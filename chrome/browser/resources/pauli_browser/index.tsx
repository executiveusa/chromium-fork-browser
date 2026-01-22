import React from 'react';
import { createRoot } from 'react-dom/client';
import { DashboardApp } from './dashboard/DashboardApp';
import { initializeOrchestrators } from './agent_bridge/manager';

/**
 * PAULI Browser Entry Point
 * Initializes the dashboard and all supporting services
 */

// Initialize services
function initializeServices() {
  console.log('Initializing PAULI Browser services...');
  
  // Initialize agent orchestrators
  initializeOrchestrators();
  
  // Initialize API clients (would load tokens from secure storage)
  // initializeGitHubClient();
  // initializeNotionClient();
  // initializeGoogleDriveClient();
  
  console.log('PAULI Browser services initialized');
}

// Main application initialization
function init() {
  console.log('PAULI Browser starting...');
  
  // Initialize services
  initializeServices();
  
  // Get root element
  const rootElement = document.getElementById('pauli-root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  
  // Create React root and render app
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DashboardApp />
    </React.StrictMode>
  );
  
  console.log('PAULI Browser started successfully');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
export { init };
