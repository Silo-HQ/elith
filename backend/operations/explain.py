"""Explain operation for codebase analysis."""


def build_explain_prompt(context: str) -> str:
    """
    Build prompt for explaining codebase architecture.
    
    Args:
        context: Context string with file contents
        
    Returns:
        Formatted prompt for the operation
    """
    return f"""Analyze this codebase and explain its architecture in clear, plain language.

{context}

Provide a comprehensive explanation covering:

1. **Overall Structure**: How is the codebase organized? What are the main directories/modules?

2. **Key Components**: What are the core components and what does each do?

3. **How They Interact**: How do the components communicate and work together?

4. **Technology Stack**: What languages, frameworks, and tools are being used?

5. **Entry Points**: Where does execution begin? What are the main entry points?

Focus on helping a new developer understand the codebase quickly. Be specific and reference actual files you see in the context."""

# Made with Bob
