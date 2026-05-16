# Enhanced Frontend Code Generation

This document contains the production-quality frontend code template that creates a dashboard UI similar to the multi-agent coordination panel.

## How to Use

Replace the `_create_frontend_code` method in `backend/agents/orchestrator.py` (lines 464-510) with the code below.

## Enhanced Code

```python
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
      <Dashboard projectType="{context.project_type}" />
    </div>
  );
}}

export default App;
"""
    
    # Dashboard component with multi-panel layout
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
      logs: [
        '[system] Recv: User Prompt -> Break down task.',
        'Dispatching Research to Agent 2 (Market Data).',
        'Code Gen to Agent 3 (Component Structure).',
        'Review to Agent 4 (Quality Check).'
      ]
    },
    {
      id: 2,
      name: 'Research',
      task: 'Fetch data requirements',
      status: 'ACTIVE',
      logs: [
        '[querying] APIs (REST, GraphQL)...',
        'Found: Data models, endpoints.',
        'Refresh intervals configured.'
      ]
    },
    {
      id: 3,
      name: 'Code Gen',
      task: 'Scaffold application',
      status: 'WORKING',
      logs: [
        '[coding] App.js -> Create layout, Dashboard.js...',
        'Components: Header, Sidebar, Content...',
        'State management setup...',
        '...'
      ]
    },
    {
      id: 4,
      name: 'Review',
      task: 'Quality & Security check',
      status: 'WAITING',
      logs: [
        '[idle] Waiting for Code Gen (Agent 3) output.',
        'Will analyze structure, hooks, performance.'
      ]
    }
  ]);

  // Simulate real-time updates
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
        {agents.map(agent => (
          <AgentPanel key={agent.id} agent={agent} />
        ))}
      </div>
      <div className="user-prompt">
        <span>[USER PROMPT]</span>
        <input 
          type="text" 
          placeholder="Enter your requirements here..."
          readOnly
        />
      </div>
    </div>
  );
}

export default Dashboard;
"""
    
    # AgentPanel component
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
        {agent.logs.map((log, idx) => (
          <div key={idx} className="log-line">{log}</div>
        ))}
      </div>
    </div>
  );
}

export default AgentPanel;
"""
    
    # Header component
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
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Header;
"""
    
    # Main CSS
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
    
    # Dashboard CSS
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
    
    # AgentPanel CSS
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
    
    # Header CSS
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
    
    # Main entry point
    files[os.path.join(project_dir, 'frontend', 'src', 'main.jsx')] = """import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
    
    # HTML template
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
```

## What This Creates

1. **Multi-Panel Dashboard** - 4 agent panels showing real-time activity
2. **Dark Mode** - Professional dark theme with toggle
3. **Real-Time Updates** - Simulated agent logs updating every 5 seconds
4. **Responsive Grid** - Adapts to different screen sizes
5. **Professional Styling** - Terminal-like aesthetic with green accents

## To Apply

1. Open `backend/agents/orchestrator.py`
2. Find the `_create_frontend_code` method (around line 464)
3. Replace the entire method with the code above
4. Restart backend
5. Delete `itinerary-app` folder
6. Run "create me an itinerary application" again

The new generated app will have the dashboard UI!