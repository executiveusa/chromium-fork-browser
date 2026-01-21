import { Command, CommandCategory } from '../dashboard/types';

/**
 * Command registry
 * Central repository of all available commands in PAULI Browser
 */

// Navigation commands
const navigationCommands: Command[] = [
  {
    id: 'nav-dashboard',
    name: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Navigating to dashboard...');
      // In real implementation: router.push('/dashboard')
    },
    icon: '🏠',
    shortcut: 'Ctrl+H',
  },
  {
    id: 'nav-projects',
    name: 'Go to Projects',
    description: 'View your GitHub projects',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Navigating to projects...');
    },
    icon: '📁',
  },
  {
    id: 'nav-tasks',
    name: 'Go to Tasks',
    description: 'View your Notion tasks',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Navigating to tasks...');
    },
    icon: '✓',
  },
];

// Sync commands
const syncCommands: Command[] = [
  {
    id: 'sync-all',
    name: 'Sync All Services',
    description: 'Trigger full triple-sync across GitHub, Notion, and Drive',
    category: CommandCategory.RequiresApproval,
    handler: async () => {
      console.log('Syncing all services...');
      // In real implementation: await syncCoordinator.syncAll()
    },
    icon: '🔄',
    shortcut: 'Ctrl+Shift+S',
  },
  {
    id: 'sync-github',
    name: 'Sync GitHub',
    description: 'Sync with GitHub repositories',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Syncing GitHub...');
    },
    icon: '🐙',
  },
  {
    id: 'sync-notion',
    name: 'Sync Notion',
    description: 'Sync with Notion workspace',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Syncing Notion...');
    },
    icon: '📝',
  },
];

// Agent commands
const agentCommands: Command[] = [
  {
    id: 'agent-start',
    name: 'Start Agent Workflow',
    description: 'Launch a new agent workflow',
    category: CommandCategory.RequiresApproval,
    handler: async () => {
      console.log('Starting agent workflow...');
    },
    icon: '🤖',
  },
  {
    id: 'agent-status',
    name: 'View Agent Status',
    description: 'Check status of running agents',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Viewing agent status...');
    },
    icon: '📊',
  },
];

// Development commands
const devCommands: Command[] = [
  {
    id: 'dev-console',
    name: 'Open Developer Console',
    description: 'Open Chrome DevTools console',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Opening developer console...');
      // In real implementation: open DevTools
    },
    icon: '🔧',
    shortcut: 'F12',
  },
  {
    id: 'dev-clear-cache',
    name: 'Clear Local Cache',
    description: 'Clear all cached data',
    category: CommandCategory.HardBlock,
    handler: async () => {
      console.log('Clearing cache...');
    },
    icon: '🗑️',
  },
];

// GitHub commands
const githubCommands: Command[] = [
  {
    id: 'github-open-pr',
    name: 'Open Pull Request',
    description: 'Create a new pull request',
    category: CommandCategory.RequiresApproval,
    handler: async () => {
      console.log('Opening pull request...');
    },
    icon: '🔀',
  },
  {
    id: 'github-view-prs',
    name: 'View Pull Requests',
    description: 'List all open pull requests',
    category: CommandCategory.AutoExecute,
    handler: async () => {
      console.log('Viewing pull requests...');
    },
    icon: '📋',
  },
  {
    id: 'github-commit',
    name: 'Commit Changes',
    description: 'Commit and push changes to GitHub',
    category: CommandCategory.RequiresApproval,
    handler: async () => {
      console.log('Committing changes...');
    },
    icon: '💾',
  },
];

// Export all commands
export const commands: Command[] = [
  ...navigationCommands,
  ...syncCommands,
  ...agentCommands,
  ...devCommands,
  ...githubCommands,
];

// Export commands by category for filtering
export const commandsByCategory = {
  navigation: navigationCommands,
  sync: syncCommands,
  agent: agentCommands,
  dev: devCommands,
  github: githubCommands,
};

/**
 * Get command by ID
 */
export function getCommandById(id: string): Command | undefined {
  return commands.find(cmd => cmd.id === id);
}

/**
 * Search commands by query
 */
export function searchCommands(query: string): Command[] {
  const lowerQuery = query.toLowerCase();
  return commands.filter(cmd =>
    cmd.name.toLowerCase().includes(lowerQuery) ||
    cmd.description.toLowerCase().includes(lowerQuery)
  );
}
