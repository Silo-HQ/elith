"""Architect operation for novel architecture proposals."""


def build_architect_prompt(context: str) -> str:
    """
    Build prompt for generating architecture proposals.
    
    This is THE KEY OPERATION - must produce repo-specific, non-generic proposals.
    
    Args:
        context: Context string with file contents
        
    Returns:
        Formatted prompt for the operation
    """
    return f"""Analyze this codebase and propose architectural improvements.

{context}

**CRITICAL REQUIREMENTS:**

1. **Analyze THIS specific codebase** - No generic textbook answers
2. **Reference actual files** you see in the context above
3. **Base proposals on actual patterns** present in this code
4. **Tailor to THIS project's constraints** and existing architecture

**Your Task:**

Propose 2-3 architectural improvements that are:

- **Specific to this codebase**: Reference actual files, patterns, and structures you observe
- **Production-ready**: Include concrete implementation steps
- **Justified**: Explain why this fits THIS codebase (not just "best practice")

**For Each Proposal:**

1. **What to Change**: Specific files/modules affected (reference actual paths)
2. **Why This Fits**: How it aligns with existing patterns in THIS codebase
3. **Tradeoffs**: What you gain vs what you lose
4. **Migration Path**: Step-by-step implementation plan
5. **Risks**: What could go wrong and how to mitigate

**Example of GOOD (specific) vs BAD (generic):**

❌ BAD: "Use microservices for better scalability"
✅ GOOD: "Split auth.py (lines 150-300) into separate service because it's already isolated, has its own database tables (users, sessions), and the current monolith is hitting memory limits at 2GB"

Focus on improvements that make sense for THIS specific project, not universal best practices."""

# Made with Bob
