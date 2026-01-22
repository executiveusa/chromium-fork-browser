/**
 * Orchestration Manager
 * Manages connections to multiple agent orchestrators
 */

import { AgentClient, AgentStatus, AgentTask } from './client';

export interface OrchestratorConfig {
  id: string;
  name: string;
  type: string;
  client: AgentClient;
}

export class OrchestrationManager {
  private orchestrators: Map<string, OrchestratorConfig> = new Map();
  private statusUpdateInterval: number | null = null;

  /**
   * Register an orchestrator
   */
  register(config: OrchestratorConfig): void {
    this.orchestrators.set(config.id, config);
    console.log(`Registered orchestrator: ${config.name} (${config.id})`);
  }

  /**
   * Unregister an orchestrator
   */
  unregister(orchestratorId: string): void {
    this.orchestrators.delete(orchestratorId);
    console.log(`Unregistered orchestrator: ${orchestratorId}`);
  }

  /**
   * Get orchestrator by ID
   */
  get(orchestratorId: string): OrchestratorConfig | undefined {
    return this.orchestrators.get(orchestratorId);
  }

  /**
   * List all registered orchestrators
   */
  list(): OrchestratorConfig[] {
    return Array.from(this.orchestrators.values());
  }

  /**
   * Execute command on specific orchestrator
   */
  async execute(
    orchestratorId: string,
    command: string,
    params?: Record<string, any>
  ): Promise<AgentTask> {
    const orchestrator = this.orchestrators.get(orchestratorId);
    if (!orchestrator) {
      throw new Error(`Orchestrator not found: ${orchestratorId}`);
    }

    return orchestrator.client.execute(command, params);
  }

  /**
   * Get status of all orchestrators
   */
  async getAllStatus(): Promise<Map<string, AgentStatus>> {
    const statusMap = new Map<string, AgentStatus>();

    for (const [id, config] of this.orchestrators) {
      try {
        const status = await config.client.getStatus();
        statusMap.set(id, status);
      } catch (error) {
        console.error(`Failed to get status for ${id}:`, error);
        statusMap.set(id, {
          agentId: id,
          status: 'error',
          queuedTasks: 0,
          completedTasks: 0,
          failedTasks: 0,
        });
      }
    }

    return statusMap;
  }

  /**
   * Start periodic status updates
   */
  startStatusUpdates(intervalMs: number, callback: (status: Map<string, AgentStatus>) => void): void {
    if (this.statusUpdateInterval) {
      this.stopStatusUpdates();
    }

    const updateStatus = async () => {
      const status = await this.getAllStatus();
      callback(status);
    };

    // Initial update
    updateStatus();

    // Periodic updates
    this.statusUpdateInterval = window.setInterval(updateStatus, intervalMs);
  }

  /**
   * Stop status updates
   */
  stopStatusUpdates(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
  }

  /**
   * Broadcast command to all orchestrators
   */
  async broadcast(
    command: string,
    params?: Record<string, any>
  ): Promise<Map<string, AgentTask>> {
    const tasks = new Map<string, AgentTask>();

    for (const [id, config] of this.orchestrators) {
      try {
        const task = await config.client.execute(command, params);
        tasks.set(id, task);
      } catch (error) {
        console.error(`Failed to execute on ${id}:`, error);
      }
    }

    return tasks;
  }

  /**
   * Get task status from specific orchestrator
   */
  async getTaskStatus(orchestratorId: string, taskId: string): Promise<AgentTask> {
    const orchestrator = this.orchestrators.get(orchestratorId);
    if (!orchestrator) {
      throw new Error(`Orchestrator not found: ${orchestratorId}`);
    }

    return orchestrator.client.getTaskStatus(taskId);
  }

  /**
   * Cancel task on specific orchestrator
   */
  async cancelTask(orchestratorId: string, taskId: string): Promise<void> {
    const orchestrator = this.orchestrators.get(orchestratorId);
    if (!orchestrator) {
      throw new Error(`Orchestrator not found: ${orchestratorId}`);
    }

    return orchestrator.client.cancelTask(taskId);
  }
}

// Global orchestration manager instance
export const orchestrationManager = new OrchestrationManager();

/**
 * Initialize default orchestrators
 */
export function initializeOrchestrators(): void {
  // In a real implementation, these would be configured from user settings
  // or environment variables
  
  console.log('Orchestrator initialization - configuration required');
  
  // Example:
  // orchestrationManager.register({
  //   id: 'pauli-prime',
  //   name: 'PAULI-PRIME',
  //   type: 'primary',
  //   client: new HTTPAgentClient({
  //     endpoint: 'https://pauli-prime.example.com/api',
  //     apiKey: 'xxx',
  //   }),
  // });
}
