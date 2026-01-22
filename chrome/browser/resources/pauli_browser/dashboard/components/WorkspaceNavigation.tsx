import React from 'react';
import type { WorkspaceTab } from '../types';

interface WorkspaceNavigationProps {
  workspaces: WorkspaceTab[];
  activeWorkspace: string;
  onWorkspaceChange: (workspaceId: string) => void;
}

/**
 * Workspace navigation component
 * Displays tabs for switching between different workspaces (Projects, Tasks, Agents, etc.)
 */
export const WorkspaceNavigation: React.FC<WorkspaceNavigationProps> = ({
  workspaces,
  activeWorkspace,
  onWorkspaceChange,
}) => {
  return (
    <nav className="workspace-navigation">
      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          className={`workspace-tab ${activeWorkspace === workspace.id ? 'active' : ''}`}
          onClick={() => onWorkspaceChange(workspace.id)}
        >
          {workspace.icon && <span className="tab-icon">{workspace.icon}</span>}
          <span className="tab-name">{workspace.name}</span>
        </button>
      ))}

      <style>{`
        .workspace-navigation {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          overflow-x: auto;
        }

        .workspace-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 0.5rem;
          color: #999;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .workspace-tab:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #e0e0e0;
        }

        .workspace-tab.active {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.5);
          color: #667eea;
        }

        .tab-icon {
          font-size: 1.2rem;
        }
      `}</style>
    </nav>
  );
};
