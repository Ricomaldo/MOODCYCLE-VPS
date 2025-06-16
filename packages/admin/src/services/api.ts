// packages/admin/src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('moodcycle_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        localStorage.removeItem('moodcycle_token');
        window.location.href = '/admin/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    return this.request('/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getInsights(): Promise<{
    success: boolean;
    data: {
      total: number;
      insights: {
        exportDate: string;
        totalInsights: number;
        validatedCount: number;
        insights: {
          menstrual: any[];
          follicular: any[];
          ovulatory: any[];
          luteal: any[];
        };
      };
    };
  }> {
    return this.request('/admin/insights');
  }

  async saveInsights(insights: any[]): Promise<void> {
    return this.request('/admin/insights/bulk', {
      method: 'POST',
      body: JSON.stringify({ insights }),
    });
  }

  async saveInsightVariants(insightId: string, variants: Record<string, string>): Promise<void> {
    return this.request('/admin/insights', {
      method: 'POST',
      body: JSON.stringify({ insightId, variants }),
    });
  }

  async getPhases(): Promise<any> {
    return this.request('/admin/phases');
  }

  async getClosings(): Promise<any> {
    return this.request('/admin/closings');
  }

  async savePhases(phases: any): Promise<any> {
    return this.request('/admin/phases', {
      method: 'POST',
      body: JSON.stringify({ phases })
    });
  }

  async saveClosings(closings: any): Promise<any> {
    return this.request('/admin/closings', {
      method: 'POST', 
      body: JSON.stringify({ closings })
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
