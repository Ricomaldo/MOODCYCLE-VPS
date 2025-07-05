import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useTheme } from "@/contexts/ThemeContext";
import { useInfrastructureData } from "@/hooks/useInfrastructureData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Server, 
  Database, 
  Activity, 
  Globe, 
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Zap,
  Shield,
  TrendingUp,
  Download,
  Upload,
  Wifi
} from "lucide-react";

interface ServerMetrics {
  status: 'online' | 'offline' | 'maintenance';
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
  ssl: {
    valid: boolean;
    expiresAt: string;
    daysUntilExpiry: number;
  };
}

interface ApiMetrics {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  requestsPerMinute: number;
  errorRate: number;
  endpoints: {
    path: string;
    status: number;
    responseTime: number;
    lastCheck: string;
  }[];
  database: {
    status: 'connected' | 'disconnected';
    connectionPool: number;
    queryTime: number;
  };
}

interface SecurityMetrics {
  lastScan: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  firewall: {
    status: 'active' | 'inactive';
    blockedRequests: number;
  };
  backups: {
    lastBackup: string;
    status: 'success' | 'failed';
    size: string;
  };
}

const Infrastructure = () => {
  const { isDarkMode } = useTheme();
  const { metrics, loading, error, lastUpdate, refetch: loadInfrastructureData, clearCache } = useInfrastructureData();
  
  // Extraire les métriques depuis la réponse API
  const serverMetrics = metrics?.server;
  const apiMetrics = metrics?.api;
  const securityMetrics = metrics?.security;
  const domainMetrics = metrics?.domain;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'connected':
      case 'active':
      case 'success':
        return 'text-green-400';
      case 'degraded':
      case 'maintenance':
        return 'text-yellow-400';
      case 'offline':
      case 'down':
      case 'disconnected':
      case 'inactive':
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online':
      case 'healthy':
      case 'connected':
      case 'active':
      case 'success':
        return 'bg-green-500';
      case 'degraded':
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
      case 'down':
      case 'disconnected':
      case 'inactive':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} GB`;
  };

  const formatLatency = (latency: number) => {
    return `${latency}ms`;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Infrastructure" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header avec statut global */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                      Infrastructure & Monitoring
                    </h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Surveillance en temps réel de l'API et du serveur Hostinger
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusDot(serverMetrics?.status || 'offline')}`}></div>
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Serveur: <span className={getStatusColor(serverMetrics?.status || 'offline')}>
                          {serverMetrics?.status === 'online' ? 'En ligne' : 
                           serverMetrics?.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                        </span>
                      </span>
                    </div>
                    <Button
                      onClick={loadInfrastructureData}
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
                        Uptime Serveur
                      </CardTitle>
                      <Server className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : formatUptime(serverMetrics?.uptime || 0)}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Disponibilité 30 jours
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Temps Réponse API
                      </CardTitle>
                      <Zap className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${apiMetrics?.responseTime || 0}ms`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Moyenne des endpoints
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Taux d'Erreur
                      </CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : `${apiMetrics?.errorRate || 0}%`}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Dernière heure
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Requêtes/min
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {loading ? '...' : apiMetrics?.requestsPerMinute || 0}
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Trafic actuel
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Contenu principal avec onglets */}
                <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                  <CardContent className="p-6">
                    <Tabs defaultValue="server" className="space-y-6">
                      <TabsList className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                        <TabsTrigger value="server">Serveur</TabsTrigger>
                        <TabsTrigger value="api">API</TabsTrigger>
                        <TabsTrigger value="database">Base de Données</TabsTrigger>
                        <TabsTrigger value="security">Sécurité</TabsTrigger>
                        <TabsTrigger value="ssl">SSL & Domaines</TabsTrigger>
                      </TabsList>

                      {/* Serveur */}
                      <TabsContent value="server" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Ressources système */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                              <Cpu className="w-5 h-5" />
                              Ressources Système
                            </h3>
                            <div className="space-y-6">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    CPU ({serverMetrics?.cpu.cores || 0} cores)
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {serverMetrics?.cpu.usage || 0}%
                                  </span>
                                </div>
                                <Progress 
                                  value={serverMetrics?.cpu.usage || 0} 
                                  className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                />
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                                  Load: {serverMetrics?.cpu.load.join(', ') || '0, 0, 0'}
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Mémoire RAM
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {formatBytes(serverMetrics?.memory.used || 0)} / {formatBytes(serverMetrics?.memory.total || 0)}
                                  </span>
                                </div>
                                <Progress 
                                  value={serverMetrics?.memory.percentage || 0} 
                                  className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                />
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Stockage
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {formatBytes(serverMetrics?.disk.used || 0)} / {formatBytes(serverMetrics?.disk.total || 0)}
                                  </span>
                                </div>
                                <Progress 
                                  value={serverMetrics?.disk.percentage || 0} 
                                  className={`h-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} 
                                />
                              </div>
                            </div>
                          </div>

                          {/* Réseau */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                              <Network className="w-5 h-5" />
                              Réseau & Connectivité
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Download className="w-4 h-4 text-blue-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Download
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {serverMetrics?.network.download || 0} Mbps
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Upload className="w-4 h-4 text-green-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Upload
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {serverMetrics?.network.upload || 0} Mbps
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Wifi className="w-4 h-4 text-purple-400" />
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Latence
                                  </span>
                                </div>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {formatLatency(serverMetrics?.network.latency || 0)}
                                </span>
                              </div>
                              
                              <div className="pt-2 border-t border-gray-600">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Statut général
                                  </span>
                                  <Badge className={`${getStatusColor(serverMetrics?.status || 'offline')} bg-opacity-20`}>
                                    {serverMetrics?.status === 'online' ? 'En ligne' : 
                                     serverMetrics?.status === 'maintenance' ? 'Maintenance' : 'Hors ligne'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* API */}
                      <TabsContent value="api" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Endpoints */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              État des Endpoints
                            </h3>
                            <div className="space-y-3">
                              {apiMetrics?.endpoints.map((endpoint) => (
                                <div key={endpoint.path} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${endpoint.status === 200 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {endpoint.path}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {endpoint.responseTime}ms
                                    </span>
                                    <Badge variant="outline" className={`text-xs ${endpoint.status === 200 ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
                                      {endpoint.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Performance API */}
                          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                              Performance API
                            </h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Temps de réponse moyen
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {apiMetrics?.responseTime || 0}ms
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Requêtes par minute
                                </span>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {apiMetrics?.requestsPerMinute || 0}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Taux d'erreur
                                </span>
                                <span className={`font-semibold ${apiMetrics?.errorRate && apiMetrics.errorRate > 1 ? 'text-red-400' : 'text-green-400'}`}>
                                  {apiMetrics?.errorRate || 0}%
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Statut global
                                </span>
                                <Badge className={`${getStatusColor(apiMetrics?.status || 'down')} bg-opacity-20`}>
                                  {apiMetrics?.status === 'healthy' ? 'Sain' : 
                                   apiMetrics?.status === 'degraded' ? 'Dégradé' : 'Hors service'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Base de données */}
                      <TabsContent value="database" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <Database className="w-5 h-5" />
                                Connexions Base de Données
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Statut connexion
                                  </span>
                                  <Badge className={`${getStatusColor(apiMetrics?.database.status || 'disconnected')} bg-opacity-20`}>
                                    {apiMetrics?.database.status === 'connected' ? 'Connectée' : 'Déconnectée'}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Pool de connexions
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {apiMetrics?.database.connectionPool || 0}/10
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Temps de requête moyen
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {apiMetrics?.database.queryTime || 0}ms
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <HardDrive className="w-5 h-5" />
                                Stockage & Fichiers
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Fichiers JSON
                                  </span>
                                  <Badge variant="outline" className={`${isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'}`}>
                                    Synchronisés
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Dernière sauvegarde
                                  </span>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(securityMetrics?.backups.lastBackup || '').toLocaleString('fr-FR')}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Taille backup
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {securityMetrics?.backups.size || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Sécurité */}
                      <TabsContent value="security" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <Shield className="w-5 h-5" />
                                Analyse de Sécurité
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Dernière analyse
                                  </span>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(securityMetrics?.lastScan || '').toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Vulnérabilités critiques
                                    </span>
                                    <Badge className={`${securityMetrics?.vulnerabilities.critical === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                      {securityMetrics?.vulnerabilities.critical || 0}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Vulnérabilités élevées
                                    </span>
                                    <Badge className={`${securityMetrics?.vulnerabilities.high === 0 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                      {securityMetrics?.vulnerabilities.high || 0}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      Vulnérabilités moyennes
                                    </span>
                                    <Badge variant="outline" className={`${isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'}`}>
                                      {securityMetrics?.vulnerabilities.medium || 0}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <Globe className="w-5 h-5" />
                                Firewall & Protection
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Statut firewall
                                  </span>
                                  <Badge className={`${getStatusColor(securityMetrics?.firewall.status || 'inactive')} bg-opacity-20`}>
                                    {securityMetrics?.firewall.status === 'active' ? 'Actif' : 'Inactif'}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Requêtes bloquées (24h)
                                  </span>
                                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {securityMetrics?.firewall.blockedRequests || 0}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Dernière sauvegarde
                                  </span>
                                  <Badge className={`${getStatusColor(securityMetrics?.backups.status || 'failed')} bg-opacity-20`}>
                                    {securityMetrics?.backups.status === 'success' ? 'Réussie' : 'Échouée'}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* SSL & Domaines */}
                      <TabsContent value="ssl" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <Shield className="w-5 h-5" />
                                Certificats SSL
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Statut SSL
                                  </span>
                                  <Badge className={`${domainMetrics?.ssl?.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {domainMetrics?.ssl?.valid ? 'Valide' : 'Invalide'}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Expire le
                                  </span>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {new Date(domainMetrics?.ssl?.expiresAt || '').toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Jours restants
                                  </span>
                                  <span className={`font-semibold ${domainMetrics?.ssl?.daysUntilExpiry && domainMetrics.ssl.daysUntilExpiry < 30 ? 'text-orange-400' : 'text-green-400'}`}>
                                    {domainMetrics?.ssl?.daysUntilExpiry || 0} jours
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className={`${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <CardHeader>
                              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
                                <Globe className="w-5 h-5" />
                                Domaines & DNS
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    moodcycle-api.com
                                  </span>
                                  <Badge className="bg-green-500/20 text-green-400">
                                    Actif
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    admin.moodcycle-api.com
                                  </span>
                                  <Badge className="bg-green-500/20 text-green-400">
                                    Actif
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    DNS Cloudflare
                                  </span>
                                  <Badge className="bg-blue-500/20 text-blue-400">
                                    Configuré
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Informations de mise à jour */}
                <Card className={`${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-100/50 border-blue-300'} backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                          Monitoring en Temps Réel
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                          Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')} • 
                          Actualisation automatique toutes les 30 secondes
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Intégration future: API Hostinger pour métriques serveur en temps réel
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

export default Infrastructure; 