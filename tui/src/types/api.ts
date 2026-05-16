// Shared API types - can be used by both frontend and TUI
// Matches backend API contracts

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

export interface FileChange {
  path: string;
  action: string;
  description: string;
}

export interface ModelUsage {
  model: string;
  role: string;
}

export interface Proposal {
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
}

export interface ResultsResponse {
  files_changed?: FileChange[];
  why?: string;
  models_used?: ModelUsage[];
  time_taken?: string;
  proposals?: Proposal[];
  bob_report_path?: string;
}

export interface ModelsResponse {
  available: string[];
  configured: string[];
}

export interface TasksResponse {
  operations: string[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Made with Bob
