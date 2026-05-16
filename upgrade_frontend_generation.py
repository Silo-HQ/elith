#!/usr/bin/env python3
"""
Script to upgrade the frontend code generation in orchestrator.py
to create production-quality dashboard UIs
"""

import os
import re

def upgrade_orchestrator():
    """Replace the _create_frontend_code method with enhanced version"""
    
    orchestrator_path = "backend/agents/orchestrator.py"
    
    if not os.path.exists(orchestrator_path):
        print(f"❌ Error: {orchestrator_path} not found")
        return False
    
    # Read current file
    with open(orchestrator_path, 'r') as f:
        content = f.read()
    
    # Find the _create_frontend_code method
    pattern = r'def _create_frontend_code\(self, project_dir: str, context: AgentContext\) -> Dict\[str, str\]:.*?return files'
    
    # Enhanced method
    enhanced_method = '''def _create_frontend_code(self, project_dir: str, context: AgentContext) -> Dict[str, str]:
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
        
        return files'''
    
    # Replace the method
    new_content = re.sub(pattern, enhanced_method, content, flags=re.DOTALL)
    
    if new_content == content:
        print("❌ Could not find _create_frontend_code method to replace")
        return False
    
    # Backup original
    backup_path = orchestrator_path + ".backup"
    with open(backup_path, 'w') as f:
        f.write(content)
    print(f"✅ Created backup: {backup_path}")
    
    # Write new version
    with open(orchestrator_path, 'w') as f:
        f.write(new_content)
    print(f"✅ Updated: {orchestrator_path}")
    
    return True

if __name__ == "__main__":
    print("🚀 Upgrading Frontend Code Generation\n")
    
    if upgrade_orchestrator():
        print("\n✅ Upgrade complete!")
        print("\nNext steps:")
        print("1. Restart backend: uvicorn backend.main:app --reload --port 8000")
        print("2. Delete old project: rm -rf itinerary-app")
        print("3. Generate new project: 'create me an itinerary application'")
        print("4. The new project will have the dashboard UI!")
    else:
        print("\n❌ Upgrade failed")
        print("See docs/ENHANCED_FRONTEND_TEMPLATE.md for manual instructions")

# Made with Bob
