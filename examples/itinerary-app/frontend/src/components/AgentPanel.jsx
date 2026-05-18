import React from 'react';
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
