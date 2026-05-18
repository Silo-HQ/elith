import React, { useState, useEffect } from 'react';
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
