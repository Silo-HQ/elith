import { useElithStore } from '../stores/elithStore';
import ModelBadge from './ModelBadge';

export default function TopBar() {
  const { repoPath, activeModels } = useElithStore();

  return (
    <div className="h-14 bg-bg-secondary border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="text-accent text-xl">◆</span>
        <span className="font-semibold text-lg">Elith</span>
      </div>

      {/* Repo Path */}
      <div className="flex-1 text-center text-text-secondary text-sm font-mono">
        {repoPath || 'No repository loaded'}
      </div>

      {/* Model Status */}
      <div className="flex items-center gap-3">
        <ModelBadge model="bob" active={activeModels.bob} />
        <ModelBadge model="claude" active={activeModels.claude} />
        <ModelBadge model="gemini" active={activeModels.gemini} />
      </div>
    </div>
  );
}

// Made with Bob
