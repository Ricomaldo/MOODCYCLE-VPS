import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useVignettesData } from "@/hooks/useVignettesData";
import { useTheme } from "@/contexts/ThemeContext";
import { type Vignette } from "@/services/api";
import { Trash2, Plus } from "lucide-react";

export function VignettesTab() {
  const [selectedPhase, setSelectedPhase] = useState<string>("");
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [currentVignettes, setCurrentVignettes] = useState<Vignette[]>([]);
  const [saving, setSaving] = useState(false);
  
  const { vignettes, loadVignettesForPhaseAndPersona, saveVignettes } = useVignettesData();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();

  const phases = [
    { id: "menstrual", name: "Menstruelle" },
    { id: "follicular", name: "Folliculaire" },
    { id: "ovulatory", name: "Ovulatoire" },
    { id: "luteal", name: "Lutéale" }
  ];

  const personas = [
    { id: "clara", name: "Clara - L'Aventurière" },
    { id: "emma", name: "Emma - L'Organisée" },
    { id: "laure", name: "Laure - L'Empathique" },
    { id: "sylvie", name: "Sylvie - La Pragmatique" },
    { id: "christine", name: "Christine - La Spirituelle" }
  ];

  const actionTypes = [
    { id: "chat", name: "Chat" },
    { id: "notebook", name: "Journal" },
    { id: "phase_detail", name: "Détail phase" }
  ];

  // Charger les vignettes quand phase et persona changent
  useEffect(() => {
    if (selectedPhase && selectedPersona) {
      loadVignettesData();
    }
  }, [selectedPhase, selectedPersona]);

  const loadVignettesData = async () => {
    if (!selectedPhase || !selectedPersona) return;
    
    try {
      const vignettesList = await loadVignettesForPhaseAndPersona(selectedPhase, selectedPersona);
      setCurrentVignettes(vignettesList || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les vignettes",
        variant: "destructive",
      });
    }
  };

  const handleVignetteChange = (index: number, field: keyof Vignette, value: string) => {
    const newVignettes = [...currentVignettes];
    newVignettes[index] = {
      ...newVignettes[index],
      [field]: value
    };
    setCurrentVignettes(newVignettes);
  };

  const addVignette = () => {
    const newId = `${selectedPhase}_${selectedPersona}_${Date.now()}`;
    const newVignette: Vignette = {
      id: newId,
      icon: "💡",
      title: "",
      action: "chat",
      prompt: "",
      category: "general"
    };
    setCurrentVignettes([...currentVignettes, newVignette]);
  };

  const removeVignette = (index: number) => {
    const newVignettes = currentVignettes.filter((_, i) => i !== index);
    setCurrentVignettes(newVignettes);
  };

  const handleSave = async () => {
    if (!selectedPhase || !selectedPersona) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une phase et une persona",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      // Filtrer les vignettes avec un titre vide
      const filteredVignettes = currentVignettes.filter(v => v.title.trim() !== "");
      
      const updatedVignettes = {
        ...vignettes,
        [selectedPhase]: {
          ...vignettes[selectedPhase],
          [selectedPersona]: filteredVignettes
        }
      };

      await saveVignettes(updatedVignettes);
      
      toast({
        title: "Succès",
        description: `Vignettes sauvegardées pour ${phases.find(p => p.id === selectedPhase)?.name} - ${personas.find(p => p.id === selectedPersona)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur", 
        description: "Impossible de sauvegarder les vignettes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardHeader>
          <CardTitle className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Gestion des Vignettes
          </CardTitle>
          <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Éditez les vignettes d'actions pour chaque phase et persona
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélecteurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phase du cycle
              </label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                  <SelectValue placeholder="Sélectionner une phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Persona
              </label>
              <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                <SelectTrigger className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                  <SelectValue placeholder="Sélectionner une persona" />
                </SelectTrigger>
                <SelectContent>
                  {personas.map((persona) => (
                    <SelectItem key={persona.id} value={persona.id}>
                      {persona.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Éditeur de vignettes */}
          {selectedPhase && selectedPersona && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Vignettes pour {phases.find(p => p.id === selectedPhase)?.name} - {personas.find(p => p.id === selectedPersona)?.name}
                </h3>
                <Button onClick={addVignette} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter vignette
                </Button>
              </div>

              <div className="space-y-6">
                {currentVignettes.map((vignette, index) => (
                  <Card key={vignette.id} className={`p-4 ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Icône
                        </label>
                        <Input
                          value={vignette.icon}
                          onChange={(e) => handleVignetteChange(index, 'icon', e.target.value)}
                          placeholder="💡"
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Titre
                        </label>
                        <Input
                          value={vignette.title}
                          onChange={(e) => handleVignetteChange(index, 'title', e.target.value)}
                          placeholder="Titre de la vignette"
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Action
                        </label>
                        <Select value={vignette.action} onValueChange={(value) => handleVignetteChange(index, 'action', value)}>
                          <SelectTrigger className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((action) => (
                              <SelectItem key={action.id} value={action.id}>
                                {action.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Catégorie
                        </label>
                        <Input
                          value={vignette.category}
                          onChange={(e) => handleVignetteChange(index, 'category', e.target.value)}
                          placeholder="emotions, body, cycle..."
                          className={`${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Prompt/Message
                        </label>
                        <Textarea
                          value={vignette.prompt || ""}
                          onChange={(e) => handleVignetteChange(index, 'prompt', e.target.value)}
                          placeholder="Prompt à envoyer ou message à afficher..."
                          className={`min-h-[80px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          onClick={() => removeVignette(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                {currentVignettes.length === 0 && (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Aucune vignette pour cette combinaison phase/persona.
                    <br />
                    Cliquez sur "Ajouter vignette" pour commencer.
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-pink-500 to-lime-400 hover:from-pink-600 hover:to-lime-500"
                >
                  {saving ? "Sauvegarde..." : "Sauvegarder les vignettes"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}