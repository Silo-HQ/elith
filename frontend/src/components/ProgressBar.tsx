interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: 'accent' | 'bob' | 'claude' | 'gemini' | 'success';
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  progress, 
  label, 
  color = 'accent',
  showPercentage = true 
}: ProgressBarProps) {
  const colorClasses = {
    accent: 'bg-accent',
    bob: 'bg-bob',
    claude: 'bg-claude',
    gemini: 'bg-gemini',
    success: 'bg-success',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-text-secondary">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-mono text-text-primary">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}

// Made with Bob
