import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePhasesData } from "@/hooks/usePhasesData";
import { RefreshCw, Save, Loader2, Edit } from "lucide-react";

interface PhaseEditorProps {
  phaseId: string;
}

interface PhaseData {
  id: string;
  name: string;
  slug: string;
  color: string;
  duration: string;
  energy: string;
  mood: string;
  description: string;
  characteristics: {
    physical: string[];
    emotional: string[];
    energy: string;
  };
  advice: {
    nutrition: string[];
    activities: string[];
    selfcare: string[];
    avoid: string[];
  };
  rituals: string[];
  affirmation: string;
  symbol: string;
  element: string;
  archetype: string;
  contextualEnrichments: {
    id: string;
    targetPersona: string;
    targetPreferences: string[];
    targetJourney: string;
    tone: string;
    contextualText: string;
  }[];
}

export function PhaseEditor({ phaseId }: PhaseEditorProps) {
  const { phases: phasesData, loading, savePhases } = usePhasesData();
  const [phaseData, setPhaseData] = useState<PhaseData | null>(null);
  const [originalPhaseData, setOriginalPhaseData] = useState<PhaseData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (phasesData && phaseId) {
      const phase = phasesData[phaseId];
      if (phase) {
        // Ensure the phase has all required fields with defaults
        const completePhase = {
          ...phase,
          slug: phase.slug || phaseId,
          characteristics: {
            ...phase.characteristics,
            energy: phase.characteristics?.energy || ''
          },
          contextualEnrichments: phase.contextualEnrichments || []
        };
        setPhaseData(completePhase);
        setOriginalPhaseData(completePhase);
      } else {
        // Si aucune donnée trouvée dans l'API, créer une structure vide
        const defaultData = {
          id: phaseId,
          name: `Phase ${phaseId}`,
          slug: phaseId,
          color: '#666666',
          duration: '',
          energy: '',
          mood: '',
          description: '',
          characteristics: { physical: [], emotional: [], energy: '' },
          advice: { nutrition: [], activities: [], selfcare: [], avoid: [] },
          rituals: [],
          affirmation: '',
          symbol: '',
          element: '',
          archetype: '',
          contextualEnrichments: []
        };
        setPhaseData(defaultData);
        setOriginalPhaseData(defaultData);
      }
    }
  }, [phasesData, phaseId]);

  const currentPhase = phaseData;

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <p className="text-gray-400">Chargement des données de phase...</p>
      </div>
    );
  }

  if (!phaseData) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <p className="text-gray-400">Aucune donnée de phase trouvée</p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!phaseData) return;
    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      console.log('Saving phase data:', phaseData);
      
      // Update the phases data with the current phase
      const updatedPhases = {
        ...phasesData,
        [phaseId]: phaseData
      };
      
      // Save to API
      await savePhases(updatedPhases);
      
      setIsEditing(false);
      console.log('Phase data saved successfully');
    } catch (error) {
      console.error('Failed to save phase data:', error);
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-6 h-6 rounded-full" 
              style={{ backgroundColor: currentPhase?.color }}
            ></div>
            <h3 className="text-xl font-semibold text-white">
              {currentPhase?.name || `Phase ${phaseId}`}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              disabled={isSaving}
              className={isEditing 
                ? "bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white"
                : "bg-gradient-to-r from-pink-500 to-lime-400 hover:from-pink-600 hover:to-lime-500 text-white"
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : isEditing ? (
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
                  setPhaseData(originalPhaseData);
                  setIsEditing(false);
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Annuler
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Durée</h4>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.duration}
                onChange={(e) => setPhaseData({...phaseData, duration: e.target.value})}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                placeholder="e.g., 3-7 days"
              />
            ) : (
              <p className="text-white">{phaseData.duration || 'Not set'}</p>
            )}
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Énergie</h4>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.energy}
                onChange={(e) => setPhaseData({...phaseData, energy: e.target.value})}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                placeholder="e.g., Low to Rising"
              />
            ) : (
              <p className="text-white">{phaseData.energy || 'Not set'}</p>
            )}
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Humeur</h4>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.mood}
                onChange={(e) => setPhaseData({...phaseData, mood: e.target.value})}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                placeholder="e.g., Reflective, Renewing"
              />
            ) : (
              <p className="text-white">{phaseData.mood || 'Not set'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Description</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={phaseData.description}
              onChange={(e) => setPhaseData({...phaseData, description: e.target.value})}
              className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
              placeholder="Décrivez cette phase..."
            />
          ) : (
            <p className="text-gray-300">{phaseData.description || 'Aucune description définie'}</p>
          )}
        </CardContent>
      </Card>

      {/* Contextual Enrichments */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Enrichissements Contextuels 
            <span className="text-sm text-gray-400">
              ({phaseData.contextualEnrichments.length} enrichissements)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              {phaseData.contextualEnrichments.map((enrichment, index) => (
                <div key={index} className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        ID
                      </label>
                      <input 
                        type="text"
                        value={enrichment.id}
                        onChange={(e) => {
                          const newEnrichments = [...phaseData.contextualEnrichments];
                          newEnrichments[index] = { ...enrichment, id: e.target.value };
                          setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                        }}
                        className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                        placeholder="unique_id_here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Target Persona
                      </label>
                      <select 
                        value={enrichment.targetPersona}
                        onChange={(e) => {
                          const newEnrichments = [...phaseData.contextualEnrichments];
                          newEnrichments[index] = { ...enrichment, targetPersona: e.target.value };
                          setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                        }}
                        className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="">Select persona</option>
                        <option value="emma">Emma</option>
                        <option value="christine">Christine</option>
                        <option value="laure">Laure</option>
                        <option value="clara">Clara</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Target Journey
                      </label>
                      <select 
                        value={enrichment.targetJourney}
                        onChange={(e) => {
                          const newEnrichments = [...phaseData.contextualEnrichments];
                          newEnrichments[index] = { ...enrichment, targetJourney: e.target.value };
                          setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                        }}
                        className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="">Sélectionner un parcours</option>
                        <option value="emotional_control">Contrôle Émotionnel</option>
                        <option value="body_disconnect">Déconnexion Corporelle</option>
                        <option value="hiding_nature">Dissimulation Nature</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Ton
                      </label>
                      <select 
                        value={enrichment.tone}
                        onChange={(e) => {
                          const newEnrichments = [...phaseData.contextualEnrichments];
                          newEnrichments[index] = { ...enrichment, tone: e.target.value };
                          setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                        }}
                        className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="">Sélectionner un ton</option>
                        <option value="friendly">Amical</option>
                        <option value="professional">Professionnel</option>
                        <option value="inspiring">Inspirant</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Préférences Cibles (séparées par des virgules)
                    </label>
                    <input 
                      type="text"
                      value={enrichment.targetPreferences.join(', ')}
                      onChange={(e) => {
                        const newEnrichments = [...phaseData.contextualEnrichments];
                        newEnrichments[index] = { 
                          ...enrichment, 
                          targetPreferences: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                        };
                        setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                      }}
                      className="w-full bg-gray-800 border border-gray-500 rounded px-3 py-2 text-white text-sm"
                      placeholder="bien-être, phases, symptômes, suivi"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Texte Contextuel
                    </label>
                    <Textarea
                      value={enrichment.contextualText}
                      onChange={(e) => {
                        const newEnrichments = [...phaseData.contextualEnrichments];
                        newEnrichments[index] = { ...enrichment, contextualText: e.target.value };
                        setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                      }}
                      className="bg-gray-800 border-gray-500 text-white min-h-[80px]"
                      placeholder="Entrez le texte contextuel pour ce persona et parcours..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newEnrichments = phaseData.contextualEnrichments.filter((_, i) => i !== index);
                      setPhaseData({ ...phaseData, contextualEnrichments: newEnrichments });
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Supprimer l'Enrichissement
                  </button>
                </div>
              ))}
              
              <button
                onClick={() => {
                  const newEnrichment = {
                    id: `${phaseId}_nouveau_${Date.now()}`,
                    targetPersona: '',
                    targetPreferences: [],
                    targetJourney: '',
                    tone: '',
                    contextualText: ''
                  };
                  setPhaseData({ 
                    ...phaseData, 
                    contextualEnrichments: [...phaseData.contextualEnrichments, newEnrichment] 
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                + Ajouter un Nouvel Enrichissement
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {phaseData.contextualEnrichments.length === 0 ? (
                <p className="text-gray-400">Aucun enrichissement contextuel configuré</p>
              ) : (
                phaseData.contextualEnrichments.map((enrichment, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-3 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-400">
                          {enrichment.targetPersona}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-300">
                          {enrichment.tone}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-sm text-gray-300">
                          {enrichment.targetJourney}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {enrichment.targetPreferences.join(', ')}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">
                      {enrichment.contextualText}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Characteristics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Caractéristiques Physiques</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={phaseData.characteristics.physical.join('\n')}
                onChange={(e) => setPhaseData({
                  ...phaseData, 
                  characteristics: {
                    ...phaseData.characteristics,
                    physical: e.target.value.split('\n').filter(item => item.trim())
                  }
                })}
                className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                placeholder="Une caractéristique par ligne..."
              />
            ) : (
              <ul className="text-gray-300 space-y-1">
                {phaseData.characteristics.physical.length > 0 ? 
                  phaseData.characteristics.physical.map((item, index) => (
                    <li key={index}>• {item}</li>
                  )) : 
                  <li className="text-gray-500">Aucune caractéristique physique définie</li>
                }
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Caractéristiques Émotionnelles</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={phaseData.characteristics.emotional.join('\n')}
                onChange={(e) => setPhaseData({
                  ...phaseData, 
                  characteristics: {
                    ...phaseData.characteristics,
                    emotional: e.target.value.split('\n').filter(item => item.trim())
                  }
                })}
                className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                placeholder="Une caractéristique par ligne..."
              />
            ) : (
              <ul className="text-gray-300 space-y-1">
                {phaseData.characteristics.emotional.length > 0 ? 
                  phaseData.characteristics.emotional.map((item, index) => (
                    <li key={index}>• {item}</li>
                  )) : 
                  <li className="text-gray-500">Aucune caractéristique émotionnelle définie</li>
                }
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Description de l'Énergie</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={phaseData.characteristics.energy}
                onChange={(e) => setPhaseData({
                  ...phaseData, 
                  characteristics: {
                    ...phaseData.characteristics,
                    energy: e.target.value
                  }
                })}
                className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                placeholder="Décrivez le niveau et la qualité de l'énergie..."
              />
            ) : (
              <p className="text-gray-300">
                {phaseData.characteristics.energy || 'Aucune description énergétique définie'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advice Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'nutrition', title: 'Nutrition' },
          { key: 'activities', title: 'Activités' },
          { key: 'selfcare', title: 'Soins Personnels' },
          { key: 'avoid', title: 'À Éviter' }
        ].map(({ key, title }) => (
          <Card key={key} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={phaseData.advice[key as keyof typeof phaseData.advice].join('\n')}
                  onChange={(e) => setPhaseData({
                    ...phaseData,
                    advice: {
                      ...phaseData.advice,
                      [key]: e.target.value.split('\n').filter(item => item.trim())
                    }
                  })}
                  className="bg-gray-900 border-gray-600 text-white min-h-[120px] text-sm"
                  placeholder="Un conseil par ligne..."
                />
              ) : (
                <ul className="text-gray-300 space-y-1 text-sm">
                  {phaseData.advice[key as keyof typeof phaseData.advice].length > 0 ? 
                    phaseData.advice[key as keyof typeof phaseData.advice].map((item, index) => (
                      <li key={index}>• {item}</li>
                    )) : 
                    <li className="text-gray-500">Aucun conseil défini</li>
                  }
                </ul>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rituals and Affirmation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Rituels</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={phaseData.rituals.join('\n')}
                onChange={(e) => setPhaseData({
                  ...phaseData, 
                  rituals: e.target.value.split('\n').filter(item => item.trim())
                })}
                className="bg-gray-900 border-gray-600 text-white min-h-[120px]"
                placeholder="Un rituel par ligne..."
              />
            ) : (
              <ul className="text-gray-300 space-y-1">
                {phaseData.rituals.length > 0 ? 
                  phaseData.rituals.map((ritual, index) => (
                    <li key={index}>• {ritual}</li>
                  )) : 
                  <li className="text-gray-500">Aucun rituel défini</li>
                }
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Affirmation</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={phaseData.affirmation}
                onChange={(e) => setPhaseData({...phaseData, affirmation: e.target.value})}
                className="bg-gray-900 border-gray-600 text-white min-h-[100px]"
                placeholder="Écrivez une affirmation positive pour cette phase..."
              />
            ) : (
              <p className="text-gray-300 italic">
                {phaseData.affirmation || 'Aucune affirmation définie'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spiritual & Symbolic Elements */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Symbole</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.symbol}
                onChange={(e) => setPhaseData({...phaseData, symbol: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-center text-2xl"
                placeholder="🌙"
              />
            ) : (
              <div className="text-center">
                <span className="text-3xl">{phaseData.symbol || '❓'}</span>
                <p className="text-gray-400 text-xs mt-1">
                  {phaseData.symbol ? 'Symbole défini' : 'Aucun symbole'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Élément</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <select 
                value={phaseData.element}
                onChange={(e) => setPhaseData({...phaseData, element: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white"
              >
                <option value="">Sélectionner un élément</option>
                <option value="Eau">Eau</option>
                <option value="Air">Air</option>
                <option value="Feu">Feu</option>
                <option value="Terre">Terre</option>
              </select>
            ) : (
              <p className="text-white text-center font-medium">
                {phaseData.element || 'Non défini'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Archétype</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.archetype}
                onChange={(e) => setPhaseData({...phaseData, archetype: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                placeholder="La Sage, L'Exploratrice..."
              />
            ) : (
              <p className="text-white text-center text-sm font-medium">
                {phaseData.archetype || 'Non défini'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Slug</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <input 
                type="text"
                value={phaseData.slug}
                onChange={(e) => setPhaseData({...phaseData, slug: e.target.value})}
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                placeholder="Nom compatible URL"
              />
            ) : (
              <p className="text-white text-center text-sm font-mono">
                {phaseData.slug || 'Non défini'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Résumé des données */}
      {!isEditing && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Résumé des données</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-gray-400">Champs complétés</div>
                <div className="text-white font-bold text-lg">
                  {[
                    phaseData.slug,
                    phaseData.duration,
                    phaseData.energy,
                    phaseData.mood,
                    phaseData.description,
                    phaseData.characteristics.energy,
                    phaseData.affirmation,
                    phaseData.symbol,
                    phaseData.element,
                    phaseData.archetype
                  ].filter(field => field && field.length > 0).length} / 10
                </div>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-gray-400">Listes</div>
                <div className="text-white font-bold text-lg">
                  {[
                    phaseData.characteristics.physical,
                    phaseData.characteristics.emotional,
                    phaseData.advice.nutrition,
                    phaseData.advice.activities,
                    phaseData.advice.selfcare,
                    phaseData.advice.avoid,
                    phaseData.rituals
                  ].reduce((total, list) => total + (list.length > 0 ? 1 : 0), 0)} / 7
                </div>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-gray-400">Enrichissements</div>
                <div className="text-white font-bold text-lg">
                  {phaseData.contextualEnrichments.length}
                </div>
              </div>
              
              <div className="bg-gray-900 p-3 rounded">
                <div className="text-gray-400">Statut</div>
                <div className={`font-bold text-lg ${
                  phaseData.slug && phaseData.description && phaseData.affirmation 
                    ? 'text-green-400' 
                    : 'text-orange-400'
                }`}>
                  {phaseData.slug && phaseData.description && phaseData.affirmation 
                    ? '✅ Complet' 
                    : '⏳ En cours'
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isEditing && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-pink-500 to-lime-400 text-white disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      )}
      
      {saveError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {saveError}
        </div>
      )}
    </div>
  );
}
