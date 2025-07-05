import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLogStats } from '@/hooks/useLogStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  Server,
  Database,
  BarChart3,
  AlertCircle,
  FileText,
  Monitor,
  Gauge
} from 'lucide-react';

const LogsMonitoringTab = () => {
  const { isDarkMode } = useTheme();
  const { data, loading, error, refetch } = useLogStats();
  const [autoRefresh, setAutoRefresh] = useState(true);

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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'WARN': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'INFO': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Chargement des logs...
          </p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            Erreur lors du chargement des logs
          </p>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header avec statut et contrôles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            📊 Logs & Monitoring
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Surveillance en temps réel des logs analytics et métriques système
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusDot(data?.systemHealth?.status || 'error')}`}></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Système: <span className={getStatusColor(data?.systemHealth?.status || 'error')}>
                {data?.systemHealth?.status === 'healthy' ? 'Opérationnel' : 
                 data?.systemHealth?.status === 'warning' ? 'Attention' : 'Erreur'}
              </span>
            </span>
          </div>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            size="sm"
            className={`${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            <Activity className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-green-400' : 'text-gray-400'}`} />
            Auto-refresh
          </Button>
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            size="sm"
            className={`${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Requêtes Totales
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {data ? formatNumber(data.totalRequests) : '0'}
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Analytics collectées
            </p>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Taux d'Erreur
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data && data.errorRate > 5 ? 'text-red-400' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {data ? data.errorRate.toFixed(1) : '0'}%
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Erreurs récentes
            </p>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Temps de Réponse
            </CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {data ? data.averageResponseTime : '0'}ms
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Moyenne
            </p>
          </CardContent>
        </Card>

        <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Uptime Système
            </CardTitle>
            <Gauge className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {data ? data.systemHealth.uptime.toFixed(1) : '0'}%
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Disponibilité
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets détaillés */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="errors">Erreurs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Graphique de performance */}
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Globale
                </CardTitle>
                <CardDescription>
                  Répartition des requêtes par vitesse
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Requêtes rapides (&lt;200ms)</span>
                    <span className="text-green-400">{data ? formatNumber(data.performanceMetrics.fastRequests) : '0'}</span>
                  </div>
                  <Progress 
                    value={data ? (data.performanceMetrics.fastRequests / data.totalRequests) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Requêtes lentes (&gt;200ms)</span>
                    <span className="text-yellow-400">{data ? formatNumber(data.performanceMetrics.slowRequests) : '0'}</span>
                  </div>
                  <Progress 
                    value={data ? (data.performanceMetrics.slowRequests / data.totalRequests) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Données traitées</span>
                    <span className="text-blue-400">{data ? formatBytes(data.performanceMetrics.totalDataProcessed) : '0 B'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Santé système */}
            <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <CardHeader>
                <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Santé du Système
                </CardTitle>
                <CardDescription>
                  État général de l'infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Status API</span>
                  <Badge className={`${data?.systemHealth?.status === 'healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {data?.systemHealth?.status === 'healthy' ? 'Opérationnel' : 'Erreur'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Uptime</span>
                  <span className="text-green-400">{data ? data.systemHealth.uptime.toFixed(2) : '0'}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Dernière mise à jour</span>
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {data ? formatTime(data.systemHealth.lastUpdate) : 'Inconnue'}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Système de logs opérationnel
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Erreurs Récentes
              </CardTitle>
              <CardDescription>
                Dernières erreurs détectées dans les logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.recentErrors && data.recentErrors.length > 0 ? (
                  data.recentErrors.map((error, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getLevelColor(error.level)}>
                          {error.level}
                        </Badge>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatTime(error.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {error.message}
                      </p>
                      {error.url && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Endpoint:</span>
                          <code className={`px-2 py-1 rounded ${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                            {error.url}
                          </code>
                          {error.statusCode && (
                            <Badge variant="outline" className="text-xs">
                              {error.statusCode}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 mx-auto mb-4 text-green-400" />
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Aucune erreur récente détectée
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Métriques de Performance
              </CardTitle>
              <CardDescription>
                Analyse détaillée des temps de réponse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {data ? formatNumber(data.performanceMetrics.fastRequests) : '0'}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Requêtes Rapides
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    &lt; 200ms
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {data ? formatNumber(data.performanceMetrics.slowRequests) : '0'}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Requêtes Lentes
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    &gt; 200ms
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {data ? formatBytes(data.performanceMetrics.totalDataProcessed) : '0 B'}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Données Traitées
                  </p>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-6">
          <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
            <CardHeader>
              <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Top Endpoints Analytics
              </CardTitle>
              <CardDescription>
                Endpoints les plus utilisés avec leurs métriques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.topEndpoints && data.topEndpoints.length > 0 ? (
                  data.topEndpoints.map((endpoint, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className={`text-sm font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {endpoint.endpoint}
                        </code>
                        <Badge variant="outline">
                          #{index + 1}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Requêtes: </span>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {formatNumber(endpoint.count)}
                          </span>
                        </div>
                        <div>
                          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Temps moyen: </span>
                          <span className={`font-medium ${endpoint.averageTime > 200 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {endpoint.averageTime}ms
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-8 h-8 mx-auto mb-4 text-gray-400" />
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Aucune donnée d'endpoint disponible
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LogsMonitoringTab; 