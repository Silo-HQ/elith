import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className="app">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} projectName="Application" />
      <Dashboard projectType="{context.project_type}" />
    </div>
  );
}

export default App;
