"""Model router for dispatching to providers."""
from typing import Generator
from ..providers import initialize_providers


class ModelRouter:
    """Routes requests to appropriate AI model providers."""
    
    def route(self, model: str, repo_path: str, prompt: str, context: str) -> Generator[str, None, None]:
        """
        Route request to appropriate provider.
        
        Args:
            model: Model name to use
            repo_path: Path to the repository
            prompt: Operation prompt
            context: Context string with file contents
            
        Yields:
            Output chunks from provider
        """
        # Initialize providers for this repo
        providers = initialize_providers(repo_path)
        
        if model not in providers:
            yield f"Error: Model '{model}' not configured or unavailable\n"
            yield f"Available models: {', '.join(providers.keys())}\n"
            return
        
        provider = providers[model]
        
        if not provider.is_configured():
            yield f"Error: Model '{model}' is not properly configured\n"
            return
        
        # Stream output from provider
        yield from provider.run(prompt, context)
    
    def get_available_models(self, repo_path: str = ".") -> list:
        """Get list of available model names."""
        providers = initialize_providers(repo_path)
        return list(providers.keys())
    
    def get_configured_models(self, repo_path: str = ".") -> list:
        """Get list of properly configured models."""
        providers = initialize_providers(repo_path)
        return [
            name for name, provider in providers.items()
            if provider.is_configured()
        ]


# Global router instance
router = ModelRouter()

# Made with Bob
