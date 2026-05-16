"""Test generation operation."""


def build_test_gen_prompt(context: str) -> str:
    """
    Build prompt for generating tests.
    
    Args:
        context: Context string with file contents
        
    Returns:
        Formatted prompt for the operation
    """
    return f"""Generate tests for the source files in this codebase.

{context}

**Your Task:**

Generate comprehensive tests for the source files shown above. Follow these guidelines:

1. **Match Existing Style**: If tests already exist in the codebase, match their style and framework
2. **Test Framework**: Use the appropriate framework for the language:
   - Python: pytest or unittest
   - JavaScript/TypeScript: Jest or Mocha
   - Go: standard testing package
   - Rust: built-in test framework

3. **Coverage**: For each source file, generate tests that cover:
   - Happy path scenarios
   - Edge cases
   - Error handling
   - Boundary conditions

4. **Test Structure**: 
   - Clear test names that describe what's being tested
   - Arrange-Act-Assert pattern
   - Proper setup and teardown if needed
   - Mock external dependencies

5. **File Organization**: 
   - Place tests in appropriate test directories
   - Follow naming conventions (e.g., `test_*.py`, `*.test.js`)

**Output Format:**

For each source file, provide:
- Test file path
- Complete test code
- Brief explanation of what's being tested

Focus on practical, maintainable tests that would actually be useful in this codebase."""

# Made with Bob
