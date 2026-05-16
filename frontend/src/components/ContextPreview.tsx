import { useElithStore } from '../stores/elithStore';

export default function ContextPreview() {
  const { loadedFiles, totalFiles, loadedVaultNotes, tokensSaved } = useElithStore();

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Context Preview</h2>

      {/* Files Loaded */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-secondary">Files loaded</span>
          <span className="text-sm font-mono text-text-primary">
            {loadedFiles.length} / {totalFiles}
          </span>
        </div>
        <div className="space-y-2">
          {loadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm font-mono text-text-primary bg-bg-tertiary px-3 py-2 rounded"
            >
              <span className="text-accent">→</span>
              <span>{file}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vault Notes */}
      {loadedVaultNotes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">Vault notes</span>
            <span className="text-sm font-mono text-text-primary">{loadedVaultNotes.length}</span>
          </div>
          <div className="space-y-2">
            {loadedVaultNotes.map((note, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm font-mono text-text-primary bg-bg-tertiary px-3 py-2 rounded"
              >
                <span className="text-accent">→</span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token Savings */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-sm">
          <span className="text-text-secondary">Token savings: </span>
          <span className="text-success font-mono font-semibold">
            ~{tokensSaved.toLocaleString()} tokens
          </span>
        </div>
        <div className="text-xs text-text-muted mt-1">
          vs full repo load ({Math.round((tokensSaved / (tokensSaved + 1000)) * 100)}% reduction)
        </div>
      </div>
    </div>
  );
}

// Made with Bob
