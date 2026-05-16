# Coding Standards

#standards #best-practices

## Python Code Style

### Type Hints
- All function signatures must include type hints
- Use `Optional[T]` for nullable types
- Use `List[T]`, `Dict[K, V]` for collections

### Error Handling
- Use specific exception types
- Always provide error context
- Log errors with appropriate level

### Documentation
- Docstrings for all public functions
- Include Args, Returns, Raises sections
- Keep docstrings concise but complete

## Architecture Patterns

### Provider Pattern
All AI model integrations follow the BaseProvider interface:
```python
class BaseProvider(ABC):
    def run(self, prompt: str, context: str) -> Generator[str, None, None]
    def is_configured(self) -> bool
```

### Skill Pattern
All repository skills follow the BaseSkill interface:
```python
class BaseSkill(ABC):
    @property
    def name(self) -> str
    def execute(self, repo_path: str, **kwargs) -> str
```

## Testing Requirements

- Unit tests for all skills
- Integration tests for providers
- End-to-end tests for operations
- Mock external API calls

## Security

- Never commit API keys
- Validate all file paths
- Sanitize user input
- Use environment variables for secrets