"""Refactor operation for code improvements."""
from typing import Optional


def build_refactor_prompt(context: str, target_file: Optional[str] = None) -> str:
    """
    Build prompt for refactoring code.
    
    Args:
        context: Context string with file contents
        target_file: Optional specific file to refactor
        
    Returns:
        Formatted prompt for the operation
    """
    target_instruction = f"\n\nFocus specifically on refactoring: {target_file}" if target_file else ""
    
    return f"""Refactor the code in this codebase to improve quality, maintainability, and performance.

{context}{target_instruction}

**Your Task:**

Analyze the code and propose specific refactoring improvements. Focus on:

1. **Code Smells**: Identify and fix:
   - Long methods/functions (>50 lines)
   - Duplicate code
   - Complex conditionals
   - Magic numbers/strings
   - Poor naming

2. **Design Patterns**: Apply appropriate patterns where beneficial:
   - Extract reusable components
   - Separate concerns
   - Reduce coupling
   - Improve cohesion

3. **Performance**: Optimize where needed:
   - Inefficient algorithms
   - Unnecessary computations
   - Memory leaks
   - Resource management

4. **Maintainability**: Improve code clarity:
   - Better naming
   - Clear structure
   - Reduced complexity
   - Better error handling

**For Each Refactoring:**

1. **What to Change**: Specific code location (file, line numbers)
2. **Why**: What problem does this solve?
3. **How**: Show before/after code
4. **Impact**: What improves? Any risks?
5. **Testing**: How to verify the refactoring works?

**Output Format:**

For each refactoring, provide:
- File path and line numbers
- Current code (before)
- Refactored code (after)
- Explanation of improvement
- Test recommendations

Focus on practical, safe refactorings that provide clear value."""

# Made with Bob
