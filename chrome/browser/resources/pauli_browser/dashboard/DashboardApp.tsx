import React, { useState } from 'react';
import { WorkspaceNavigation } from './components/WorkspaceNavigation';
import { ProjectsPanel } from './components/ProjectsPanel';
import { TasksPanel } from './components/TasksPanel';
import { AgentStatusPanel } from './components/AgentStatusPanel';
import { SyncStatusIndicator } from './components/SyncStatusIndicator';
import { CommandPaletteContainer } from '../command_palette/CommandPaletteContainer';
import type { WorkspaceTab } from './types';

/**
 * Main PAULI Browser Dashboard Application
 * 
 * This component serves as the entry point for the PAULI Browser UI,
 * replacing the default New Tab Page with a developer-focused dashboard.
 */
export const DashboardApp: React.FC = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<string>('projects');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);

  // Define available workspaces
  const workspaces: WorkspaceTab[] = [
    { id: 'projects', name: 'Projects', component: ProjectsPanel },
    { id: 'tasks', name: 'Tasks', component: TasksPanel },
    { id: 'agents', name: 'Agents', component: AgentStatusPanel },
  ];

  // Get the active workspace component
  const ActiveComponent = workspaces.find(w => w.id === activeWorkspace)?.component || ProjectsPanel;

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to open command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="pauli-dashboard">
      <header className="dashboard-header">
        <div className="header-logo">
          <h1>PAULI Browser</h1>
          <span className="version">v0.1.0</span>
        </div>
        
        <SyncStatusIndicator />
        
        <div className="header-actions">
          <button
            className="command-palette-trigger"
            onClick={() => setCommandPaletteOpen(true)}
            title="Open Command Palette (Cmd/Ctrl+K)"
          >
            ⌘K
          </button>
        </div>
      </header>

      <WorkspaceNavigation
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
      />

      <main className="dashboard-content">
        <ActiveComponent />
      </main>

      {commandPaletteOpen && (
        <CommandPaletteContainer onClose={() => setCommandPaletteOpen(false)} />
      )}

      <style>{`
        .pauli-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0e0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-logo h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-logo .version {
          font-size: 0.75rem;
          color: #888;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .command-palette-trigger {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: #e0e0e0;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.2s;
        }

        .command-palette-trigger:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .dashboard-content {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};
