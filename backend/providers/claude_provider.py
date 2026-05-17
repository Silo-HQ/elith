# backend/providers/claude_provider.py
# Force reload

import anthropic
import json
from typing import Generator
from .base_provider import BaseProvider
from ..skills import ALL_SKILLS

class ClaudeProvider(BaseProvider):
    """
    Claude provider with tool calling support.
    
    This is the proof of concept - when Claude starts calling skills
    automatically, that's the moment Elith works.
    """
    
    def __init__(self, repo_path: str, api_key: str, model: str = "claude-sonnet-4-20250514"):
        """
        Initialize Claude provider.
        
        Args:
            repo_path: Repository root path
            api_key: Anthropic API key
            model: Claude model to use
        """
        super().__init__(repo_path, ALL_SKILLS)
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.api_key = api_key
    
    def is_configured(self) -> bool:
        """
        Check if Claude provider is configured with valid API key.
        
        Returns:
            True if API key is present
        """
        return bool(self.api_key)
    
    def run(self, prompt: str, context: str = "") -> Generator[str, None, None]:
        """
        Run Claude with tool calling support.
        
        This implements the critical tool calling loop:
        1. Send message with tools
        2. Yield text blocks
        3. If tool_use: execute skills, append results, continue loop
        4. If end_turn: break
        
        Args:
            prompt: User's task or question
            context: Additional context
        
        Yields:
            Output chunks as they stream
        """
        # Convert all skills to Anthropic tool format
        tools = [s.to_anthropic_tool() for s in self.skills.values()]
        
        # Build initial message
        if context:
            messages = [{"role": "user", "content": f"{context}\n\n{prompt}"}]
        else:
            messages = [{"role": "user", "content": prompt}]
        
        # Tool calling loop - CRITICAL PATTERN
        while True:
            try:
                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=8096,
                    tools=tools,
                    messages=messages
                )
                
                # Stream text blocks as they arrive
                for block in response.content:
                    if block.type == "text":
                        yield block.text
                
                # Handle tool calls
                if response.stop_reason == "tool_use":
                    tool_results = []
                    
                    for block in response.content:
                        if block.type == "tool_use":
                            # Show which skill is being called
                            yield f"\n[Elith Skill: {block.name}({json.dumps(block.input)})]\n"
                            
                            # Execute the skill
                            result = self.execute_skill(block.name, **block.input)
                            
                            # Show result preview
                            if len(result) > 200:
                                yield f"→ {result[:200]}...\n"
                            else:
                                yield f"→ {result}\n"
                            
                            # Collect tool result for Claude
                            tool_results.append({
                                "type": "tool_result",
                                "tool_use_id": block.id,
                                "content": result
                            })
                    
                    # Continue conversation with tool results
                    messages.append({"role": "assistant", "content": response.content})
                    messages.append({"role": "user", "content": tool_results})
                    
                    # Loop back to get Claude's next response
                    continue
                
                else:
                    # Done - Claude has finished
                    break
            
            except anthropic.APIError as e:
                yield f"\nClaude API Error: {str(e)}\n"
                break
            except Exception as e:
                yield f"\nError: {str(e)}\n"
                break

# Made with Bob
