// Global state management with useReducer + Context

import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { AppState, AppAction, Message, ExpandableBlock } from '../types.js';
import { execSync } from 'child_process';

// Initial state
const initialState: AppState = {
  messages: [],
  status: 'idle',
  model: 'lmstudio',
  branch: getBranch(),
  workspace: process.cwd(),
  sandbox: 'no sandbox',
  ctxPercent: 0,
  quotaPercent: 0,
  memoryMB: getMemoryUsage(),
  tokens: 0,
  sessionId: generateSessionId(),
  inputHistory: [],
  historyIndex: -1,
  queuedInput: null,
  autoScroll: true,
  triggerMode: null,
  triggerQuery: '',
  panelSelectedIndex: 0,
  focusedExpandableId: null,
  mode: 'autonomous',
};

// Helper functions
function getBranch(): string {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    return 'main';
  }
}

function getMemoryUsage(): number {
  return Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 10) / 10;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Reducer
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'USER_SUBMIT': {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: action.payload.text,
        timestamp: Date.now(),
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
        status: 'thinking',
        inputHistory: [...state.inputHistory, action.payload.text],
        historyIndex: -1,
        queuedInput: null,
      };
    }

    case 'THINKING_CHUNK': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage) return state;

      if (!lastMessage.thinking) {
        lastMessage.thinking = {
          id: `thinking-${Date.now()}`,
          type: 'thinking',
          label: 'Thinking',
          body: action.payload.chunk,
          collapsed: false,
          active: true,
          focused: false,
        };
      } else {
        lastMessage.thinking.body += action.payload.chunk;
      }

      return { ...state, messages };
    }

    case 'THINKING_DONE': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage?.thinking) {
        lastMessage.thinking.active = false;
        lastMessage.thinking.durationMs = Date.now() - parseInt(lastMessage.thinking.id.split('-')[1]);
      }

      return { ...state, messages };
    }

    case 'SUBAGENT_START': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage) return state;

      const newSubAgent: ExpandableBlock = {
        id: action.payload.id,
        type: 'subagent',
        label: action.payload.label,
        body: '',
        collapsed: true,
        active: true,
        focused: false,
      };

      if (!lastMessage.subAgents) {
        lastMessage.subAgents = [];
      }
      lastMessage.subAgents.push(newSubAgent);

      return { ...state, messages };
    }

    case 'SUBAGENT_CHUNK': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage?.subAgents) return state;

      const subAgent = lastMessage.subAgents.find(sa => sa.id === action.payload.id);
      if (subAgent) {
        subAgent.body += action.payload.chunk;
      }

      return { ...state, messages };
    }

    case 'SUBAGENT_DONE': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage?.subAgents) return state;

      const subAgent = lastMessage.subAgents.find(sa => sa.id === action.payload.id);
      if (subAgent) {
        subAgent.active = false;
        subAgent.durationMs = Date.now() - parseInt(subAgent.id.split('-')[1] || '0');
      }

      return { ...state, messages };
    }

    case 'STREAM_CHUNK': {
      const messages = [...state.messages];
      let lastMessage = messages[messages.length - 1];
      
      // If last message is not from agent, create new agent message
      if (!lastMessage || lastMessage.role !== 'agent') {
        lastMessage = {
          id: Date.now().toString(),
          role: 'agent',
          text: action.payload.chunk,
          timestamp: Date.now(),
        };
        messages.push(lastMessage);
      } else {
        lastMessage.text += action.payload.chunk;
      }

      return { ...state, messages, status: 'streaming' };
    }

    case 'TOOL_START': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage) return state;

      if (!lastMessage.tools) {
        lastMessage.tools = [];
      }
      lastMessage.tools.push(action.payload);

      return { ...state, messages, status: 'tool_running' };
    }

    case 'TOOL_DONE': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage?.tools) return state;

      const tool = lastMessage.tools.find(t => t.id === action.payload.id);
      if (tool) {
        tool.status = action.payload.status;
        tool.result = action.payload.result;
      }

      return { ...state, messages };
    }

    case 'ACTIVITY_LOG': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (!lastMessage) return state;

      if (!lastMessage.activityLogs) {
        lastMessage.activityLogs = [];
      }
      lastMessage.activityLogs.push(action.payload.message);
      
      // Keep only last 5 activity logs
      if (lastMessage.activityLogs.length > 5) {
        lastMessage.activityLogs.shift();
      }

      return { ...state, messages };
    }

    case 'STREAM_DONE': {
      return { ...state, status: 'idle' };
    }

    case 'STREAM_ERROR': {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        text: `Error: ${action.payload.error}`,
        timestamp: Date.now(),
      };
      return {
        ...state,
        messages: [...state.messages, errorMessage],
        status: 'idle',
      };
    }

    case 'AWAITING_APPROVAL': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage) {
        lastMessage.awaitingApproval = true;
      }

      return { ...state, messages, status: 'awaiting_approval' };
    }

    case 'APPROVAL_RESULT': {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage) {
        lastMessage.awaitingApproval = false;
      }

      return { ...state, messages, status: 'idle' };
    }

    case 'CLEAR_TRANSCRIPT': {
      return { ...state, messages: [] };
    }

    case 'SET_MODEL': {
      return { ...state, model: action.payload.model };
    }

    case 'SET_AUTO_SCROLL': {
      return { ...state, autoScroll: action.payload.autoScroll };
    }

    case 'SET_TRIGGER': {
      return {
        ...state,
        triggerMode: action.payload.mode,
        triggerQuery: action.payload.query,
        panelSelectedIndex: 0,
      };
    }

    case 'CLOSE_TRIGGER': {
      return {
        ...state,
        triggerMode: null,
        triggerQuery: '',
        panelSelectedIndex: 0,
      };
    }

    case 'PANEL_NAVIGATE': {
      const delta = action.payload.direction === 'up' ? -1 : 1;
      const newIndex = Math.max(0, state.panelSelectedIndex + delta);
      return { ...state, panelSelectedIndex: newIndex };
    }

    case 'SET_FOCUS_EXPANDABLE': {
      return { ...state, focusedExpandableId: action.payload.id };
    }

    case 'TOGGLE_EXPANDABLE': {
      const messages = state.messages.map(msg => {
        // Toggle thinking block
        if (msg.thinking?.id === action.payload.id) {
          return {
            ...msg,
            thinking: {
              ...msg.thinking,
              collapsed: !msg.thinking.collapsed,
            },
          };
        }
        
        // Toggle subagent block
        if (msg.subAgents) {
          return {
            ...msg,
            subAgents: msg.subAgents.map(sa =>
              sa.id === action.payload.id
                ? { ...sa, collapsed: !sa.collapsed }
                : sa
            ),
          };
        }
        
        return msg;
      });

      return { ...state, messages };
    }

    case 'UPDATE_STATUS': {
      return { ...state, status: action.payload.status };
    }

    case 'UPDATE_STATS': {
      return {
        ...state,
        ...action.payload,
        memoryMB: getMemoryUsage(),
      };
    }

    default:
      return state;
  }
}

// Context
const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<Dispatch<AppAction> | undefined>(undefined);

// Provider
export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// Hooks
export function useAppState(): AppState {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within AppStoreProvider');
  }
  return context;
}

export function useAppDispatch(): Dispatch<AppAction> {
  const context = useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used within AppStoreProvider');
  }
  return context;
}

// Made with Bob
