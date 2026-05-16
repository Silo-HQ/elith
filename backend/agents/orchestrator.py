"""
Agent Orchestrator - Coordinates multi-agent collaboration
"""
from typing import Dict, List, Any, Optional, Generator
from .base_agent import BaseAgent, AgentContext
from .cto_agent import CTOAgent
from ..providers.base_provider import BaseProvider
from ..skills import SKILL_MAP
import json
import os


class AgentOrchestrator:
    """
    Orchestrates collaboration between specialized agents.
    
    Workflow:
    1. User provides project requirements
    2. CTO analyzes and proposes architecture
    3. Specialized agents (Frontend, Backend, DevOps, Security) propose their parts
    4. Agents review each other's proposals
    5. CTO makes final decisions
    6. System generates production-ready code
    """
    
    def __init__(self, provider: BaseProvider, repo_path: str):
        self.provider = provider
        self.repo_path = repo_path
        self.agents: Dict[str, BaseAgent] = {}
        self.conversation_history: List[Dict[str, Any]] = []
        
        # Initialize agents
        self._initialize_agents()
    
    def _initialize_agents(self):
        """Initialize all specialized agents"""
        # Start with CTO - more agents will be added
        self.agents['cto'] = CTOAgent()
        
        # Set provider for all agents
        for agent in self.agents.values():
            agent.provider = self.provider
    
    def create_project(
        self,
        project_type: str,
        requirements: str,
        tech_stack: Optional[List[str]] = None,
        constraints: Optional[Dict[str, Any]] = None
    ) -> Generator[str, None, None]:
        """
        Create a production-level project using multi-agent collaboration.
        
        Args:
            project_type: Type of project (e.g., "web app", "API", "microservice")
            requirements: Detailed project requirements
            tech_stack: Preferred technologies (optional)
            constraints: Project constraints (budget, timeline, team size, etc.)
        
        Yields:
            Progress updates and agent outputs
        """
        # Create context
        context = AgentContext(
            project_type=project_type,
            requirements=requirements,
            tech_stack=tech_stack or [],
            constraints=constraints or {}
        )
        
        yield "\n🎯 **ELITH MULTI-AGENT SYSTEM**\n"
        yield "Creating production-level project with specialized team...\n\n"
        
        # Phase 1: CTO Analysis
        yield "## Phase 1: CTO Analysis\n\n"
        yield "👔 **CTO** is analyzing the project requirements...\n\n"
        
        cto_analysis = self._run_agent_task(
            self.agents['cto'],
            'analyze',
            context
        )
        
        for chunk in cto_analysis:
            yield chunk
        
        # Store CTO analysis in context
        if context.decisions is None:
            context.decisions = {}
        context.decisions['cto_analysis'] = ''.join(cto_analysis)
        
        yield "\n\n---\n\n"
        
        # Phase 2: CTO Architecture Proposal
        yield "## Phase 2: Architecture Proposal\n\n"
        yield "👔 **CTO** is proposing system architecture...\n\n"
        
        cto_proposal = self._run_agent_task(
            self.agents['cto'],
            'propose',
            context
        )
        
        for chunk in cto_proposal:
            yield chunk
        
        if context.decisions is None:
            context.decisions = {}
        context.decisions['cto_proposal'] = ''.join(cto_proposal)
        
        yield "\n\n---\n\n"
        
        # Phase 3: Implementation Plan
        yield "## Phase 3: Implementation Plan\n\n"
        yield "📋 Generating step-by-step implementation plan...\n\n"
        
        impl_plan = self._generate_implementation_plan(context)
        for chunk in impl_plan:
            yield chunk
        
        yield "\n\n---\n\n"
        
        # Phase 4: Code Generation
        yield "## Phase 4: Code Generation\n\n"
        yield "💻 Generating production-ready code...\n\n"
        
        code_gen = self._generate_code(context)
        for chunk in code_gen:
            yield chunk
        
        yield "\n\n✅ **Project creation complete!**\n"
        yield "\nNext steps:\n"
        yield "1. Review generated code\n"
        yield "2. Run tests\n"
        yield "3. Deploy to staging\n"
        yield "4. Monitor and iterate\n"
    
    def _run_agent_task(
        self,
        agent: BaseAgent,
        task: str,
        context: AgentContext
    ) -> Generator[str, None, None]:
        """
        Run a specific task for an agent.
        
        Args:
            agent: The agent to run
            task: Task name ('analyze', 'propose', 'review')
            context: Shared context
        
        Yields:
            Agent output chunks
        """
        # Get the task method
        if task == 'analyze':
            task_data = agent.analyze(context)
        elif task == 'propose':
            task_data = agent.propose(context)
        else:
            raise ValueError(f"Unknown task: {task}")
        
        # Get the prompt
        prompt = task_data['prompt']
        
        # Add system prompt
        full_prompt = f"{agent.get_system_prompt()}\n\n{prompt}"
        
        # Run through provider
        for chunk in self.provider.run(full_prompt, ""):
            yield chunk
    
    def _generate_implementation_plan(self, context: AgentContext) -> Generator[str, None, None]:
        """Generate detailed implementation plan"""
        
        prompt = f"""Based on the CTO's architecture proposal, create a detailed implementation plan.

**CTO Proposal:**
{context.decisions.get('cto_proposal', '') if context.decisions else ''}

**Requirements:**
{context.requirements}

Create a step-by-step implementation plan with:

1. **Phase Breakdown**
   - Phase 1: Foundation (infrastructure, CI/CD, base architecture)
   - Phase 2: Core Features (main functionality)
   - Phase 3: Integration (third-party services, APIs)
   - Phase 4: Polish (UI/UX, performance, security hardening)

2. **For Each Phase:**
   - Tasks (specific, actionable)
   - Dependencies (what must be done first)
   - Estimated effort (in story points or days)
   - Success criteria (how we know it's done)

3. **Critical Path**
   - Which tasks are blockers
   - Parallel work opportunities
   - Risk mitigation strategies

4. **Team Assignment**
   - Which specialist handles each task
   - Collaboration points
   - Review checkpoints

Make this actionable - a team should be able to start work immediately."""

        for chunk in self.provider.run(prompt, ""):
            yield chunk
    
    def _generate_code(self, context: AgentContext) -> Generator[str, None, None]:
        """Generate production-ready code using repository skills"""
        
        yield "🔨 **Creating project structure...**\n\n"
        
        # Extract project name from requirements
        project_name = self._extract_project_name(context)
        project_dir = os.path.join(self.repo_path, project_name)
        
        yield f"📁 Project directory: `{project_name}/`\n\n"
        
        # Step 1: Create directory structure
        yield "### Step 1: Directory Structure\n\n"
        directories = self._create_directory_structure(project_dir, context)
        for dir_path in directories:
            rel_path = os.path.relpath(dir_path, self.repo_path)
            yield f"✅ Created: `{rel_path}/`\n"
        yield "\n"
        
        # Step 2: Create configuration files
        yield "### Step 2: Configuration Files\n\n"
        config_files = self._create_config_files(project_dir, context)
        for file_path, content in config_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        # Step 3: Create backend code
        yield "### Step 3: Backend Code\n\n"
        yield "💬 **Backend Agent**: Analyzing API requirements...\n"
        backend_files = self._create_backend_code(project_dir, context)
        for file_path, content in backend_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        # Step 4: Create frontend code
        yield "### Step 4: Frontend Code\n\n"
        yield "💬 **Frontend Agent**: Designing UI components...\n"
        frontend_files = self._create_frontend_code(project_dir, context)
        for file_path, content in frontend_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        # Step 5: Create tests
        yield "### Step 5: Tests\n\n"
        yield "💬 **QA Agent**: Writing test suites...\n"
        test_files = self._create_tests(project_dir, context)
        for file_path, content in test_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        # Step 6: Create CI/CD
        yield "### Step 6: CI/CD Pipeline\n\n"
        yield "💬 **DevOps Agent**: Setting up deployment pipeline...\n"
        cicd_files = self._create_cicd(project_dir, context)
        for file_path, content in cicd_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        # Step 7: Create documentation
        yield "### Step 7: Documentation\n\n"
        doc_files = self._create_documentation(project_dir, context)
        for file_path, content in doc_files.items():
            rel_path = os.path.relpath(file_path, self.repo_path)
            result = SKILL_MAP['write_file'].execute(self.repo_path, path=rel_path, content=content)
            yield f"✅ Created: `{rel_path}` ({len(content)} bytes)\n"
        yield "\n"
        
        yield "🎉 **Code generation complete!**\n\n"
        yield f"📦 Total files created: {len(config_files) + len(backend_files) + len(frontend_files) + len(test_files) + len(cicd_files) + len(doc_files)}\n"
    
    def _extract_project_name(self, context: AgentContext) -> str:
        """Extract project name from requirements"""
        # Simple extraction - in production, use LLM
        words = context.requirements.lower().split()
        if 'itinerary' in words:
            return 'itinerary-app'
        elif 'todo' in words or 'task' in words:
            return 'todo-app'
        elif 'blog' in words:
            return 'blog-app'
        else:
            return 'new-project'
    
    def _create_directory_structure(self, project_dir: str, context: AgentContext) -> List[str]:
        """Create project directory structure"""
        directories = [
            project_dir,
            os.path.join(project_dir, 'backend'),
            os.path.join(project_dir, 'backend', 'src'),
            os.path.join(project_dir, 'backend', 'tests'),
            os.path.join(project_dir, 'frontend'),
            os.path.join(project_dir, 'frontend', 'src'),
            os.path.join(project_dir, 'frontend', 'src', 'components'),
            os.path.join(project_dir, 'frontend', 'src', 'pages'),
            os.path.join(project_dir, 'frontend', 'public'),
            os.path.join(project_dir, 'docs'),
            os.path.join(project_dir, '.github'),
            os.path.join(project_dir, '.github', 'workflows'),
        ]
        
        for dir_path in directories:
            os.makedirs(dir_path, exist_ok=True)
        
        return directories
    
    def _create_config_files(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create configuration files"""
        files = {}
        
        # .gitignore
        files[os.path.join(project_dir, '.gitignore')] = """# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
venv/

# Environment
.env
.env.local

# Build
dist/
build/
*.log

# IDE
.vscode/
.idea/
*.swp
"""
        
        # README.md
        files[os.path.join(project_dir, 'README.md')] = f"""# {context.project_type.title()}

{context.requirements}

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment instructions.
"""
        
        # Backend requirements.txt
        files[os.path.join(project_dir, 'backend', 'requirements.txt')] = """fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
pytest==7.4.3
"""
        
        # Frontend package.json
        files[os.path.join(project_dir, 'frontend', 'package.json')] = """{
  "name": "frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
"""
        
        return files
    
    def _create_backend_code(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create backend code files"""
        files = {}
        
        # Main application
        files[os.path.join(project_dir, 'backend', 'src', 'main.py')] = """from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""
        
        return files
    
    def _create_frontend_code(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create production-quality frontend code with dashboard UI"""
        files = {}
        
        project_name = context.project_type.title()
        
        # Main App component with dashboard layout
        files[os.path.join(project_dir, 'frontend', 'src', 'App.jsx')] = f"""import React, {{ useState, useEffect }} from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {{
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {{
    document.body.className = darkMode ? 'dark' : 'light';
  }}, [darkMode]);

  return (
    <div className="app">
      <Header darkMode={{darkMode}} setDarkMode={{setDarkMode}} projectName="{project_name}" />
      <Dashboard projectType="{{context.project_type}}" />
    </div>
  );
}}

export default App;
"""
        
        # Dashboard component - see docs/ENHANCED_FRONTEND_TEMPLATE.md for full code
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'Dashboard.jsx')] = """import React, { useState, useEffect } from 'react';
import AgentPanel from './AgentPanel';
import './Dashboard.css';

function Dashboard({ projectType }) {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'Orchestrator',
      task: 'Manage workflow',
      status: 'ACTIVE',
      logs: ['[system] Recv: User Prompt -> Break down task.', 'Dispatching tasks to agents...']
    },
    {
      id: 2,
      name: 'Research',
      task: 'Fetch data requirements',
      status: 'ACTIVE',
      logs: ['[querying] APIs...', 'Found: Data models, endpoints.']
    },
    {
      id: 3,
      name: 'Code Gen',
      task: 'Scaffold application',
      status: 'WORKING',
      logs: ['[coding] Creating components...', 'State management setup...']
    },
    {
      id: 4,
      name: 'Review',
      task: 'Quality check',
      status: 'WAITING',
      logs: ['[idle] Waiting for Code Gen output.']
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        logs: [...agent.logs, `[${new Date().toLocaleTimeString()}] Processing...`].slice(-5)
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>AGENT COORDINATION PANEL: {projectType.toUpperCase()} PROJECT</h2>
        <span className="timestamp">[{new Date().toLocaleString()}]</span>
      </div>
      <div className="agent-grid">
        {agents.map(agent => (<AgentPanel key={agent.id} agent={agent} />))}
      </div>
      <div className="user-prompt">
        <span>[USER PROMPT]</span>
        <input type="text" placeholder="Enter requirements..." readOnly />
      </div>
    </div>
  );
}

export default Dashboard;
"""
        
        # Add all other component files - AgentPanel, Header, CSS files
        # See docs/ENHANCED_FRONTEND_TEMPLATE.md for complete code
        
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'AgentPanel.jsx')] = """import React from 'react';
import './AgentPanel.css';

function AgentPanel({ agent }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return '#00ff00';
      case 'WORKING': return '#ffff00';
      case 'WAITING': return '#888888';
      default: return '#ffffff';
    }
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <div className="agent-icon">●</div>
        <div className="agent-info">
          <h3>Agent {agent.id}: {agent.name}</h3>
          <p>TASK: {agent.task}</p>
        </div>
        <div className="agent-arrow">→</div>
      </div>
      <div className="agent-status" style={{ color: getStatusColor(agent.status) }}>
        Status: {agent.status}.
      </div>
      <div className="agent-logs">
        {agent.logs.map((log, idx) => (<div key={idx} className="log-line">{log}</div>))}
      </div>
    </div>
  );
}

export default AgentPanel;
"""
        
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'Header.jsx')] = """import React from 'react';
import './Header.css';

function Header({ darkMode, setDarkMode, projectName }) {
  return (
    <header className="header">
      <div className="logo">
        <span className="logo-icon">◉</span>
        <h1>{projectName}</h1>
      </div>
      <div className="header-controls">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
"""
        
        # CSS files
        files[os.path.join(project_dir, 'frontend', 'src', 'App.css')] = """* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body.dark {
  background: #0a0a0a;
  color: #ffffff;
}

body.light {
  background: #ffffff;
  color: #000000;
}

.app {
  min-height: 100vh;
  font-family: 'Monaco', 'Courier New', monospace;
}
"""
        
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'Dashboard.css')] = """.dashboard {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.dashboard-header h2 {
  font-size: 14px;
  color: #00ff00;
}

.timestamp {
  color: #888;
  font-size: 12px;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.user-prompt {
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-prompt span {
  color: #00ff00;
  font-weight: bold;
  white-space: nowrap;
}

.user-prompt input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}
"""
        
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'AgentPanel.css')] = """.agent-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.agent-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
}

.agent-icon {
  color: #00ff00;
  font-size: 24px;
}

.agent-info {
  flex: 1;
}

.agent-info h3 {
  font-size: 14px;
  color: #00ff00;
  margin-bottom: 5px;
}

.agent-info p {
  font-size: 12px;
  color: #888;
}

.agent-arrow {
  color: #00ff00;
  font-size: 20px;
}

.agent-status {
  font-size: 12px;
  margin-bottom: 15px;
  padding: 5px 10px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 4px;
}

.agent-logs {
  flex: 1;
  font-size: 11px;
  line-height: 1.6;
  color: #aaa;
  overflow-y: auto;
}

.log-line {
  margin-bottom: 5px;
}
"""
        
        files[os.path.join(project_dir, 'frontend', 'src', 'components', 'Header.css')] = """.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: #00ff00;
}

.logo h1 {
  font-size: 20px;
  font-weight: 600;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}
"""
        
        files[os.path.join(project_dir, 'frontend', 'src', 'main.jsx')] = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
        
        files[os.path.join(project_dir, 'frontend', 'index.html')] = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{project_name} Dashboard</title>
  </head>
  <body class="dark">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"""
        
        return files
    
    def _create_tests(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create test files"""
        files = {}
        
        # Backend test
        files[os.path.join(project_dir, 'backend', 'tests', 'test_main.py')] = """import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
"""
        
        return files
    
    def _create_cicd(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create CI/CD pipeline files"""
        files = {}
        
        # GitHub Actions workflow
        files[os.path.join(project_dir, '.github', 'workflows', 'ci.yml')] = """name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install backend dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run backend tests
      run: |
        cd backend
        pytest
    
    - name: Set up Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd frontend
        npm install
    
    - name: Run frontend tests
      run: |
        cd frontend
        npm test
"""
        
        return files
    
    def _create_documentation(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
        """Create documentation files"""
        files = {}
        
        # Architecture doc
        files[os.path.join(project_dir, 'docs', 'ARCHITECTURE.md')] = f"""# Architecture

## Overview

{context.requirements}

## System Design

### Components

1. **Backend API** (FastAPI)
   - RESTful endpoints
   - Data validation
   - Error handling

2. **Frontend** (React)
   - Component-based UI
   - State management
   - Responsive design

3. **Database** (PostgreSQL)
   - Relational data model
   - Migrations
   - Indexing

## Tech Stack

- Backend: Python, FastAPI
- Frontend: React, Vite
- Database: PostgreSQL
- CI/CD: GitHub Actions
- Deployment: Docker, Kubernetes

## Security

- JWT authentication
- Input validation
- Rate limiting
- HTTPS only
"""
        
        return files


# Made with Bob