import React from 'react';
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
