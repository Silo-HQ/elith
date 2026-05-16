import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ModelBadge from '../components/ModelBadge';
import { useElithStore } from '../stores/elithStore';
import { mockSessionResult } from '../mockData';
import { useEffect } from 'react';

export default function Results() {
  const navigate = useNavigate();
  const { sessionResult, setSessionResult, activeModels } = useElithStore();

  useEffect(() => {
    // Load mock result if none exists
    if (!sessionResult) {
      setSessionResult(mockSessionResult);
    }
  }, [sessionResult, setSessionResult]);

  if (!sessionResult) {
    return (
      <div className="h-screen flex items-center justify-center bg-bg-primary">
        <p className="text-text-muted">No results available</p>
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

            {/* Why */}
            <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Why</h2>
              <p className="text-text-primary leading-relaxed">{sessionResult.why}</p>
            </div>

            {/* Models Used */}
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

            {/* Context Efficiency */}
            <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Context Efficiency</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Files loaded</p>
                  <p className="text-2xl font-mono text-text-primary">6 / 312</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Token savings</p>
                  <p className="text-2xl font-mono text-success">~4,200</p>
                </div>
              </div>
            </div>

            {/* Bob Report */}
            <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Bob Report</h2>
                  <p className="text-sm text-text-secondary">
                    Saved to bob-reports/session_{new Date().toISOString().split('T')[0]}.md
                  </p>
                </div>
                <button className="bg-bg-tertiary hover:bg-bg-hover border border-border-light text-text-primary px-4 py-2 rounded transition-colors">
                  Download Report
                </button>
              </div>
            </div>

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
