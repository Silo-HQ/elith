"""
OpenRouter Provider
Uses OpenRouter's OpenAI-compatible API to access various models
"""
from typing import Generator
from openai import OpenAI
from .base_provider import BaseProvider
from ..skills.base_skill import BaseSkill


class OpenRouterProvider(BaseProvider):
    """
    Provider for OpenRouter API (OpenAI-compatible)
    Supports multiple models through OpenRouter
    """
    
    def __init__(self, repo_path: str, api_key: str, model: str = "openai/gpt-3.5-turbo"):
        """
        Initialize OpenRouter provider.
        
        Args:
            repo_path: Path to the repository
            api_key: OpenRouter API key (sk-or-v1-...)
            model: Model identifier (e.g., "openai/gpt-3.5-turbo", "meta-llama/llama-3.1-8b-instruct")
        """
        super().__init__(repo_path, [])  # Skills will be added after
        self.api_key = api_key
        self.model = model
        
        # Initialize OpenAI client with OpenRouter base URL
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
    
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Run the provider with the given prompt.
        
        Args:
            prompt: User's prompt/question
            context: Additional context (optional)
        
        Yields:
            Response chunks as they arrive
        """
        # Build full prompt with context
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        
        # Convert skills to OpenAI tool format
        tools = [skill.to_openai_tool() for skill in self.skills.values()]
        
        # Initialize messages
        messages = [
            {
                "role": "system",
                "content": f"You are a helpful AI assistant with access to repository tools. The repository is located at: {self.repo_path}"
            },
            {
                "role": "user",
                "content": full_prompt
            }
        ]
        
        # Tool calling loop
        while True:
            # Call OpenRouter API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                stream=False  # OpenRouter may not support streaming with tools
            )
            
            message = response.choices[0].message
            
            # Check if model wants to call tools
            if message.tool_calls:
                # Add assistant message to history
                messages.append({
                    "role": "assistant",
                    "content": message.content or "",
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": "function",
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        }
                        for tc in message.tool_calls
                    ]
                })
                
                # Execute each tool call
                for tool_call in message.tool_calls:
                    function_name = tool_call.function.name
                    
                    # Parse arguments
                    import json
                    try:
                        function_args = json.loads(tool_call.function.arguments)
                    except json.JSONDecodeError:
                        function_args = {}
                    
                    # Execute skill
                    result = self.execute_skill(function_name, **function_args)
                    
                    # Add tool result to messages
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": result
                    })
                
                # Continue loop to get final response
                continue
            
            # No more tool calls, return final response
            if message.content:
                yield message.content
            
            break


# Made with Bob