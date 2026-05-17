// API service layer for backend communication
// Shared between frontend and TUI

import fetch from 'node-fetch';
import EventSource from 'eventsource';
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
  streamSession(
    sessionId: string,
    onEvent: (event: StreamEvent) => void,
    onError?: (error: Error) => void
  ): EventSource {
    const eventSource = new EventSource(`${API_BASE}/stream/${sessionId}`);

    eventSource.onmessage = (event: any) => {
      try {
        const data = JSON.parse(event.data) as StreamEvent;
        onEvent(data);
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
      }
    };

    eventSource.onerror = (error: any) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      if (onError) {
        onError(new Error('Connection lost'));
      } else {
        onEvent({ type: 'error', error: 'Connection lost' });
      }
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
