/**
 * Notion API Client
 * Handles authentication and API requests to Notion
 */

export interface NotionConfig {
  token: string;
  apiVersion?: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  description?: string;
  properties: Record<string, any>;
}

export interface NotionPage {
  id: string;
  parent: {
    type: string;
    database_id?: string;
  };
  properties: Record<string, any>;
  url: string;
  created_time: string;
  last_edited_time: string;
}

export interface NotionQueryFilter {
  property?: string;
  [key: string]: any;
}

export class NotionClient {
  private token: string;
  private apiVersion: string;
  private apiUrl = 'https://api.notion.com/v1';

  constructor(config: NotionConfig) {
    this.token = config.token;
    this.apiVersion = config.apiVersion || '2022-06-28';
  }

  /**
   * Make authenticated request to Notion API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Notion-Version': this.apiVersion,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Notion API error: ${response.status} - ${error.message}`);
    }

    return response.json();
  }

  /**
   * Get user information
   */
  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  /**
   * List all users
   */
  async listUsers() {
    return this.request('/users');
  }

  /**
   * Get database
   */
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    return this.request(`/databases/${databaseId}`);
  }

  /**
   * Query database
   */
  async queryDatabase(
    databaseId: string,
    filter?: NotionQueryFilter,
    sorts?: any[]
  ): Promise<{ results: NotionPage[] }> {
    return this.request(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        filter,
        sorts,
      }),
    });
  }

  /**
   * Get page
   */
  async getPage(pageId: string): Promise<NotionPage> {
    return this.request(`/pages/${pageId}`);
  }

  /**
   * Create page
   */
  async createPage(
    parentDatabaseId: string,
    properties: Record<string, any>
  ): Promise<NotionPage> {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: {
          type: 'database_id',
          database_id: parentDatabaseId,
        },
        properties,
      }),
    });
  }

  /**
   * Update page properties
   */
  async updatePage(
    pageId: string,
    properties: Record<string, any>
  ): Promise<NotionPage> {
    return this.request(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });
  }

  /**
   * Get page content (blocks)
   */
  async getPageContent(pageId: string) {
    return this.request(`/blocks/${pageId}/children`);
  }

  /**
   * Append blocks to page
   */
  async appendBlocks(pageId: string, blocks: any[]) {
    return this.request(`/blocks/${pageId}/children`, {
      method: 'PATCH',
      body: JSON.stringify({ children: blocks }),
    });
  }

  /**
   * Search Notion workspace
   */
  async search(query: string, filter?: { property: string; value: string }) {
    return this.request('/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        filter,
      }),
    });
  }
}

/**
 * Initialize Notion client with stored credentials
 */
export async function initializeNotionClient(): Promise<NotionClient | null> {
  // In real implementation, retrieve token from secure storage
  // For now, return null if no token is available
  
  console.log('Notion client initialization - token required');
  return null;
}

/**
 * OAuth flow for Notion authentication
 */
export async function authenticateNotion(): Promise<string> {
  // In real implementation, initiate OAuth flow
  // 1. Open OAuth URL in new window
  // 2. User authorizes
  // 3. Receive callback with code
  // 4. Exchange code for token
  // 5. Store token securely
  
  console.log('Notion OAuth flow - not yet implemented');
  throw new Error('Notion authentication not implemented');
}

/**
 * Helper: Extract plain text from Notion rich text
 */
export function extractPlainText(richText: any[]): string {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(rt => rt.plain_text || '').join('');
}

/**
 * Helper: Create Notion rich text object
 */
export function createRichText(text: string) {
  return [
    {
      type: 'text',
      text: { content: text },
    },
  ];
}
