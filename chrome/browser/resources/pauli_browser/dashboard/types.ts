// Common types used across PAULI Browser

export interface SyncStatus {
  github: 'synced' | 'pending' | 'stale' | 'error';
  notion: 'synced' | 'pending' | 'stale' | 'error';
  drive: 'synced' | 'pending' | 'stale' | 'error';
  lastSync: Date;
}

export interface Project {
  id: string;
  name: string;
  repository: string;
  status: string;
  syncStatus: SyncStatus;
  lastUpdated: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  assignee?: string;
  project?: string;
  dueDate?: Date;
  notionUrl?: string;
  githubIssue?: string;
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  author: string;
  status: 'open' | 'closed' | 'merged';
  repository: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  currentTask?: string;
  progress?: number;
  logs?: string[];
}

export interface Command {
  id: string;
  name: string;
  description: string;
  category: CommandCategory;
  handler: (params?: any) => Promise<void>;
  shortcut?: string;
  icon?: string;
}

export enum CommandCategory {
  AutoExecute = 'auto-execute',
  RequiresApproval = 'requires-approval',
  HardBlock = 'hard-block',
}

export interface WorkspaceTab {
  id: string;
  name: string;
  icon?: string;
  component: React.ComponentType;
}

export interface AuthConfig {
  github?: {
    token: string;
    user: string;
  };
  notion?: {
    token: string;
    workspace: string;
  };
  drive?: {
    token: string;
    email: string;
  };
}
