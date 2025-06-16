import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useInsightsData } from "@/hooks/useInsightsData";
import { useTheme } from "@/contexts/ThemeContext";
import { Activity, Clock, Database, TrendingUp, Users, Globe, Smartphone, Target, BarChart3, Calendar } from "lucide-react";

const Analytics = () => {
  const { insights, loading, getPersonaProgress } = useInsightsData();
  const { isDarkMode } = useTheme();

  const personas = [
    { name: 'Emma', id: 'emma', color: 'bg-pink-500' },
    { name: 'Laure', id: 'laure', color: 'bg-purple-500' },
    { name: 'Sylvie', id: 'sylvie', color: 'bg-blue-500' },
    { name: 'Christine', id: 'christine', color: 'bg-green-500' },
    { name: 'Clara', id: 'clara', color: 'bg-yellow-500' }
  ];

  // Calculate total variants created
  const totalVariantsCreated = personas.reduce((total, persona) => {
    const progress = getPersonaProgress(persona.id);
    const variantsForPersona = Math.round((progress / 100) * insights.length);
    return total + variantsForPersona;
  }, 0);

  const totalPossibleVariants = insights.length * personas.length;
  const overallProgress = totalPossibleVariants > 0 ? Math.round((totalVariantsCreated / totalPossibleVariants) * 100) : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AppHeader currentPage="Analytics" />
            <main className={`flex-1 p-4 lg:p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-auto`}>
              <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className={`text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Analyses Détaillées
                    </h2>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                      Pré-lancement
                    </Badge>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tableau de bord prêt pour les futures analyses d'usage et de comportement utilisateur
                  </p>
                </div>

                {/* Analyse comportementale utilisateur */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Durée Sessions</h3>
                      <Clock className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-purple-500">0min</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Durée moyenne</p>
                      <div className="text-xs">
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Répartition:</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Suivi: 0min</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Conseils: 0min</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Navigation: 0min</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Heures d'Usage</h3>
                      <BarChart3 className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-green-500">N/A</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pic d'activité</p>
                      <div className="text-xs space-y-1">
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Matin: 0% (7h-9h)</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Après-midi: 0% (14h-17h)</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Soir: 0% (21h-23h)</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fréquence</h3>
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-500">0j/sem</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Usage moyen</p>
                      <div className="text-xs space-y-1">
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quotidien: 0%</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Régulier: 0%</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Occasionnel: 0%</div>
                      </div>
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sessions Courtes</h3>
                      <TrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-orange-500">0%</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Moins de 30sec</p>
                      <div className="text-xs">
                        <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Raisons:</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Interface: 0%</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Chargement: 0%</div>
                        <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>• Confusion: 0%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage détaillé des fonctionnalités */}
                <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6 mb-6`}>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Adoption des Fonctionnalités
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Suivi du Cycle</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Phases notées</span>
                            <span className="text-sm font-bold text-pink-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Symptômes suivis</span>
                            <span className="text-sm font-bold text-pink-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Humeur quotidienne</span>
                            <span className="text-sm font-bold text-pink-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Conseils & Melune</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Conseils lus</span>
                            <span className="text-sm font-bold text-blue-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Conversations Melune</span>
                            <span className="text-sm font-bold text-blue-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Favoris sauvés</span>
                            <span className="text-sm font-bold text-blue-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Paramètres</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Notifications ON</span>
                            <span className="text-sm font-bold text-green-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Mode sombre</span>
                            <span className="text-sm font-bold text-green-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Profil complété</span>
                            <span className="text-sm font-bold text-green-500">0%</span>
                          </div>
                          <Progress value={0} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analyse géographique & appareils */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Répartition Géographique
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { region: "France", users: "0", percentage: 0 },
                        { region: "Québec", users: "0", percentage: 0 },
                        { region: "Belgique", users: "0", percentage: 0 },
                        { region: "Suisse", users: "0", percentage: 0 }
                      ].map((region) => (
                        <div key={region.region} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{region.region}</span>
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{region.users}</span>
                          </div>
                          <Progress value={region.percentage} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="w-5 h-5 text-purple-500" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Appareils Utilisés
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Type d'appareil</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mobile</span>
                            <span className="text-sm font-bold text-purple-500">0%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tablette</span>
                            <span className="text-sm font-bold text-purple-500">0%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Système</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>iOS</span>
                            <span className="text-sm font-bold text-purple-500">0%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Android</span>
                            <span className="text-sm font-bold text-purple-500">0%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métriques techniques de performance */}
                <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6 mb-6`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-500" />
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Performance Technique
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-500">99.8%</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-500">1.2s</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Chargement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-yellow-500">0.8%</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taux erreur</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-500">240ms</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Réponse API</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-cyan-500">8MB</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taille app</p>
                    </div>
                  </div>
                </div>

                {/* Progression actuelle de la gestion de contenu */}
                <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-cyan-500" />
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Progression du Contenu
                      </h3>
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                      En Développement
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Variantes de Personas Créées
                        </span>
                        <span className="text-lg font-bold text-cyan-400">
                          {totalVariantsCreated}/{totalPossibleVariants}
                        </span>
                      </div>
                      <Progress value={overallProgress} className={`h-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {overallProgress}% des variantes complétées
                      </p>
                    </div>
                    
                    {/* Répartition par persona */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mt-4">
                      {personas.map((persona) => {
                        const progress = getPersonaProgress(persona.id);
                        const completed = Math.round((progress / 100) * insights.length);
                        return (
                          <div key={persona.id} className={`${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg p-3`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${persona.color}`}></div>
                              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {persona.name}
                              </span>
                            </div>
                            <p className="text-lg font-bold text-cyan-400">{completed}/{insights.length}</p>
                            <Progress value={progress} className={`h-2 mt-2 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Analytics;
