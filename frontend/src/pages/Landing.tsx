import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useElithStore } from '../stores/elithStore';
import { mockContext } from '../mockData';

export default function Landing() {
  const navigate = useNavigate();
  const { setRepoPath, setVaultPath, activeModels, toggleModel, setContext } = useElithStore();
  const [repoInput, setRepoInput] = useState('');
  const [vaultInput, setVaultInput] = useState('');
  const [showVault, setShowVault] = useState(false);

  const handleStartSession = () => {
    if (!repoInput.trim()) return;

    setRepoPath(repoInput);
    setVaultPath(vaultInput);

    // Load mock context data
    setContext(
      mockContext.loaded_files,
      mockContext.total_files,
      mockContext.vault_notes,
      mockContext.tokens_saved
    );

    navigate('/workspace');
  };

  const recentSessions = [
    { path: '~/projects/myapp', date: '2 hours ago' },
    { path: '~/work/api-service', date: 'Yesterday' },
    { path: '~/personal/blog', date: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-block animate-glow">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-accent text-6xl">◆</span>
              <h1 className="text-5xl font-bold">Elith</h1>
            </div>
          </div>
          <p className="text-text-secondary text-lg mt-4">
            Load less. Think deeper. Ship better.
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-bg-secondary border border-border rounded-lg p-8 space-y-6">
          {/* Repo Path Input */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Repository Path
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="~/projects/myapp"
              className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
            />
          </div>

          {/* Vault Path Toggle */}
          <div>
            <button
              onClick={() => setShowVault(!showVault)}
              className="text-sm text-accent hover:text-accent-dim transition-colors mb-2"
            >
              {showVault ? '− Hide' : '+ Add'} Obsidian Vault (optional)
            </button>
            {showVault && (
              <input
                type="text"
                value={vaultInput}
                onChange={(e) => setVaultInput(e.target.value)}
                placeholder="~/Documents/vault"
                className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
              />
            )}
          </div>

          {/* Model Toggles */}
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-3">
              Active Models
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(activeModels).map(([model, active]) => (
                <button
                  key={model}
                  onClick={() => toggleModel(model as keyof typeof activeModels)}
                  disabled={model === 'bob'}
                  className={`flex items-center gap-3 px-4 py-3 rounded border transition-colors ${
                    active
                      ? 'border-accent bg-accent bg-opacity-10 text-text-primary'
                      : 'border-border-light bg-bg-tertiary text-text-muted hover:border-border'
                  } ${model === 'bob' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      model === 'bob'
                        ? 'bg-bob'
                        : model === 'claude'
                        ? 'bg-claude'
                        : model === 'gemini'
                        ? 'bg-gemini'
                        : model === 'codex'
                        ? 'bg-codex'
                        : 'bg-local'
                    } ${active ? '' : 'opacity-30'}`}
                  />
                  <span className="capitalize font-medium">{model}</span>
                  {model === 'bob' && (
                    <span className="ml-auto text-xs text-text-muted">(required)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartSession}
            disabled={!repoInput.trim()}
            className="w-full bg-accent hover:bg-accent-dim disabled:bg-bg-hover disabled:text-text-muted text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:cursor-not-allowed"
          >
            Start Session
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <button
                key={index}
                onClick={() => {
                  setRepoInput(session.path);
                }}
                className="w-full bg-bg-secondary border border-border rounded px-4 py-3 text-left hover:border-border-light transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-primary font-mono text-sm group-hover:text-accent transition-colors">
                    {session.path}
                  </span>
                  <span className="text-text-muted text-xs">{session.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
