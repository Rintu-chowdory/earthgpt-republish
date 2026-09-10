import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LayerSummary } from "@/hooks/useLayerSummary";

interface SummaryPanelProps {
  summary: LayerSummary | null;
  isGenerating: boolean;
  onRefresh: () => void;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
  summary,
  isGenerating,
  onRefresh,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!summary) {
    return null;
  }

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">Earth Summary</h3>
            <p className="text-xs text-slate-400">Updated {timeAgo(summary.timestamp)}</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isGenerating}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Quick Summary */}
      <div className="mb-3 p-3 bg-slate-900/50 rounded border border-slate-700/30">
        <p className="text-sm text-slate-200 leading-relaxed">
          {summary.summary}
        </p>
      </div>

      {/* Expandable Detailed Briefing */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-slate-700/20 rounded transition-colors text-sm text-slate-300 hover:text-slate-100"
      >
        <span className="font-medium">Detailed Briefing</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 p-3 bg-slate-900/50 rounded border border-slate-700/30 max-h-48 overflow-y-auto">
          <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
            {summary.briefing}
          </div>
        </div>
      )}

      {/* Active Layers Indicator */}
      <div className="mt-3 flex flex-wrap gap-2">
        {summary.activeLayers.map((layer) => (
          <span
            key={layer}
            className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-700/50 text-slate-200 border border-slate-600/50"
          >
            {layer.charAt(0).toUpperCase() + layer.slice(1)}
          </span>
        ))}
      </div>
    </div>
  );
};
