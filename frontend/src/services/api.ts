// API service layer for backend communication
// Centralizes all API calls and handles errors consistently

const API_BASE = '/api';

export interface ScanRequest {
  repo_path: string;
  vault_path?: string;
}

export interface ScanResponse {
  loaded_files: string[];
  total_files: number;
  vault_notes: string[];
  tokens_saved: number;
}

export interface ExecuteRequest {
  model: string;
  operation: string;
  repo_path: string;
  vault_path?: string;
  prompt?: string;
}

export interface ExecuteResponse {
  session_id: string;
  status: string;
}

export interface StreamEvent {
  type: 'output' | 'done' | 'error';
  model?: string;
  content?: string;
  error?: string;
}

export interface ResultsResponse {
  files_changed?: Array<{
    path: string;
    action: string;
    description: string;
  }>;
  why?: string;
  models_used?: Array<{
    model: string;
    role: string;
  }>;
  time_taken?: string;
  proposals?: Array<{
    id: string;
    name: string;
    recommended: boolean;
    why_not_standard: string;
    proposal: string;
    tradeoffs: {
      pros: string[];
      cons: string[];
    };
    migration_steps: string[];
    migration_downtime: boolean;
  }>;
  bob_report_path?: string;
}

export interface ModelsResponse {
  available: string[];
  configured: string[];
}

export interface TasksResponse {
  operations: string[];
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(response.status, error || response.statusText);
  }
  return response.json();
}

export const api = {
  /**
   * Scan repository and vault for context
   */
  async scan(request: ScanRequest): Promise<ScanResponse> {
    const response = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<ScanResponse>(response);
  },

  /**
   * Execute an operation (explain, architect, test-gen, refactor)
   */
  async execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    const response = await fetch(`${API_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return handleResponse<ExecuteResponse>(response);
  },

  /**
   * Stream live output from a session using Server-Sent Events
   */
  streamSession(sessionId: string, onEvent: (event: StreamEvent) => void): EventSource {
    const eventSource = new EventSource(`${API_BASE}/stream/${sessionId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as StreamEvent;
        onEvent(data);
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      onEvent({ type: 'error', error: 'Connection lost' });
    };

    return eventSource;
  },

  /**
   * Get results for a completed session
   */
  async getResults(sessionId: string): Promise<ResultsResponse> {
    const response = await fetch(`${API_BASE}/results/${sessionId}`);
    return handleResponse<ResultsResponse>(response);
  },

  /**
   * Get available and configured models
   */
  async getModels(): Promise<ModelsResponse> {
    const response = await fetch(`${API_BASE}/models`);
    return handleResponse<ModelsResponse>(response);
  },

  /**
   * Get available operations/tasks
   */
  async getTasks(): Promise<TasksResponse> {
    const response = await fetch(`${API_BASE}/tasks`);
    return handleResponse<TasksResponse>(response);
  },
};

// Made with Bob