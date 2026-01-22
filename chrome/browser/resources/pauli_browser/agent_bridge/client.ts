/**
 * Agent Client Base Class
 * Base class for all agent orchestrator integrations
 */

export interface AgentConfig {
  endpoint: string;
  apiKey?: string;
  timeout?: number;
}

export interface AgentTask {
  id: string;
  command: string;
  params?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentStatus {
  agentId: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  currentTask?: string;
  queuedTasks: number;
  completedTasks: number;
  failedTasks: number;
}

export abstract class AgentClient {
  protected endpoint: string;
  protected apiKey?: string;
  protected timeout: number;

  constructor(config: AgentConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
  }

  /**
   * Make request to agent endpoint
   */
  protected async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.endpoint}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Execute a command on the agent
   */
  abstract execute(command: string, params?: Record<string, any>): Promise<AgentTask>;

  /**
   * Get status of a task
   */
  abstract getTaskStatus(taskId: string): Promise<AgentTask>;

  /**
   * Get overall agent status
   */
  abstract getStatus(): Promise<AgentStatus>;

  /**
   * Cancel a running task
   */
  abstract cancelTask(taskId: string): Promise<void>;
}

/**
 * WebSocket-based agent client
 * For real-time bidirectional communication
 */
export class WebSocketAgentClient extends AgentClient {
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  /**
   * Connect to agent WebSocket
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.endpoint.replace('http://', 'ws://').replace('https://', 'wss://');
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected to agent');
        resolve();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(error);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const handler = this.messageHandlers.get(data.type);
          if (handler) {
            handler(data);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected from agent');
        this.ws = null;
      };
    });
  }

  /**
   * Send message to agent
   */
  send(type: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.ws.send(JSON.stringify({ type, ...data }));
  }

  /**
   * Register message handler
   */
  on(type: string, handler: (data: any) => void): void {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Implement abstract methods
  async execute(command: string, params?: Record<string, any>): Promise<AgentTask> {
    // Send via WebSocket and wait for response
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ command, params }),
    });
  }

  async getTaskStatus(taskId: string): Promise<AgentTask> {
    return this.request(`/tasks/${taskId}`);
  }

  async getStatus(): Promise<AgentStatus> {
    return this.request('/status');
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.request(`/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
  }
}

/**
 * HTTP polling-based agent client
 * For simpler integrations
 */
export class HTTPAgentClient extends AgentClient {
  async execute(command: string, params?: Record<string, any>): Promise<AgentTask> {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify({ command, params }),
    });
  }

  async getTaskStatus(taskId: string): Promise<AgentTask> {
    return this.request(`/tasks/${taskId}`);
  }

  async getStatus(): Promise<AgentStatus> {
    return this.request('/status');
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.request(`/tasks/${taskId}/cancel`, {
      method: 'POST',
    });
  }

  /**
   * Poll task status until completion
   */
  async waitForCompletion(
    taskId: string,
    onProgress?: (task: AgentTask) => void,
    maxRetries: number = 300 // 10 minutes with 2s polling
  ): Promise<AgentTask> {
    let retries = 0;
    
    while (retries < maxRetries) {
      const task = await this.getTaskStatus(taskId);
      
      if (onProgress) {
        onProgress(task);
      }

      if (task.status === 'completed' || task.status === 'failed') {
        return task;
      }

      retries++;
      
      // Poll every 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error(`Task ${taskId} timed out after ${maxRetries * 2} seconds`);
  }
}
