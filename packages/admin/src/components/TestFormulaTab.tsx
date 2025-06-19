import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dice1, Users, RefreshCw } from "lucide-react";
import { useInsightsData } from "@/hooks/useInsightsData";
import { useClosingsData } from "@/hooks/useClosingsData";
import { MobilePreview } from "@/components/MobilePreview";
import { SessionHistory } from "@/components/SessionHistory";
import { useTheme } from "@/contexts/ThemeContext";

const personas = [
  { id: "emma", name: "Emma", color: "from-pink-500 to-rose-400" },
  { id: "laure", name: "Laure", color: "from-purple-500 to-indigo-400" },
  { id: "sylvie", name: "Sylvie", color: "from-blue-500 to-cyan-400" },
  { id: "christine", name: "Christine", color: "from-green-500 to-lime-400" },
  { id: "clara", name: "Clara", color: "from-yellow-500 to-orange-400" }
];

const journeyMapping = {
  body_disconnect: "Incarnation",
  hiding_nature: "Déploiement", 
  emotional_control: "Apaisement"
};

const phases = [
  { id: "menstrual", name: "Phase menstruelle" },
  { id: "follicular", name: "Phase folliculaire" },
  { id: "ovulatory", name: "Phase ovulatoire" },
  { id: "luteal", name: "Phase lutéale" }
];

interface InsightData {
  id: string;
  baseContent: string;
  personaVariants?: Record<string, string>;
  targetJourney?: string[];
  phase: string;
  // ✅ NOUVEAU : Métadonnées pour le type de contenu
  _contentType?: 'variant' | 'base';
  _isPersonalized?: boolean;
}

interface TestSession {
  id: string;
  timestamp: number;
  persona: string;
  testName: string;
  journey: string;
  phase: string;
  insight: InsightData;
}

export function TestFormulaTab() {
  const [selectedPersona, setSelectedPersona] = useState("emma");
  const [testName, setTestName] = useState("");
  const [selectedJourney, setSelectedJourney] = useState("body_disconnect");
  const [selectedPhase, setSelectedPhase] = useState("follicular");
  const [currentInsight, setCurrentInsight] = useState<InsightData | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [sessions, setSessions] = useState<TestSession[]>([]);

  const { insights, loading } = useInsightsData();
  const { closings } = useClosingsData();
  const { isDarkMode } = useTheme();

  // Load sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('testFormulaSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage
  const saveSession = (session: TestSession) => {
    const newSessions = [session, ...sessions.slice(0, 4)]; // Keep last 5
    setSessions(newSessions);
    localStorage.setItem('testFormulaSessions', JSON.stringify(newSessions));
  };

  // Smart randomization - respects persona-journey rules
  const pickRandomInsight = () => {
    if (!insights.length) return;

    // ✅ NOUVEAU : Priorité aux insights avec variantes, fallback sur baseContent
    // Filter insights that match the journey and have variants for the persona
    const eligibleInsightsWithVariants = insights.filter(insight => {
      const hasJourney = insight.targetJourney?.includes(selectedJourney);
      const hasVariant = insight.personaVariants?.[selectedPersona]?.trim();
      const matchesPhase = insight.phase === selectedPhase;
      return hasJourney && hasVariant && matchesPhase;
    });

    // ✅ NOUVEAU : Si pas de variantes, chercher insights avec baseContent
    const eligibleInsightsWithBase = insights.filter(insight => {
      const hasJourney = insight.targetJourney?.includes(selectedJourney);
      const hasBaseContent = insight.baseContent?.trim();
      const matchesPhase = insight.phase === selectedPhase;
      return hasJourney && hasBaseContent && matchesPhase;
    });

    let selectedInsight = null;
    let contentType = 'variant'; // 'variant' ou 'base'

    // Priorité : variantes d'abord, puis base content
    if (eligibleInsightsWithVariants.length > 0) {
      selectedInsight = eligibleInsightsWithVariants[Math.floor(Math.random() * eligibleInsightsWithVariants.length)];
      contentType = 'variant';
    } else if (eligibleInsightsWithBase.length > 0) {
      selectedInsight = eligibleInsightsWithBase[Math.floor(Math.random() * eligibleInsightsWithBase.length)];
      contentType = 'base';
    } else {
      // ✅ NOUVEAU : Fallback final - any insight with base content for the phase
      const fallbackInsights = insights.filter(insight => 
        insight.baseContent?.trim() && insight.phase === selectedPhase
      );
      if (fallbackInsights.length > 0) {
        selectedInsight = fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)];
        contentType = 'base';
      }
    }

    if (selectedInsight) {
      // ✅ NOUVEAU : Ajouter métadonnées sur le type de contenu
      const enrichedInsight = {
        ...selectedInsight,
        _contentType: contentType,
        _isPersonalized: contentType === 'variant'
      };
      
      setCurrentInsight(enrichedInsight);

      // Save session with content type info
      const session: TestSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        persona: selectedPersona,
        testName: testName || `Test ${Date.now()}`,
        journey: selectedJourney,
        phase: selectedPhase,
        insight: enrichedInsight
      };
      saveSession(session);
    }

    setShowComparison(false);
  };

  const comparePersonas = () => {
    if (!currentInsight) {
      pickRandomInsight();
    }
    setShowComparison(true);
  };

  const loadSession = (session: TestSession) => {
    setSelectedPersona(session.persona);
    setTestName(session.testName);
    setSelectedJourney(session.journey);
    setSelectedPhase(session.phase);
    setCurrentInsight(session.insight);
    setShowComparison(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm border rounded-xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Dice1 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Formule de Test</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Terrain de jeu pour comprendre la personnalisation complète</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-2 block`}>
              Persona
            </Label>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className={`${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
                {personas.map(persona => (
                  <SelectItem key={persona.id} value={persona.id} className={`${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-2 block`}>
              Nom du test
            </Label>
            <Input
              placeholder="Optionnel..."
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className={`${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white placeholder:text-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>

          <div>
            <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-2 block`}>
              Parcours
            </Label>
            <Select value={selectedJourney} onValueChange={setSelectedJourney}>
              <SelectTrigger className={`${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
                {Object.entries(journeyMapping).map(([key, label]) => (
                  <SelectItem key={key} value={key} className={`${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-2 block`}>
              Phase
            </Label>
            <Select value={selectedPhase} onValueChange={setSelectedPhase}>
              <SelectTrigger className={`${isDarkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={`${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'}`}>
                {phases.map(phase => (
                  <SelectItem key={phase.id} value={phase.id} className={`${isDarkMode ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
                    {phase.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              onClick={pickRandomInsight}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Dice1 className="w-4 h-4 mr-2" />
              🎲 Piocher conseil aléatoire
            </Button>

          <Button
            onClick={comparePersonas}
            disabled={loading}
            variant="outline"
            className={`${isDarkMode ? 'border-gray-600 text-white hover:bg-gray-800' : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
          >
            <Users className="w-4 h-4 mr-2" />
            👥 Comparer 5 personas
          </Button>

          {currentInsight && (
            <Button
              onClick={() => {
                setCurrentInsight({ ...currentInsight });
                setShowComparison(false);
              }}
              variant="ghost"
              className={`${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              🔄 Actualiser
            </Button>
          )}
          </div>
          
          {/* ✅ NOUVEAU : Message informatif sur le contenu de base */}
          <div className={`${isDarkMode ? 'bg-amber-900/20 border-amber-500/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'} border rounded-lg p-3 text-sm`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">ℹ️</span>
              <div>
                <p className="font-medium">Mode fallback activé</p>
                <p className="text-xs opacity-80">
                  Tant que les variantes personas ne sont pas créées, l'aperçu utilise le contenu de base (baseContent) des insights.
                  Créez des variantes dans l'onglet "Variantes Personas" pour tester le contenu personnalisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Area */}
        <div className="lg:col-span-2">
          <MobilePreview
            insight={currentInsight}
            selectedPersona={selectedPersona}
            selectedJourney={selectedJourney}
            showComparison={showComparison}
            closings={closings}
          />
        </div>

        {/* Session History */}
        <div>
          <SessionHistory
            sessions={sessions}
            onLoadSession={loadSession}
            onClearHistory={() => {
              setSessions([]);
              localStorage.removeItem('testFormulaSessions');
            }}
          />
        </div>
      </div>
    </div>
  );
}
