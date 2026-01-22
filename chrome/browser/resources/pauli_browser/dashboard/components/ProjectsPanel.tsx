import React, { useEffect, useState } from 'react';
import type { Project } from '../types';

/**
 * Projects panel component
 * Displays GitHub projects and repositories with sync status
 */
export const ProjectsPanel: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading projects (in real implementation, fetch from GitHub API)
    const loadProjects = async () => {
      setLoading(true);
      
      // Mock data for demonstration
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'chromium-fork-browser',
          repository: 'executiveusa/chromium-fork-browser',
          status: 'active',
          syncStatus: {
            github: 'synced',
            notion: 'synced',
            drive: 'synced',
            lastSync: new Date(),
          },
          lastUpdated: new Date(),
        },
        {
          id: '2',
          name: 'pauli-comic-funnel',
          repository: 'executiveusa/pauli-comic-funnel',
          status: 'active',
          syncStatus: {
            github: 'synced',
            notion: 'pending',
            drive: 'synced',
            lastSync: new Date(Date.now() - 5 * 60 * 1000),
          },
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(mockProjects);
      setLoading(false);
    };

    loadProjects();
  }, []);

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'stale': return '#fb923c';
      case 'error': return '#f87171';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="projects-panel loading">
        <div className="loading-spinner">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="projects-panel">
      <div className="panel-header">
        <h2>Your Projects</h2>
        <button className="btn-primary">+ New Project</button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`project-status ${project.status}`}>
                {project.status}
              </span>
            </div>
            
            <div className="project-repo">
              <span className="repo-icon">📁</span>
              <span className="repo-name">{project.repository}</span>
            </div>

            <div className="project-sync">
              <div className="sync-indicator">
                <span
                  className="sync-dot"
                  style={{ backgroundColor: getSyncStatusColor(project.syncStatus.github) }}
                  title={`GitHub: ${project.syncStatus.github}`}
                />
                <span
                  className="sync-dot"
                  style={{ backgroundColor: getSyncStatusColor(project.syncStatus.notion) }}
                  title={`Notion: ${project.syncStatus.notion}`}
                />
                <span
                  className="sync-dot"
                  style={{ backgroundColor: getSyncStatusColor(project.syncStatus.drive) }}
                  title={`Drive: ${project.syncStatus.drive}`}
                />
              </div>
              <span className="sync-time">
                Last synced: {project.syncStatus.lastSync.toLocaleTimeString()}
              </span>
            </div>

            <div className="project-actions">
              <button className="btn-secondary">View</button>
              <button className="btn-secondary">Sync Now</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .projects-panel {
          width: 100%;
        }

        .projects-panel.loading {
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

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.2s;
        }

        .project-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .project-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .project-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .project-status.active {
          background: rgba(74, 222, 128, 0.2);
          color: #4ade80;
        }

        .project-repo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #999;
          font-size: 0.9rem;
        }

        .repo-icon {
          font-size: 1rem;
        }

        .project-sync {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sync-indicator {
          display: flex;
          gap: 0.5rem;
        }

        .sync-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .sync-time {
          font-size: 0.8rem;
          color: #666;
        }

        .project-actions {
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
