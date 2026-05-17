// Command system types and definitions
// Based on Claude Code CLI: https://code.claude.com/docs/en/commands

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  category: 'core' | 'file' | 'code' | 'git' | 'memory' | 'mode' | 'session';
  subCommands?: Command[];
  handler?: (args: string[]) => Promise<void>;
  tabComplete?: (partial: string) => Promise<string[]>;
}

export const COMMANDS: Command[] = [
  // Core Commands
  {
    name: 'help',
    aliases: ['h', '?'],
    description: 'Show all available commands',
    usage: '/help [command]',
    category: 'core',
  },
  {
    name: 'clear',
    aliases: ['cls'],
    description: 'Clear chat history',
    usage: '/clear',
    category: 'core',
  },
  {
    name: 'reset',
    description: 'Reset session',
    usage: '/reset',
    category: 'core',
  },
  {
    name: 'exit',
    aliases: ['quit', 'q'],
    description: 'Exit the application',
    usage: '/exit',
    category: 'core',
  },

  // Model Commands
  {
    name: 'model',
    aliases: ['m'],
    description: 'Switch AI model',
    usage: '/model <name>',
    category: 'mode',
  },
  {
    name: 'models',
    description: 'List available models',
    usage: '/models',
    category: 'mode',
  },

  // File Operations
  {
    name: 'read',
    aliases: ['r'],
    description: 'Read file contents',
    usage: '/read <file>',
    category: 'file',
  },
  {
    name: 'write',
    aliases: ['w'],
    description: 'Write to file',
    usage: '/write <file> <content>',
    category: 'file',
  },
  {
    name: 'edit',
    aliases: ['e'],
    description: 'Edit file with approval',
    usage: '/edit <file>',
    category: 'file',
  },
  {
    name: 'diff',
    aliases: ['d'],
    description: 'Show file diffs',
    usage: '/diff [file]',
    category: 'file',
  },
  {
    name: 'tree',
    aliases: ['ls'],
    description: 'Show file tree',
    usage: '/tree [path]',
    category: 'file',
  },
  {
    name: 'repo',
    description: 'Set repository path',
    usage: '/repo <path>',
    category: 'file',
  },

  // Code Operations
  {
    name: 'search',
    aliases: ['s', 'find'],
    description: 'Search codebase',
    usage: '/search <query>',
    category: 'code',
  },
  {
    name: 'references',
    aliases: ['refs'],
    description: 'Find symbol references',
    usage: '/references <symbol>',
    category: 'code',
  },
  {
    name: 'explain',
    aliases: ['ex'],
    description: 'Explain code',
    usage: '/explain <file>',
    category: 'code',
  },
  {
    name: 'refactor',
    aliases: ['rf'],
    description: 'Refactor code',
    usage: '/refactor <file>',
    category: 'code',
  },
  {
    name: 'test',
    aliases: ['t'],
    description: 'Generate tests',
    usage: '/test <file>',
    category: 'code',
  },
  {
    name: 'architect',
    aliases: ['arch'],
    description: 'Generate architecture proposals',
    usage: '/architect <description>',
    category: 'code',
  },

  // Git Operations
  {
    name: 'git',
    description: 'Git operations',
    usage: '/git <subcommand>',
    category: 'git',
    subCommands: [
      {
        name: 'status',
        description: 'Show git status',
        usage: '/git status',
        category: 'git',
      },
      {
        name: 'diff',
        description: 'Show git diff',
        usage: '/git diff [file]',
        category: 'git',
      },
      {
        name: 'commit',
        description: 'Commit changes',
        usage: '/git commit <message>',
        category: 'git',
      },
      {
        name: 'branch',
        description: 'Show branches',
        usage: '/git branch',
        category: 'git',
      },
      {
        name: 'log',
        description: 'Show git log',
        usage: '/git log [n]',
        category: 'git',
      },
    ],
  },

  // Memory/Obsidian
  {
    name: 'obsidian',
    aliases: ['obs', 'vault'],
    description: 'Obsidian vault operations',
    usage: '/obsidian <subcommand>',
    category: 'memory',
    subCommands: [
      {
        name: 'status',
        description: 'Check vault status',
        usage: '/obsidian status',
        category: 'memory',
      },
      {
        name: 'setup',
        description: 'Setup Obsidian integration',
        usage: '/obsidian setup',
        category: 'memory',
      },
      {
        name: 'open',
        description: 'Open vault in Obsidian',
        usage: '/obsidian open',
        category: 'memory',
      },
      {
        name: 'search',
        description: 'Search vault',
        usage: '/obsidian search <query>',
        category: 'memory',
      },
      {
        name: 'note',
        description: 'Create/edit note',
        usage: '/obsidian note <name>',
        category: 'memory',
      },
    ],
  },

  // Mode/Rules
  {
    name: 'mode',
    description: 'Switch mode',
    usage: '/mode <mode>',
    category: 'mode',
    subCommands: [
      {
        name: 'code',
        description: 'Code mode',
        usage: '/mode code',
        category: 'mode',
      },
      {
        name: 'plan',
        description: 'Planning mode',
        usage: '/mode plan',
        category: 'mode',
      },
      {
        name: 'ask',
        description: 'Ask mode',
        usage: '/mode ask',
        category: 'mode',
      },
      {
        name: 'advanced',
        description: 'Advanced mode',
        usage: '/mode advanced',
        category: 'mode',
      },
    ],
  },
  {
    name: 'rules',
    description: 'Manage rules',
    usage: '/rules <subcommand>',
    category: 'mode',
    subCommands: [
      {
        name: 'list',
        description: 'List all rules',
        usage: '/rules list',
        category: 'mode',
      },
      {
        name: 'add',
        description: 'Add custom rule',
        usage: '/rules add <rule>',
        category: 'mode',
      },
      {
        name: 'remove',
        description: 'Remove rule',
        usage: '/rules remove <id>',
        category: 'mode',
      },
      {
        name: 'show',
        description: 'Show current rules',
        usage: '/rules show',
        category: 'mode',
      },
    ],
  },

  // Session Management
  {
    name: 'session',
    aliases: ['sess'],
    description: 'Session management',
    usage: '/session <subcommand>',
    category: 'session',
    subCommands: [
      {
        name: 'save',
        description: 'Save current session',
        usage: '/session save [name]',
        category: 'session',
      },
      {
        name: 'load',
        description: 'Load session',
        usage: '/session load <id>',
        category: 'session',
      },
      {
        name: 'list',
        description: 'List sessions',
        usage: '/session list',
        category: 'session',
      },
      {
        name: 'export',
        description: 'Export to bob-reports',
        usage: '/session export',
        category: 'session',
      },
      {
        name: 'delete',
        description: 'Delete session',
        usage: '/session delete <id>',
        category: 'session',
      },
    ],
  },
];

// Helper functions
export function findCommand(name: string): Command | undefined {
  return COMMANDS.find(
    (cmd) =>
      cmd.name === name ||
      (cmd.aliases && cmd.aliases.includes(name))
  );
}

export function findSubCommand(
  parentName: string,
  subName: string
): Command | undefined {
  const parent = findCommand(parentName);
  if (!parent || !parent.subCommands) return undefined;
  
  return parent.subCommands.find(
    (cmd) =>
      cmd.name === subName ||
      (cmd.aliases && cmd.aliases.includes(subName))
  );
}

export function getCommandsByCategory(category: string): Command[] {
  return COMMANDS.filter((cmd) => cmd.category === category);
}

export function getAllCommandNames(): string[] {
  const names: string[] = [];
  
  COMMANDS.forEach((cmd) => {
    names.push(cmd.name);
    if (cmd.aliases) {
      names.push(...cmd.aliases);
    }
  });
  
  return names;
}

export function getTabCompletions(partial: string): string[] {
  const allNames = getAllCommandNames();
  return allNames
    .filter((name) => name.startsWith(partial))
    .sort();
}

// Made with Bob