
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const personas = [
  { id: "emma", name: "Emma", color: "from-pink-500 to-rose-400", avatar: "/images/avatars/Emma.jpg" },
  { id: "laure", name: "Laure", color: "from-purple-500 to-indigo-400", avatar: "/images/avatars/Laure.jpg" },
  { id: "sylvie", name: "Sylvie", color: "from-blue-500 to-cyan-400", avatar: "/images/avatars/Sylvie.jpg" },
  { id: "christine", name: "Christine", color: "from-green-500 to-lime-400", avatar: "/images/avatars/Christine.jpg" },
  { id: "clara", name: "Clara", color: "from-yellow-500 to-orange-400", avatar: "/images/avatars/Clara.jpg" }
];

const journeyMapping = {
  body_disconnect: "Incarnation",
  hiding_nature: "Déploiement", 
  emotional_control: "Apaisement"
};

const contextTexts = {
  body_disconnect: "Profite de cette montée d'énergie pour canaliser positivement tes émotions,",
  hiding_nature: "Cette phase d'introspection t'invite à explorer tes ressentis profonds,",
  emotional_control: "L'harmonie de cette période te permet de cultiver ta sérénité,"
};

interface InsightData {
  id: string;
  baseContent: string;
  personaVariants?: Record<string, string>;
  phase?: string;
  jezaApproval?: number;
  // ✅ NOUVEAU : Métadonnées pour le type de contenu
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

export function MobilePreview({ insight, selectedPersona, selectedJourney, showComparison, closings }: MobilePreviewProps) {
  const renderPersonaCard = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId);
    if (!persona || !insight) return null;

    const contextText = contextTexts[selectedJourney as keyof typeof contextTexts] || "";
    // ✅ NOUVEAU : Détecter si on utilise variant ou base content
    const hasPersonaVariant = insight.personaVariants?.[personaId]?.trim();
    const insightVariant = hasPersonaVariant || insight.baseContent;
    const isUsingBaseContent = !hasPersonaVariant;
    const closing = closings?.[personaId]?.[selectedJourney] || "Je t'accompagne dans cette découverte";

    const fullMessage = `${contextText} ${persona.name} 💜 ${insightVariant} ${closing}`;

    return (
      <div key={personaId} className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-sm mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-50 p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Bonjour {persona.name}</h3>
          <p className="text-sm text-gray-600">Jour 8 • Phase {insight?.phase || 'folliculaire'}</p>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-8 mb-4">
          <div className={`p-1 bg-gradient-to-r ${persona.color} rounded-full`}>
            <Avatar className="w-16 h-16 border-4 border-white">
              <AvatarImage src={persona.avatar} />
              <AvatarFallback className="bg-gray-200 text-gray-800">
                {persona.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="px-4 pb-6">
          <div className={`bg-gradient-to-r ${persona.color} bg-opacity-10 border-l-4 border-gradient-to-b ${persona.color.replace('from-', 'border-').replace(' to-rose-400', '').replace(' to-indigo-400', '').replace(' to-cyan-400', '').replace(' to-lime-400', '').replace(' to-orange-400', '')} rounded-2xl p-4`}>
            <p className="text-gray-800 leading-relaxed text-sm">
              {fullMessage}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 capitalize">Phase {insight?.phase}</span>
                {/* ✅ NOUVEAU : Badge pour indiquer le type de contenu */}
                {isUsingBaseContent && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0 text-amber-600 border-amber-400 bg-amber-50"
                  >
                    ⚠️ Base
                  </Badge>
                )}
                {!isUsingBaseContent && (
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0 text-green-600 border-green-400 bg-green-50"
                  >
                    ✅ Varianté
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-4 pb-4">
          <button className={`w-full bg-gradient-to-r ${persona.color} text-white py-3 rounded-2xl font-medium text-sm shadow-lg hover:shadow-xl transition-shadow`}>
            Discuter avec Mélune
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-50 p-4 flex justify-around text-center">
          <div className="text-pink-500">
            <div className="text-lg">🏠</div>
            <div className="text-xs text-gray-600">Accueil</div>
          </div>
          <div className="text-gray-400">
            <div className="text-lg">⚪</div>
            <div className="text-xs text-gray-600">Cycle</div>
          </div>
          <div className="text-gray-400">
            <div className="text-lg">💬</div>
            <div className="text-xs text-gray-600">Mélune</div>
          </div>
          <div className="text-gray-400">
            <div className="text-lg">📖</div>
            <div className="text-xs text-gray-600">Carnet</div>
          </div>
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
            Jeza Score: {insight.jezaApproval || 'N/A'}
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {showComparison ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {personas.map(persona => renderPersonaCard(persona.id))}
          </div>
        ) : (
          <div className="flex justify-center">
            {renderPersonaCard(selectedPersona)}
          </div>
        )}
      </div>

      {/* Formula Breakdown */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300">Composition de la formule :</h4>
          {/* ✅ NOUVEAU : Badge global pour le type de contenu */}
          {insight._contentType === 'base' ? (
            <Badge 
              variant="outline" 
              className="text-xs px-3 py-1 text-amber-400 border-amber-500 bg-amber-900/20"
            >
              ⚠️ Contenu de base utilisé
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
        <div className="space-y-2 text-xs text-gray-400">
          <div><strong>Contexte :</strong> {contextTexts[selectedJourney as keyof typeof contextTexts]}</div>
          <div><strong>Prénom :</strong> {personas.find(p => p.id === selectedPersona)?.name} 💜</div>
          <div>
            <strong>Insight :</strong> {insight.personaVariants?.[selectedPersona] || insight.baseContent}
            {/* ✅ NOUVEAU : Indication du type de contenu utilisé */}
            {insight._contentType === 'base' && (
              <span className="ml-2 text-amber-400 text-xs">(⚠️ baseContent utilisé)</span>
            )}
            {insight._contentType === 'variant' && (
              <span className="ml-2 text-green-400 text-xs">(✅ variant {selectedPersona})</span>
            )}
          </div>
          <div><strong>Closing :</strong> {closings?.[selectedPersona]?.[selectedJourney] || "Je t'accompagne dans cette découverte"}</div>
        </div>
      </div>
    </div>
  );
}
