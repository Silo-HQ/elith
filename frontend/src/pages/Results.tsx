import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ModelBadge from '../components/ModelBadge';
import { useElithStore } from '../stores/elithStore';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Results() {
  const navigate = useNavigate();
  const { sessionResult, setSessionResult, sessionId, loadedFiles, totalFiles, tokensSaved } = useElithStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real results if we have a session ID
    const fetchResults = async () => {
      if (!sessionResult && sessionId) {
        setLoading(true);
        setError(null);
        
        try {
          const results = await api.getResults(sessionId);
          setSessionResult(results);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch results');
          console.error('Results fetch error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [sessionResult, sessionId, setSessionResult]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-muted">Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/workspace')}
            className="bg-accent hover:bg-accent-dim text-white px-6 py-2 rounded transition-colors"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  if (!sessionResult) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <p className="text-text-muted mb-4">No results available</p>
          <button
            onClick={() => navigate('/workspace')}
            className="bg-accent hover:bg-accent-dim text-white px-6 py-2 rounded transition-colors"
          >
            Back to Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-success text-3xl">✓</span>
              <div>
                <h1 className="text-3xl font-bold">Session Complete</h1>
                <p className="text-text-secondary">{sessionResult.time_taken}</p>
              </div>
            </div>

            {/* Changes Made */}
            {sessionResult.files_changed && sessionResult.files_changed.length > 0 && (
              <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Changes Made</h2>
                <div className="space-y-3">
                  {sessionResult.files_changed.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 bg-bg-tertiary rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-text-primary">{file.path}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-accent text-white">
                            {file.action}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{file.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why */}
            {sessionResult.why && (
              <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Why</h2>
                <p className="text-text-primary leading-relaxed">{sessionResult.why}</p>
              </div>
            )}

            {/* Models Used */}
            {sessionResult.models_used && sessionResult.models_used.length > 0 && (
              <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Models Used</h2>
                <div className="space-y-3">
                  {sessionResult.models_used.map((modelInfo, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <ModelBadge
                        model={modelInfo.model.toLowerCase() as any}
                        active={true}
                        status="done"
                      />
                      <span className="text-text-secondary">→</span>
                      <span className="text-text-primary">{modelInfo.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Context Efficiency */}
            <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Context Efficiency</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Files loaded</p>
                  <p className="text-2xl font-mono text-text-primary">
                    {loadedFiles.length} / {totalFiles}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Token savings</p>
                  <p className="text-2xl font-mono text-success">~{tokensSaved.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Bob Report */}
            {sessionResult.bob_report_path && (
              <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">Bob Report</h2>
                    <p className="text-sm text-text-secondary font-mono">
                      {sessionResult.bob_report_path}
                    </p>
                  </div>
                  <button className="bg-bg-tertiary hover:bg-bg-hover border border-border-light text-text-primary px-4 py-2 rounded transition-colors">
                    View Report
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  navigate('/workspace');
                }}
                className="flex-1 bg-accent hover:bg-accent-dim text-white font-semibold py-3 rounded-lg transition-colors"
              >
                New Task
              </button>
              <button className="flex-1 bg-bg-secondary hover:bg-bg-hover border border-border text-text-primary font-semibold py-3 rounded-lg transition-colors">
                View Full Diff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
