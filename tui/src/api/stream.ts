// SSE stream handler for real-time backend events

import EventSource from 'eventsource';
import type { StreamEvent } from '../types.js';

const BASE_URL = 'http://localhost:8000';

export class StreamHandler {
  private eventSource: EventSource | null = null;

  connect(
    sessionId: string,
    onEvent: (event: StreamEvent) => void,
    onError?: (error: Error) => void
  ): EventSource {
    const url = `${BASE_URL}/api/sessions/${sessionId}/stream`;
    
    this.eventSource = new EventSource(url);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as StreamEvent;
        onEvent(data);
      } catch (error) {
        console.error('Failed to parse SSE event:', error);
        onError?.(error as Error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      onError?.(new Error('SSE connection failed'));
      this.close();
    };

    return this.eventSource;
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  isConnected(): boolean {
    return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN;
  }
}

// Singleton instance
export const streamHandler = new StreamHandler();

// Helper function for use in React components
export function createStreamConnection(
  sessionId: string,
  onEvent: (event: StreamEvent) => void,
  onError?: (error: Error) => void
): () => void {
  const handler = new StreamHandler();
  handler.connect(sessionId, onEvent, onError);
  
  // Return cleanup function
  return () => handler.close();
}

// Made with Bob
