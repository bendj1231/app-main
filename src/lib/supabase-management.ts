// Supabase Management API Integration
// This provides full control over Supabase resources including user management

const SUPABASE_MANAGEMENT_API_URL = 'https://api.supabase.com/v1';
const PROJECT_REF = 'gkbhgrozrzhalnjherfu';

interface ManagementAPIConfig {
  accessToken: string;
}

export class SupabaseManagementAPI {
  private accessToken: string;

  constructor(config: ManagementAPIConfig) {
    this.accessToken = config.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${SUPABASE_MANAGEMENT_API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Management API request failed');
    }

    return response.json();
  }

  // Delete a user from the authentication system
  async deleteUser(userId: string): Promise<void> {
    await this.request(`/projects/${PROJECT_REF}/auth/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Get all users in the project
  async getUsers(): Promise<any[]> {
    const data = await this.request<{ users: any[] }>(
      `/projects/${PROJECT_REF}/auth/users`
    );
    return data.users;
  }

  // Get a specific user by ID
  async getUser(userId: string): Promise<any> {
    return this.request(`/projects/${PROJECT_REF}/auth/users/${userId}`);
  }

  // Update user metadata
  async updateUser(userId: string, metadata: Record<string, any>): Promise<any> {
    return this.request(`/projects/${PROJECT_REF}/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ user_metadata: metadata }),
    });
  }

  // List all Edge Functions
  async listEdgeFunctions(): Promise<any[]> {
    const data = await this.request<{ functions: any[] }>(
      `/projects/${PROJECT_REF}/functions`
    );
    return data.functions;
  }

  // Delete an Edge Function
  async deleteEdgeFunction(functionId: string): Promise<void> {
    await this.request(`/projects/${PROJECT_REF}/functions/${functionId}`, {
      method: 'DELETE',
    });
  }

  // List all database migrations
  async listMigrations(): Promise<any[]> {
    const data = await this.request<{ migrations: any[] }>(
      `/projects/${PROJECT_REF}/database/migrations`
    );
    return data.migrations;
  }

  // Apply a database migration
  async applyMigration(sql: string): Promise<any> {
    return this.request(`/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      body: JSON.stringify({ query: sql }),
    });
  }
}

// Factory function to create the management API client
export function createManagementAPI(accessToken: string): SupabaseManagementAPI {
  return new SupabaseManagementAPI({ accessToken });
}
