
import { useState } from "react";
import { PhaseEditor } from "@/components/PhaseEditor";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const phases = [
  { id: 'menstrual', name: 'Menstruelle', color: '#F44336' },
  { id: 'follicular', name: 'Folliculaire', color: '#FFC107' },
  { id: 'ovulatory', name: 'Ovulatoire', color: '#00BCD4' },
  { id: 'luteal', name: 'Lutéale', color: '#673AB7' }
];

export function PhasesTab() {
  const [selectedPhase, setSelectedPhase] = useState('menstrual');
  const { isDarkMode } = useTheme();

  const handlePhaseChange = (phaseId: string) => {
    console.log('Phase sélectionnée:', phaseId);
    setSelectedPhase(phaseId);
  };

  return (
    <div className="space-y-6">

        <div className="flex gap-2 mb-6 justify-center">
          {phases.map((phase) => (
            <Button
              key={phase.id}
              onClick={() => handlePhaseChange(phase.id)}
              variant={selectedPhase === phase.id ? "default" : "outline"}
              className={`${
                selectedPhase === phase.id
                  ? 'bg-gradient-to-r from-pink-500 to-lime-400 text-white'
                  : `${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
              } flex items-center gap-2`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: phase.color }}
              ></div>
              {phase.name}
            </Button>
          ))}
        </div>


      <PhaseEditor phaseId={selectedPhase} />
    </div>
  );
}
