import React, { useState, useEffect, useRef } from 'react';
import { commands } from './registry';
import type { Command } from '../dashboard/types';

interface CommandPaletteContainerProps {
  onClose: () => void;
}

/**
 * Command Palette Container
 * Universal command interface accessible via Cmd/Ctrl+K
 */
export const CommandPaletteContainer: React.FC<CommandPaletteContainerProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [executing, setExecuting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on search query
  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            handleExecuteCommand(filteredCommands[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onClose]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleExecuteCommand = async (command: Command) => {
    setExecuting(true);
    
    try {
      await command.handler();
      onClose();
    } catch (error) {
      console.error('Command execution failed:', error);
      // In a real implementation, show error toast
    } finally {
      setExecuting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'auto-execute': return '#4ade80';
      case 'requires-approval': return '#fbbf24';
      case 'hard-block': return '#f87171';
      default: return '#6b7280';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'auto-execute': return 'Auto';
      case 'requires-approval': return 'Approval';
      case 'hard-block': return 'Block';
      default: return category;
    }
  };

  return (
    <>
      <div className="command-palette-overlay" onClick={onClose} />
      <div className="command-palette">
        <div className="command-palette-header">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="command-search"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={executing}
          />
          <button className="close-button" onClick={onClose}>
            Esc
          </button>
        </div>

        <div className="command-results">
          {filteredCommands.length === 0 ? (
            <div className="no-results">
              <p>No commands found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleExecuteCommand(command)}
                disabled={executing}
              >
                <div className="command-info">
                  {command.icon && <span className="command-icon">{command.icon}</span>}
                  <div className="command-text">
                    <div className="command-name">{command.name}</div>
                    <div className="command-description">{command.description}</div>
                  </div>
                </div>
                <div className="command-meta">
                  <span
                    className="command-category"
                    style={{
                      backgroundColor: `${getCategoryColor(command.category)}20`,
                      color: getCategoryColor(command.category),
                    }}
                  >
                    {getCategoryLabel(command.category)}
                  </span>
                  {command.shortcut && (
                    <span className="command-shortcut">{command.shortcut}</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {executing && (
          <div className="command-executing">
            <div className="executing-spinner"></div>
            <span>Executing command...</span>
          </div>
        )}
      </div>

      <style>{`
        .command-palette-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9998;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .command-palette {
          position: fixed;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          max-width: 640px;
          background: rgba(26, 26, 46, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          z-index: 9999;
          animation: slideDown 0.3s ease;
          overflow: hidden;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .command-palette-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-icon {
          font-size: 1.25rem;
        }

        .command-search {
          flex: 1;
          background: transparent;
          border: none;
          color: #e0e0e0;
          font-size: 1.1rem;
          outline: none;
        }

        .command-search::placeholder {
          color: #666;
        }

        .close-button {
          padding: 0.25rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.25rem;
          color: #888;
          font-size: 0.75rem;
          font-family: monospace;
          cursor: pointer;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #e0e0e0;
        }

        .command-results {
          max-height: 400px;
          overflow-y: auto;
        }

        .command-results::-webkit-scrollbar {
          width: 8px;
        }

        .command-results::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .command-results::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .command-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #e0e0e0;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
        }

        .command-item:hover,
        .command-item.selected {
          background: rgba(102, 126, 234, 0.15);
        }

        .command-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .command-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .command-icon {
          font-size: 1.5rem;
        }

        .command-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .command-name {
          font-size: 1rem;
          font-weight: 500;
        }

        .command-description {
          font-size: 0.85rem;
          color: #888;
        }

        .command-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .command-category {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .command-shortcut {
          padding: 0.25rem 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-family: monospace;
          color: #888;
        }

        .no-results {
          padding: 3rem 1.25rem;
          text-align: center;
          color: #666;
        }

        .command-executing {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.2);
          border-top: 1px solid rgba(102, 126, 234, 0.5);
          color: #667eea;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .executing-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(102, 126, 234, 0.3);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
