
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useInsightsData } from "@/hooks/useInsightsData";

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

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaChange: (persona: string) => void;
}

export function PersonaSelector({ selectedPersona, onPersonaChange }: PersonaSelectorProps) {
  const { getPersonaProgress, loading } = useInsightsData();

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Select Persona</h3>
      
      <div className="space-y-4">
        {personas.map((persona) => {
          const progress = loading ? 0 : getPersonaProgress(persona.id);
          
          return (
            <div
              key={persona.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedPersona === persona.id
                  ? `bg-gradient-to-r ${persona.color} bg-opacity-20 border-pink-500/50`
                  : 'bg-gray-800/30 border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => onPersonaChange(persona.id)}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={persona.avatar} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {persona.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{persona.name}</h4>
                  <p className="text-sm text-gray-400">
                    {loading ? 'Loading...' : `${progress}% complete`}
                  </p>
                </div>
              </div>
              
              <Progress 
                value={progress} 
                className="h-2 bg-gray-700"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
