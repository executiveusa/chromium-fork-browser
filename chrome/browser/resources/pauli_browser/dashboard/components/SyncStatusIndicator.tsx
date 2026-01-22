import React, { useEffect, useState } from 'react';
import type { SyncStatus } from '../types';

/**
 * Sync status indicator component
 * Displays triple-sync health across GitHub, Notion, and Google Drive
 */
export const SyncStatusIndicator: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    github: 'synced',
    notion: 'synced',
    drive: 'synced',
    lastSync: new Date(),
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Simulate periodic sync status updates
    const interval = setInterval(() => {
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getOverallStatus = (): 'synced' | 'pending' | 'error' => {
    if (syncStatus.github === 'error' || syncStatus.notion === 'error' || syncStatus.drive === 'error') {
      return 'error';
    }
    if (syncStatus.github === 'pending' || syncStatus.notion === 'pending' || syncStatus.drive === 'pending') {
      return 'pending';
    }
    return 'synced';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return '✓';
      case 'pending': return '⟳';
      case 'stale': return '⚠';
      case 'error': return '✗';
      default: return '?';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'stale': return '#fb923c';
      case 'error': return '#f87171';
      default: return '#6b7280';
    }
  };

  const overallStatus = getOverallStatus();
  const timeSinceSync = Math.floor((Date.now() - syncStatus.lastSync.getTime()) / 1000 / 60);

  return (
    <div className="sync-status-container">
      <button
        className="sync-status-trigger"
        onClick={() => setExpanded(!expanded)}
        title="Triple-sync status"
      >
        <span
          className="status-dot"
          style={{ backgroundColor: getStatusColor(overallStatus) }}
        />
        <span className="status-label">
          {overallStatus === 'synced' && 'Synced'}
          {overallStatus === 'pending' && 'Syncing...'}
          {overallStatus === 'error' && 'Sync Error'}
        </span>
      </button>

      {expanded && (
        <div className="sync-status-dropdown">
          <div className="dropdown-header">
            <h4>Triple-Sync Status</h4>
            <button className="btn-close" onClick={() => setExpanded(false)}>
              ×
            </button>
          </div>

          <div className="sync-services">
            <div className="sync-service">
              <div className="service-info">
                <span className="service-icon">🐙</span>
                <span className="service-name">GitHub</span>
              </div>
              <div className="service-status">
                <span
                  className="status-indicator"
                  style={{ color: getStatusColor(syncStatus.github) }}
                >
                  {getStatusIcon(syncStatus.github)}
                </span>
                <span className="status-text">{syncStatus.github}</span>
              </div>
            </div>

            <div className="sync-service">
              <div className="service-info">
                <span className="service-icon">📝</span>
                <span className="service-name">Notion</span>
              </div>
              <div className="service-status">
                <span
                  className="status-indicator"
                  style={{ color: getStatusColor(syncStatus.notion) }}
                >
                  {getStatusIcon(syncStatus.notion)}
                </span>
                <span className="status-text">{syncStatus.notion}</span>
              </div>
            </div>

            <div className="sync-service">
              <div className="service-info">
                <span className="service-icon">💾</span>
                <span className="service-name">Google Drive</span>
              </div>
              <div className="service-status">
                <span
                  className="status-indicator"
                  style={{ color: getStatusColor(syncStatus.drive) }}
                >
                  {getStatusIcon(syncStatus.drive)}
                </span>
                <span className="status-text">{syncStatus.drive}</span>
              </div>
            </div>
          </div>

          <div className="sync-info">
            <p className="last-sync">
              Last synced {timeSinceSync === 0 ? 'just now' : `${timeSinceSync}m ago`}
            </p>
            <button className="btn-sync">Sync Now</button>
          </div>
        </div>
      )}

      <style>{`
        .sync-status-container {
          position: relative;
        }

        .sync-status-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sync-status-trigger:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .status-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sync-status-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 320px;
          background: rgba(26, 26, 46, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          z-index: 1000;
        }

        .dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dropdown-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .btn-close {
          background: transparent;
          border: none;
          color: #888;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .btn-close:hover {
          color: #e0e0e0;
        }

        .sync-services {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sync-service {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .service-icon {
          font-size: 1.25rem;
        }

        .service-name {
          font-size: 0.95rem;
          font-weight: 500;
        }

        .service-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-indicator {
          font-size: 1.1rem;
          font-weight: bold;
        }

        .status-text {
          font-size: 0.85rem;
          color: #888;
          text-transform: capitalize;
        }

        .sync-info {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-sync {
          margin: 0;
          font-size: 0.85rem;
          color: #888;
        }

        .btn-sync {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-sync:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      `}</style>
    </div>
  );
};
