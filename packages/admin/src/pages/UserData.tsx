import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useStoresData } from "@/hooks/useStoresData";
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
  Trash2,
  Activity,
  Zap,
  Heart
} from "lucide-react";

const UserData = () => {
  const { isDarkMode } = useTheme();
  const { 
    storesData, 
    analytics, 
    intelligencePatterns,
    loading, 
    error, 
    lastUpdate, 
    refetch: loadUserData, 
    deleteUser, 
    exportData: exportUserData 
  } = useStoresData();

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'discovery': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'learning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'autonomous': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getPersonaColor = (persona: string) => {
    switch (persona) {
      case 'emma': return 'bg-pink-500/20 text-pink-400 border-pink-500/50';
      case 'laure': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'sylvie': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'christine': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'clara': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
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
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
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
                      disabled={loading || storesData.length === 0}
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
                        Testeuses Total
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : analytics?.totalUsers || 0}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Stores collectés
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Engagement Moyen
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${analytics?.avgEngagement || 0} jours`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Utilisation moyenne
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tracking Cycle
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${analytics?.cycleTracking.active || 0}/${analytics?.totalUsers || 0}`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Utilisatrices actives
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        IA Confiance
                      </CardTitle>
                      <Brain className="h-4 w-4 text-orange-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${analytics?.intelligenceMetrics.avgConfidence || 0}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Confiance moyenne
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
                          {/* Distribution maturité */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Distribution Maturité
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Discovery
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.maturityDistribution.discovery || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Learning
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.maturityDistribution.learning || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Autonomous
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.maturityDistribution.autonomous || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Métriques conversations */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                              <MessageCircle className="w-5 h-5" />
                              Conversations
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Messages totaux
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.conversationMetrics.totalMessages || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Moyenne par utilisateur
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.conversationMetrics.avgPerUser || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Métriques notebook */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                              <BookOpen className="w-5 h-5" />
                              Carnet Personnel
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Entrées totales
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.notebookMetrics.totalEntries || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Moyenne par utilisateur
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.notebookMetrics.avgPerUser || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Métriques cycle */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                              <Activity className="w-5 h-5" />
                              Suivi Cycle
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Cycles réguliers
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.storeBreakdown.cycleStore.regularCycles || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Durée moyenne
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.storeBreakdown.cycleStore.avgCycleLength || 0} jours
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Observations totales
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.storeBreakdown.cycleStore.observationsCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Personas */}
                      <TabsContent value="personas" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Distribution des Personas
                            </h3>
                            <div className="space-y-3">
                              {analytics?.storeBreakdown.userStore.personaDistribution && 
                                Object.entries(analytics.storeBreakdown.userStore.personaDistribution).map(([persona, count]) => (
                                  <div key={persona} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge className={getPersonaColor(persona)}>
                                        {persona.charAt(0).toUpperCase() + persona.slice(1)}
                                      </Badge>
                                    </div>
                                    <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {count} utilisateurs
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>

                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Profils Complétés
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Onboarding terminé
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.storeBreakdown.userStore.completedProfiles || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Taux de completion
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {analytics?.totalUsers ? 
                                    Math.round(((analytics?.storeBreakdown.userStore.completedProfiles || 0) / analytics.totalUsers) * 100) : 0}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Intelligence */}
                      <TabsContent value="intelligence" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Distribution Confiance IA
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Faible (&lt; 30%)
                                </span>
                                <span className={`font-semibold text-red-400`}>
                                  {intelligencePatterns?.confidenceDistribution.low || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Moyenne (30-70%)
                                </span>
                                <span className={`font-semibold text-yellow-400`}>
                                  {intelligencePatterns?.confidenceDistribution.medium || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Élevée (&gt; 70%)
                                </span>
                                <span className={`font-semibold text-green-400`}>
                                  {intelligencePatterns?.confidenceDistribution.high || 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Signaux d'Autonomie
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Corrections prédictions
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {intelligencePatterns?.autonomySignals.distribution.correctsPredictions || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Changements manuels
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {intelligencePatterns?.autonomySignals.distribution.manualPhaseChanges || 0}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Observations détaillées
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {intelligencePatterns?.autonomySignals.distribution.detailedObservations || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Détails utilisateurs */}
                      <TabsContent value="details" className="space-y-6">
                        <div className="space-y-4">
                          {storesData.map((store, index) => (
                            <Card key={store.deviceId} className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${getPersonaColor(store.stores.userStore.persona.assigned)} flex items-center justify-center`}>
                                      <span className="text-sm font-semibold">
                                        {store.stores.userStore.persona.assigned.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <CardTitle className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Utilisateur #{index + 1}
                                      </CardTitle>
                                      <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {store.deviceId} • {store.metadata.platform} • {store.metadata.appVersion}
                                      </CardDescription>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge className={getMaturityColor(store.stores.engagementStore.maturity.current)}>
                                      {store.stores.engagementStore.maturity.current}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteUser(store.deviceId)}
                                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                      Profil
                                    </h4>
                                    <div className="space-y-1">
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Âge: {store.stores.userStore.profile.ageRange}
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Parcours: {store.stores.userStore.profile.journeyChoice}
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Complété: {store.stores.userStore.profile.completed ? 'Oui' : 'Non'}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                      Engagement
                                    </h4>
                                    <div className="space-y-1">
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Jours: {store.stores.engagementStore.metrics.daysUsed}
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Sessions: {store.stores.engagementStore.metrics.sessionsCount}
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Conversations: {store.stores.engagementStore.metrics.conversationsStarted}
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                      Intelligence
                                    </h4>
                                    <div className="space-y-1">
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Confiance: {store.stores.intelligenceStore.confidence}%
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Observations: {store.stores.intelligenceStore.totalObservations}
                                      </div>
                                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Consistance: {Math.round((store.stores.intelligenceStore.consistency || 0) * 100)}%
                                      </div>
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
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserData; 