import React, { useState, useEffect } from "react";
import { TypingMessage } from "./TypingMessage";
import { extractLocations } from "@/utils/locationExtractor";
import type { ExtractedLocation } from "@/utils/locationExtractor";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  onLocationDetected?: (locations: ExtractedLocation[]) => void;
  onShare?: (content: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  isStreaming = false,
  onLocationDetected,
  onShare,
}) => {
  const [locations, setLocations] = useState<ExtractedLocation[]>([]);

  useEffect(() => {
    if (role === "assistant" && content) {
      const extractedLocs = extractLocations(content);
      setLocations(extractedLocs);
      onLocationDetected?.(extractedLocs);
    }
  }, [content, role, onLocationDetected]);

  // Highlight locations in text
  const renderContentWithHighlights = () => {
    if (locations.length === 0) {
      return content;
    }

    let highlightedContent = content;
    const sortedLocations = [...locations].sort(
      (a, b) => b.name.length - a.name.length
    );

    sortedLocations.forEach((loc) => {
      const regex = new RegExp(`\\b${loc.name}\\b`, "gi");
      highlightedContent = highlightedContent.replace(
        regex,
        `<span class="bg-blue-500/20 text-blue-300 px-1 rounded border-l-2 border-blue-500 font-semibold">${loc.name}</span>`
      );
    });

    return highlightedContent;
  };

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs px-3 py-2 rounded-lg ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {role === "user" ? (
          <div className="text-sm">{content}</div>
        ) : isStreaming ? (
          <TypingMessage content={content} speed={30} />
        ) : (
          <div className="text-sm leading-relaxed">
            {locations.length > 0 ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: renderContentWithHighlights(),
                }}
              />
            ) : (
              content
            )}
          </div>
        )}

        {/* Location indicators */}
        {locations.length > 0 && role === "assistant" && (
          <div className="mt-2 pt-2 border-t border-slate-600/50 flex flex-wrap gap-1">
            {locations.slice(0, 3).map((loc) => (
              <span
                key={loc.name}
                className="inline-block text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
              >
                📍 {loc.name}
              </span>
            ))}
            {locations.length > 3 && (
              <span className="inline-block text-xs px-2 py-1 rounded bg-slate-700/50 text-slate-300">
                +{locations.length - 3} more
              </span>
            )}
          </div>
        )}
        {role === "assistant" && !isStreaming && onShare && (
          <div className="mt-2 flex justify-end border-t border-slate-600/50 pt-2">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Share this AI answer"
              title="Share this AI answer"
              className="text-slate-400 hover:bg-slate-700 hover:text-white"
              onClick={() => onShare(content)}
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
