"""Base provider interface for AI models."""
from abc import ABC, abstractmethod
from typing import Generator


class BaseProvider(ABC):
    """Abstract base class for AI model providers."""
    
    def __init__(self, model_name: str):
        """Initialize provider with model name."""
        self.model_name = model_name
    
    @abstractmethod
    def run(self, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Execute prompt with context and yield output chunks.
        
        Args:
            prompt: The operation prompt
            context: The context string with file contents
            
        Yields:
            Output chunks as they are generated
        """
        pass
    
    @abstractmethod
    def is_configured(self) -> bool:
        """Check if provider is properly configured."""
        pass

# Made with Bob
