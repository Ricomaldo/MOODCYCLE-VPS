
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const moonLabels = [
  "Nuit noire",
  "Veille lunaire", 
  "Croissant secret",
  "Révélation",
  "Éveil total"
];

const moonEmojis = ["🌑", "🌘", "🌗", "🌕", "🌝"];

interface JezaScoreSelectorProps {
  value: number;
  onChange: (score: number) => void;
  className?: string;
  disabled?: boolean;
}

export function JezaScoreSelector({ value, onChange, className, disabled = false }: JezaScoreSelectorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    if (!disabled) {
      onChange(index + 1);
    }
  };

  const getDisplayIndex = () => {
    return hoveredIndex !== null ? hoveredIndex : Math.max(0, value - 1);
  };

  return (
    <div className={className}>
      <div className="text-gray-300 text-sm font-medium mb-2">
        Jeza Score ({value}/5)
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((index) => {
            const isActive = index <= getDisplayIndex();
            const isSelected = index < value;
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center text-lg ${
                      isActive 
                        ? 'border-gray-500 bg-gray-700/50' 
                        : 'border-gray-600 bg-gray-800/30'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700/70 cursor-pointer'}`}
                    onClick={() => handleClick(index)}
                    onMouseEnter={disabled ? undefined : () => setHoveredIndex(index)}
                    onMouseLeave={disabled ? undefined : () => setHoveredIndex(null)}
                    disabled={disabled}
                  >
                    {isActive ? moonEmojis[index] : "•"}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 border-gray-600 text-white">
                  <p>{moonLabels[index]}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
