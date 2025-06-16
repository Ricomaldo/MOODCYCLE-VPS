import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useInsightsData } from "@/hooks/useInsightsData";
import { PersonaSidebar } from "@/components/PersonaSidebar";
import { VariantsEditor } from "@/components/VariantsEditor";
import { PersonaVariantFilters } from "@/components/PersonaVariantFilters";
import { useTheme } from "@/contexts/ThemeContext";

export function PersonaVariantsTab() {
  const [selectedPersona, setSelectedPersona] = useState("emma");
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [filters, setFilters] = useState({
    phase: '',
    tone: '',
    completion: ''
  });

  const { insights, loading, error, getPersonaProgress } = useInsightsData();
  const { isDarkMode } = useTheme();

  // Filter insights based on filters
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      const matchesPhase = !filters.phase || filters.phase === 'all' || insight.phase === filters.phase;
      const matchesTone = !filters.tone || filters.tone === 'all' || insight.tone === filters.tone;
      
      return matchesPhase && matchesTone;
    });
  }, [insights, filters]);

  // Apply completion filter for persona variants
  const workingInsights = useMemo(() => {
    if (!filters.completion || filters.completion === 'all') {
      // Show all insights
      return filteredInsights;
    }
    
    return filteredInsights.filter(insight => {
      const hasVariant = insight.personaVariants && insight.personaVariants[selectedPersona];
      const isComplete = hasVariant && insight.personaVariants[selectedPersona].trim().length > 0;
      
      if (filters.completion === 'done') {
        return isComplete; // Show only completed variants
      } else if (filters.completion === 'todo') {
        return !isComplete; // Show only incomplete variants
      }
      
      return true; // Should not reach here
    });
  }, [filteredInsights, selectedPersona, filters.completion]);

  // Calculate total progress across all personas
  const totalVariants = insights.length * 5; // 5 personas
  const completedVariants = insights.reduce((count, insight) => {
    const variants = insight.personaVariants || {};
    return count + Object.values(variants).filter(variant => variant && variant.trim().length > 0).length;
  }, 0);

  const totalProgress = totalVariants > 0 ? Math.round((completedVariants / totalVariants) * 100) : 0;

  const currentInsight = workingInsights[currentInsightIndex];

  const handlePersonaChange = (persona: string) => {
    setSelectedPersona(persona);
    setCurrentInsightIndex(0);
  };

  const handleNavigateInsight = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1);
    } else if (direction === 'next' && currentInsightIndex < workingInsights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
        <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chargement des variantes personas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-100 border-red-300'} border rounded-xl p-6`}>
        <p className={`${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">


      {/* Main Content */}
      <div className={`flex flex-col lg:flex-row lg:h-[calc(100vh-300px)] ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-xl overflow-hidden border`}>
        {/* Sidebar - Responsive */}
        <PersonaSidebar 
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          getPersonaProgress={getPersonaProgress}
          loading={loading}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Filters and Navigation */}
          <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'} backdrop-blur-sm border-b p-4`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <PersonaVariantFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
              
              {workingInsights.length > 0 && (
                <div className="flex items-center gap-4">

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleNavigateInsight('prev')}
                      disabled={currentInsightIndex === 0}
                      variant="outline"
                      size="sm"
                      className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'} disabled:opacity-50`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Précédent
                    </Button>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {currentInsightIndex + 1}/{workingInsights.length}
                  </span>
                    <Button
                      onClick={() => handleNavigateInsight('next')}
                      disabled={currentInsightIndex === workingInsights.length - 1}
                      variant="outline"
                      size="sm"
                      className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'} disabled:opacity-50`}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {currentInsight ? (
              <VariantsEditor 
                insight={currentInsight}
                persona={selectedPersona} 
              />
            ) : (
              <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6 lg:p-8 text-center`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Toutes les variantes terminées !</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Toutes les variantes pour {selectedPersona} sont complétées avec les filtres actuels.
                </p>
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-sm mt-2`}>
                  Essayez de modifier les filtres ou de sélectionner une autre persona.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

            {/* Progress Header */}
            <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4 lg:p-6`}>
        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-lg lg:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Variantes Personas</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Créez des variantes personnalisées pour chaque persona</p>
          </div>
        </div> */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {completedVariants}/{totalVariants} variantes créées
            </span>
            <span className="text-sm text-green-400">{totalProgress}%</span>
          </div>
          <Progress value={totalProgress} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>
    </div>
  );
}
