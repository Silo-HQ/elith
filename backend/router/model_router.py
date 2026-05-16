"""Model router for dispatching to providers."""
from typing import Generator, Dict
from ..providers.base_provider import BaseProvider


class ModelRouter:
    """Routes requests to appropriate AI model providers."""
    
    def __init__(self):
        """Initialize router with empty provider registry."""
        self.providers: Dict[str, BaseProvider] = {}
    
    def register_provider(self, name: str, provider: BaseProvider):
        """
        Register a provider.
        
        Args:
            name: Provider name (e.g., "bob", "claude")
            provider: Provider instance
        """
        self.providers[name] = provider
    
    def route(self, model: str, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Route request to appropriate provider.
        
        Args:
            model: Model name to use
            prompt: Operation prompt
            context: Context string with file contents
            
        Yields:
            Output chunks from provider
        """
        if model not in self.providers:
            yield f"Error: Model '{model}' not configured\n"
            return
        
        provider = self.providers[model]
        
        if not provider.is_configured():
            yield f"Error: Model '{model}' is not properly configured\n"
            return
        
        yield from provider.run(prompt, context)
    
    def get_available_models(self) -> list:
        """Get list of registered model names."""
        return list(self.providers.keys())
    
    def get_configured_models(self) -> list:
        """Get list of properly configured models."""
        return [
            name for name, provider in self.providers.items()
            if provider.is_configured()
        ]


# Global router instance
router = ModelRouter()

# Made with Bob
