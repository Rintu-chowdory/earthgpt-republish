import React, { useState, useCallback, useMemo } from "react";
import { GlobeWithData } from "@/components/GlobeWithData";
import { SidePanel } from "@/components/SidePanel";
import { useAuth } from "@/_core/hooks/useAuth";
import { useWildfires } from "@/hooks/useWildfires";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { useLayerSummary } from "@/hooks/useLayerSummary";
import { useQuerySuggestions } from "@/hooks/useQuerySuggestions";
import { trpc } from "@/lib/trpc";
import type { ExtractedLocation } from "@/utils/locationExtractor";

export default function Home() {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layerStates, setLayerStates] = useState({
    fires: true,
    earthquakes: true,
    weather: false,
  });
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [highlightedLocations, setHighlightedLocations] = useState<ExtractedLocation[]>([]);

  // Fetch live data
  const { wildfires } = useWildfires(layerStates.fires);
  const { earthquakes } = useEarthquakes(layerStates.earthquakes);

  // Generate summaries for active layers
  const activeLayers = useMemo(
    () => Object.entries(layerStates)
      .filter(([_, enabled]) => enabled)
      .map(([layer, _]) => layer),
    [layerStates]
  );

  const { summary, isGenerating: isSummaryGenerating, generateSummary } = useLayerSummary(
    activeLayers,
    wildfires,
    earthquakes,
    true // Auto-generate summaries
  );

  // Get query suggestions
  const { suggestions, examples, isLoading: isLoadingSuggestions } = useQuerySuggestions(
    activeLayers,
    wildfires.length,
    earthquakes.length
  );

  // Chat mutation
  const chatMutation = trpc.chat.message.useMutation();
  const queryEnhanceMutation = trpc.query.enhance.useMutation();

  const handleLayerToggle = useCallback((layer: string, enabled: boolean) => {
    setLayerStates((prev) => ({ ...prev, [layer]: enabled }));
  }, []);

  const handleLocationDetected = useCallback((locations: ExtractedLocation[]) => {
    setHighlightedLocations(locations);
  }, []);

  const handleChatSubmit = useCallback(
    async (message: string) => {
      setChatMessages((prev) => [...prev, { role: "user", content: message }]);
      setIsLoading(true);

      try {
        // First, enhance the query with context about active layers
        const enhancedResponse = await queryEnhanceMutation.mutateAsync({
          userQuery: message,
          activeLayers: activeLayers as any,
          fireCount: wildfires.length,
          earthquakeCount: earthquakes.length,
        });

        if (enhancedResponse.success) {
          // Use the enhanced response directly
          setChatMessages((prev) => [...prev, { role: "assistant", content: enhancedResponse.answer }]);
        } else {
          // Fallback to regular chat
          const response = await chatMutation.mutateAsync({
            message,
            context: selectedEntity
              ? {
                  eventType: selectedEntity.confidence !== undefined ? "fire" : "earthquake",
                  latitude: selectedEntity.latitude,
                  longitude: selectedEntity.longitude,
                  eventData: selectedEntity,
                }
              : undefined,
          });

          if (response.success) {
            const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
            setChatMessages((prev) => [...prev, { role: "assistant", content }]);
          } else {
            const content = typeof response.content === 'string' ? response.content : "Error processing request";
            setChatMessages((prev) => [
              ...prev,
              { role: "assistant", content },
            ]);
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [chatMutation, queryEnhanceMutation, selectedEntity, activeLayers, wildfires.length, earthquakes.length]
  );

  const handleEntityClick = useCallback((entityData: any) => {
    console.log("Entity clicked:", entityData);
    setSelectedEntity(entityData);
    if (entityData.confidence !== undefined) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Tell me about this wildfire at ${entityData.latitude.toFixed(2)}, ${entityData.longitude.toFixed(2)}`,
        },
      ]);
    } else if (entityData.magnitude !== undefined) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Tell me about this ${entityData.magnitude} magnitude earthquake at ${entityData.latitude.toFixed(2)}, ${entityData.longitude.toFixed(2)}`,
        },
      ]);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading EarthGPT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex flex-col relative overflow-hidden">
      <div className="flex-1 relative">
        <GlobeWithData
          onEntityClick={(entity) => {
            setSelectedEntity(entity);
            handleEntityClick(entity);
          }}
          showFires={layerStates.fires}
          showEarthquakes={layerStates.earthquakes}
          showWeather={layerStates.weather}
          highlightedLocations={highlightedLocations}
        />

        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="text-white">
            <h1 className="text-3xl font-bold tracking-wider">EarthGPT</h1>
            <p className="text-sm text-slate-400 mt-1">Talk to Planet Earth</p>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="space-y-2">
            {layerStates.fires && (
              <div className="bg-slate-900/80 border border-red-500/30 rounded px-3 py-1 text-sm text-red-400">
                Fires: <span className="font-semibold">{wildfires.length}</span>
              </div>
            )}
            {layerStates.earthquakes && (
              <div className="bg-slate-900/80 border border-yellow-500/30 rounded px-3 py-1 text-sm text-yellow-400">
                Earthquakes: <span className="font-semibold">{earthquakes.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <SidePanel
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLayerToggle={handleLayerToggle}
        layerStates={layerStates}
        onChatSubmit={handleChatSubmit}
        chatMessages={chatMessages}
        isLoading={isLoading || chatMutation.isPending || queryEnhanceMutation.isPending}
        summary={summary}
        isSummaryGenerating={isSummaryGenerating}
        onRefreshSummary={generateSummary}
        querySuggestions={suggestions}
        queryExamples={examples}
        isLoadingSuggestions={isLoadingSuggestions}
        onLocationDetected={handleLocationDetected}
      />
    </div>
  );
}
