import React from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuerySuggestionsProps {
  suggestions: string[];
  examples: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  activeLayers: string[];
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({
  suggestions,
  examples,
  isLoading,
  onSuggestionClick,
  activeLayers,
}) => {
  if (activeLayers.length === 0) {
    return null;
  }

  // Use suggestions if available, otherwise fall back to examples
  const displayQueries = suggestions.length > 0 ? suggestions : examples;

  return (
    <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold text-slate-300">Try asking:</span>
        {isLoading && <Loader2 className="w-3 h-3 text-blue-400 animate-spin ml-auto" />}
      </div>

      <div className="space-y-2">
        {displayQueries.slice(0, 3).map((query, idx) => (
          <button
            key={idx}
            onClick={() => onSuggestionClick(query)}
            className="w-full text-left p-2 rounded bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-xs text-slate-300 hover:text-slate-100 border border-slate-600/30 hover:border-slate-500/50"
          >
            <span className="line-clamp-2">{query}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
