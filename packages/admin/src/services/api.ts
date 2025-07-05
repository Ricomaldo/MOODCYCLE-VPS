// packages/admin/src/services/api.ts

// Interface pour les données d'insight
interface InsightData {
  id: string;
  baseContent: string;
  content?: string;
  personaVariants?: Record<string, string>;
  targetPersonas?: string[];
  targetPreferences: string[];
  tone: string;
  phase: string;
  jezaApproval: number;
  status: string;
  lastModified: string;
  targetJourney: string[];
  enrichedBy?: string;
}

// Interface pour les phases
interface PhaseData {
  [key: string]: unknown;
}

// Interface pour les closings
interface ClosingsData {
  [key: string]: Record<string, string>;
}

// Interface pour une seule vignette
export interface Vignette {
  id: string;
  icon: string;
  title: string;
  action: string;
  prompt: string | null;
  category: string;
}

// Interface pour les vignettes
export interface VignettesData {
  [phase: string]: {
    [persona: string]: Vignette[];
  };
}

// Interface pour les données d'insights par phase
interface InsightsByPhase {
  menstrual: InsightData[];
  follicular: InsightData[];
  ovulatory: InsightData[];
  luteal: InsightData[];
}

// Interface pour la réponse API des insights
interface InsightsApiResponse {
  success: boolean;
  data: {
    total: number;
    insights: {
      exportDate: string;
      totalInsights: number;
      validatedCount: number;
      insights: InsightsByPhase;
    };
  };
}

// ✅ NOUVELLES INTERFACES POUR INFRASTRUCTURE ET USERDATA
export interface InfrastructureMetrics {
  server: {
    status: string;
    uptime: number;
    cpu: {
      usage: number;
      cores: number;
      load: number[];
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    disk: {
      used: number;
      total: number;
      percentage: number;
    };
    network: {
      download: number;
      upload: number;
      latency: number;
    };
  };
  domain: {
    ssl: {
      valid: boolean;
      expiresAt: string;
      daysUntilExpiry: number;
      issuer: string;
    };
    domains: string[];
    dnsStatus: string;
  };
  security: {
    lastScan: string;
    vulnerabilities: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    firewall: {
      status: string;
      blockedRequests: number;
    };
    backups: {
      lastBackup: string;
      status: string;
      size: string;
    };
  };
  api: {
    status: string;
    responseTime: number;
    requestsPerMinute: number;
    errorRate: number;
    endpoints: Array<{
      path: string;
      status: number;
      responseTime: number;
      lastCheck: string;
    }>;
    database: {
      status: string;
      connectionPool: number;
      queryTime: number;
    };
  };
}

export interface UserDataMetrics {
  totalUsers: number;
  activeUsers: number;
  avgSessionTime: number;
  retentionRate: number;
  completionRate: number;
  cycleTrackingRate: number;
  chatEngagementRate: number;
  notebookUsageRate: number;
}

export interface UserStoreData {
  userId: string;
  deviceId: string;
  lastSync: string;
  stores: {
    userStore: any;
    cycleStore: any;
    chatStore: any;
    notebookStore: any;
    engagementStore: any;
    userIntelligence: any;
    navigationStore: any;
  };
  metadata: {
    appVersion: string;
    platform: string;
    firstLaunch: string;
    sessionCount: number;
    serverReceivedAt: string;
    dataVersion: string;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://moodcycle.irimwebforge.com';

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

  private getDeviceHeaders(): Record<string, string> {
    // Pour les endpoints infrastructure et userdata qui nécessitent deviceAuth
    return {
      'X-Device-ID': 'admin-panel-' + Date.now(),
      'Content-Type': 'application/json',
    };
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

  private async deviceRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getDeviceHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Device API request failed:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<{ token: string }> {
    return this.request('/api/admin/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getInsights(): Promise<InsightsApiResponse> {
    return this.request('/api/admin/insights');
  }

  async saveInsights(insights: InsightData[]): Promise<void> {
    return this.request('/api/admin/insights/bulk', {
      method: 'POST',
      body: JSON.stringify({ insights }),
    });
  }

  async saveInsightVariants(insightId: string, variants: Record<string, string>): Promise<void> {
    return this.request('/api/admin/insights', {
      method: 'POST',
      body: JSON.stringify({ insightId, variants }),
    });
  }

  async getPhases(): Promise<PhaseData> {
    return this.request('/api/admin/phases');
  }

  async getClosings(): Promise<ClosingsData> {
    return this.request('/api/admin/closings');
  }

  async savePhases(phases: PhaseData): Promise<PhaseData> {
    return this.request('/api/admin/phases', {
      method: 'POST',
      body: JSON.stringify({ phases })
    });
  }

  async saveClosings(closings: ClosingsData): Promise<ClosingsData> {
    return this.request('/api/admin/closings', {
      method: 'POST', 
      body: JSON.stringify({ closings })
    });
  }

  async getVignettes(phase: string, persona: string): Promise<{ success: boolean; vignettes: Vignette[] }> {
    return this.request(`/api/admin/vignettes?phase=${phase}&persona=${persona}`);
  }

  async saveVignettes(vignettes: VignettesData): Promise<VignettesData> {
    return this.request('/api/admin/vignettes', {
      method: 'POST',
      body: JSON.stringify({ vignettes })
    });
  }

  // ✅ NOUVELLES MÉTHODES POUR INFRASTRUCTURE
  async getInfrastructureMetrics(): Promise<{ success: boolean; data: InfrastructureMetrics; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/metrics');
  }

  async getServerMetrics(): Promise<{ success: boolean; data: any; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/server');
  }

  async getDomainInfo(): Promise<{ success: boolean; data: any; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/domain');
  }

  async getSecurityMetrics(): Promise<{ success: boolean; data: any; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/security');
  }

  async clearInfrastructureCache(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/clear-cache', {
      method: 'POST',
    });
  }

  // ✅ NOUVELLES MÉTHODES POUR USERDATA
  async getUserData(): Promise<{ success: boolean; data: UserStoreData[]; metrics: UserDataMetrics; totalUsers: number; lastUpdate: string }> {
    return this.deviceRequest('/api/userdata/all');
  }

  async getUserById(deviceId: string): Promise<{ success: boolean; data: UserStoreData }> {
    return this.deviceRequest(`/api/userdata/${deviceId}`);
  }

  async deleteUser(deviceId: string): Promise<{ success: boolean; message: string; deviceId: string }> {
    return this.deviceRequest(`/api/userdata/${deviceId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
