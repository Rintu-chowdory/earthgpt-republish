import { useState, useCallback, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import type { Wildfire } from "./useWildfires";
import type { Earthquake } from "./useEarthquakes";

export interface LayerSummary {
  summary: string;
  briefing: string;
  timestamp: Date;
  activeLayers: string[];
  isLoading: boolean;
}

export const useLayerSummary = (
  activeLayers: string[],
  wildfires: Wildfire[],
  earthquakes: Earthquake[],
  autoGenerate: boolean = true
) => {
  const [summary, setSummary] = useState<LayerSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const summaryMutation = trpc.summarize.layers.useMutation();
  const briefingMutation = trpc.summarize.briefing.useMutation();

  const generateSummary = useCallback(async () => {
    if (activeLayers.length === 0) {
      setSummary(null);
      return;
    }

    setIsGenerating(true);

    try {
      // Generate quick summary
      const summaryResponse = await summaryMutation.mutateAsync({
        activeLayers: activeLayers as any,
        fireCount: wildfires.length,
        earthquakeCount: earthquakes.length,
        recentEvents: {
          fires: wildfires.slice(0, 5) as any,
          earthquakes: earthquakes.slice(0, 5) as any,
        },
      });

      // Generate detailed briefing
      const briefingResponse = await briefingMutation.mutateAsync({
        activeLayers: activeLayers as any,
        fireCount: wildfires.length,
        earthquakeCount: earthquakes.length,
        recentEvents: {
          fires: wildfires.slice(0, 5) as any,
          earthquakes: earthquakes.slice(0, 5) as any,
        },
      });

      if (summaryResponse.success && briefingResponse.success) {
        const summaryText = typeof summaryResponse.summary === 'string' ? summaryResponse.summary : JSON.stringify(summaryResponse.summary);
        const briefingText = typeof briefingResponse.briefing === 'string' ? briefingResponse.briefing : JSON.stringify(briefingResponse.briefing);
        setSummary({
          summary: summaryText,
          briefing: briefingText,
          timestamp: new Date(),
          activeLayers,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [activeLayers, wildfires, earthquakes, summaryMutation, briefingMutation]);

  // Auto-generate summary when layers change
  useEffect(() => {
    if (autoGenerate && activeLayers.length > 0) {
      const timer = setTimeout(() => {
        generateSummary();
      }, 500); // Debounce to avoid excessive API calls

      return () => clearTimeout(timer);
    }
  }, [activeLayers, autoGenerate, generateSummary]);

  return {
    summary,
    isGenerating,
    generateSummary,
  };
};
