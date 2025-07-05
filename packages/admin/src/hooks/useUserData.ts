import { useState, useEffect } from 'react';
import { apiClient, type UserStoreData, type UserDataMetrics } from '@/services/api';

export function useUserData() {
  const [userData, setUserData] = useState<UserStoreData[]>([]);
  const [metrics, setMetrics] = useState<UserDataMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    avgSessionTime: 0,
    retentionRate: 0,
    completionRate: 0,
    cycleTrackingRate: 0,
    chatEngagementRate: 0,
    notebookUsageRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('👥 Loading user data from API...');
      const response = await apiClient.getUserData();
      
      if (response.success) {
        setUserData(response.data);
        setMetrics(response.metrics);
        setLastUpdate(new Date(response.lastUpdate));
        console.log(`✅ User data loaded successfully (${response.totalUsers} users)`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('❌ Failed to load user data:', err);
      setError('Failed to load user data');
      
      // Fallback vers des données simulées en cas d'erreur
      console.log('🎭 Falling back to simulated data');
      const mockData: UserStoreData[] = [
        {
          userId: "testuser_001",
          deviceId: "device_ios_001",
          lastSync: new Date().toISOString(),
          stores: {
            userStore: {
              profile: { prenom: "Emma", ageRange: "26-35", completed: true },
              preferences: { symptoms: 4, moods: 5, phases: 3 },
              persona: { assigned: "emma", confidence: 0.9 }
            },
            cycleStore: {
              lastPeriodDate: "2024-01-15",
              length: 28,
              observations: Array(12).fill(null).map((_, i) => ({
                feeling: Math.floor(Math.random() * 5) + 1,
                energy: Math.floor(Math.random() * 5) + 1,
                phase: ["menstrual", "follicular", "ovulatory", "luteal"][i % 4],
                timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
              }))
            },
            chatStore: {
              messages: Array(25).fill(null),
              suggestions: ["Comment je me sens ?", "Conseils phase"]
            },
            notebookStore: {
              entries: Array(8).fill(null),
              availableTags: ["#personnel", "#tracking", "#melune"]
            },
            engagementStore: {
              metrics: {
                daysUsed: 12,
                sessionsCount: 28,
                conversationsStarted: 6,
                notebookEntriesCreated: 8,
                cycleTrackedDays: 12
              },
              maturity: { current: "learning", confidence: 65 }
            },
            userIntelligence: {
              learning: { confidence: 72 },
              observationPatterns: { consistency: 0.8, totalObservations: 12 }
            },
            navigationStore: {
              navigationHistory: { lastTab: "cycle", vignetteInteractions: {} }
            }
          },
          metadata: {
            appVersion: "1.0.0",
            platform: "iOS",
            firstLaunch: "2024-01-01",
            sessionCount: 28,
            serverReceivedAt: new Date().toISOString(),
            dataVersion: "1.0"
          }
        }
      ];
      
      setUserData(mockData);
      
      // Calculer les métriques simulées
      const simulatedMetrics: UserDataMetrics = {
        totalUsers: mockData.length,
        activeUsers: mockData.filter(u => 
          new Date(u.lastSync).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        avgSessionTime: 4.2,
        retentionRate: 85,
        completionRate: mockData.filter(u => u.stores.userStore.profile.completed).length / mockData.length * 100,
        cycleTrackingRate: mockData.filter(u => u.stores.cycleStore.observations?.length > 0).length / mockData.length * 100,
        chatEngagementRate: mockData.filter(u => u.stores.chatStore.messages?.length > 0).length / mockData.length * 100,
        notebookUsageRate: mockData.filter(u => u.stores.notebookStore.entries?.length > 0).length / mockData.length * 100
      };
      
      setMetrics(simulatedMetrics);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (deviceId: string) => {
    try {
      console.log(`🗑️ Deleting user data for device: ${deviceId}`);
      await apiClient.deleteUser(deviceId);
      console.log('✅ User data deleted successfully');
      
      // Mettre à jour les données locales
      setUserData(prev => prev.filter(user => user.deviceId !== deviceId));
      
      // Recalculer les métriques
      await loadUserData();
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      setError('Failed to delete user');
      throw err;
    }
  };

  const exportUserData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moodcycle-user-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return {
    userData,
    metrics,
    loading,
    error,
    lastUpdate,
    refetch: loadUserData,
    deleteUser,
    exportUserData
  };
} 