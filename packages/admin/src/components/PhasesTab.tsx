import { useState } from "react";
import { PhaseEditor } from "@/components/PhaseEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

const phases = [
  { 
    id: 'menstrual', 
    name: 'Menstruelle', 
    color: '#E53935',
    symbol: '🌙',
    element: 'Eau',
    archetype: 'La Sage',
    energy: 'Introspection',
    duration: 'Jours 1-5'
  },
  { 
    id: 'follicular', 
    name: 'Folliculaire', 
    color: '#4CAF50',
    symbol: '🌱',
    element: 'Air',
    archetype: 'La Jeune Fille',
    energy: 'Renaissance',
    duration: 'Jours 6-13'
  },
  { 
    id: 'ovulatory', 
    name: 'Ovulatoire', 
    color: '#FF9800',
    symbol: '☀️',
    element: 'Feu',
    archetype: 'La Mère',
    energy: 'Rayonnement',
    duration: 'Jours 14-20'
  },
  { 
    id: 'luteal', 
    name: 'Lutéale', 
    color: '#9C27B0',
    symbol: '🍂',
    element: 'Terre',
    archetype: 'L\'Enchanteresse',
    energy: 'Transformation',
    duration: 'Jours 21-28'
  }
];

export function PhasesTab() {
  const [selectedPhase, setSelectedPhase] = useState('menstrual');
  const { isDarkMode } = useTheme();

  const handlePhaseChange = (phaseId: string) => {
    console.log('Phase sélectionnée:', phaseId);
    setSelectedPhase(phaseId);
  };

  const selectedPhaseData = phases.find(phase => phase.id === selectedPhase);

  return (
    <div className="space-y-6">
      {/* Phase Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {phases.map((phase) => (
          <Button
            key={phase.id}
            onClick={() => handlePhaseChange(phase.id)}
            variant={selectedPhase === phase.id ? "default" : "outline"}
            className={`${
              selectedPhase === phase.id
                ? 'bg-gradient-to-r from-pink-500 to-lime-400 text-white shadow-lg scale-105'
                : `${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
            } flex flex-col items-center gap-2 p-4 h-auto transition-all duration-200 hover:scale-102`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: phase.color }}
              />
              <span className="text-2xl">{phase.symbol}</span>
            </div>
            <div className="text-center">
              <div className="font-medium text-sm">{phase.name}</div>
              <div className="text-xs opacity-75 mt-1">{phase.duration}</div>
              <div className="text-xs opacity-60">{phase.element} • {phase.energy}</div>
            </div>
          </Button>
        ))}
      </div>

      {/* Phase Info Card */}
      {selectedPhaseData && (
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                style={{ 
                  backgroundColor: selectedPhaseData.color + '20', 
                  border: `3px solid ${selectedPhaseData.color}`,
                  boxShadow: `0 0 20px ${selectedPhaseData.color}40`
                }}
              >
                {selectedPhaseData.symbol}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Phase {selectedPhaseData.name}
                </h2>
                <p className="text-lg text-gray-300 mb-2">
                  {selectedPhaseData.archetype}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>🕒 {selectedPhaseData.duration}</span>
                  <span>🌟 Élément {selectedPhaseData.element}</span>
                  <span>⚡ {selectedPhaseData.energy}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase Editor */}
      <PhaseEditor phaseId={selectedPhase} />
    </div>
  );
}
