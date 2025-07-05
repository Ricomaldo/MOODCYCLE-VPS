import { useState, useEffect } from 'react';

interface BehaviorAnalytics {
  totalInteractions: number;
  screenUsage: Record<string, number>;
  interactionTypes: Record<string, number>;
  sessionPatterns: Record<string, unknown>;
  engagementLevels: Record<string, number>;
  navigationFlows: unknown[];
  topScreens: Array<{ screen: string; count: number }>;
  topInteractions: Array<{ interaction: string; count: number }>;
}

interface DeviceAnalytics {
  platforms: Record<string, number>;
  models: Record<string, number>;
  osVersions: Record<string, number>;
  screenSizes: Record<string, number>;
  networkTypes: Record<string, number>;
  batteryLevels: Record<string, number>;
  avgPerformanceScore: number;
}

interface PerformanceAnalytics {
  avgRenderTime: number;
  avgFPS: number;
  memoryUsage: number[];
  networkLatencies: number[];
  avgNetworkLatency: number;
  crashRates: Record<string, number>;
  performanceIssues: string[];
}

interface UsagePatterns {
  timePatterns: Record<string, number>;
  dayPatterns: Record<string, number>;
  sessionDurations: number[];
  avgSessionDuration: number;
  featureUsage: Record<string, number>;
  userJourneys: unknown[];
}

interface CrashAnalytics {
  totalCrashes: number;
  crashTypes: Record<string, number>;
  crashTrends: Record<string, unknown>;
  topErrors: Array<{ error: string; count: number }>;
  crashByDevice: Record<string, number>;
  crashByOS: Record<string, number>;
  crashRate: string;
}

interface OverviewMetrics {
  totalUsers: number;
  totalInteractions: number;
  totalCrashes: number;
  avgEngagement: number;
  platformDistribution: Record<string, number>;
}

interface Recommendation {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metric: string;
}

interface AdvancedAnalyticsData {
  behavior: BehaviorAnalytics | null;
  device: DeviceAnalytics | null;
  performance: PerformanceAnalytics | null;
  patterns: UsagePatterns | null;
  crashes: CrashAnalytics | null;
  overview: OverviewMetrics | null;
  recommendations: Recommendation[];
}

export const useAdvancedAnalytics = () => {
  const [data, setData] = useState<AdvancedAnalyticsData>({
    behavior: null,
    device: null,
    performance: null,
    patterns: null,
    crashes: null,
    overview: null,
    recommendations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer toutes les données en parallèle
      const [
        behaviorRes,
        deviceRes,
        performanceRes,
        patternsRes,
        crashesRes,
        overviewRes,
        recommendationsRes
      ] = await Promise.all([
        fetch('/api/analytics/behavior', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/device', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/performance', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/patterns', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/crashes', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/overview', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        }),
        fetch('/api/analytics/recommendations', {
          headers: { 'X-Device-ID': 'admin-dashboard' }
        })
      ]);

      // Vérifier si toutes les requêtes ont réussi
      const responses = [behaviorRes, deviceRes, performanceRes, patternsRes, crashesRes, overviewRes, recommendationsRes];
      const failedRequests = responses.filter(res => !res.ok);
      
      if (failedRequests.length > 0) {
        throw new Error(`Failed to fetch analytics data: ${failedRequests.length} requests failed`);
      }

      // Parser les réponses
      const [
        behaviorData,
        deviceData,
        performanceData,
        patternsData,
        crashesData,
        overviewData,
        recommendationsData
      ] = await Promise.all(
        responses.map(res => res.json())
      );

      setData({
        behavior: behaviorData.success ? behaviorData.data : null,
        device: deviceData.success ? deviceData.data : null,
        performance: performanceData.success ? performanceData.data : null,
        patterns: patternsData.success ? patternsData.data : null,
        crashes: crashesData.success ? crashesData.data : null,
        overview: overviewData.success ? overviewData.data : null,
        recommendations: recommendationsData.success ? recommendationsData.data : []
      });

    } catch (err) {
      console.error('Error fetching advanced analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getDashboardData = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard', {
        headers: { 'X-Device-ID': 'admin-dashboard' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const dashboardData = await response.json();
      
      if (dashboardData.success) {
        setData({
          behavior: dashboardData.data.behavior,
          device: dashboardData.data.device,
          performance: dashboardData.data.performance,
          patterns: dashboardData.data.patterns,
          crashes: dashboardData.data.crashes,
          overview: dashboardData.data.overview,
          recommendations: dashboardData.data.recommendations || []
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    }
  };

  const checkHealthStatus = async () => {
    try {
      const response = await fetch('/api/analytics/health', {
        headers: { 'X-Device-ID': 'admin-dashboard' }
      });

      const healthData = await response.json();
      return healthData.success ? healthData.data : null;
    } catch (err) {
      console.error('Error checking analytics health:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalyticsData,
    getDashboardData,
    checkHealthStatus
  };
}; 