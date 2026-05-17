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
    try {
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
    } catch (error) {
      // Silently fail - dispatch will handle offline status
      throw error;
    }
  }

  async getModels(): Promise<ModelsResponse> {
    try {
      return await this.fetch<ModelsResponse>('/api/models');
    } catch {
      return { available: [], configured: [], current: 'lmstudio' };
    }
  }

  async getStatus(): Promise<StatusResponse> {
    try {
      return await this.fetch<StatusResponse>('/api/status');
    } catch {
      throw new Error('Backend offline');
    }
  }

  async execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    try {
      return await this.fetch<ExecuteResponse>('/api/execute', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch {
      throw new Error('Backend offline');
    }
  }

  async scanWorkspace(path: string): Promise<FileItem[]> {
    try {
      return await this.fetch<FileItem[]>(`/api/scan?path=${encodeURIComponent(path)}`);
    } catch {
      return [];
    }
  }

  async executeShell(command: string): Promise<{ output: string; exitCode: number }> {
    try {
      return await this.fetch('/api/execute', {
        method: 'POST',
        body: JSON.stringify({
          type: 'shell',
          command,
        }),
      });
    } catch {
      return { output: 'Backend offline', exitCode: 1 };
    }
  }

  async approveChange(sessionId: string, approved: boolean): Promise<void> {
    try {
      await this.fetch(`/api/sessions/${sessionId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approved }),
      });
    } catch {
      // Silently fail
    }
  }

  async getContextFiles(sessionId: string): Promise<string[]> {
    try {
      return await this.fetch<string[]>(`/api/sessions/${sessionId}/context`);
    } catch {
      return [];
    }
  }

  async addContextFile(sessionId: string, path: string): Promise<void> {
    try {
      await this.fetch(`/api/sessions/${sessionId}/context`, {
        method: 'POST',
        body: JSON.stringify({ path }),
      });
    } catch {
      // Silently fail
    }
  }
}

export const api = new ApiClient();

// Made with Bob
