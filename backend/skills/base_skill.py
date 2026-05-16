# backend/skills/base_skill.py

from abc import ABC, abstractmethod
from typing import Any, Dict

class BaseSkill(ABC):
    """
    Abstract base class for all Elith skills.
    
    Every skill must implement this interface to be usable by providers.
    Skills are exposed to LLMs as tools via provider-specific formats.
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Skill name — used as tool name by LLM"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """What this skill does — shown to LLM"""
        pass
    
    @property
    @abstractmethod
    def parameters(self) -> Dict:
        """
        JSON Schema of parameters.
        
        Must be a valid JSON Schema object with:
        - type: "object"
        - properties: dict of parameter definitions
        - required: list of required parameter names
        """
        pass
    
    @abstractmethod
    def execute(self, repo_path: str, **kwargs) -> str:
        """
        Execute the skill and return string result.
        
        Args:
            repo_path: Path to the repository root
            **kwargs: Skill-specific parameters
        
        Returns:
            String result (even for errors: "Error: description")
        """
        pass
    
    def to_anthropic_tool(self) -> Dict:
        """Convert skill to Anthropic (Claude) tool format"""
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": self.parameters
        }
    
    def to_openai_tool(self) -> Dict:
        """Convert skill to OpenAI/Ollama tool format"""
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }
    
    def to_gemini_function(self):
        """Convert skill to Gemini function declaration format"""
        import google.generativeai as genai
        
        # Build Gemini FunctionDeclaration from parameters
        return genai.protos.FunctionDeclaration(
            name=self.name,
            description=self.description,
        )

# Made with Bob
