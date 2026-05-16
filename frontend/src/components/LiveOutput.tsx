import { useEffect, useRef } from 'react';
import { useElithStore } from '../stores/elithStore';
import ModelBadge from './ModelBadge';

export default function LiveOutput() {
  const { liveOutput, sessionStatus, activeModels } = useElithStore();
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveOutput]);

  const activeModelsList = Object.entries(activeModels)
    .filter(([_, active]) => active)
    .map(([model]) => model);

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Live Output</h2>
        {sessionStatus === 'running' && (
          <span className="text-sm text-running animate-pulse-slow">Running...</span>
        )}
        {sessionStatus === 'done' && (
          <span className="text-sm text-success">✓ Complete</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 font-mono text-sm">
        {activeModelsList.length === 0 ? (
          <div className="text-center text-text-muted py-8">
            No active models. Select models from the sidebar to begin.
          </div>
        ) : (
          activeModelsList.map((model) => (
            <div key={model} className="space-y-2">
              {/* Model Header */}
              <div className="flex items-center gap-2 pb-2 border-b border-border-light">
                <ModelBadge
                  model={model as any}
                  active={true}
                  status={sessionStatus === 'running' ? 'running' : sessionStatus === 'done' ? 'done' : 'idle'}
                />
              </div>

              {/* Model Output */}
              <div className="space-y-1 pl-4">
                {liveOutput[model]?.length > 0 ? (
                  liveOutput[model].map((line, index) => (
                    <div key={index} className="text-text-primary">
                      <span className="text-accent mr-2">▸</span>
                      {line}
                    </div>
                  ))
                ) : (
                  <div className="text-text-muted italic">Waiting for output...</div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={outputEndRef} />
      </div>
    </div>
  );
}

// Made with Bob
