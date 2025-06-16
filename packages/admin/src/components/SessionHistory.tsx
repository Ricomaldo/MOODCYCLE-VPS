
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Clock, User, Map, Calendar } from "lucide-react";

const personas = [
  { id: "emma", name: "Emma" },
  { id: "laure", name: "Laure" },
  { id: "sylvie", name: "Sylvie" },
  { id: "christine", name: "Christine" },
  { id: "clara", name: "Clara" }
];

const journeyMapping = {
  body_disconnect: "Incarnation",
  hiding_nature: "Déploiement", 
  emotional_control: "Apaisement"
};

interface SessionHistoryProps {
  sessions: Array<{
    id: string;
    timestamp: number;
    persona: string;
    testName: string;
    journey: string;
    phase: string;
    insight: any;
  }>;
  onLoadSession: (session: any) => void;
  onClearHistory: () => void;
}

export function SessionHistory({ sessions, onLoadSession, onClearHistory }: SessionHistoryProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    if (minutes < 1440) return `Il y a ${Math.floor(minutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Historique</h3>
        {sessions.length > 0 && (
          <Button
            onClick={onClearHistory}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Aucun test récent</p>
          </div>
        ) : (
          sessions.map((session) => {
            const persona = personas.find(p => p.id === session.persona);
            
            return (
              <div
                key={session.id}
                className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors"
                onClick={() => onLoadSession(session)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-sm truncate">
                    {session.testName}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatTime(session.timestamp)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{persona?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Map className="w-3 h-3" />
                    <span>{journeyMapping[session.journey as keyof typeof journeyMapping]}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="capitalize">{session.phase}</span>
                  </div>
                </div>

                {session.insight && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {session.insight.personaVariants?.[session.persona] || session.insight.baseContent}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {sessions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            🔄 Derniers {sessions.length} tests • Stockage local
          </p>
        </div>
      )}
    </div>
  );
}
