import { useState } from 'react';

export default function BottomBar() {
  const [task, setTask] = useState('');
  const [mode, setMode] = useState('parallel');

  const handleRun = () => {
    console.log('Running task:', task, 'in mode:', mode);
    // This will be wired to the API later
  };

  return (
    <div className="h-16 bg-bg-secondary border-t border-border flex items-center gap-4 px-6">
      {/* Task Input */}
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your prompt, /commands, @file references..."
        className="flex-1 bg-bg-tertiary border border-border-light rounded px-4 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleRun();
          }
        }}
      />

      {/* Mode Selector */}
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="bg-bg-tertiary border border-border-light rounded px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
      >
        <option value="parallel">Parallel</option>
        <option value="sequential">Sequential</option>
        <option value="single">Single Model</option>
      </select>

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={!task.trim()}
        className="bg-accent hover:bg-accent-dim disabled:bg-bg-hover disabled:text-text-muted text-white px-6 py-2 rounded font-semibold text-sm transition-colors disabled:cursor-not-allowed"
      >
        Run
      </button>
    </div>
  );
}

// Made with Bob
