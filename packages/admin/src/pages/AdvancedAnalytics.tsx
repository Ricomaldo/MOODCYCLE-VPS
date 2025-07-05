import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useAdvancedAnalytics } from "@/hooks/useAdvancedAnalytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Smartphone, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Users,
  MousePointer,
  Navigation,
  Clock,
  Zap,
  Wifi,
  Battery,
  Cpu,
  Monitor,
  HardDrive,
  Bug,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Layers,
  Settings,
  ShieldCheck,
  AlertCircle,
  TrendingDown,
  Gauge
} from "lucide-react";

const AdvancedAnalytics = () => {
  const { isDarkMode } = useTheme();
  const { data, loading, error, refetch } = useAdvancedAnalytics();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
    return `${Math.round(seconds / 3600)}h`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AppHeader currentPage="Analytics Avancés" />
              <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Chargement des analytics avancés...
                      </p>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AppHeader currentPage="Analytics Avancés" />
              <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                        Erreur lors du chargement des données
                      </p>
                      <Button onClick={refetch} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Réessayer
                      </Button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Analytics Avancés" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header avec statut et actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Analytics Avancés
                    </h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Analyse comportementale et métriques device en temps réel
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Système: <span className="text-green-400">Opérationnel</span>
                      </span>
                    </div>
                    <Button
                      onClick={refetch}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Actualiser
                    </Button>
                  </div>
                </div>

                {/* Métriques globales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Utilisateurs Actifs
                      </CardTitle>
                      <Users className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.overview ? formatNumber(data.overview.totalUsers) : '0'}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Données collectées
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Interactions Totales
                      </CardTitle>
                      <MousePointer className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.overview ? formatNumber(data.overview.totalInteractions) : '0'}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Comportements analysés
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Score Performance
                      </CardTitle>
                      <Gauge className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.device?.avgPerformanceScore || 'N/A'}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Score moyen /100
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Taux de Crash
                      </CardTitle>
                      <Bug className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {data.crashes?.crashRate || '0%'}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Crashes par utilisateur
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommandations */}
                {data.recommendations && data.recommendations.length > 0 && (
                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader>
                      <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                        <Target className="w-5 h-5" />
                        Recommandations
                      </CardTitle>
                      <CardDescription>
                        Actions recommandées basées sur l'analyse des données
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.recommendations.map((rec, index) => (
                          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex-shrink-0 mt-1">
                              {rec.priority === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                              {rec.priority === 'high' && <AlertCircle className="w-4 h-4 text-orange-400" />}
                              {rec.priority === 'medium' && <TrendingUp className="w-4 h-4 text-yellow-400" />}
                              {rec.priority === 'low' && <CheckCircle className="w-4 h-4 text-green-400" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className={getPriorityColor(rec.priority)}>
                                  {rec.priority.toUpperCase()}
                                </Badge>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {rec.type}
                                </span>
                              </div>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                {rec.message}
                              </p>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Métrique: {rec.metric}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tabs pour les différentes analyses */}
                <Tabs defaultValue="behavior" className="w-full">
                  <TabsList className={`grid w-full grid-cols-5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <TabsTrigger value="behavior">Comportement</TabsTrigger>
                    <TabsTrigger value="device">Devices</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    <TabsTrigger value="crashes">Crashes</TabsTrigger>
                  </TabsList>

                  {/* Tab Comportement */}
                  <TabsContent value="behavior" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Écrans populaires */}
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Navigation className="w-5 h-5" />
                            Écrans Populaires
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.behavior?.topScreens?.slice(0, 8).map((screen, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {screen.screen}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {screen.count}
                                  </span>
                                  <Progress 
                                    value={data.behavior?.topScreens ? (screen.count / data.behavior.topScreens[0].count) * 100 : 0} 
                                    className={`w-20 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                                  />
                                </div>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée disponible
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Types d'interactions */}
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <MousePointer className="w-5 h-5" />
                            Types d'Interactions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.behavior?.topInteractions?.slice(0, 8).map((interaction, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {interaction.interaction}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {interaction.count}
                                  </span>
                                  <Progress 
                                    value={data.behavior?.topInteractions ? (interaction.count / data.behavior.topInteractions[0].count) * 100 : 0} 
                                    className={`w-20 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                                  />
                                </div>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée disponible
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Niveaux d'engagement */}
                    <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                      <CardHeader>
                        <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                          <TrendingUp className="w-5 h-5" />
                          Niveaux d'Engagement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {data.behavior?.engagementLevels && Object.entries(data.behavior.engagementLevels).map(([level, count]) => (
                            <div key={level} className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                              <p className="text-2xl font-bold text-blue-400">{count}</p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} capitalize`}>
                                {level}
                              </p>
                            </div>
                          )) || (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} col-span-3`}>
                              Aucune donnée d'engagement disponible
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Tab Devices */}
                  <TabsContent value="device" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Plateformes */}
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Smartphone className="w-5 h-5" />
                            Plateformes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.device?.platforms && Object.entries(data.device.platforms).map(([platform, count]) => {
                              const total = Object.values(data.device!.platforms).reduce((sum, c) => sum + c, 0);
                              const percentage = total > 0 ? (count / total) * 100 : 0;
                              return (
                                <div key={platform} className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {platform}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {count} ({percentage.toFixed(1)}%)
                                    </span>
                                    <Progress 
                                      value={percentage} 
                                      className={`w-20 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                                    />
                                  </div>
                                </div>
                              );
                            }) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée de plateforme disponible
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Modèles de devices */}
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Monitor className="w-5 h-5" />
                            Modèles Populaires
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.device?.models && Object.entries(data.device.models)
                              .sort(([,a], [,b]) => b - a)
                              .slice(0, 6)
                              .map(([model, count]) => {
                                const total = Object.values(data.device!.models).reduce((sum, c) => sum + c, 0);
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                return (
                                  <div key={model} className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {model}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {count}
                                      </span>
                                      <Progress 
                                        value={percentage} 
                                        className={`w-20 h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                                      />
                                    </div>
                                  </div>
                                );
                              }) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée de modèle disponible
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Métriques réseau et batterie */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Wifi className="w-5 h-5" />
                            Types de Réseau
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {data.device?.networkTypes && Object.entries(data.device.networkTypes).map(([type, count]) => (
                              <div key={type} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {type}
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {count}
                                </span>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée réseau
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Battery className="w-5 h-5" />
                            Niveaux de Batterie
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {data.device?.batteryLevels && Object.entries(data.device.batteryLevels).map(([level, count]) => (
                              <div key={level} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {level}
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {count}
                                </span>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée batterie
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Cpu className="w-5 h-5" />
                            Score Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-green-400">
                              {data.device?.avgPerformanceScore || 'N/A'}
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Score moyen sur 100
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tab Performance */}
                  <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Zap className="w-5 h-5" />
                            Métriques de Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-400">
                                {data.performance?.avgFPS || 'N/A'}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                FPS moyen
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-400">
                                {data.performance?.avgRenderTime || 'N/A'}ms
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Temps rendu
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-purple-400">
                                {data.performance?.avgNetworkLatency || 'N/A'}ms
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Latence réseau
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-400">
                                {data.performance?.memoryUsage?.length || 0}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Mesures mémoire
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <AlertTriangle className="w-5 h-5" />
                            Problèmes Détectés
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {data.performance?.performanceIssues?.map((issue, index) => (
                              <div key={index} className={`p-2 rounded ${isDarkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                                <p className="text-sm">{issue}</p>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                Aucun problème détecté
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tab Patterns */}
                  <TabsContent value="patterns" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Clock className="w-5 h-5" />
                            Durée des Sessions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <p className="text-3xl font-bold text-blue-400">
                              {data.patterns?.avgSessionDuration ? formatDuration(data.patterns.avgSessionDuration) : 'N/A'}
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Durée moyenne
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                              {data.patterns?.sessionDurations?.length || 0} sessions analysées
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Activity className="w-5 h-5" />
                            Usage des Fonctionnalités
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {data.patterns?.featureUsage && Object.entries(data.patterns.featureUsage).map(([feature, count]) => (
                              <div key={feature} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>
                                  {feature}
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {count}
                                </span>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune donnée d'usage disponible
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Tab Crashes */}
                  <TabsContent value="crashes" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <Bug className="w-5 h-5" />
                            Erreurs Principales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.crashes?.topErrors?.map((error, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {error.error}
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {error.count}
                                </span>
                              </div>
                            )) || (
                              <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                Aucun crash détecté
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                        <CardHeader>
                          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                            <TrendingDown className="w-5 h-5" />
                            Statistiques Crashes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-red-400">
                                {data.crashes?.totalCrashes || 0}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Total crashes
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-orange-400">
                                {data.crashes?.crashRate || '0%'}
                              </p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Taux de crash
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdvancedAnalytics; 