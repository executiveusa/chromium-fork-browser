/**
 * GitHub API Client
 * Handles authentication and API requests to GitHub
 */

export interface GitHubConfig {
  token: string;
  apiUrl?: string;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  url: string;
  description?: string;
  private: boolean;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  author: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export class GitHubClient {
  private token: string;
  private apiUrl: string;

  constructor(config: GitHubConfig) {
    this.token = config.token;
    this.apiUrl = config.apiUrl || 'https://api.github.com';
  }

  /**
   * Make authenticated request to GitHub API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get authenticated user
   */
  async getUser() {
    return this.request('/user');
  }

  /**
   * List user repositories
   */
  async listRepositories(): Promise<Repository[]> {
    return this.request('/user/repos?sort=updated&per_page=100');
  }

  /**
   * Get a specific repository
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    return this.request(`/repos/${owner}/${repo}`);
  }

  /**
   * List pull requests for a repository
   */
  async listPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<PullRequest[]> {
    return this.request(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`);
  }

  /**
   * Get a specific pull request
   */
  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<PullRequest> {
    return this.request(`/repos/${owner}/${repo}/pulls/${prNumber}`);
  }

  /**
   * List issues for a repository
   */
  async listIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open'): Promise<Issue[]> {
    return this.request(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  /**
   * Create a new issue
   */
  async createIssue(owner: string, repo: string, title: string, body: string): Promise<Issue> {
    return this.request(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({ title, body }),
    });
  }

  /**
   * Get file contents from repository
   */
  async getFileContents(owner: string, repo: string, path: string, ref?: string) {
    const query = ref ? `?ref=${ref}` : '';
    return this.request(`/repos/${owner}/${repo}/contents/${path}${query}`);
  }

  /**
   * Create or update file in repository
   */
  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string
  ) {
    const encodedContent = btoa(content);
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodedContent,
        sha,
      }),
    });
  }

  /**
   * Get commit history
   */
  async listCommits(owner: string, repo: string, path?: string) {
    const query = path ? `?path=${path}` : '';
    return this.request(`/repos/${owner}/${repo}/commits${query}`);
  }
}

/**
 * Initialize GitHub client with stored credentials
 */
export async function initializeGitHubClient(): Promise<GitHubClient | null> {
  // In real implementation, retrieve token from secure storage
  // For now, return null if no token is available
  
  // Example: const token = await chrome.storage.local.get('github_token');
  // if (!token) return null;
  
  // return new GitHubClient({ token });
  
  console.log('GitHub client initialization - token required');
  return null;
}

/**
 * OAuth flow for GitHub authentication
 */
export async function authenticateGitHub(): Promise<string> {
  // In real implementation, initiate OAuth flow
  // 1. Open OAuth URL in new window
  // 2. User authorizes
  // 3. Receive callback with code
  // 4. Exchange code for token
  // 5. Store token securely
  
  console.log('GitHub OAuth flow - not yet implemented');
  throw new Error('GitHub authentication not implemented');
}
