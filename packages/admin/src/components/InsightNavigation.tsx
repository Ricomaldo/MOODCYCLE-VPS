
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InsightNavigationProps {
  current: number;
  total: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function InsightNavigation({ current, total, onNavigate }: InsightNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onNavigate('prev')}
        disabled={current === 1}
        variant="outline"
        size="sm"
        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={() => onNavigate('next')}
        disabled={current === total}
        variant="outline"
        size="sm"
        className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
