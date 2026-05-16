"""
Base Agent - Foundation for all specialized agents
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass


@dataclass
class AgentContext:
    """Context shared between agents"""
    project_type: str
    requirements: str
    tech_stack: List[str]
    constraints: Dict[str, Any]
    existing_code: Optional[str] = None
    decisions: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.decisions is None:
            self.decisions = {}


class BaseAgent(ABC):
    """
    Base class for all specialized agents.
    Each agent represents a role in a production software team.
    """
    
    def __init__(self, name: str, role: str, expertise: List[str]):
        self.name = name
        self.role = role
        self.expertise = expertise
        self.provider: Any = None  # Will be set by orchestrator
    
    @abstractmethod
    def analyze(self, context: AgentContext) -> Dict[str, Any]:
        """
        Analyze the project from this agent's perspective.
        
        Returns:
            Dict with analysis results, recommendations, concerns
        """
        pass
    
    @abstractmethod
    def propose(self, context: AgentContext) -> Dict[str, Any]:
        """
        Propose solutions/architecture from this agent's perspective.
        
        Returns:
            Dict with proposals, alternatives, tradeoffs
        """
        pass
    
    @abstractmethod
    def review(self, proposal: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """
        Review proposals from other agents.
        
        Returns:
            Dict with approval/concerns/suggestions
        """
        pass
    
    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent's LLM calls"""
        return f"""You are {self.name}, a {self.role} with expertise in {', '.join(self.expertise)}.

Your role in the team:
- Analyze projects from your specialized perspective
- Propose production-ready solutions
- Review other team members' proposals
- Think like a senior engineer with 10+ years experience
- Focus on hybrid architectures and non-traditional solutions
- Every decision must be production-level quality

Key principles:
1. No generic textbook answers - tailor to THIS specific project
2. Consider scalability, security, maintainability from day 1
3. Propose hybrid solutions that combine best of different approaches
4. Think about the full system lifecycle (dev, deploy, monitor, scale)
5. Challenge assumptions and propose innovative alternatives"""


# Made with Bob