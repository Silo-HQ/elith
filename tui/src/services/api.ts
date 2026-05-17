// API service layer for backend communication
// Shared between frontend and TUI

import EventSource from 'eventsource';
import { notifyBackendStatus } from '../api/client.js';
import {
  ScanRequest,
  ScanResponse,
  ExecuteRequest,
  ExecuteResponse,
  StreamEvent,
  ResultsResponse,
  ModelsResponse,
  TasksResponse,
  ApiError,
} from '../types/api.js';

const API_BASE = 'http://localhost:8000/api';

async function handleResponse<T>(response: any): Promise<T> {
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
    try {
      const response = await fetch(`${API_BASE}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data = await handleResponse<ScanResponse>(response);
      notifyBackendStatus('online');
      return data;
    } catch {
      notifyBackendStatus('offline');
      throw new Error('Backend offline');
    }
  },

  /**
   * Execute an operation (explain, architect, test-gen, refactor)
   */
  async execute(request: ExecuteRequest): Promise<ExecuteResponse> {
    try {
      const response = await fetch(`${API_BASE}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data = await handleResponse<ExecuteResponse>(response);
      notifyBackendStatus('online');
      return data;
    } catch {
      notifyBackendStatus('offline');
      throw new Error('Backend offline');
    }
  },

  /**
   * Stream live output from a session using Server-Sent Events
   */
  streamSession(
    sessionId: string,
    onEvent: (event: StreamEvent) => void,
    onError?: (error: Error) => void
  ): EventSource {
    let eventSource: EventSource;
    try {
      eventSource = new EventSource(`${API_BASE}/stream/${sessionId}`);
    } catch {
      notifyBackendStatus('offline');
      onEvent({ type: 'error', error: 'Connection lost' });
      throw new Error('Connection lost');
    }

    eventSource.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data) as StreamEvent;
        onEvent(data);
      } catch {
        notifyBackendStatus('offline');
        onEvent({ type: 'error', error: 'Connection lost' });
      }
    };

    eventSource.onerror = () => {
      try {
        eventSource.close();
        notifyBackendStatus('offline');
        onError?.(new Error('Connection lost'));
        onEvent({ type: 'error', error: 'Connection lost' });
      } catch {
        notifyBackendStatus('offline');
        onEvent({ type: 'error', error: 'Connection lost' });
      }
    };

    return eventSource;
  },

  /**
   * Get results for a completed session
   */
  async getResults(sessionId: string): Promise<ResultsResponse> {
    try {
      const response = await fetch(`${API_BASE}/results/${sessionId}`);
      const data = await handleResponse<ResultsResponse>(response);
      notifyBackendStatus('online');
      return data;
    } catch {
      notifyBackendStatus('offline');
      throw new Error('Backend offline');
    }
  },

  /**
   * Get available and configured models
   */
  async getModels(): Promise<ModelsResponse> {
    try {
      const response = await fetch(`${API_BASE}/models`);
      const data = await handleResponse<ModelsResponse>(response);
      notifyBackendStatus('online');
      return data;
    } catch {
      notifyBackendStatus('offline');
      throw new Error('Backend offline');
    }
  },

  /**
   * Get available operations/tasks
   */
  async getTasks(): Promise<TasksResponse> {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      const data = await handleResponse<TasksResponse>(response);
      notifyBackendStatus('online');
      return data;
    } catch {
      notifyBackendStatus('offline');
      throw new Error('Backend offline');
    }
  },
};

// Made with Bob
