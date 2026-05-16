import { create } from 'zustand';

export interface ArchProposal {
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

export interface SessionResult {
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
  bob_report_path?: string;
}

interface ElithStore {
  // Repo
  repoPath: string;
  vaultPath: string;
  setRepoPath: (path: string) => void;
  setVaultPath: (path: string) => void;

  // Models
  activeModels: {
    bob: boolean;
    claude: boolean;
    gemini: boolean;
    codex: boolean;
    local: boolean;
  };
  toggleModel: (model: keyof ElithStore['activeModels']) => void;

  // Context
  loadedFiles: string[];
  totalFiles: number;
  loadedVaultNotes: string[];
  tokensSaved: number;
  setContext: (files: string[], total: number, notes: string[], tokens: number) => void;

  // Session
  currentOperation: string | null;
  sessionStatus: 'idle' | 'running' | 'done' | 'error';
  sessionId: string | null;
  liveOutput: Record<string, string[]>;
  setOperation: (operation: string | null) => void;
  setSessionStatus: (status: ElithStore['sessionStatus']) => void;
  setSessionId: (id: string | null) => void;
  appendOutput: (model: string, line: string) => void;
  clearOutput: () => void;

  // Results
  proposals: ArchProposal[];
  sessionResult: SessionResult | null;
  bobReportPath: string | null;
  setProposals: (proposals: ArchProposal[]) => void;
  setSessionResult: (result: SessionResult | null) => void;
  setBobReportPath: (path: string | null) => void;

  // UI State
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const useElithStore = create<ElithStore>((set) => ({
  // Repo
  repoPath: '',
  vaultPath: '',
  setRepoPath: (path) => set({ repoPath: path }),
  setVaultPath: (path) => set({ vaultPath: path }),

  // Models
  activeModels: {
    bob: true,
    claude: false,
    gemini: false,
    codex: false,
    local: false,
  },
  toggleModel: (model) =>
    set((state) => ({
      activeModels: {
        ...state.activeModels,
        [model]: model === 'bob' ? true : !state.activeModels[model],
      },
    })),

  // Context
  loadedFiles: [],
  totalFiles: 0,
  loadedVaultNotes: [],
  tokensSaved: 0,
  setContext: (files, total, notes, tokens) =>
    set({
      loadedFiles: files,
      totalFiles: total,
      loadedVaultNotes: notes,
      tokensSaved: tokens,
    }),

  // Session
  currentOperation: null,
  sessionStatus: 'idle',
  sessionId: null,
  liveOutput: {},
  setOperation: (operation) => set({ currentOperation: operation }),
  setSessionStatus: (status) => set({ sessionStatus: status }),
  setSessionId: (id) => set({ sessionId: id }),
  appendOutput: (model, line) =>
    set((state) => ({
      liveOutput: {
        ...state.liveOutput,
        [model]: [...(state.liveOutput[model] || []), line],
      },
    })),
  clearOutput: () => set({ liveOutput: {} }),

  // Results
  proposals: [],
  sessionResult: null,
  bobReportPath: null,
  setProposals: (proposals) => set({ proposals }),
  setSessionResult: (result) => set({ sessionResult: result }),
  setBobReportPath: (path) => set({ bobReportPath: path }),

  // UI State
  currentPage: 'landing',
  setCurrentPage: (page) => set({ currentPage: page }),
}));

// Made with Bob
