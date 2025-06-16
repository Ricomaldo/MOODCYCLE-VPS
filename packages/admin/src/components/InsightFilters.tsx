
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InsightFiltersProps {
  filters: {
    phase: string;
    tone: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function InsightFilters({ filters, onFiltersChange }: InsightFiltersProps) {
  const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
  const tones = ['friendly', 'professional', 'inspiring'];
  const statuses = ['validated', 'enriched', 'draft'];

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      phase: '',
      tone: '',
      status: ''
    });
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-gray-300 text-sm whitespace-nowrap">Phase:</Label>
        <Select value={filters.phase || 'all'} onValueChange={(value) => updateFilter('phase', value)}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white w-32">
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
            <SelectItem value="all">Toutes</SelectItem>
            {phases.map((phase) => (
              <SelectItem key={phase} value={phase} className="text-white hover:bg-gray-800">
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-gray-300 text-sm whitespace-nowrap">Ton:</Label>
        <Select value={filters.tone || 'all'} onValueChange={(value) => updateFilter('tone', value)}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white w-32">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
            <SelectItem value="all">Tous</SelectItem>
            {tones.map((tone) => (
              <SelectItem key={tone} value={tone} className="text-white hover:bg-gray-800">
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div className="flex items-center gap-2">
        <Label className="text-gray-300 text-sm whitespace-nowrap">Statut:</Label>
        <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger className="bg-gray-900/50 border-gray-600 text-white w-32">
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-600">
            <SelectItem value="all">Tous</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status} className="text-white hover:bg-gray-800">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* <Button
        onClick={clearFilters}
        size="sm"
        variant="outline"
        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
      >
        <X className="w-4 h-4 mr-1" />
        Effacer
      </Button> */}
    </div>
  );
}
