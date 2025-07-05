import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useUserData } from "@/hooks/useUserData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Target,
  Brain,
  MessageCircle,
  BookOpen,
  Calendar,
  RefreshCw,
  Download,
  AlertCircle,
  Trash2
} from "lucide-react";

const UserData = () => {
  const { isDarkMode } = useTheme();
  const { 
    userData, 
    metrics, 
    loading, 
    error, 
    lastUpdate, 
    refetch: loadUserData, 
    deleteUser, 
    exportUserData 
  } = useUserData();

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'discovery': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'learning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'autonomous': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const handleDeleteUser = async (deviceId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ces données utilisateur ? Cette action est irréversible.')) {
      try {
        await deleteUser(deviceId);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
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

                {/* Affichage erreur */}
                {error && (
                  <Card className={`${isDarkMode ? 'bg-red-900/20 border-red-500/30' : 'bg-red-100/50 border-red-300'} backdrop-blur-sm`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                            Erreur de chargement
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {error} - Utilisation des données de fallback.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Métriques d'engagement globales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Utilisateurs Total
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : metrics.totalUsers}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Testeuses TestFlight
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Utilisateurs Actifs
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : metrics.activeUsers}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Derniers 7 jours
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Taux de Rétention
                      </CardTitle>
                      <Target className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${Math.round(metrics.retentionRate)}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Utilisateurs récurrents
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Temps Session Moyen
                      </CardTitle>
                      <Clock className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${metrics.avgSessionTime}min`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Par session
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

                          {/* Métriques d'engagement */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Engagement par Fonctionnalité
                            </h3>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      Suivi de cycle
                                    </span>
                                  </div>
                                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {Math.round(metrics.cycleTrackingRate)}%
                                  </span>
                                </div>
                                <Progress value={metrics.cycleTrackingRate} className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-blue-400" />
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      Chat avec Melune
                                    </span>
                                  </div>
                                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {Math.round(metrics.chatEngagementRate)}%
                                  </span>
                                </div>
                                <Progress value={metrics.chatEngagementRate} className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-green-400" />
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                      Carnet personnel
                                    </span>
                                  </div>
                                  <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {Math.round(metrics.notebookUsageRate)}%
                                  </span>
                                </div>
                                <Progress value={metrics.notebookUsageRate} className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Personas */}
                      <TabsContent value="personas" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userData.map((user, index) => (
                            <Card key={user.userId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                              <CardHeader className="pb-3">
                                <CardTitle className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {user.stores.userStore?.profile?.prenom || `Utilisateur ${index + 1}`}
                                </CardTitle>
                                <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Persona: {user.stores.userStore?.persona?.assigned || 'Non assigné'}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Âge
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.userStore?.profile?.ageRange || 'N/A'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Confiance persona
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.userStore?.persona?.confidence ? 
                                        `${Math.round(user.stores.userStore.persona.confidence * 100)}%` : 'N/A'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Profil complété
                                    </span>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {user.stores.userStore?.profile?.completed ? '✅' : '❌'}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      {/* Engagement */}
                      <TabsContent value="engagement" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {userData.map((user, index) => (
                            <Card key={user.userId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                              <CardHeader className="pb-3">
                                <CardTitle className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {user.stores.userStore?.profile?.prenom || `Utilisateur ${index + 1}`}
                                </CardTitle>
                                <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Maturité: {user.stores.engagementStore?.maturity?.current || 'N/A'}
                                </CardDescription>
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
                                    <div className="flex items-center gap-2">
                                      <Brain className="w-4 h-4 text-purple-400" />
                                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Apprentissage
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Confiance
                                        </span>
                                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {intelligence?.learning?.confidence || 0}%
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Consistance
                                        </span>
                                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {observations?.consistency ? 
                                            `${Math.round(observations.consistency * 100)}%` : 'N/A'}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                          Observations totales
                                        </span>
                                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                          {observations?.totalObservations || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </TabsContent>

                      {/* Détails Utilisateurs */}
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
                                    <Button
                                      onClick={() => handleDeleteUser(user.deviceId)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
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
                <Card className={`${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-100/50 border-blue-300'} backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          Collecte de Données en Temps Réel
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Cette page affiche les données collectées depuis l'endpoint `/api/userdata/all`. 
                          Les testeuses TestFlight peuvent synchroniser leurs stores Zustand via l'endpoint `/api/userdata/sync`.
                          Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
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