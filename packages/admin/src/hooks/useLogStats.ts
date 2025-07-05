import { useState, useEffect } from 'react';
import { apiClient, LogStatsResponse } from '@/services/api';

interface UseLogStatsReturn {
  data: LogStatsResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLogStats = (): UseLogStatsReturn => {
  const [data, setData] = useState<LogStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getLogStats();

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error('Failed to fetch log stats');
      }
    } catch (err: unknown) {
      console.error('Error fetching log stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch log statistics');
      
      // Fallback data pour développement
      setData({
        totalRequests: 1247,
        errorRate: 2.3,
        averageResponseTime: 156,
        recentErrors: [
          {
            timestamp: new Date(Date.now() - 300000).toISOString(),
            level: 'ERROR',
            message: 'Database connection timeout',
            url: '/api/analytics/behavior',
            statusCode: 500
          },
          {
            timestamp: new Date(Date.now() - 600000).toISOString(),
            level: 'WARN',
            message: 'Slow query detected',
            url: '/api/analytics/dashboard',
            statusCode: 200
          }
        ],
        topEndpoints: [
          { endpoint: '/api/analytics/dashboard', count: 342, averageTime: 145 },
          { endpoint: '/api/analytics/behavior', count: 289, averageTime: 178 },
          { endpoint: '/api/analytics/device', count: 156, averageTime: 134 },
          { endpoint: '/api/analytics/performance', count: 98, averageTime: 167 },
          { endpoint: '/api/analytics/overview', count: 87, averageTime: 123 }
        ],
        performanceMetrics: {
          slowRequests: 23,
          fastRequests: 1224,
          totalDataProcessed: 2847392
        },
        systemHealth: {
          status: 'healthy',
          uptime: 99.7,
          lastUpdate: new Date().toISOString()
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogStats();
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(fetchLogStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchLogStats
  };
}; 