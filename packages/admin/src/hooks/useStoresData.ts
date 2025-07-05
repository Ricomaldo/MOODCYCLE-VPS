import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

export interface StoreData {
  deviceId: string;
  metadata: {
    timestamp: string;
    platform: string;
    appVersion: string;
  };
  stores: {
    userStore: {
      profile: {
        ageRange: string;
        journeyChoice: string;
        completed: boolean;
      };
      persona: {
        assigned: string;
        confidence: number;
      };
    };
    cycleStore: {
      length: number;
      isRegular: boolean;
      observationsCount: number;
    };
    engagementStore: {
      metrics: {
        daysUsed: number;
        sessionsCount: number;
        conversationsStarted: number;
        notebookEntriesCreated: number;
        cycleTrackedDays: number;
      };
      maturity: {
        current: 'discovery' | 'learning' | 'autonomous';
        confidence: number;
      };
    };
    intelligenceStore: {
      confidence: number;
      totalObservations: number;
      consistency: number;
    };
  };
}

export interface StoresAnalytics {
  totalUsers: number;
  avgEngagement: number;
  maturityDistribution: {
    discovery: number;
    learning: number;
    autonomous: number;
  };
  cycleTracking: {
    active: number;
    inactive: number;
  };
  conversationMetrics: {
    totalMessages: number;
    avgPerUser: number;
  };
  notebookMetrics: {
    totalEntries: number;
    avgPerUser: number;
  };
  intelligenceMetrics: {
    avgConfidence: number;
    patternsDetected: number;
  };
  storeBreakdown: {
    userStore: {
      completedProfiles: number;
      personaDistribution: Record<string, number>;
    };
    cycleStore: {
      regularCycles: number;
      avgCycleLength: number;
      observationsCount: number;
    };
    intelligenceStore: {
      highConfidence: number;
      patternsDetected: number;
    };
  };
}

export interface IntelligencePatterns {
  totalDevices: number;
  confidenceDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  phasePatterns: {
    menstrual: { topics: Record<string, number>; moods: Record<string, number> };
    follicular: { topics: Record<string, number>; moods: Record<string, number> };
    ovulatory: { topics: Record<string, number>; moods: Record<string, number> };
    luteal: { topics: Record<string, number>; moods: Record<string, number> };
  };
  observationReadiness: {
    ready: number;
    learning: number;
    starting: number;
  };
  autonomySignals: {
    total: number;
    avgPerUser: number;
    distribution: Record<string, number>;
  };
}

export function useStoresData() {
  const [storesData, setStoresData] = useState<StoreData[]>([]);
  const [analytics, setAnalytics] = useState<StoresAnalytics | null>(null);
  const [intelligencePatterns, setIntelligencePatterns] = useState<IntelligencePatterns | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadStoresData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Loading stores data from API...');
      
      // Charger toutes les données en parallèle
      const [allStoresResponse, analyticsResponse, patternsResponse] = await Promise.all([
        apiClient.getAllStores(),
        apiClient.getStoresAnalytics(),
        apiClient.getIntelligencePatterns()
      ]);
      
      if (allStoresResponse.success) {
        setStoresData(allStoresResponse.data);
        console.log(`✅ Loaded ${allStoresResponse.count} stores`);
      }
      
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
        console.log('✅ Analytics loaded successfully');
      }
      
      if (patternsResponse.success) {
        setIntelligencePatterns(patternsResponse.data);
        console.log('✅ Intelligence patterns loaded successfully');
      }
      
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('❌ Failed to load stores data:', err);
      setError('Failed to load stores data');
      
      // Fallback vers des données simulées
      console.log('🎭 Falling back to simulated data');
      setStoresData([
        {
          deviceId: 'device_001...',
          metadata: {
            timestamp: new Date().toISOString(),
            platform: 'iOS',
            appVersion: '1.0.0'
          },
          stores: {
            userStore: {
              profile: {
                ageRange: '26-35',
                journeyChoice: 'emotions',
                completed: true
              },
              persona: {
                assigned: 'emma',
                confidence: 0.85
              }
            },
            cycleStore: {
              length: 28,
              isRegular: true,
              observationsCount: 15
            },
            engagementStore: {
              metrics: {
                daysUsed: 12,
                sessionsCount: 34,
                conversationsStarted: 8,
                notebookEntriesCreated: 23,
                cycleTrackedDays: 12
              },
              maturity: {
                current: 'learning',
                confidence: 72
              }
            },
            intelligenceStore: {
              confidence: 68,
              totalObservations: 15,
              consistency: 0.73
            }
          }
        },
        {
          deviceId: 'device_002...',
          metadata: {
            timestamp: new Date().toISOString(),
            platform: 'Android',
            appVersion: '1.0.0'
          },
          stores: {
            userStore: {
              profile: {
                ageRange: '18-25',
                journeyChoice: 'body',
                completed: false
              },
              persona: {
                assigned: 'clara',
                confidence: 0.62
              }
            },
            cycleStore: {
              length: 30,
              isRegular: false,
              observationsCount: 7
            },
            engagementStore: {
              metrics: {
                daysUsed: 5,
                sessionsCount: 12,
                conversationsStarted: 3,
                notebookEntriesCreated: 8,
                cycleTrackedDays: 5
              },
              maturity: {
                current: 'discovery',
                confidence: 45
              }
            },
            intelligenceStore: {
              confidence: 32,
              totalObservations: 7,
              consistency: 0.41
            }
          }
        }
      ]);
      
      setAnalytics({
        totalUsers: 2,
        avgEngagement: 8,
        maturityDistribution: {
          discovery: 1,
          learning: 1,
          autonomous: 0
        },
        cycleTracking: {
          active: 2,
          inactive: 0
        },
        conversationMetrics: {
          totalMessages: 11,
          avgPerUser: 5
        },
        notebookMetrics: {
          totalEntries: 31,
          avgPerUser: 15
        },
        intelligenceMetrics: {
          avgConfidence: 50,
          patternsDetected: 1
        },
        storeBreakdown: {
          userStore: {
            completedProfiles: 1,
            personaDistribution: {
              emma: 1,
              clara: 1
            }
          },
          cycleStore: {
            regularCycles: 1,
            avgCycleLength: 29,
            observationsCount: 22
          },
          intelligenceStore: {
            highConfidence: 0,
            patternsDetected: 1
          }
        }
      });
      
      setIntelligencePatterns({
        totalDevices: 2,
        confidenceDistribution: {
          low: 1,
          medium: 1,
          high: 0
        },
        phasePatterns: {
          menstrual: {
            topics: { 'bien-être': 3, 'symptômes': 2 },
            moods: { 'fatiguée': 2, 'irritable': 1 }
          },
          follicular: {
            topics: { 'énergie': 4, 'sport': 2 },
            moods: { 'motivée': 3, 'positive': 2 }
          },
          ovulatory: {
            topics: { 'créativité': 3, 'social': 2 },
            moods: { 'confiante': 3, 'sociable': 2 }
          },
          luteal: {
            topics: { 'émotions': 4, 'introspection': 2 },
            moods: { 'sensible': 3, 'réflexive': 2 }
          }
        },
        observationReadiness: {
          ready: 0,
          learning: 1,
          starting: 1
        },
        autonomySignals: {
          total: 8,
          avgPerUser: 4,
          distribution: {
            correctsPredictions: 2,
            manualPhaseChanges: 3,
            detailedObservations: 2,
            patternRecognitions: 1
          }
        }
      });
      
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (deviceId: string) => {
    try {
      console.log(`🗑️ Deleting user ${deviceId}...`);
      const response = await apiClient.deleteStoresByDevice(deviceId);
      
      if (response.success) {
        // Retirer l'utilisateur de la liste locale
        setStoresData(prev => prev.filter(store => store.deviceId !== deviceId));
        console.log('✅ User deleted successfully');
        
        // Recharger les analytics
        await loadStoresData();
      }
      
      return response;
    } catch (err) {
      console.error('❌ Failed to delete user:', err);
      throw err;
    }
  };

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalUsers: storesData.length,
      analytics,
      intelligencePatterns,
      storesData: storesData.map(store => ({
        ...store,
        deviceId: store.deviceId // Garder l'ID complet pour l'export
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moodcycle-stores-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadStoresData();
  }, []);

  return {
    storesData,
    analytics,
    intelligencePatterns,
    loading,
    error,
    lastUpdate,
    refetch: loadStoresData,
    deleteUser,
    exportData
  };
} 