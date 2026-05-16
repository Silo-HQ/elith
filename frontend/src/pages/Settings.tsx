import { useState } from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    gemini: '',
    openai: '',
    ollama_url: 'http://localhost:11434',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage or backend
    localStorage.setItem('elith_api_keys', JSON.stringify(apiKeys));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (provider: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-text-secondary mb-8">
              Configure API keys for AI providers
            </p>

            {/* API Keys Section */}
            <div className="bg-bg-secondary border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">API Keys</h2>
              
              <div className="space-y-4">
                {/* Bob - Always enabled */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    IBM Bob
                  </label>
                  <div className="bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-muted">
                    Native integration - no API key required
                  </div>
                </div>

                {/* Claude */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Claude API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.claude}
                    onChange={(e) => handleChange('claude', e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                {/* Gemini */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => handleChange('gemini', e.target.value)}
                    placeholder="AIza..."
                    className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                {/* OpenAI */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKeys.openai}
                    onChange={(e) => handleChange('openai', e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>

                {/* Ollama URL */}
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Ollama URL
                  </label>
                  <input
                    type="text"
                    value={apiKeys.ollama_url}
                    onChange={(e) => handleChange('ollama_url', e.target.value)}
                    placeholder="http://localhost:11434"
                    className="w-full bg-bg-tertiary border border-border-light rounded px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="bg-accent hover:bg-accent-dim text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Save Settings
              </button>
              {saved && (
                <span className="text-success flex items-center gap-2">
                  <span>✓</span>
                  <span>Settings saved successfully</span>
                </span>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-8 bg-bg-secondary border border-border-light rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">About API Keys</h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• API keys are stored locally in your browser</li>
                <li>• Bob runs natively and doesn't require an API key</li>
                <li>• Other providers require valid API keys to function</li>
                <li>• Keys are never sent to Elith servers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
