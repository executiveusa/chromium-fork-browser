import React, { useEffect, useState } from 'react';
import type { Agent } from '../types';

/**
 * Agent status panel component
 * Displays running agent workflows and their status
 */
export const AgentStatusPanel: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);

      // Mock data
      const mockAgents: Agent[] = [
        {
          id: '1',
          name: 'PAULI-PRIME',
          type: 'orchestrator',
          status: 'idle',
          currentTask: undefined,
          progress: 0,
          logs: [],
        },
        {
          id: '2',
          name: 'Code Review Agent',
          type: 'analyzer',
          status: 'running',
          currentTask: 'Reviewing PR #42',
          progress: 65,
          logs: [
            'Starting code review...',
            'Analyzing file changes...',
            'Running static analysis...',
            'Generating suggestions...',
          ],
        },
        {
          id: '3',
          name: 'Sync Agent',
          type: 'background',
          status: 'idle',
          currentTask: undefined,
          progress: 100,
          logs: ['Last sync completed successfully'],
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setAgents(mockAgents);
      setLoading(false);
    };

    loadAgents();
  }, []);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'idle': return '#6b7280';
      case 'running': return '#3b82f6';
      case 'paused': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'idle': return '⏸️';
      case 'running': return '▶️';
      case 'paused': return '⏸️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="agents-panel loading">
        <div className="loading-spinner">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="agents-panel">
      <div className="panel-header">
        <h2>Agent Workflows</h2>
        <button className="btn-primary">+ Configure Agent</button>
      </div>

      <div className="agents-grid">
        {agents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-info">
                <div className="agent-status-indicator">
                  <span className="status-icon">{getStatusIcon(agent.status)}</span>
                  <span
                    className="status-dot"
                    style={{ backgroundColor: getStatusColor(agent.status) }}
                  />
                </div>
                <div>
                  <h3 className="agent-name">{agent.name}</h3>
                  <span className="agent-type">{agent.type}</span>
                </div>
              </div>
              <button className="btn-icon" title="More options">⋮</button>
            </div>

            {agent.currentTask && (
              <div className="agent-current-task">
                <p className="current-task-label">Current Task:</p>
                <p className="current-task-text">{agent.currentTask}</p>
              </div>
            )}

            {agent.status === 'running' && agent.progress !== undefined && (
              <div className="agent-progress">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <span className="progress-text">{agent.progress}%</span>
              </div>
            )}

            {agent.logs && agent.logs.length > 0 && (
              <div className="agent-logs">
                <p className="logs-label">Recent Activity:</p>
                <div className="logs-list">
                  {agent.logs.slice(-3).map((log, index) => (
                    <div key={index} className="log-entry">
                      <span className="log-bullet">•</span>
                      <span className="log-text">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="agent-actions">
              {agent.status === 'running' ? (
                <>
                  <button className="btn-secondary">Pause</button>
                  <button className="btn-secondary">Cancel</button>
                </>
              ) : (
                <>
                  <button className="btn-secondary">Start</button>
                  <button className="btn-secondary">View Logs</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .agents-panel {
          width: 100%;
        }

        .agents-panel.loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .loading-spinner {
          font-size: 1.1rem;
          color: #888;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 600;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .agent-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.2s;
        }

        .agent-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .agent-status-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .status-icon {
          font-size: 1.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }

        .agent-name {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .agent-type {
          font-size: 0.8rem;
          color: #888;
          text-transform: uppercase;
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
        }

        .btn-icon:hover {
          color: #e0e0e0;
        }

        .agent-current-task {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          border-left: 3px solid #3b82f6;
          border-radius: 0.25rem;
        }

        .current-task-label {
          margin: 0 0 0.25rem 0;
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          font-weight: 600;
        }

        .current-task-text {
          margin: 0;
          font-size: 0.9rem;
          color: #e0e0e0;
        }

        .agent-progress {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-bar-container {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #888;
          font-weight: 600;
          min-width: 45px;
          text-align: right;
        }

        .agent-logs {
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logs-label {
          margin: 0 0 0.5rem 0;
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          font-weight: 600;
        }

        .logs-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .log-entry {
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #999;
          font-family: monospace;
        }

        .log-bullet {
          color: #667eea;
        }

        .log-text {
          flex: 1;
        }

        .agent-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          border: none;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e0e0e0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
};
