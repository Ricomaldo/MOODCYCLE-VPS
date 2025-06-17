
import { Label } from "@/components/ui/label";
import { journeyMapping } from "@/utils/mappingTranslate";
import { useTheme } from "@/contexts/ThemeContext";

interface JourneySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  disabled?: boolean;
}

export function JourneySelector({ value = [], onChange, className, disabled = false }: JourneySelectorProps) {
  const { isDarkMode } = useTheme();

  const handleToggle = (journeyKey: string) => {
    if (disabled) return;
    
    const newValue = value.includes(journeyKey)
      ? value.filter(v => v !== journeyKey)
      : [...value, journeyKey];
    
    onChange(newValue);
  };

  return (
    <div className={className}>
      <Label className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-medium mb-3 block`}>
        Parcours (important)
      </Label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(journeyMapping).map(([key, label]) => {
          const isSelected = value.includes(key);
          
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleToggle(key)}
              disabled={disabled}
              className={`
                px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer transform hover:scale-105'
                }
                ${isSelected
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-pink-500/20 to-lime-400/20 border-pink-500/50 text-pink-300 shadow-lg shadow-pink-500/20'
                    : 'bg-gradient-to-r from-pink-500/10 to-lime-400/10 border-pink-500/40 text-pink-600 shadow-md'
                  : isDarkMode
                    ? 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50 hover:text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900'
                }
                ${!disabled && !isSelected ? 'hover:shadow-md' : ''}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
      {value.length > 0 && (
        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {value.length} parcours sélectionné{value.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
