import { useState, useEffect } from 'react';
import { apiClient, type InfrastructureMetrics } from '@/services/api';

export function useInfrastructureData() {
  const [metrics, setMetrics] = useState<InfrastructureMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadInfrastructureData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Loading infrastructure data from API...');
      const response = await apiClient.getInfrastructureMetrics();
      
      if (response.success && response.data) {
        setMetrics(response.data);
        setLastUpdate(new Date(response.timestamp));
        console.log('✅ Infrastructure data loaded successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Failed to load infrastructure data:', err);
      setError('Failed to load infrastructure data');
      
      // Fallback vers des données simulées en cas d'erreur
      console.log('🎭 Falling back to simulated data');
      setMetrics({
        server: {
          status: 'online',
          uptime: 99.8,
          cpu: {
            usage: 23,
            cores: 4,
            load: [0.8, 1.2, 0.6]
          },
          memory: {
            used: 3.2,
            total: 8,
            percentage: 40
          },
          disk: {
            used: 45,
            total: 100,
            percentage: 45
          },
          network: {
            download: 125.5,
            upload: 67.3,
            latency: 12
          }
        },
        domain: {
          ssl: {
            valid: true,
            expiresAt: '2024-12-15',
            daysUntilExpiry: 45,
            issuer: 'Let\'s Encrypt'
          },
          domains: ['moodcycle.irimwebforge.com'],
          dnsStatus: 'active'
        },
        security: {
          lastScan: new Date().toISOString(),
          vulnerabilities: {
            critical: 0,
            high: 0,
            medium: 2,
            low: 5
          },
          firewall: {
            status: 'active',
            blockedRequests: 1247
          },
          backups: {
            lastBackup: new Date().toISOString(),
            status: 'success',
            size: '2.3 GB'
          }
        },
        api: {
          status: 'healthy',
          responseTime: 185,
          requestsPerMinute: 42,
          errorRate: 0.2,
          endpoints: [
            { path: '/api/insights', status: 200, responseTime: 120, lastCheck: new Date().toISOString() },
            { path: '/api/phases', status: 200, responseTime: 95, lastCheck: new Date().toISOString() },
            { path: '/api/closings', status: 200, responseTime: 110, lastCheck: new Date().toISOString() },
            { path: '/api/vignettes', status: 200, responseTime: 140, lastCheck: new Date().toISOString() },
            { path: '/api/chat', status: 200, responseTime: 320, lastCheck: new Date().toISOString() }
          ],
          database: {
            status: 'connected',
            connectionPool: 8,
            queryTime: 25
          }
        }
      });
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      console.log('🧹 Clearing infrastructure cache...');
      await apiClient.clearInfrastructureCache();
      console.log('✅ Cache cleared successfully');
      // Recharger les données après avoir vidé le cache
      await loadInfrastructureData();
    } catch (err) {
      console.error('❌ Failed to clear cache:', err);
      setError('Failed to clear cache');
    }
  };

  useEffect(() => {
    loadInfrastructureData();
  }, []);

  return {
    metrics,
    loading,
    error,
    lastUpdate,
    refetch: loadInfrastructureData,
    clearCache
  };
} 