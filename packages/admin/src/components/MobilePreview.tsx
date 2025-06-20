import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Configuration des thèmes et couleurs par phase
const phaseTheme = {
  menstrual: {
    bg: '#DC2626', // Rouge profond
    textColor: '#FFFFFF',
    captionColor: 'rgba(255, 255, 255, 0.8)',
    gradientFrom: 'from-red-600',
    gradientTo: 'to-red-500'
  },
  follicular: {
    bg: '#059669', // Vert émeraude
    textColor: '#FFFFFF', 
    captionColor: 'rgba(255, 255, 255, 0.8)',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-emerald-500'
  },
  ovulatory: {
    bg: '#D97706', // Orange chaleureux
    textColor: '#FFFFFF',
    captionColor: 'rgba(255, 255, 255, 0.8)',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-amber-500'
  },
  luteal: {
    bg: '#7C3AED', // Violet profond
    textColor: '#FFFFFF',
    captionColor: 'rgba(255, 255, 255, 0.8)',
    gradientFrom: 'from-violet-600',
    gradientTo: 'to-violet-500'
  }
};

const personas = [
  { id: "emma", name: "Emma", avatar: "/images/avatars/Emma.jpg" },
  { id: "laure", name: "Laure", avatar: "/images/avatars/Laure.jpg" },
  { id: "sylvie", name: "Sylvie", avatar: "/images/avatars/Sylvie.jpg" },
  { id: "christine", name: "Christine", avatar: "/images/avatars/Christine.jpg" },
  { id: "clara", name: "Clara", avatar: "/images/avatars/Clara.jpg" }
];

const journeyMapping = {
  body_disconnect: "Incarnation",
  hiding_nature: "Déploiement", 
  emotional_control: "Apaisement"
};

interface InsightData {
  id: string;
  baseContent: string;
  personaVariants?: Record<string, string>;
  phase?: string;
  jezaApproval?: number;
  _contentType?: 'variant' | 'base';
  _isPersonalized?: boolean;
}

interface ClosingsData {
  [personaId: string]: {
    [journey: string]: string;
  };
}

interface MobilePreviewProps {
  insight: InsightData | null;
  selectedPersona: string;
  selectedJourney: string;
  showComparison: boolean;
  closings: ClosingsData;
}

// Composant InsightCard simplifié - juste la carte avec le conseil
function InsightCard({ insight, persona, phase = 'follicular', closing }: {
  insight: string;
  persona: { id: string; name: string; avatar: string };
  phase: string;
  closing: string;
}) {
  const theme = phaseTheme[phase as keyof typeof phaseTheme] || phaseTheme.follicular;

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Juste le message - formule InsightsEngine */}
      <div className="p-6">
        <div 
          className="rounded-2xl p-6 shadow-inner"
          style={{ backgroundColor: theme.bg }}
        >
          <p 
            className="text-base leading-relaxed text-center"
            style={{ color: theme.textColor }}
          >
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}

export function MobilePreview({ insight, selectedPersona, selectedJourney, showComparison, closings }: MobilePreviewProps) {
  // Intros de phases enrichies
  const phaseIntros = {
    menstrual: "Tu es dans ta phase menstruelle, temps sacré de régénération et d'introspection.",
    follicular: "Tu entres dans ta phase folliculaire, période de renouveau et de créativité.",
    ovulatory: "Tu rayonnes dans ta phase d'ovulation, moment de pleine puissance féminine.",
    luteal: "Tu traverses ta phase lutéale, temps de maturation et de sagesse intérieure."
  };

  const renderPersonaCard = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    if (!persona || !insight) return null;

    // 🎯 VRAIE FORMULE d'après InsightsEngine.js
    const hasPersonaVariant = insight.personaVariants?.[personaId]?.trim();
    const baseVariant = hasPersonaVariant || insight.baseContent;
    const isUsingBaseContent = !hasPersonaVariant;
    
    const phase = insight.phase || 'follicular';
    const phaseIntro = phaseIntros[phase as keyof typeof phaseIntros] || "";
    
    // Formule complète : phase + prenom + baseVariant + closing
    const prenom = persona.name;
    const personalizedClosing = closings?.[personaId]?.[selectedJourney] || "Je t'accompagne dans cette découverte ✨";
    
    // Reproduction de la logique enrichInsightWithContext complète
    let finalMessage = `${phaseIntro} ${prenom}, ${baseVariant}`;
    if (personalizedClosing) {
      finalMessage += ` ${personalizedClosing}`;
    }

    return (
      <div key={personaId} className="relative">
        <InsightCard
          insight={finalMessage}
          persona={persona}
          phase={phase}
          closing="" // Le closing est déjà inclus dans finalMessage
        />
        
        {/* Badge de statut */}
        <div className="absolute top-2 right-2">
          {isUsingBaseContent ? (
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-1 text-amber-600 border-amber-400 bg-white/90 shadow-sm"
            >
              ⚠️ Base
            </Badge>
          ) : (
            <Badge 
              variant="outline" 
              className="text-xs px-2 py-1 text-green-600 border-green-400 bg-white/90 shadow-sm"
            >
              ✅ Personnalisé
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (!insight) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-lg font-semibold text-white mb-2">Aperçu Mobile</h3>
        <p className="text-gray-400">
          Cliquez sur "Piocher insight aléatoire" pour voir le rendu dans l'app
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Aperçu Mobile</h3>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            {journeyMapping[selectedJourney as keyof typeof journeyMapping]}
          </Badge>
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            Phase: {insight.phase || 'follicular'}
          </Badge>
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            Jeza: {insight.jezaApproval || 'N/A'}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {showComparison ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
            {personas.map(persona => renderPersonaCard(persona.id))}
          </div>
        ) : (
          <div className="flex justify-center">
            {renderPersonaCard(selectedPersona)}
          </div>
        )}
      </div>

      {/* Résumé simplifié */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300">Formule InsightsEngine :</h4>
          <div className="flex gap-2">
            {insight._contentType === 'base' ? (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 text-amber-400 border-amber-500 bg-amber-900/20"
              >
                ⚠️ baseContent
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 text-green-400 border-green-500 bg-green-900/20"
              >
                ✅ personaVariants[{selectedPersona}]
              </Badge>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <div><strong>Phase Intro :</strong> {phaseIntros[(insight.phase || 'follicular') as keyof typeof phaseIntros]}</div>
          <div><strong>Prénom :</strong> {personas.find(p => p.id === selectedPersona)?.name}</div>
          <div><strong>Base Variant :</strong> {insight.personaVariants?.[selectedPersona] || insight.baseContent}</div>
          <div><strong>Closing :</strong> {closings?.[selectedPersona]?.[selectedJourney] || "Je t'accompagne dans cette découverte ✨"}</div>
          <div className="pt-2 border-t border-gray-600">
            <strong>Résultat :</strong> "{phaseIntros[(insight.phase || 'follicular') as keyof typeof phaseIntros]} {personas.find(p => p.id === selectedPersona)?.name}, {insight.personaVariants?.[selectedPersona] || insight.baseContent} {closings?.[selectedPersona]?.[selectedJourney] || "Je t'accompagne dans cette découverte ✨"}"
          </div>
        </div>
      </div>
    </div>
  );
}
