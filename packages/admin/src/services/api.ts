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

// ✅ NOUVEAUX TYPES POUR STORES
export interface UserStoreType {
  profile: {
    prenom: string | null;
    ageRange: string | null;
    journeyChoice: string | null;
    completed: boolean;
  };
  preferences: {
    symptoms: number;
    moods: number;
    phyto: number;
    phases: number;
    lithotherapy: number;
    rituals: number;
    terminology: string;
  };
  persona: {
    assigned: string;
    confidence: number;
    lastCalculated: number | null;
    scores: Record<string, number>;
  };
  melune: {
    avatarStyle: string;
    tone: string;
    personalityMatch: string | null;
    position: string;
    animated: boolean;
  };
  syncMetadata: {
    lastSyncAt: string | null;
    pendingSync: boolean;
  };
}

export interface CycleStoreType {
  lastPeriodDate: string | null;
  length: number;
  periodDuration: number;
  isRegular: boolean | null;
  trackingExperience: string | null;
  observations: Array<{
    id: string;
    type: string;
    value: string;
    timestamp: number;
    phase: string;
  }>;
  detectedPatterns: Record<string, unknown> | null;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'melune';
  content: string;
  timestamp: number;
  mood?: string;
  persona?: string | null;
  isOffline?: boolean;
}

export interface ChatStoreType {
  messages: ChatMessage[];
  isTyping: boolean;
  isWaitingResponse: boolean;
  pendingMessages: ChatMessage[];
  suggestions: string[];
}

export interface NotebookEntry {
  id: string;
  content: string;
  type: 'personal' | 'saved' | 'tracking';
  tags: string[];
  timestamp: number;
  phase: string;
}

export interface NotebookStoreType {
  entries: NotebookEntry[];
  availableTags: string[];
}

export interface EngagementMetrics {
  daysUsed: number;
  sessionsCount: number;
  totalTimeSpent: number;
  lastActiveDate: string | null;
  conversationsStarted: number;
  conversationsCompleted: number;
  notebookEntriesCreated: number;
  cycleTrackedDays: number;
  insightsSaved: number;
  vignettesEngaged: number;
  phasesExplored: string[];
  cyclesCompleted: number;
  autonomySignals: number;
}

export interface EngagementStoreType {
  metrics: EngagementMetrics;
  maturity: {
    current: string;
    confidence: number;
    lastCalculated: number | null;
    thresholds: Record<string, Record<string, number>>;
  };
}

export interface UserIntelligenceType {
  learning: {
    confidence: number;
    timePatterns: {
      favoriteHours: number[];
      activeDays: string[];
      sessionDuration: number;
    };
    conversationPrefs: {
      responseLength: string;
      questionTypes: string[];
      successfulPrompts: string[];
      avoidedTopics: string[];
    };
    phasePatterns: Record<string, {
      mood: string | null;
      energy: string | null;
      topics: string[];
    }>;
    suggestionEffectiveness: Record<string, {
      shown: number;
      clicked: number;
      rate: number;
    }>;
  };
}

export interface NavigationStoreType {
  notebookFilters: {
    type: string;
    phase: string | null;
    tags: string[];
    searchQuery: string;
    sortBy: string;
  };
  modalState: {
    entryDetail: {
      visible: boolean;
      entries: NotebookEntry[];
      currentIndex: number;
    };
  };
  navigationHistory: {
    lastTab: string;
    lastVignetteId: string | null;
    vignetteInteractions: Record<string, number>;
  };
}

// ✅ NOUVEAUX TYPES POUR RÉPONSES API
export interface ServerMetricsResponse {
  status: string;
  uptime: number;
  version: string;
  environment: string;
  timestamp: string;
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    responseTime: number;
  };
}

export interface DomainInfoResponse {
  domain: string;
  ssl: {
    valid: boolean;
    expiresAt: string;
    issuer: string;
  };
  dns: {
    status: string;
    records: Record<string, string>;
  };
  certificates: Array<{
    domain: string;
    valid: boolean;
    expiresAt: string;
  }>;
}

export interface SecurityMetricsResponse {
  firewall: {
    status: string;
    rules: number;
    blockedRequests: number;
  };
  ssl: {
    grade: string;
    vulnerabilities: string[];
  };
  backups: {
    lastBackup: string;
    status: string;
    size: string;
  };
  monitoring: {
    uptime: number;
    alerts: number;
  };
}

export interface StoresAnalyticsResponse {
  totalStores: number;
  activeStores: number;
  storeTypes: Record<string, number>;
  averageDataSize: number;
  lastUpdated: string;
  patterns: {
    mostActiveHours: number[];
    averageSessionTime: number;
    retentionRate: number;
  };
}

export interface IntelligencePatternsResponse {
  patterns: {
    conversational: {
      popularTopics: Array<{
        topic: string;
        frequency: number;
      }>;
      responsePreferences: Record<string, number>;
    };
    behavioral: {
      sessionPatterns: Record<string, number>;
      engagementTrends: Array<{
        date: string;
        value: number;
      }>;
    };
    cyclical: {
      phasePreferences: Record<string, Record<string, number>>;
      seasonalTrends: Record<string, number>;
    };
  };
  metadata: {
    analysisDate: string;
    sampleSize: number;
    confidence: number;
  };
}

export interface LogStatsResponse {
  totalRequests: number;
  errorRate: number;
  averageResponseTime: number;
  recentErrors: Array<{
    timestamp: string;
    level: string;
    message: string;
    url?: string;
    statusCode?: number;
  }>;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    averageTime: number;
  }>;
  performanceMetrics: {
    slowRequests: number;
    fastRequests: number;
    totalDataProcessed: number;
  };
  systemHealth: {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    lastUpdate: string;
  };
}

export interface UserStoreData {
  userId: string;
  deviceId: string;
  lastSync: string;
  stores: {
    userStore: UserStoreType;
    cycleStore: CycleStoreType;
    chatStore: ChatStoreType;
    notebookStore: NotebookStoreType;
    engagementStore: EngagementStoreType;
    userIntelligence: UserIntelligenceType;
    navigationStore: NavigationStoreType;
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

  async getServerMetrics(): Promise<{ success: boolean; data: ServerMetricsResponse; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/server');
  }

  async getDomainInfo(): Promise<{ success: boolean; data: DomainInfoResponse; timestamp: string }> {
    return this.deviceRequest('/api/infrastructure/domain');
  }

  async getSecurityMetrics(): Promise<{ success: boolean; data: SecurityMetricsResponse; timestamp: string }> {
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

  // ✅ NOUVELLES MÉTHODES POUR STORES
  async getStoresAnalytics(): Promise<{ success: boolean; data: StoresAnalyticsResponse; timestamp: string }> {
    return this.deviceRequest('/api/stores/analytics');
  }

  async getAllStores(): Promise<{ success: boolean; data: UserStoreData[]; count: number; timestamp: string }> {
    return this.deviceRequest('/api/stores/all');
  }

  async getStoresByDevice(deviceId: string): Promise<{ success: boolean; data: UserStoreData; timestamp: string }> {
    return this.deviceRequest(`/api/stores/${deviceId}`);
  }

  async deleteStoresByDevice(deviceId: string): Promise<{ success: boolean; message: string; deviceId: string }> {
    return this.deviceRequest(`/api/stores/${deviceId}`, {
      method: 'DELETE',
    });
  }

  async getIntelligencePatterns(): Promise<{ success: boolean; data: IntelligencePatternsResponse; timestamp: string }> {
    return this.deviceRequest('/api/stores/intelligence/patterns');
  }

  async getLogStats(): Promise<{ success: boolean; data: LogStatsResponse; timestamp: string }> {
    return this.deviceRequest('/api/logs/analytics/stats');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
