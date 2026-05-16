interface ModelBadgeProps {
  model: 'bob' | 'claude' | 'gemini' | 'codex' | 'local';
  active: boolean;
  status?: 'idle' | 'running' | 'done';
}

const modelColors = {
  bob: 'bg-bob',
  claude: 'bg-claude',
  gemini: 'bg-gemini',
  codex: 'bg-codex',
  local: 'bg-local',
};

const modelNames = {
  bob: 'Bob',
  claude: 'Claude',
  gemini: 'Gemini',
  codex: 'Codex',
  local: 'Local',
};

export default function ModelBadge({ model, active, status = 'idle' }: ModelBadgeProps) {
  const dotColor = modelColors[model];
  const isRunning = status === 'running';
  const isDone = status === 'done';

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${dotColor} ${
          active ? (isRunning ? 'animate-pulse-slow' : isDone ? 'bg-success' : '') : 'opacity-30'
        }`}
      />
      <span className={`text-sm ${active ? 'text-text-primary' : 'text-text-muted'}`}>
        {modelNames[model]}
      </span>
    </div>
  );
}

// Made with Bob
