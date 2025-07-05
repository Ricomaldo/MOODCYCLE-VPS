import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Brain, 
  Activity, 
  Heart, 
  Calendar,
  MessageSquare,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Download,
  RefreshCw,
  Smartphone,
  Clock,
  Target,
  Zap
} from "lucide-react";

interface UserStoreData {
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
  };
}

interface EngagementMetrics {
  totalUsers: number;
  activeUsers: number;
  avgSessionTime: number;
  retentionRate: number;
  completionRate: number;
  cycleTrackingRate: number;
  chatEngagementRate: number;
  notebookUsageRate: number;
}

const UserData = () => {
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState<UserStoreData[]>([]);
  const [metrics, setMetrics] = useState<EngagementMetrics>({
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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Simuler le chargement des données utilisateurs
      // En production, ceci appellerait l'API pour récupérer les stores
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données simulées pour le développement
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
            sessionCount: 28
          }
        }
      ];
      
      setUserData(mockData);
      
      // Calculer les métriques
      const calculatedMetrics: EngagementMetrics = {
        totalUsers: mockData.length,
        activeUsers: mockData.filter(u => 
          new Date(u.lastSync).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        avgSessionTime: 4.2, // minutes
        retentionRate: 85,
        completionRate: mockData.filter(u => u.stores.userStore.profile.completed).length / mockData.length * 100,
        cycleTrackingRate: mockData.filter(u => u.stores.cycleStore.observations?.length > 0).length / mockData.length * 100,
        chatEngagementRate: mockData.filter(u => u.stores.chatStore.messages?.length > 0).length / mockData.length * 100,
        notebookUsageRate: mockData.filter(u => u.stores.notebookStore.entries?.length > 0).length / mockData.length * 100
      };
      
      setMetrics(calculatedMetrics);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateurs:', error);
    } finally {
      setLoading(false);
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

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'discovery': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'learning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'autonomous': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPersonaColor = (persona: string) => {
    const colors = {
      emma: 'from-pink-500 to-rose-400',
      clara: 'from-purple-500 to-indigo-400',
      laure: 'from-green-500 to-emerald-400',
      sylvie: 'from-blue-500 to-cyan-400',
      christine: 'from-orange-500 to-amber-400'
    };
    return colors[persona as keyof typeof colors] || 'from-gray-500 to-gray-400';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Données Utilisateurs" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header avec actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Données Utilisateurs TestFlight
                    </h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Analyse des stores Zustand collectés depuis l'application mobile
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={loadUserData}
                      disabled={loading}
                      variant="outline"
                      className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                    <Button
                      onClick={exportUserData}
                      disabled={loading || userData.length === 0}
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exporter JSON
                    </Button>
                  </div>
                </div>

                {/* Métriques d'engagement globales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Testeuses Actives
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${metrics.activeUsers}/${metrics.totalUsers}`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Actives cette semaine
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Suivi du Cycle
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-pink-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${Math.round(metrics.cycleTrackingRate)}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Utilisent le tracking
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Engagement Chat
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${Math.round(metrics.chatEngagementRate)}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Utilisent Melune
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Usage Notebook
                      </CardTitle>
                      <BookOpen className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${Math.round(metrics.notebookUsageRate)}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Écrivent dans le carnet
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contenu principal avec onglets */}
                <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <Tabs defaultValue="overview" className="space-y-6">
                      <TabsList className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="personas">Personas</TabsTrigger>
                        <TabsTrigger value="engagement">Engagement</TabsTrigger>
                        <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
                        <TabsTrigger value="details">Détails Utilisateurs</TabsTrigger>
                      </TabsList>

                      {/* Vue d'ensemble */}
                      <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Répartition des maturités */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Niveaux de Maturité
                            </h3>
                            <div className="space-y-4">
                              {['discovery', 'learning', 'autonomous'].map(level => {
                                const count = userData.filter(u => 
                                  u.stores.engagementStore?.maturity?.current === level
                                ).length;
                                const percentage = userData.length > 0 ? (count / userData.length) * 100 : 0;
                                
                                return (
                                  <div key={level} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Badge className={getMaturityColor(level)}>
                                        {level === 'discovery' ? 'Découverte' : 
                                         level === 'learning' ? 'Apprentissage' : 'Autonome'}
                                      </Badge>
                                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {count} ({Math.round(percentage)}%)
                                      </span>
                                    </div>
                                    <Progress value={percentage} className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Tendances d'usage */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Tendances d'Usage
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Session moyenne
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {metrics.avgSessionTime}min
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4 text-green-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Profils complétés
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {Math.round(metrics.completionRate)}%
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Heart className="w-4 h-4 text-pink-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Rétention
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {Math.round(metrics.retentionRate)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Personas */}
                      <TabsContent value="personas" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {['emma', 'clara', 'laure', 'sylvie', 'christine'].map(persona => {
                            const count = userData.filter(u => 
                              u.stores.userStore?.persona?.assigned === persona
                            ).length;
                            const avgConfidence = userData
                              .filter(u => u.stores.userStore?.persona?.assigned === persona)
                              .reduce((sum, u) => sum + (u.stores.userStore?.persona?.confidence || 0), 0) / count || 0;
                            
                            return (
                              <Card key={persona} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <CardHeader className="pb-3">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className={`text-lg capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {persona}
                                    </CardTitle>
                                    <Badge className={`bg-gradient-to-r ${getPersonaColor(persona)} text-white`}>
                                      {count}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Confiance moyenne
                                      </span>
                                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {Math.round(avgConfidence * 100)}%
                                      </span>
                                    </div>
                                    <Progress 
                                      value={avgConfidence * 100} 
                                      className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </TabsContent>

                      {/* Engagement */}
                      <TabsContent value="engagement" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {userData.map((user, index) => (
                            <Card key={user.userId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {user.stores.userStore?.profile?.prenom || `Utilisateur ${index + 1}`}
                                  </CardTitle>
                                  <Badge className={getMaturityColor(user.stores.engagementStore?.maturity?.current || 'discovery')}>
                                    {user.stores.engagementStore?.maturity?.current || 'discovery'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Jours d'usage
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.engagementStore?.metrics?.daysUsed || 0}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Conversations
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.engagementStore?.metrics?.conversationsStarted || 0}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Entrées carnet
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.engagementStore?.metrics?.notebookEntriesCreated || 0}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Intelligence */}
                      <TabsContent value="intelligence" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {userData.map((user, index) => {
                            const intelligence = user.stores.userIntelligence;
                            const observations = intelligence?.observationPatterns;
                            
                            return (
                              <Card key={user.userId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                                <CardHeader className="pb-3">
                                  <CardTitle className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {user.stores.userStore?.profile?.prenom || `Utilisateur ${index + 1}`} - Intelligence
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Confiance système
                                        </span>
                                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {intelligence?.learning?.confidence || 0}%
                                        </span>
                                      </div>
                                      <Progress 
                                        value={intelligence?.learning?.confidence || 0} 
                                        className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                      />
                                    </div>
                                    
                                    <div>
                                      <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Consistance observations
                                        </span>
                                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {Math.round((observations?.consistency || 0) * 100)}%
                                        </span>
                                      </div>
                                      <Progress 
                                        value={(observations?.consistency || 0) * 100} 
                                        className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                      />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Total observations
                                      </span>
                                      <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {observations?.totalObservations || 0}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </TabsContent>

                      {/* Détails utilisateurs */}
                      <TabsContent value="details" className="space-y-6">
                        <div className="space-y-4">
                          {userData.map((user, index) => (
                            <Card key={user.userId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {user.stores.userStore?.profile?.prenom || `Utilisateur ${index + 1}`}
                                  </CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`${isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'}`}>
                                      {user.metadata.platform}
                                    </Badge>
                                    <Badge variant="outline" className={`${isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'}`}>
                                      v{user.metadata.appVersion}
                                    </Badge>
                                  </div>
                                </div>
                                <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Device ID: {user.deviceId} • Dernière sync: {new Date(user.lastSync).toLocaleDateString('fr-FR')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profil</h4>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                                      <div>Âge: {user.stores.userStore?.profile?.ageRange || 'N/A'}</div>
                                      <div>Persona: {user.stores.userStore?.persona?.assigned || 'N/A'}</div>
                                      <div>Complété: {user.stores.userStore?.profile?.completed ? '✅' : '❌'}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cycle</h4>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                                      <div>Durée: {user.stores.cycleStore?.length || 'N/A'} jours</div>
                                      <div>Observations: {user.stores.cycleStore?.observations?.length || 0}</div>
                                      <div>Dernières règles: {user.stores.cycleStore?.lastPeriodDate ? 
                                        new Date(user.stores.cycleStore.lastPeriodDate).toLocaleDateString('fr-FR') : 'N/A'}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activité</h4>
                                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                                      <div>Sessions: {user.metadata.sessionCount}</div>
                                      <div>Messages: {user.stores.chatStore?.messages?.length || 0}</div>
                                      <div>Entrées: {user.stores.notebookStore?.entries?.length || 0}</div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Note sur la collecte de données */}
                <Card className={`${isDarkMode ? 'bg-orange-900/20 border-orange-500/30' : 'bg-orange-100/50 border-orange-300'} backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          Collecte de Données TestFlight
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Les données affichées sont actuellement simulées. Une fois l'endpoint de collecte implémenté, 
                          cette page affichera les vraies données des stores Zustand des testeuses TestFlight.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserData; 