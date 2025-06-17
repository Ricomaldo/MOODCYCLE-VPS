
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X } from "lucide-react";

const journeyOptions = [
  { key: "body_disconnect", label: "Incarnation" },
  { key: "hiding_nature", label: "Déploiement" },
  { key: "emotional_control", label: "Apaisement" }
];

const personas = ["emma", "laure", "sylvie", "christine", "clara"];

// Mock data for journey closings
const mockJourneyClosings = {
  emma: {
    body_disconnect: "Je t'accompagne dans cette reconnexion avec ton corps",
    hiding_nature: "Je t'aide à révéler ta vraie nature féminine",
    emotional_control: "Je te guide vers une relation apaisée avec tes émotions"
  },
  laure: {
    body_disconnect: "Optimise cette connexion corps-esprit pour ta performance",
    hiding_nature: "Révèle ton potentiel authentique au monde",
    emotional_control: "Maîtrise tes émotions comme un atout stratégique"
  },
  sylvie: {
    body_disconnect: "Accueille avec douceur cette sagesse corporelle",
    hiding_nature: "Laisse rayonner ta beauté naturelle unique",
    emotional_control: "Transforme tes émotions en force créatrice"
  },
  christine: {
    body_disconnect: "Honore cette sagesse du corps qui t'habite",
    hiding_nature: "Exprime cette maturité féminine avec fierté",
    emotional_control: "Cultive cette sérénité émotionnelle profonde"
  },
  clara: {
    body_disconnect: "Analyse ces signaux pour optimiser ton bien-être",
    hiding_nature: "Décrypte les patterns de ton authenticité",
    emotional_control: "Comprends la logique de tes réactions émotionnelles"
  }
};

interface JourneyClosingsEditorProps {
  selectedPersona: string;
  onClose: () => void;
}

export function JourneyClosingsEditor({ selectedPersona, onClose }: JourneyClosingsEditorProps) {
  const [selectedJourney, setSelectedJourney] = useState("body_disconnect");
  const [closingsData, setClosingsData] = useState(mockJourneyClosings);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const currentClosing = closingsData[selectedPersona as keyof typeof closingsData]?.[selectedJourney as keyof typeof closingsData.emma] || "";

  const handleEdit = () => {
    setEditText(currentClosing);
    setIsEditing(true);
  };

  const handleSave = () => {
    setClosingsData(prev => ({
      ...prev,
      [selectedPersona]: {
        ...prev[selectedPersona as keyof typeof prev],
        [selectedJourney]: editText
      }
    }));
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Journey Closings Editor</h3>
        <Button onClick={onClose} size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-300 text-sm font-medium mb-2 block">
            Journey
          </Label>
          <Select value={selectedJourney} onValueChange={setSelectedJourney}>
            <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {journeyOptions.map((journey) => (
                <SelectItem key={journey.key} value={journey.key} className="text-white hover:bg-gray-800">
                  {journey.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-gray-300 text-sm font-medium">
              Closing for {selectedPersona} → {journeyOptions.find(j => j.key === selectedJourney)?.label}
            </Label>
            <Button
              onClick={isEditing ? handleSave : handleEdit}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-lime-400 hover:from-pink-600 hover:to-lime-500 text-white"
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </div>

          {isEditing ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="bg-gray-900/50 border-gray-600 text-white min-h-[100px]"
              placeholder="Enter closing message..."
            />
          ) : (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
              <p className="text-white leading-relaxed">{currentClosing}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
