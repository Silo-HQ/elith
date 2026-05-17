// Type definitions for Elith TUI

export type Role = 'user' | 'agent' | 'system';
export type ToolStatus = 'running' | 'success' | 'error';
export type TriggerMode = null | 'slash' | 'file' | 'shell' | 'context';
export type AgentStatus = 
  | 'idle' 
  | 'thinking' 
  | 'streaming' 
  | 'awaiting_approval' 
  | 'tool_running';

export interface ToolCall {
  id: string;
  name: string;
  argument: string;
  status: ToolStatus;
  result?: string;
  startedAt: number;
}

export interface ExpandableBlock {
  id: string;
  type: 'thinking' | 'subagent';
  label: string;
  body: string;
  collapsed: boolean;
  active: boolean;        // currently streaming
  durationMs?: number;
  focused: boolean;       // Tab focus ring
}

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
}

export interface CodeBlock {
  lang: string;
  code: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  thinking?: ExpandableBlock;
  subAgents?: ExpandableBlock[];
  tools?: ToolCall[];
  diff?: DiffLine[];
  codeBlocks?: CodeBlock[];
  awaitingApproval?: boolean;
  activityLogs?: string[];
}

export interface AppState {
  messages: Message[];
  status: AgentStatus;
  model: string;
  branch: string;
  workspace: string;
  sandbox: string;
  ctxPercent: number;
  quotaPercent: number;
  memoryMB: number;
  tokens: number;
  sessionId: string;
  inputHistory: string[];
  historyIndex: number;
  queuedInput: string | null;
  autoScroll: boolean;
  triggerMode: TriggerMode;
  triggerQuery: string;
  panelSelectedIndex: number;
  focusedExpandableId: string | null;
  mode: 'autonomous' | 'confirm';
  backendStatus: 'online' | 'offline' | 'unknown';
  thinkingWord: string;
  thinkingStartedAt: number | null;
  shellMode: boolean;
}

export type AppAction =
  | { type: 'USER_SUBMIT'; payload: { text: string } }
  | { type: 'THINKING_CHUNK'; payload: { chunk: string } }
  | { type: 'THINKING_DONE' }
  | { type: 'SUBAGENT_START'; payload: { id: string; label: string } }
  | { type: 'SUBAGENT_CHUNK'; payload: { id: string; chunk: string } }
  | { type: 'SUBAGENT_DONE'; payload: { id: string } }
  | { type: 'STREAM_CHUNK'; payload: { chunk: string } }
  | { type: 'TOOL_START'; payload: ToolCall }
  | { type: 'TOOL_DONE'; payload: { id: string; status: ToolStatus; result?: string } }
  | { type: 'ACTIVITY_LOG'; payload: { message: string } }
  | { type: 'STREAM_DONE' }
  | { type: 'STREAM_ERROR'; payload: { error: string } }
  | { type: 'AWAITING_APPROVAL' }
  | { type: 'APPROVAL_RESULT'; payload: { approved: boolean } }
  | { type: 'CLEAR_TRANSCRIPT' }
  | { type: 'SET_MODEL'; payload: string }
  | { type: 'SET_MODE'; payload: 'autonomous' | 'confirm' }
  | { type: 'SET_BACKEND_STATUS'; payload: 'online' | 'offline' | 'unknown' }
  | { type: 'SET_THINKING_WORD'; payload: string }
  | { type: 'SET_THINKING_STARTED_AT'; payload: number | null }
  | { type: 'SET_SHELL_MODE'; payload: boolean }
  | { type: 'SCAN_WORKSPACE' }
  | { type: 'SET_AUTO_SCROLL'; payload: { autoScroll: boolean } }
  | { type: 'SET_TRIGGER'; payload: { mode: TriggerMode; query: string } }
  | { type: 'CLOSE_TRIGGER' }
  | { type: 'PANEL_NAVIGATE'; payload: { direction: 'up' | 'down' } }
  | { type: 'SET_FOCUS_EXPANDABLE'; payload: { id: string | null } }
  | { type: 'TOGGLE_EXPANDABLE'; payload: { id: string } }
  | { type: 'UPDATE_STATUS'; payload: { status: AgentStatus } }
  | { type: 'UPDATE_STATS'; payload: Partial<Pick<AppState, 'ctxPercent' | 'quotaPercent' | 'memoryMB' | 'tokens' | 'branch' | 'workspace' | 'sandbox'>> }
  | { type: 'SET_THINKING_WORD'; payload: string }
  | { type: 'SET_THINKING_START'; payload: number | null }
  | { type: 'SET_SHELL_MODE'; payload: boolean };

// Command panel items
export interface CommandItem {
  id: string;
  icon: string;
  name: string;
  description: string;
  action?: () => void;
}

// File picker item
export interface FileItem {
  path: string;
  type: 'file' | 'directory';
}

// Backend API types
export interface ExecuteRequest {
  model: string;
  operation: string;
  repo_path: string;
  prompt: string;
}

export interface ExecuteResponse {
  session_id: string;
  status: string;
}

export interface ModelsResponse {
  available: string[];
  configured: string[];
  current: string;
}

export interface StatusResponse {
  model: string;
  quota_percent: number;
  ctx_percent: number;
  memory_mb: number;
  tokens: number;
}

export interface StreamEvent {
  type: 'output' | 'thinking' | 'tool' | 'subagent' | 'done' | 'error' | 'approval';
  content?: string;
  model?: string;
  error?: string;
  tool?: ToolCall;
  subagent?: { id: string; label: string };
}

// Made with Bob
