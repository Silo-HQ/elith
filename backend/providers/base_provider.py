# backend/providers/base_provider.py

from abc import ABC, abstractmethod
from typing import List, Generator
from ..skills.base_skill import BaseSkill

class BaseProvider(ABC):
    """
    Abstract base class for all Elith providers.
    
    Providers wrap different LLM APIs (Claude, Gemini, GPT, Ollama, Bob)
    and expose repository skills as tools to the models.
    """
    
    def __init__(self, repo_path: str, skills: List[BaseSkill]):
        """
        Initialize provider with repository path and available skills.
        
        Args:
            repo_path: Path to the repository root
            skills: List of BaseSkill instances to expose as tools
        """
        self.repo_path = repo_path
        self.skills = {s.name: s for s in skills}
    
    @abstractmethod
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Run the model with the given prompt and context.
        
        This method must:
        1. Send prompt to the model with skills as tools
        2. Yield output chunks as they stream
        3. Handle tool calls internally (loop on tool_use)
        4. Call execute_skill() when model requests a tool
        5. Feed results back to model and continue
        6. Break only when model is done (end_turn)
        
        Args:
            prompt: User's task or question
            context: Additional context (e.g., from context engine)
        
        Yields:
            Output chunks as strings
        """
        pass
    
    def is_configured(self) -> bool:
        """
        Check if provider is properly configured and ready to use.
        
        Override this method in subclasses to check for API keys,
        connectivity, or other requirements.
        
        Returns:
            True if provider is ready, False otherwise
        """
        return True  # Default: assume configured
    
    def execute_skill(self, skill_name: str, **kwargs) -> str:
        """
        Execute a skill by name with given parameters.
        
        Args:
            skill_name: Name of the skill to execute
            **kwargs: Skill-specific parameters
        
        Returns:
            String result from skill execution
        """
        if skill_name not in self.skills:
            return f"Error: skill '{skill_name}' not found"
        return self.skills[skill_name].execute(self.repo_path, **kwargs)

# Made with Bob
