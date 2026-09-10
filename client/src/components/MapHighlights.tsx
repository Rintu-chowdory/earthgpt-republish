import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ExtractedLocation } from "@/utils/locationExtractor";

interface MapHighlightsProps {
  locations: ExtractedLocation[];
  onLocationClick?: (location: ExtractedLocation) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export const MapHighlights: React.FC<MapHighlightsProps> = ({
  locations,
  onLocationClick,
  canvasRef,
}) => {
  const [highlights, setHighlights] = useState<Array<{ id: string; x: number; y: number; location: ExtractedLocation }>>([]);

  useEffect(() => {
    if (!canvasRef?.current || locations.length === 0) {
      setHighlights([]);
      return;
    }

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Convert lat/lng to canvas coordinates (simple mercator projection)
    const newHighlights = locations.map((loc) => {
      if (!loc.latitude || !loc.longitude) return null;

      // Simple mercator projection
      const x = ((loc.longitude + 180) / 360) * width;
      const y = ((90 - loc.latitude) / 180) * height;

      return {
        id: `highlight-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
        x,
        y,
        location: loc,
      };
    }).filter((h) => h !== null) as typeof highlights;

    setHighlights(newHighlights);
  }, [locations, canvasRef]);

  if (highlights.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {highlights.map((highlight) => (
        <motion.div
          key={highlight.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="absolute pointer-events-auto"
          style={{
            left: `${(highlight.x / (canvasRef?.current?.getBoundingClientRect().width || 1)) * 100}%`,
            top: `${(highlight.y / (canvasRef?.current?.getBoundingClientRect().height || 1)) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => onLocationClick?.(highlight.location)}
        >
          {/* Outer pulsing ring */}
          <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-blue-400 animate-pulse" style={{ transform: "translate(-50%, -50%)" }} />

          {/* Middle ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 w-6 h-6 rounded-full border border-blue-300"
            style={{ transform: "translate(-50%, -50%)" }}
          />

          {/* Center dot */}
          <div className="absolute w-3 h-3 rounded-full bg-blue-500 shadow-lg" style={{ transform: "translate(-50%, -50%)" }} />

          {/* Location label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute mt-2 px-2 py-1 bg-slate-900/90 border border-blue-500/50 rounded text-xs text-white whitespace-nowrap"
            style={{ transform: "translateX(-50%)" }}
          >
            {highlight.location.name}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
