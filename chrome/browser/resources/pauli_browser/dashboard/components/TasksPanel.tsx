import React, { useEffect, useState } from 'react';
import type { Task } from '../types';

/**
 * Tasks panel component
 * Displays Notion tasks and to-dos
 */
export const TasksPanel: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);

      // Mock data
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Implement PAULI Browser dashboard',
          description: 'Create the main dashboard with React components',
          status: 'in_progress',
          assignee: 'developer',
          project: 'chromium-fork-browser',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          githubIssue: '#42',
        },
        {
          id: '2',
          title: 'Set up GitHub API connector',
          description: 'Create OAuth flow and API client for GitHub integration',
          status: 'todo',
          project: 'chromium-fork-browser',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
        {
          id: '3',
          title: 'Implement command palette',
          description: 'Build command palette with keyboard shortcuts',
          status: 'todo',
          project: 'chromium-fork-browser',
        },
        {
          id: '4',
          title: 'Write project documentation',
          description: 'Create README and architecture docs',
          status: 'done',
          project: 'chromium-fork-browser',
        },
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setTasks(mockTasks);
      setLoading(false);
    };

    loadTasks();
  }, []);

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return '#6b7280';
      case 'in_progress': return '#3b82f6';
      case 'done': return '#10b981';
      case 'blocked': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Done';
      case 'blocked': return 'Blocked';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="tasks-panel loading">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="tasks-panel">
      <div className="panel-header">
        <h2>Your Tasks</h2>
        <button className="btn-primary">+ New Task</button>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
          onClick={() => setFilter('todo')}
        >
          To Do ({tasks.filter(t => t.status === 'todo').length})
        </button>
        <button
          className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
          onClick={() => setFilter('in_progress')}
        >
          In Progress ({tasks.filter(t => t.status === 'in_progress').length})
        </button>
        <button
          className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
          onClick={() => setFilter('done')}
        >
          Done ({tasks.filter(t => t.status === 'done').length})
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-status-indicator">
                <span
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(task.status) }}
                />
                <span className="status-label">{getStatusLabel(task.status)}</span>
              </div>
              {task.githubIssue && (
                <span className="github-issue">{task.githubIssue}</span>
              )}
            </div>

            <h3 className="task-title">{task.title}</h3>
            <p className="task-description">{task.description}</p>

            <div className="task-meta">
              {task.project && (
                <span className="task-project">📁 {task.project}</span>
              )}
              {task.dueDate && (
                <span className="task-due">
                  📅 Due {task.dueDate.toLocaleDateString()}
                </span>
              )}
              {task.assignee && (
                <span className="task-assignee">👤 {task.assignee}</span>
              )}
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="no-tasks">
            <p>No tasks found</p>
          </div>
        )}
      </div>

      <style>{`
        .tasks-panel {
          width: 100%;
        }

        .tasks-panel.loading {
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

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: #e0e0e0;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .filter-btn.active {
          background: rgba(102, 126, 234, 0.2);
          border-color: rgba(102, 126, 234, 0.5);
          color: #667eea;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .task-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.2s;
        }

        .task-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .task-status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: #999;
        }

        .github-issue {
          padding: 0.25rem 0.5rem;
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-family: monospace;
        }

        .task-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .task-description {
          margin: 0 0 1rem 0;
          color: #999;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .task-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: #888;
        }

        .task-project, .task-due, .task-assignee {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .no-tasks {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .btn-primary {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
};
