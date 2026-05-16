import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ModelBadge from '../components/ModelBadge';
import { useElithStore } from '../stores/elithStore';
import { api } from '../services/api';

export default function Execution() {
  const navigate = useNavigate();
  const {
    activeModels,
    liveOutput,
    sessionStatus,
    sessionId,
    repoPath,
    vaultPath,
    currentOperation,
    setSessionStatus,
    setSessionId,
    appendOutput,
    clearOutput
  } = useElithStore();
  
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Start execution when component mounts
    const startExecution = async () => {
      if (sessionStatus === 'idle' && !sessionId) {
        clearOutput();
        setSessionStatus('running');

        try {
          // Get active model (prefer first non-bob model, fallback to lmstudio)
          const activeModelsList = Object.entries(activeModels)
            .filter(([_, active]) => active)
            .map(([model]) => model);
          
          const selectedModel = activeModelsList.find(m => m !== 'bob') || 'lmstudio';

          // Execute operation
          const response = await api.execute({
            model: selectedModel,
            operation: currentOperation || 'explain',
            repo_path: repoPath || '.',
            vault_path: vaultPath || undefined,
          });

          setSessionId(response.session_id);

          // Start streaming output
          eventSourceRef.current = api.streamSession(response.session_id, (event) => {
            if (event.type === 'output' && event.model && event.content) {
              appendOutput(event.model, event.content);
            } else if (event.type === 'done') {
              setSessionStatus('done');
              eventSourceRef.current?.close();
              setTimeout(() => navigate('/results'), 2000);
            } else if (event.type === 'error') {
              setSessionStatus('error');
              eventSourceRef.current?.close();
              console.error('Execution error:', event.error);
            }
          });
        } catch (error) {
          console.error('Failed to start execution:', error);
          setSessionStatus('error');
        }
      }
    };

    startExecution();

    // Cleanup on unmount
    return () => {
      eventSourceRef.current?.close();
    };
  }, []); // Empty deps - only run once on mount

  const activeModelsList = Object.entries(activeModels)
    .filter(([_, active]) => active)
    .map(([model]) => model);

  const progress = sessionStatus === 'done' ? 100 : sessionStatus === 'running' ? 75 : 0;

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Live Execution</h1>
              <div className="flex items-center gap-2">
                {sessionStatus === 'running' && (
                  <span className="text-running animate-pulse-slow">Running...</span>
                )}
                {sessionStatus === 'done' && (
                  <span className="text-success">✓ Complete</span>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Overall Progress</span>
                <span className="text-sm font-mono text-text-primary">{progress}%</span>
              </div>
              <div className="w-full bg-bg-tertiary rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Model Execution Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {activeModelsList.map((model) => (
                <div
                  key={model}
                  className="bg-bg-secondary border border-border rounded-lg p-6 flex flex-col"
                >
                  {/* Model Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-border-light">
                    <ModelBadge
                      model={model as any}
                      active={true}
                      status={sessionStatus === 'running' ? 'running' : sessionStatus === 'done' ? 'done' : 'idle'}
                    />
                  </div>

                  {/* Model Output */}
                  <div className="flex-1 space-y-2 font-mono text-sm overflow-y-auto max-h-96">
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

                  {/* Model Progress */}
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <div className="w-full bg-bg-tertiary rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          model === 'bob'
                            ? 'bg-bob'
                            : model === 'claude'
                            ? 'bg-claude'
                            : model === 'gemini'
                            ? 'bg-gemini'
                            : 'bg-accent'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeModelsList.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-muted">No active models selected.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
