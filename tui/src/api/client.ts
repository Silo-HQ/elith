// API client for Elith backend communication

import type {
  ExecuteRequest,
  ExecuteResponse,
  ModelsResponse,
  StatusResponse,
  FileItem,
} from '../types.js';

const BASE_URL = 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getModels(): Promise<ModelsResponse> {
    return this.fetch<ModelsResponse>('/api/models');
  }

  async getStatus(): Promise<StatusResponse> {
    return this.fetch<StatusResponse>('/api/status');
  }

  async execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    return this.fetch<ExecuteResponse>('/api/execute', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async scanWorkspace(path: string): Promise<FileItem[]> {
    return this.fetch<FileItem[]>(`/api/scan?path=${encodeURIComponent(path)}`);
  }

  async executeShell(command: string): Promise<{ output: string; exitCode: number }> {
    return this.fetch('/api/execute', {
      method: 'POST',
      body: JSON.stringify({
        type: 'shell',
        command,
      }),
    });
  }

  async approveChange(sessionId: string, approved: boolean): Promise<void> {
    await this.fetch(`/api/sessions/${sessionId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approved }),
    });
  }

  async getContextFiles(sessionId: string): Promise<string[]> {
    return this.fetch<string[]>(`/api/sessions/${sessionId}/context`);
  }

  async addContextFile(sessionId: string, path: string): Promise<void> {
    await this.fetch(`/api/sessions/${sessionId}/context`, {
      method: 'POST',
      body: JSON.stringify({ path }),
    });
  }
}

export const api = new ApiClient();

// Made with Bob
