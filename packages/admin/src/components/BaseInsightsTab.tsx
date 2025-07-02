import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Save, Edit, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useInsightsData } from "@/hooks/useInsightsData";
import { JourneySelector } from "@/components/JourneySelector";
import { JezaScoreSelector } from "@/components/JezaScoreSelector";
import { InsightFilters } from "@/components/InsightFilters";
import { useTheme } from "@/contexts/ThemeContext";
import { getPhaseLabel, getToneLabel } from "@/utils/mappingTranslate";

export function BaseInsightsTab() {
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [filters, setFilters] = useState({
    phase: '',
    tone: '',
    status: ''
  });

  const { insights, loading, error, saving, updateInsight, saveInsights, saveInsightVariants } = useInsightsData();
  const { isDarkMode } = useTheme();

  // Filter insights based on filters
  const filteredInsights = useMemo(() => {
    return insights.filter(insight => {
      const matchesPhase = !filters.phase || filters.phase === 'all' || insight.phase === filters.phase;
      const matchesTone = !filters.tone || filters.tone === 'all' || insight.tone === filters.tone;
      const matchesStatus = !filters.status || filters.status === 'all' || insight.status === filters.status;
      
      return matchesPhase && matchesTone && matchesStatus;
    });
  }, [insights, filters]);

  // Progress calculation
  const configuredInsights = insights.filter(insight => {
    const hasBaseContent = insight.baseContent && insight.baseContent.trim().length > 0;
    const hasJourney = insight.targetJourney && insight.targetJourney.length > 0;
    const hasJezaScore = insight.jezaApproval && insight.jezaApproval > 0;
    return hasBaseContent && hasJourney && hasJezaScore;
  });

  const progress = insights.length > 0 ? Math.round((configuredInsights.length / insights.length) * 100) : 0;

  const currentInsight = filteredInsights[currentInsightIndex];

  const handleEdit = () => {
    setEditContent(currentInsight?.baseContent || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentInsight) return;
    
    try {
      console.log('Saving baseContent for insight:', currentInsight.id);
      
      const updatedData = {
        baseContent: editContent,
        status: 'enriched',
        enrichedBy: 'baseInsightsTab-v1',
        lastModified: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      };

      // Update local state first
      await updateInsight(currentInsight.id, updatedData);
      
      // Save to API using the saveInsightVariants method
      await saveInsightVariants(currentInsight.id, {
        baseContent: editContent
      });
      
      console.log('BaseContent saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save baseContent:', error);
    }
  };

  const handleJourneyChange = async (journeys: string[]) => {
    if (!currentInsight || !isEditing) return;
    
    try {
      console.log('Saving journeys for insight:', currentInsight.id, journeys);
      
      const updatedData = {
        targetJourney: journeys,
        targetPreferences: journeys, // Synchroniser avec l'ancien champ
        lastModified: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      };

      // Update local state
      await updateInsight(currentInsight.id, updatedData);
      
      // Save to API - only send string values
      await saveInsightVariants(currentInsight.id, {
        targetJourney: JSON.stringify(journeys),
        targetPreferences: JSON.stringify(journeys)
      });
      
      console.log('Journeys saved successfully');
    } catch (error) {
      console.error('Failed to save journeys:', error);
    }
  };

  const handleJezaScoreChange = async (score: number) => {
    if (!currentInsight || !isEditing) return;
    
    try {
      console.log('Saving Jeza score for insight:', currentInsight.id, score);
      
      // Update local state
      await updateInsight(currentInsight.id, {
        jezaApproval: score,
        lastModified: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
      });
      
      // Save to API
      await saveInsightVariants(currentInsight.id, { 
        jezaApproval: score.toString()
      });
      
      console.log('Jeza score saved successfully');
    } catch (error) {
      console.error('Failed to save Jeza score:', error);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentInsightIndex > 0) {
      setCurrentInsightIndex(currentInsightIndex - 1);
    } else if (direction === 'next' && currentInsightIndex < filteredInsights.length - 1) {
      setCurrentInsightIndex(currentInsightIndex + 1);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-white' : 'text-gray-900'}`} />
        <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chargement des conseils génériques...</span>
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
    <div className="space-y-6">
      {/* Current Insight Editor */}
      {currentInsight && (
        <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Conseil de base n°{currentInsightIndex + 1}
              </h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                  {getPhaseLabel(currentInsight.phase)}
                </Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                  {getToneLabel(currentInsight.tone)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isEditing ? handleSave : handleEdit}
                size="sm"
                className={isEditing 
                  ? "bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white"
                  : "bg-gradient-to-r from-pink-500 to-lime-400 hover:from-pink-600 hover:to-lime-500 text-white"
                }
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </>
                )}
              </Button>
              
              {isEditing && (
                <Button
                  onClick={() => {
                    setEditContent(currentInsight?.baseContent || "");
                    setIsEditing(false);
                  }}
                  size="sm"
                  variant="outline"
                  className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  Annuler
                </Button>
              )}
            </div>
          </div>

          {/* Base Content Editor - Moved to top */}
          <div className="space-y-4 mb-6">
            {/* <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Contenu de Base</h4> */}

            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className={`min-h-[150px] ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} resize-none`}
                placeholder="Saisissez le contenu de base..."
              />
            ) : (
              <div className={`${isDarkMode ? 'bg-gray-900/50 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg p-4 border`}>
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'} leading-relaxed`}>
                  {currentInsight.baseContent || "Aucun contenu de base configuré"}
                </p>
              </div>
            )}
          </div>

          {/* Critical Fields - Moved below content */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-4 ${isDarkMode ? 'bg-gray-900/30 border-gray-600' : 'bg-gray-50 border-gray-200'} rounded-lg border`}>
            <JourneySelector
              value={currentInsight.targetJourney || []}
              onChange={handleJourneyChange}
              disabled={!isEditing}
            />
            <JezaScoreSelector
              value={currentInsight.jezaApproval || 0}
              onChange={handleJezaScoreChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      )}

      {/* Progress Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        {/* <div className="mb-4">
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Conseils Génériques</h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configurez le contenu de base, parcours et scores Jeza</p>
        </div> */}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {configuredInsights.length}/{insights.length} conseils configurés
            </span>
            <span className="text-sm text-green-400">{progress}%</span>
          </div>
          <Progress value={progress} className={`h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>
      </div>

      {/* Filters and Navigation */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-4`}>
        <div className="flex items-center justify-between">
          <InsightFilters 
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          <div className="flex items-center gap-4">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {currentInsightIndex + 1} sur {filteredInsights.length}
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => handleNavigation('prev')}
                disabled={currentInsightIndex === 0}
                variant="outline"
                size="sm"
                className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleNavigation('next')}
                disabled={currentInsightIndex === filteredInsights.length - 1}
                variant="outline"
                size="sm"
                className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
