import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Workspace from './pages/Workspace';
import Proposals from './pages/Proposals';
import Execution from './pages/Execution';
import Results from './pages/Results';
import Settings from './pages/Settings';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/proposals" element={<Proposals />} />
        <Route path="/execution" element={<Execution />} />
        <Route path="/results" element={<Results />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;

// Made with Bob
