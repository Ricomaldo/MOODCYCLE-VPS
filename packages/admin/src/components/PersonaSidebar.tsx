
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

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

interface PersonaSidebarProps {
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
  getPersonaProgress: (persona: string) => number;
  loading: boolean;
}

export function PersonaSidebar({ selectedPersona, onPersonaChange, getPersonaProgress, loading }: PersonaSidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-gray-800/50 backdrop-blur-sm border-b lg:border-r lg:border-b-0 border-gray-700 flex flex-col">
      {/* <div className="p-4 lg:p-6 border-b border-gray-700">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-2">Personas</h3>
        <p className="text-xs lg:text-sm text-gray-400">Sélectionnez une persona pour éditer</p>
      </div> */}
      
      {/* Mobile: Horizontal scrolling list */}
      <div className="lg:hidden overflow-x-auto p-4">
        <div className="flex gap-3 min-w-max">
          {personas.map((persona) => {
            const progress = loading ? 0 : getPersonaProgress(persona.id);
            const isSelected = selectedPersona === persona.id;
            
            return (
              <div
                key={persona.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 min-w-[120px] ${
                  isSelected
                    ? `bg-gradient-to-r ${persona.color} bg-opacity-20 border-pink-500/50`
                    : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => onPersonaChange(persona.id)}
              >
                <div className="flex flex-col items-center gap-2 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={persona.avatar} />
                    <AvatarFallback className="bg-gray-700 text-white text-sm">
                      {persona.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h4 className="font-medium text-white text-sm">{persona.name}</h4>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs text-gray-400">
                        {loading ? 'Loading...' : `${progress}%`}
                      </span>
                      {progress === 100 && (
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={progress} 
                  className="h-2 bg-gray-700"
                />
                
                {isSelected && (
                  <div className="mt-2 text-xs text-pink-300 text-center">
                    • Active
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Vertical list */}
      <div className="hidden lg:block flex-1 overflow-auto p-4 space-y-3">
        {personas.map((persona) => {
          const progress = loading ? 0 : getPersonaProgress(persona.id);
          const isSelected = selectedPersona === persona.id;
          
          return (
            <div
              key={persona.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 touch-manipulation ${
                isSelected
                  ? `bg-gradient-to-r ${persona.color} bg-opacity-20 border-pink-500/50`
                  : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onPersonaChange(persona.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={persona.avatar} />
                  <AvatarFallback className="bg-gray-700 text-white text-sm">
                    {persona.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{persona.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {loading ? 'Chargement...' : `${progress}%`}
                    </span>
                    {progress === 100 && (
                      <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Progress 
                value={progress} 
                className="h-2 bg-gray-700"
              />
              
              {isSelected && (
                <div className="mt-2 text-xs text-pink-300">
                  • Persona active
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* <div className="p-4 border-t border-gray-700 hidden lg:block">
        <div className="text-xs text-gray-400">
          <p>Raccourcis clavier :</p>
          <p>• Ctrl+S : Sauvegarder</p>
          <p>• Ctrl+→ : Conseil suivant</p>
          <p>• Ctrl+← : Conseil précédent</p>
        </div>
      </div> */}
    </div>
  );
}
