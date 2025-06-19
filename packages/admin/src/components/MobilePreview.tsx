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

// Composant InsightCard simplifié inspiré de React Native
function InsightCard({ insight, persona, phase = 'follicular', closing }: {
  insight: string;
  persona: { id: string; name: string; avatar: string };
  phase: string;
  closing: string;
}) {
  const theme = phaseTheme[phase as keyof typeof phaseTheme] || phaseTheme.follicular;

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header avec nom et phase */}
      <div 
        className="p-6 text-center"
        style={{ backgroundColor: theme.bg }}
      >
        <div className="flex justify-center mb-3">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarImage src={persona.avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-800">
              {persona.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 
          className="text-lg font-semibold mb-1"
          style={{ color: theme.textColor }}
        >
          Bonjour {persona.name} 💜
        </h3>
        <p 
          className="text-sm"
          style={{ color: theme.captionColor }}
        >
          Phase {phase}
        </p>
      </div>

      {/* Insight Card */}
      <div className="p-6">
        <div 
          className="rounded-2xl p-4 shadow-inner"
          style={{ backgroundColor: theme.bg }}
        >
          <p 
            className="text-sm leading-relaxed mb-3"
            style={{ color: theme.textColor }}
          >
            {insight}
          </p>
          <p 
            className="text-sm"
            style={{ color: theme.textColor }}
          >
            {closing}
          </p>
          <div className="flex justify-end mt-3">
            <span 
              className="text-xs"
              style={{ color: theme.captionColor }}
            >
              Phase {phase}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 pb-6">
        <button 
          className={`w-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} text-white py-3 rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transition-shadow`}
        >
          Discuter avec Mélune
        </button>
      </div>
    </div>
  );
}

export function MobilePreview({ insight, selectedPersona, selectedJourney, showComparison, closings }: MobilePreviewProps) {
  const renderPersonaCard = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    if (!persona || !insight) return null;

    const hasPersonaVariant = insight.personaVariants?.[personaId]?.trim();
    const insightText = hasPersonaVariant || insight.baseContent;
    const isUsingBaseContent = !hasPersonaVariant;
    const closing = closings?.[personaId]?.[selectedJourney] || "Je t'accompagne dans cette découverte ✨";
    const phase = insight.phase || 'follicular';

    return (
      <div key={personaId} className="relative">
        <InsightCard
          insight={insightText}
          persona={persona}
          phase={phase}
          closing={closing}
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
          <h4 className="text-sm font-medium text-gray-300">Résumé :</h4>
          <div className="flex gap-2">
            {insight._contentType === 'base' ? (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 text-amber-400 border-amber-500 bg-amber-900/20"
              >
                ⚠️ Contenu de base
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="text-xs px-3 py-1 text-green-400 border-green-500 bg-green-900/20"
              >
                ✅ Contenu personnalisé
              </Badge>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          <strong>Phase :</strong> {insight.phase || 'follicular'} • 
          <strong> Journey :</strong> {journeyMapping[selectedJourney as keyof typeof journeyMapping]} • 
          <strong> Score Jeza :</strong> {insight.jezaApproval || 'N/A'}
        </div>
      </div>
    </div>
  );
}
