interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  color?: 'primary' | 'success' | 'warning' | 'accent';
}

export default function StatCard({ 
  label, 
  value, 
  subtext, 
  icon,
  color = 'primary' 
}: StatCardProps) {
  const colorClasses = {
    primary: 'text-text-primary',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
  };

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-text-secondary">{label}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <div className={`text-2xl font-mono font-semibold ${colorClasses[color]} mb-1`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-text-muted">{subtext}</div>
      )}
    </div>
  );
}

// Made with Bob
