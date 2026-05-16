// Mock data for development - use these exactly as specified in TASKS_JOHANN.md

export const mockContext = {
  loaded_files: [
    "auth/views.py",
    "auth/models.py",
    "auth/urls.py",
    "config/settings.py",
    "requirements.txt",
    "README.md"
  ],
  total_files: 312,
  vault_notes: ["auth-decisions.md", "tech-debt.md", "coding-standards.md"],
  tokens_saved: 4200
};

export const mockProposals = [
  {
    id: "A",
    name: "JWT + Redis Session Hybrid",
    recommended: true,
    why_not_standard: "auth/views.py:L142 requires immediate token revocation. Pure JWT cannot revoke without blocklist overhead.",
    proposal: "Short-lived JWT (15min) + Redis-backed refresh tokens. Matches your security-notes.md requirements exactly.",
    tradeoffs: {
      pros: ["Immediate revocation", "Stateless verification (fast reads)"],
      cons: ["Redis dependency added"]
    },
    migration_steps: ["Add Redis to requirements", "Update token model", "Refactor session endpoints"],
    migration_downtime: false
  },
  {
    id: "B",
    name: "OAuth2 + PKCE Flow",
    recommended: false,
    why_not_standard: "Your security-notes.md flags CSRF risk in current flow. PKCE eliminates this without server-side state.",
    proposal: "Full OAuth2 with PKCE. Stateless, secure, industry standard for your threat model.",
    tradeoffs: {
      pros: ["Stateless", "Secure against CSRF"],
      cons: ["Frontend changes required", "More complex client"]
    },
    migration_steps: ["Update auth endpoints", "Add PKCE verifier", "Update frontend", "Update tests", "Documentation"],
    migration_downtime: false
  }
];

export const mockOutput = {
  bob: [
    "Reading auth/views.py...",
    "Reading auth/models.py...",
    "Found pattern: no token revocation mechanism",
    "Found pattern: shared session state across requests",
    "Analyzing dependency graph...",
    "Cross-referencing tech-debt.md...",
  ],
  claude: [
    "Reasoning about constraints...",
    "Your read:write ratio (18:1) rules out standard session storage",
    "Evaluating 3 architecture patterns for your constraints...",
  ]
};

export const mockSessionResult = {
  files_changed: [
    {
      path: "auth/views.py",
      action: "refactored",
      description: "JWT + Redis hybrid implementation"
    },
    {
      path: "auth/models.py",
      action: "updated",
      description: "new token model"
    },
    {
      path: "tests/test_auth.py",
      action: "created",
      description: "14 tests"
    },
    {
      path: "auth/README.md",
      action: "updated",
      description: "new flow documented"
    }
  ],
  why: "Previous implementation lacked token revocation. New hybrid provides immediate revocation via Redis while keeping stateless JWT verification for read performance.",
  models_used: [
    { model: "Bob", role: "refactoring + implementation" },
    { model: "Claude", role: "reasoning + documentation" },
    { model: "Gemini", role: "test generation (14 tests)" }
  ],
  time_taken: "2m 14s"
};

// Made with Bob
