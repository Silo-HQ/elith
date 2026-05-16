interface FileChipProps {
  filename: string;
  onRemove?: () => void;
}

export default function FileChip({ filename, onRemove }: FileChipProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-bg-tertiary border border-border-light rounded px-3 py-1.5 text-sm font-mono text-text-primary hover:border-border transition-colors">
      <span>{filename}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-text-muted hover:text-error transition-colors"
          aria-label="Remove file"
        >
          ×
        </button>
      )}
    </div>
  );
}

// Made with Bob
