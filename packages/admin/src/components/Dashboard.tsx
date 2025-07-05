import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Users, TestTube, Activity, Calendar, Smartphone, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface AppMetrics {
  apiHealth: 'excellent' | 'good' | 'fair' | 'poor';
}

export function Dashboard({ onNavigateToTab }: { onNavigateToTab: (tab: string) => void }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [metrics, setMetrics] = useState<AppMetrics>({
    apiHealth: 'excellent'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppMetrics();
  }, []);

  const loadAppMetrics = async () => {
    try {
      setLoading(true);
      
      // App not launched yet - pre-launch metrics
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setMetrics({
        apiHealth: 'excellent' // API is ready and optimized
      });
      
    } catch (error) {
      console.error('Failed to load app metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const quickActions = [
    {
      title: "Gestion du Contenu",
      description: "Gérer les insights thérapeutiques",
      icon: FileText,
      color: "from-blue-500 to-cyan-400",
      tab: "base-insights"
    },
    {
      title: "Données Détaillées",
      description: "Analyser l'usage en détail",
      icon: Users,
      color: "from-purple-500 to-pink-400",
      tab: "analytics"
    },
    {
      title: "Test des Fonctionnalités",
      description: "Prévisualiser l'application",
      icon: TestTube,
      color: "from-green-500 to-lime-400",
      tab: "test-formula"
    }
  ];

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthDot = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
              Bonjour {user?.username || 'Jeza'} ! 👋
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
              <Calendar className="w-4 h-4" />
              {currentDate} • Vue d'ensemble MoodCycle
            </p>
          </div>
          
          {/* API Health Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getHealthDot(metrics.apiHealth)}`}></div>
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              État système: <span className={getHealthColor(metrics.apiHealth)}>
                {metrics.apiHealth === 'excellent' ? 'excellent' : 
                 metrics.apiHealth === 'good' ? 'bon' : 
                 metrics.apiHealth === 'fair' ? 'correct' : 'problème'}
              </span>
            </span>
          </div>
        </div>
      </div>



      {/* App Health Overview */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
          <Smartphone className="w-5 h-5" />
          État de l'Application
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stabilité</span>
            </div>
            <p className="text-lg font-bold text-green-400">0%</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taux de crash (N/A)</p>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance</span>
            </div>
            <p className="text-lg font-bold text-blue-400">1.2s</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Temps de chargement (dev)</p>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-700/30' : 'bg-gray-100'} rounded-lg p-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Serveurs</span>
            </div>
            <p className="text-lg font-bold text-green-400">99.9%</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité (API)</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
          <Activity className="w-5 h-5" />
          Actions Rapides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.tab}
              onClick={() => onNavigateToTab(action.tab)}
              className={`h-auto p-6 bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-0 flex-col items-start space-y-2`}
            >
              <div className="flex items-center gap-3 w-full">
                <action.icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Pre-Launch Notice */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30' : 'bg-gradient-to-r from-orange-100/50 to-yellow-100/50 border-orange-300'} backdrop-blur-sm border rounded-xl p-6`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              Phase de Pré-lancement
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              MoodCycle est en préparation pour son lancement sur l'App Store. L'infrastructure est 
              prête et optimisée, le contenu thérapeutique est en cours de finalisation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • <strong>Statut :</strong> API opérationnelle et optimisée
              </div>
              <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                • <strong>Focus :</strong> Finalisation du contenu thérapeutique
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
