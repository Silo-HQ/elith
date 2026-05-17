# Contributing to Elith

Thank you for your interest in contributing to Elith! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- **Report bugs** - Help us identify and fix issues
- **Suggest features** - Share ideas for new functionality
- **Improve documentation** - Help make our docs clearer
- **Submit code** - Fix bugs or implement new features
- **Write tests** - Improve test coverage
- **Review PRs** - Help review pull requests from others

## 🚀 Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- Git
- A GitHub account

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/elith.git
   cd elith
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Silo-HQ/elith.git
   ```

3. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   # Backend dependencies
   pip install -r requirements.txt
   pip install -e .

   # Frontend dependencies
   cd frontend && npm install
   cd ../tui && npm install
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

6. **Run tests to verify setup**
   ```bash
   pytest
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

### 2. Make Your Changes

- Write clear, concise code
- Follow existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_skills.py

# Run with coverage
pytest --cov=backend

# Test specific skill
python -c "
from backend.skills.read_file import ReadFileSkill
skill = ReadFileSkill()
print(skill.execute('.', 'README.md'))
"

# Test provider integration
python -c "
from backend.providers.claude_provider import ClaudeProvider
import os
provider = ClaudeProvider('.', os.environ['ANTHROPIC_API_KEY'])
for chunk in provider.run('List files', ''):
    print(chunk, end='', flush=True)
"
```

### 4. Commit Your Changes

Write clear commit messages:

```bash
git add .
git commit -m "feat: add new skill for code analysis"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or updates
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create PR on GitHub
# Go to https://github.com/Silo-HQ/elith/pulls
# Click "New Pull Request"
```

## 📝 Code Style Guidelines

### Python (Backend)

We use **Black** for code formatting and **flake8** for linting:

```bash
# Format code
black backend/

# Check linting
flake8 backend/

# Type checking
mypy backend/
```

**Style guidelines:**
- Use type hints for function parameters and return values
- Write docstrings for all public functions and classes
- Keep functions focused and under 50 lines when possible
- Use descriptive variable names
- Follow PEP 8 conventions

**Example:**
```python
from typing import Dict, List

def process_files(file_paths: List[str], options: Dict[str, str]) -> str:
    """
    Process multiple files with given options.
    
    Args:
        file_paths: List of file paths to process
        options: Processing options as key-value pairs
        
    Returns:
        Processed result as string
        
    Raises:
        FileNotFoundError: If any file doesn't exist
    """
    # Implementation here
    pass
```

### TypeScript/JavaScript (Frontend/TUI)

We use **Prettier** for formatting and **ESLint** for linting:

```bash
# Format code
npm run format

# Check linting
npm run lint

# Type checking
npm run type-check
```

**Style guidelines:**
- Use TypeScript for type safety
- Prefer functional components with hooks
- Use meaningful component and variable names
- Keep components small and focused
- Write JSDoc comments for complex functions

### Documentation

- Use clear, concise language
- Include code examples where helpful
- Keep README.md up to date
- Document all public APIs
- Add inline comments for complex logic

## 🧪 Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve test coverage
- Use descriptive test names
- Test edge cases and error conditions
- Mock external dependencies

**Example test:**
```python
import pytest
from backend.skills.read_file import ReadFileSkill

def test_read_file_success():
    """Test reading an existing file."""
    skill = ReadFileSkill()
    result = skill.execute(".", "README.md")
    assert "Elith" in result
    assert len(result) > 0

def test_read_file_not_found():
    """Test reading a non-existent file."""
    skill = ReadFileSkill()
    result = skill.execute(".", "nonexistent.txt")
    assert "Error" in result
```

### Test Coverage

Aim for:
- **80%+ overall coverage**
- **100% coverage for critical paths** (skills, providers)
- **Edge cases and error handling**

## 🏗️ Architecture Guidelines

### Adding a New Skill

1. Create file in `backend/skills/`
2. Inherit from `BaseSkill`
3. Implement required methods
4. Add to `backend/skills/__init__.py`
5. Write tests
6. Update documentation

**Template:**
```python
from .base_skill import BaseSkill
from typing import Dict

class MySkill(BaseSkill):
    @property
    def name(self) -> str:
        return "my_skill"
    
    @property
    def description(self) -> str:
        return "Description of what this skill does"
    
    @property
    def parameters(self) -> Dict:
        return {
            "type": "object",
            "properties": {
                "param": {"type": "string", "description": "Parameter description"}
            },
            "required": ["param"]
        }
    
    def execute(self, repo_path: str, **kwargs) -> str:
        try:
            # Implementation
            return "Result"
        except Exception as e:
            return f"Error: {str(e)}"
```

### Adding a New Provider

1. Create file in `backend/providers/`
2. Inherit from `BaseProvider`
3. Implement `run()` method with tool calling loop
4. Add provider-specific tool format conversion
5. Write tests
6. Update documentation

### Adding a New Operation

1. Create file in `backend/operations/`
2. Implement operation logic
3. Add API endpoint in `backend/routes/`
4. Update frontend/TUI to support operation
5. Write tests
6. Update documentation

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests pass
```

### Review Process

1. Automated checks run (tests, linting)
2. Maintainers review code
3. Address feedback if needed
4. Approval and merge

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS 13.0]
- Python version: [e.g., 3.10.5]
- Elith version: [e.g., 0.1.0]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Any other relevant information
```

## 📞 Getting Help

- **GitHub Discussions**: https://github.com/Silo-HQ/elith/discussions
- **GitHub Issues**: https://github.com/Silo-HQ/elith/issues
- **Documentation**: https://github.com/Silo-HQ/elith

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

## 🎓 Learning Resources

### Understanding Elith Architecture

- [AGENTS.md](AGENTS.md) - Agent system overview
- [docs/ELITH_AGENT_SKILLS.md](docs/ELITH_AGENT_SKILLS.md) - Skill specifications
- [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md) - Visual architecture

### AI Provider Documentation

- [Anthropic Claude](https://docs.anthropic.com/)
- [Google Gemini](https://ai.google.dev/docs)
- [OpenAI GPT](https://platform.openai.com/docs)
- [LMStudio](https://lmstudio.ai/docs)
- [Ollama](https://ollama.ai/docs)

## 🙏 Recognition

Contributors will be:
- Listed in project documentation
- Credited in release notes
- Acknowledged in the community

Thank you for contributing to Elith! 🚀

---

**Questions?** Open a discussion on GitHub or reach out to the maintainers.