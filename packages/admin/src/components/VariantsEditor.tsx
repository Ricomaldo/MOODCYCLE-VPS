import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Save, X, RefreshCw } from "lucide-react";
import { useInsightsData } from "@/hooks/useInsightsData";
import { useTheme } from "@/contexts/ThemeContext";
import { getPhaseLabel, getToneLabel } from "@/utils/mappingTranslate";

interface Insight {
  id: string;
  baseContent?: string;
  content?: string;
  personaVariants?: Record<string, string>;
  targetPreferences?: string[];
  tone: string;
  phase: string;
  status: string;
  lastModified: string;
}

interface VariantsEditorProps {
  insight: Insight | null;
  persona: string;
}

export function VariantsEditor({ insight, persona }: VariantsEditorProps) {
  const [editBaseContent, setEditBaseContent] = useState("");
  const [editVariantContent, setEditVariantContent] = useState("");
  const [originalBaseContent, setOriginalBaseContent] = useState("");
  const [originalVariantContent, setOriginalVariantContent] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateInsight, saveInsightVariants } = useInsightsData();
  const { isDarkMode } = useTheme();
  
  const maxLength = 500;
  
  useEffect(() => {
    if (insight) {
      const baseContent = insight.baseContent || insight.content || '';
      const variantContent = insight.personaVariants?.[persona] || "";
      
      setEditBaseContent(baseContent);
      setEditVariantContent(variantContent);
      setOriginalBaseContent(baseContent);
      setOriginalVariantContent(variantContent);
    }
  }, [insight, persona]);

  // Check if content has been modified
  const baseContentModified = editBaseContent !== originalBaseContent;
  const variantContentModified = editVariantContent !== originalVariantContent;
  const hasModifications = baseContentModified || variantContentModified;

  const handleSave = async () => {
    if (!insight) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      console.log('Saving changes for insight:', insight.id);
      
      // Prepare updates
      const updates: Partial<Insight> = {};
      const variantUpdates: Record<string, string> = {};
      
      if (baseContentModified) {
        updates.baseContent = editBaseContent;
        variantUpdates.baseContent = editBaseContent;
      }
      
      if (variantContentModified) {
        updates.personaVariants = {
          ...insight.personaVariants,
          [persona]: editVariantContent
        };
        variantUpdates[persona] = editVariantContent;
      }
      
      // Save to API
      if (Object.keys(variantUpdates).length > 0) {
        await saveInsightVariants(insight.id, variantUpdates);
      }
      
      // Update local state
      if (Object.keys(updates).length > 0) {
        await updateInsight(insight.id, {
          ...updates,
          status: 'enriched',
          enrichedBy: 'variantsEditor-v1',
          lastModified: new Date().toLocaleString('fr-FR', {timeZone: 'Europe/Paris'})
        });
      }
      
      // Update original content to match current
      setOriginalBaseContent(editBaseContent);
      setOriginalVariantContent(editVariantContent);
      
      console.log('Changes saved successfully');
    } catch (error) {
      console.error('Failed to save changes:', error);
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditBaseContent(originalBaseContent);
    setEditVariantContent(originalVariantContent);
    setSaveError(null);
  };

  if (!insight) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Aucun conseil sélectionné</p>
      </div>
    );
  }

  const hasVariant = originalVariantContent && originalVariantContent.trim().length > 0;
  const remainingChars = maxLength - editVariantContent.length;
  
  const getConseilNumber = (id: string) => {
    const match = id.match(/\d+/);
    return match ? match[0] : '1';
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'validated': 'Validé',
      'enriched': 'Enrichi', 
      'draft': 'Brouillon'
    };
    return statusMap[status] || status;
  };
  
  return (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Conseil {persona.charAt(0).toUpperCase() + persona.slice(1)} n°{getConseilNumber(insight.id)}
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                {getPhaseLabel(insight.phase)}
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                {getToneLabel(insight.tone)}
              </Badge>
              <Badge variant="outline" className={`${insight.status === 'enriched' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'}`}>
                {getStatusBadge(insight.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons - Show when modifications are made */}
        {hasModifications && (
          <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex-1">
              <p className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Vous avez des modifications non sauvegardées
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white disabled:opacity-50"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isSaving}
                size="sm"
                variant="outline"
                className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className={`mb-4 p-3 ${isDarkMode ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-100 border-red-300 text-red-700'} border rounded-lg text-sm`}>
            {saveError}
          </div>
        )}

        {/* Base Content */}
        <div className="mb-6">
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Contenu de base
          </h4>
          <Textarea
            value={editBaseContent}
            onChange={(e) => setEditBaseContent(e.target.value)}
            className={`min-h-[100px] ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} resize-none`}
            placeholder="Saisissez le contenu de base..."
          />
        </div>

        {/* Persona Variant */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
              Variante {persona.charAt(0).toUpperCase() + persona.slice(1)}
              {!hasVariant && !editVariantContent.trim() && (
                <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                  Manquante
                </Badge>
              )}
              {(hasVariant || editVariantContent.trim()) && (
                <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                  {editVariantContent.trim() ? 'En cours' : 'Complète'}
                </Badge>
              )}
            </h4>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs ${remainingChars < 50 ? 'text-red-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {remainingChars} caractères restants
              </span>
            </div>
          </div>

          <Textarea
            value={editVariantContent}
            onChange={(e) => setEditVariantContent(e.target.value)}
            maxLength={maxLength}
            className={`min-h-[200px] ${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} resize-none`}
            placeholder={`Créez une variante personnalisée pour ${persona}...`}
          />
        </div>



        {/* Metadata */}
        <div className={`mt-6 pt-4 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Préférences ciblées:</span>
              <div className="flex gap-1 mt-1 flex-wrap">
                {insight.targetPreferences?.map((pref: string) => (
                  <Badge key={pref} variant="outline" className={`${isDarkMode ? 'border-gray-500 text-gray-300' : 'border-gray-400 text-gray-600'} text-xs`}>
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Dernière modification:</span>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>{new Date(insight.lastModified).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 