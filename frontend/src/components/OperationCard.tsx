interface OperationCardProps {
  icon: string;
  name: string;
  description: string;
  models: string[];
  onClick: () => void;
  isActive?: boolean;
}

export default function OperationCard({ 
  icon, 
  name, 
  description, 
  models, 
  onClick,
  isActive = false 
}: OperationCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isActive
          ? 'border-accent bg-accent bg-opacity-10 shadow-lg shadow-accent/20'
          : 'border-border bg-bg-secondary hover:border-border-light hover:bg-bg-tertiary'
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary mb-1">{name}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {models.map((model, index) => (
          <span
            key={index}
            className="text-xs px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary"
          >
            {model}
          </span>
        ))}
      </div>
    </button>
  );
}

// Made with Bob
