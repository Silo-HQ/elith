# backend/providers/lmstudio_provider.py

import requests
import json
from typing import Generator
from .base_provider import BaseProvider
from ..skills import ALL_SKILLS

class LMStudioProvider(BaseProvider):
    """
    LM Studio provider with tool calling support.
    
    LM Studio runs locally and uses OpenAI-compatible API.
    Default endpoint: http://localhost:1234/v1
    """
    
    def __init__(self, repo_path: str, base_url: str = "http://localhost:1234/v1", api_key: str = None, model: str = None):
        """
        Initialize LM Studio provider.
        
        Args:
            repo_path: Repository root path
            base_url: LM Studio API endpoint (default: http://localhost:1234/v1)
            api_key: LM Studio API key (optional)
            model: Model name (optional, LM Studio auto-selects if None)
        """
        super().__init__(repo_path, ALL_SKILLS)
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.model = model or "local-model"  # LM Studio uses loaded model
    
    def is_configured(self) -> bool:
        """Check if LM Studio provider is accessible."""
        try:
            headers = {}
            if self.api_key:
                headers["Authorization"] = f"Bearer {self.api_key}"
            response = requests.get(f"{self.base_url}/models", headers=headers, timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def run(self, prompt: str, context: str = "") -> Generator[str, None, None]:
        """
        Run LM Studio with tool calling support.
        
        Uses OpenAI-compatible API with tool calling.
        
        Args:
            prompt: User's task or question
            context: Additional context
        
        Yields:
            Output chunks as they stream
        """
        # Convert all skills to OpenAI tool format
        tools = [s.to_openai_tool() for s in self.skills.values()]
        
        # Build initial message
        if context:
            messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
        else:
            messages = [{"role": "user", "content": prompt}]
        
        # Tool calling loop
        max_iterations = 10  # Prevent infinite loops
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            
            try:
                # Prepare headers
                headers = {"Content-Type": "application/json"}
                if self.api_key:
                    headers["Authorization"] = f"Bearer {self.api_key}"
                
                # Call LM Studio API
                response = requests.post(
                    f"{self.base_url}/chat/completions",
                    headers=headers,
                    json={
                        "model": self.model,
                        "messages": messages,
                        "tools": tools,
                        "tool_choice": "auto",
                        "max_tokens": 4096,
                        "temperature": 0.7,
                    },
                    timeout=120
                )
                
                if response.status_code != 200:
                    yield f"\nLM Studio API Error: {response.status_code} - {response.text}\n"
                    break
                
                result = response.json()
                
                if "choices" not in result or len(result["choices"]) == 0:
                    yield "\nNo response from LM Studio\n"
                    break
                
                choice = result["choices"][0]
                message = choice.get("message", {})
                
                # Yield text content if present
                if "content" in message and message["content"]:
                    yield message["content"]
                
                # Handle tool calls
                tool_calls = message.get("tool_calls", [])
                
                if tool_calls:
                    # Add assistant message to history
                    messages.append(message)
                    
                    # Execute each tool call
                    for tool_call in tool_calls:
                        function = tool_call.get("function", {})
                        function_name = function.get("name", "")
                        
                        try:
                            function_args = json.loads(function.get("arguments", "{}"))
                        except json.JSONDecodeError:
                            function_args = {}
                        
                        # Show which skill is being called
                        yield f"\n[Elith Skill: {function_name}({json.dumps(function_args)})]\n"
                        
                        # Execute the skill
                        result_content = self.execute_skill(function_name, **function_args)
                        
                        # Show result preview
                        if len(result_content) > 200:
                            yield f"→ {result_content[:200]}...\n"
                        else:
                            yield f"→ {result_content}\n"
                        
                        # Add tool result to messages
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tool_call.get("id", ""),
                            "name": function_name,
                            "content": result_content
                        })
                    
                    # Continue loop to get model's next response
                    continue
                
                else:
                    # No more tool calls, we're done
                    break
            
            except requests.exceptions.ConnectionError:
                yield "\nError: Cannot connect to LM Studio. Make sure LM Studio is running on http://localhost:1234\n"
                break
            except requests.exceptions.Timeout:
                yield "\nError: LM Studio request timed out\n"
                break
            except Exception as e:
                yield f"\nError: {str(e)}\n"
                break
        
        if iteration >= max_iterations:
            yield "\n(Reached maximum tool calling iterations)\n"

# Made with Bob
