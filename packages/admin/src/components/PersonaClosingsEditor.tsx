import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, RefreshCw } from "lucide-react";
import { useClosingsData } from "@/hooks/useClosingsData";

const personas = [
  {
    id: "emma",
    name: "Emma",
    avatar: "/images/avatars/Emma.jpg",
    color: "from-pink-500 to-rose-400"
  },
  {
    id: "laure",
    name: "Laure",
    avatar: "/images/avatars/Laure.jpg",
    color: "from-purple-500 to-indigo-400"
  },
  {
    id: "sylvie",
    name: "Sylvie",
    avatar: "/images/avatars/Sylvie.jpg",
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "christine",
    name: "Christine",
    avatar: "/images/avatars/Christine.jpg",
    color: "from-green-500 to-lime-400"
  },
  {
    id: "clara",
    name: "Clara",
    avatar: "/images/avatars/Clara.jpg",
    color: "from-yellow-500 to-orange-400"
  }
];

// Mock persona closings data
const mockClosingsData = {
  emma: {
    body: "Je t'accompagne dans cette reconnexion avec ton corps",
    nature: "Je t'aide à célébrer ta nature cyclique authentique", 
    emotions: "Je te guide vers une relation apaisée avec tes émotions"
  },
  laure: {
    body: "Optimise cette connexion corps-esprit pour ta performance",
    nature: "Transforme tes cycles en avantage stratégique personnel",
    emotions: "Développe ton intelligence émotionnelle comme un atout"
  },
  sylvie: {
    body: "Accueille avec douceur cette sagesse corporelle",
    nature: "Embrasse la beauté de tes rythmes naturels féminins", 
    emotions: "Transforme tes émotions en force créatrice"
  },
  christine: {
    body: "Laisse ton corps te guider vers ta vérité intérieure",
    nature: "Honore cette sagesse ancestrale qui vit en toi",
    emotions: "Cultive cette maturité émotionnelle qui t'habite"
  },
  clara: {
    body: "Analyse ces signaux pour mieux comprendre ton fonctionnement",
    nature: "Observe la logique fascinante de tes cycles biologiques",
    emotions: "Décrypte ces patterns pour maîtriser tes réactions"
  }
};

export function PersonaClosingsEditor() {
  const { closings, saveClosings } = useClosingsData();
  const [selectedPersona, setSelectedPersona] = useState("emma");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [closingsData, setClosingsData] = useState(mockClosingsData);
  const [editData, setEditData] = useState(closingsData[selectedPersona as keyof typeof closingsData]);

  const handlePersonaChange = (personaId: string) => {
    if (isEditing) {
      // Save current changes before switching
      handleSave();
    }
    setSelectedPersona(personaId);
    setEditData(closingsData[personaId as keyof typeof closingsData]);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      console.log('Saving closings data for persona:', selectedPersona);
      
      // Update closings data
      const updatedClosings = {
        ...closingsData,
        [selectedPersona]: editData
      };
      
      // Save to API
      await saveClosings(updatedClosings);
      
      // Update local state
      setClosingsData(updatedClosings);
      setIsEditing(false);
      
      console.log('Closings saved successfully');
    } catch (error) {
      console.error('Failed to save closings:', error);
      setSaveError(error instanceof Error ? error.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const currentPersona = personas.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-6">
      {/* Persona Selector */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Persona Closings Editor</h3>
        <p className="text-gray-400 mb-6">Edit closing messages for each persona across different content categories.</p>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {personas.map((persona) => (
            <Button
              key={persona.id}
              onClick={() => handlePersonaChange(persona.id)}
              variant={selectedPersona === persona.id ? "default" : "outline"}
              className={`${
                selectedPersona === persona.id
                  ? `bg-gradient-to-r ${persona.color} text-white`
                  : 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700'
              } flex items-center gap-2 min-w-fit`}
            >
              <Avatar className="w-6 h-6">
                <AvatarImage src={persona.avatar} />
                <AvatarFallback className="bg-gray-700 text-white text-xs">
                  {persona.name[0]}
                </AvatarFallback>
              </Avatar>
              {persona.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Closings Editor */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={currentPersona?.avatar} />
              <AvatarFallback className="bg-gray-700 text-white">
                {currentPersona?.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-lg font-semibold text-white">{currentPersona?.name} Closings</h4>
              <p className="text-sm text-gray-400">Customize closing messages for different content types</p>
            </div>
          </div>
          
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-pink-500 to-lime-400 hover:from-pink-600 hover:to-lime-500 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Body Closing */}
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">
              Body Content Closing
            </Label>
            {isEditing ? (
              <Textarea
                value={editData.body}
                onChange={(e) => setEditData(prev => ({ ...prev, body: e.target.value }))}
                className="bg-gray-900/50 border-gray-600 text-white min-h-[80px]"
                placeholder="Closing message for body-related content..."
              />
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                <p className="text-white leading-relaxed">{editData.body}</p>
              </div>
            )}
          </div>

          {/* Nature Closing */}
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">
              Nature Content Closing
            </Label>
            {isEditing ? (
              <Textarea
                value={editData.nature}
                onChange={(e) => setEditData(prev => ({ ...prev, nature: e.target.value }))}
                className="bg-gray-900/50 border-gray-600 text-white min-h-[80px]"
                placeholder="Closing message for nature-related content..."
              />
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                <p className="text-white leading-relaxed">{editData.nature}</p>
              </div>
            )}
          </div>

          {/* Emotions Closing */}
          <div>
            <Label className="text-gray-300 text-sm font-medium mb-2 block">
              Emotions Content Closing
            </Label>
            {isEditing ? (
              <Textarea
                value={editData.emotions}
                onChange={(e) => setEditData(prev => ({ ...prev, emotions: e.target.value }))}
                className="bg-gray-900/50 border-gray-600 text-white min-h-[80px]"
                placeholder="Closing message for emotion-related content..."
              />
            ) : (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                <p className="text-white leading-relaxed">{editData.emotions}</p>
              </div>
            )}
          </div>
        </div>

        {saveError && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {saveError}
          </div>
        )}

        {isEditing && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-gray-600">
            <Button
              onClick={handleSave}
              disabled={isSaving}
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
              onClick={() => {
                setEditData(closingsData[selectedPersona as keyof typeof closingsData]);
                setIsEditing(false);
                setSaveError(null);
              }}
              disabled={isSaving}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
            >
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
