import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Send, Flame, Zap, Cloud, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SummaryPanel } from "./SummaryPanel";
import { QuerySuggestions } from "./QuerySuggestions";
import { ChatMessage } from "./ChatMessage";
import { ShareDialog } from "./ShareDialog";
import type { LayerSummary } from "@/hooks/useLayerSummary";
import type { ExtractedLocation } from "@/utils/locationExtractor";

interface SidePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onLayerToggle: (layer: string, enabled: boolean) => void;
  layerStates: Record<string, boolean>;
  onChatSubmit: (message: string) => void;
  chatMessages: Array<{ role: string; content: string }>;
  isLoading?: boolean;
  summary?: LayerSummary | null;
  isSummaryGenerating?: boolean;
  onRefreshSummary?: () => void;
  querySuggestions?: string[];
  queryExamples?: string[];
  isLoadingSuggestions?: boolean;
  onLocationDetected?: (locations: ExtractedLocation[]) => void;
  mapShareUrl?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onToggle,
  onLayerToggle,
  layerStates,
  onChatSubmit,
  chatMessages,
  isLoading = false,
  summary,
  isSummaryGenerating = false,
  onRefreshSummary,
  querySuggestions = [],
  queryExamples = [],
  isLoadingSuggestions = false,
  onLocationDetected,
  mapShareUrl,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareText, setShareText] = useState("");
  const [shareTitle, setShareTitle] = useState("map view");

  const handleSend = () => {
    if (inputValue.trim()) {
      onChatSubmit(inputValue);
      setInputValue("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const openShare = (title: string, text: string) => {
    setShareTitle(title);
    setShareText(text);
    setShareOpen(true);
  };

  const layerIcons: Record<string, React.ReactNode> = {
    fires: <Flame className="w-4 h-4 text-red-500" />,
    earthquakes: <Zap className="w-4 h-4 text-yellow-500" />,
    weather: <Cloud className="w-4 h-4 text-blue-500" />,
  };

  const activeLayers = Object.entries(layerStates)
    .filter(([_, enabled]) => enabled)
    .map(([layer, _]) => layer);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900/80 hover:bg-slate-800 text-white p-2 rounded-l-lg border border-r-0 border-slate-700 transition-colors"
      >
        {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>

      {/* Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-950 to-slate-900 border-l border-slate-700 shadow-2xl z-30 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-900/50">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Earth Data</h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Share current map view"
                  title="Share current map view"
                  className="text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => openShare("map view", `EarthGPT map view with ${activeLayers.join(", ") || "no active layers"}.`)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Layer Toggles */}
              <div className="space-y-3">
                {Object.entries(layerIcons).map(([layer, icon]) => (
                  <div key={layer} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {icon}
                      <span className="text-sm text-slate-300 capitalize">{layer}</span>
                    </div>
                    <Switch
                      checked={layerStates[layer] || false}
                      onCheckedChange={(checked) => onLayerToggle(layer, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Panel */}
            {summary && (
              <SummaryPanel
                summary={summary}
                isGenerating={isSummaryGenerating}
                onRefresh={onRefreshSummary || (() => {})}
              />
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {chatMessages.length === 0 ? (
                <div className="text-center text-slate-400 py-8 flex-1 flex items-center justify-center">
                  <p className="text-sm">Ask Earth anything...</p>
                </div>
              ) : (
                <div className="flex-1">
                  {chatMessages.map((msg, idx) => (
                    <ChatMessage
                      key={idx}
                      role={msg.role as "user" | "assistant"}
                      content={msg.content}
                      isStreaming={isLoading && idx === chatMessages.length - 1 && msg.role === "assistant"}
                      onLocationDetected={onLocationDetected}
                      onShare={(content) => openShare("AI answer", content)}
                    />
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 px-3 py-2 rounded-lg text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Query Suggestions */}
            {activeLayers.length > 0 && chatMessages.length === 0 && (
              <QuerySuggestions
                suggestions={querySuggestions}
                examples={queryExamples}
                isLoading={isLoadingSuggestions}
                onSuggestionClick={handleSuggestionClick}
                activeLayers={activeLayers}
              />
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700 bg-slate-900/50">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask Earth anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={shareTitle}
        text={shareText}
        url={mapShareUrl}
      />
    </>
  );
};
