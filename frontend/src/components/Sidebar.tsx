import { useNavigate } from 'react-router-dom';
import { useElithStore } from '../stores/elithStore';

const operations = [
  { id: 'explain', name: 'Explain', icon: '📖' },
  { id: 'architect', name: 'Architect', icon: '⚡' },
  { id: 'refactor', name: 'Refactor', icon: '🔧' },
  { id: 'test-gen', name: 'Test Gen', icon: '✓' },
  { id: 'document', name: 'Document', icon: '📝' },
  { id: 'risk', name: 'Risk Scan', icon: '⚠️' },
  { id: 'harden', name: 'Harden', icon: '🛡️' },
  { id: 'review', name: 'Review', icon: '👁️' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { activeModels, toggleModel, loadedFiles, totalFiles, loadedVaultNotes, tokensSaved, currentOperation } = useElithStore();

  return (
    <div className="w-sidebar bg-bg-secondary border-r border-border flex flex-col">
      {/* Models Section */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Models</h3>
        <div className="space-y-2">
          {Object.entries(activeModels).map(([model, active]) => (
            <button
              key={model}
              onClick={() => toggleModel(model as keyof typeof activeModels)}
              disabled={model === 'bob'}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                active
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-muted hover:bg-bg-hover'
              } ${model === 'bob' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
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
              <span className="capitalize">{model}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Operations Section */}
      <div className="p-4 border-b border-border flex-1 overflow-y-auto">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Operations</h3>
        <div className="space-y-1">
          {operations.map((op, index) => (
            <button
              key={op.id}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                currentOperation === op.id
                  ? 'bg-accent text-white'
                  : 'text-text-primary hover:bg-bg-hover'
              }`}
            >
              <span className="text-base">{op.icon}</span>
              <span>{op.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Context Stats Section */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">Context</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Files loaded</span>
            <span className="text-text-primary font-mono">
              {loadedFiles.length} / {totalFiles}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Vault notes</span>
            <span className="text-text-primary font-mono">{loadedVaultNotes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Tokens saved</span>
            <span className="text-success font-mono">~{tokensSaved.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Settings Link */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-text-primary hover:bg-bg-hover transition-colors"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

// Made with Bob
