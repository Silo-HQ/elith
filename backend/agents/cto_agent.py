"""
CTO Agent - Technical Leadership and Architecture Decisions
"""
from typing import Dict, Any
from .base_agent import BaseAgent, AgentContext


class CTOAgent(BaseAgent):
    """
    CTO/Tech Lead Agent
    
    Responsibilities:
    - High-level architecture decisions
    - Tech stack selection
    - Cross-team alignment
    - Scalability and performance strategy
    - Innovation and hybrid architecture proposals
    """
    
    def __init__(self):
        super().__init__(
            name="CTO",
            role="Chief Technology Officer / Tech Lead",
            expertise=[
                "System Architecture",
                "Tech Stack Selection",
                "Scalability Design",
                "Performance Optimization",
                "Hybrid Architectures",
                "Innovation Strategy"
            ]
        )
    
    def analyze(self, context: AgentContext) -> Dict[str, Any]:
        """Analyze project from CTO perspective"""
        
        prompt = f"""As CTO, analyze this project request:

**Project Type:** {context.project_type}
**Requirements:** {context.requirements}
**Proposed Tech Stack:** {', '.join(context.tech_stack) if context.tech_stack else 'Not specified'}
**Constraints:** {context.constraints}

Provide a CTO-level analysis covering:

1. **Architecture Strategy**
   - Monolith vs Microservices vs Hybrid
   - Event-driven vs Request-response vs Mixed
   - Serverless opportunities
   - Edge computing considerations

2. **Tech Stack Evaluation**
   - Assess proposed stack
   - Suggest alternatives with justification
   - Consider team expertise, hiring, maintenance

3. **Scalability Plan**
   - Expected load patterns
   - Horizontal vs vertical scaling strategy
   - Database sharding/replication needs
   - Caching strategy (CDN, Redis, etc.)

4. **Innovation Opportunities**
   - Where can we use cutting-edge tech?
   - Hybrid approaches that combine best practices
   - Non-traditional solutions that fit THIS project

5. **Risk Assessment**
   - Technical risks
   - Vendor lock-in concerns
   - Team capability gaps
   - Timeline feasibility

Think like a senior CTO who has built systems at scale. Be specific, not generic."""

        # This will be called by the orchestrator with the provider
        return {
            "prompt": prompt,
            "agent": self.name,
            "role": self.role
        }
    
    def propose(self, context: AgentContext) -> Dict[str, Any]:
        """Propose architecture from CTO perspective"""
        
        prompt = f"""As CTO, propose a production-ready architecture for:

**Project:** {context.project_type}
**Requirements:** {context.requirements}

Your proposal must include:

1. **System Architecture Diagram** (describe in text)
   - Components and their responsibilities
   - Communication patterns
   - Data flow
   - External integrations

2. **Tech Stack with Justification**
   - Frontend: Framework, state management, styling
   - Backend: Language, framework, API design
   - Database: Type, schema strategy, migrations
   - Infrastructure: Cloud provider, containers, orchestration
   - Monitoring: Logging, metrics, alerting

3. **Hybrid Architecture Decisions**
   - Where we use microservices (and why)
   - Where we keep monolithic (and why)
   - Event-driven components
   - Synchronous vs asynchronous boundaries

4. **Scalability Strategy**
   - Load balancing approach
   - Database scaling plan
   - Caching layers
   - CDN strategy

5. **Development Workflow**
   - Git branching strategy
   - CI/CD pipeline
   - Environment strategy (dev/staging/prod)
   - Feature flags

6. **Non-Negotiables**
   - Security requirements
   - Performance SLAs
   - Availability targets
   - Compliance needs

Make this production-ready from day 1. No "we'll add this later" - build it right."""

        return {
            "prompt": prompt,
            "agent": self.name,
            "role": self.role
        }
    
    def review(self, proposal: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Review proposals from other agents"""
        
        prompt = f"""As CTO, review this proposal from {proposal.get('agent', 'another team member')}:

**Proposal:**
{proposal.get('content', '')}

**Project Context:**
{context.requirements}

Provide CTO-level review:

1. **Strategic Alignment**
   - Does this fit our overall architecture?
   - Any conflicts with other components?
   - Impact on scalability/performance?

2. **Technical Concerns**
   - Architecture red flags
   - Scalability bottlenecks
   - Security vulnerabilities
   - Performance issues

3. **Innovation Assessment**
   - Is this the best approach?
   - Are there better alternatives?
   - Hybrid solutions to consider?

4. **Decision**
   - ✅ Approve (with any conditions)
   - ⚠️ Approve with changes (specify)
   - ❌ Reject (with alternative)

Be constructive but firm. Production quality is non-negotiable."""

        return {
            "prompt": prompt,
            "agent": self.name,
            "role": self.role
        }


# Made with Bob