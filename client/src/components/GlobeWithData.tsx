import React, { useRef, useEffect, useState, useMemo } from "react";
import { useWildfires, type Wildfire } from "@/hooks/useWildfires";
import { useEarthquakes, type Earthquake } from "@/hooks/useEarthquakes";
import { MapHighlights } from "./MapHighlights";
import type { ExtractedLocation } from "@/utils/locationExtractor";

interface GlobeWithDataProps {
  onEntityClick?: (entityData: any) => void;
  showFires?: boolean;
  showEarthquakes?: boolean;
  showWeather?: boolean;
  highlightedLocations?: ExtractedLocation[];
}

export const GlobeWithData: React.FC<GlobeWithDataProps> = ({
  onEntityClick,
  showFires = true,
  showEarthquakes = true,
  showWeather = false,
  highlightedLocations = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { wildfires, isLoading: wildfireLoading } = useWildfires(showFires);
  const { earthquakes, isLoading: earthquakeLoading } = useEarthquakes(showEarthquakes);

  // Convert lat/lon to canvas coordinates
  const latLonToCanvas = (lat: number, lon: number, centerX: number, centerY: number, radius: number) => {
    const x = centerX + (lon / 180) * radius * 0.8;
    const y = centerY - (lat / 90) * radius * 0.8;
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0a0e27");
    gradient.addColorStop(1, "#1a1f3a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5;
      const opacity = Math.random() * 0.5 + 0.5;

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(x, y, size, size);
    }

    // Draw Earth circle
    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthRadius = Math.min(canvas.width, canvas.height) * 0.3;

    // Earth gradient
    const earthGradient = ctx.createRadialGradient(
      earthX - earthRadius * 0.3,
      earthY - earthRadius * 0.3,
      0,
      earthX,
      earthY,
      earthRadius
    );
    earthGradient.addColorStop(0, "#4a9eff");
    earthGradient.addColorStop(0.5, "#2563eb");
    earthGradient.addColorStop(1, "#1e40af");
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw continents (simplified)
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.ellipse(earthX - earthRadius * 0.4, earthY - earthRadius * 0.2, earthRadius * 0.3, earthRadius * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(earthX + earthRadius * 0.3, earthY, earthRadius * 0.25, earthRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw fire points
    if (showFires && wildfires.length > 0) {
      wildfires.forEach((fire: Wildfire) => {
        const { x, y } = latLonToCanvas(fire.latitude, fire.longitude, earthX, earthY, earthRadius);

        // Draw fire point with glow
        const glowRadius = 8 + (fire.confidence / 100) * 4;
        ctx.fillStyle = `rgba(239, 68, 68, ${0.3 + (fire.confidence / 100) * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw fire core
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#dc2626";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // Draw earthquake points
    if (showEarthquakes && earthquakes.length > 0) {
      earthquakes.forEach((eq: Earthquake) => {
        const { x, y } = latLonToCanvas(eq.latitude, eq.longitude, earthX, earthY, earthRadius);

        // Draw earthquake point with magnitude-based size
        const eqSize = 5 + (eq.magnitude / 8) * 5;
        const glowRadius = eqSize + 3;

        ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + (eq.magnitude / 8) * 0.4})`;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw earthquake core
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(x, y, eqSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    }

    // Draw atmosphere glow
    const glowGradient = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, earthRadius * 1.2);
    glowGradient.addColorStop(0, "rgba(74, 158, 255, 0.3)");
    glowGradient.addColorStop(1, "rgba(74, 158, 255, 0)");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }, [wildfires, earthquakes, showFires, showEarthquakes, showWeather]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;
    const earthRadius = Math.min(canvas.width, canvas.height) * 0.3;

    // Check if clicked on fire point
    if (showFires) {
      for (const fire of wildfires) {
        const { x: fireX, y: fireY } = latLonToCanvas(fire.latitude, fire.longitude, earthX, earthY, earthRadius);
        const dist = Math.sqrt((x - fireX) ** 2 + (y - fireY) ** 2);
        if (dist < 12) {
          onEntityClick?.(fire);
          return;
        }
      }
    }

    // Check if clicked on earthquake point
    if (showEarthquakes) {
      for (const eq of earthquakes) {
        const { x: eqX, y: eqY } = latLonToCanvas(eq.latitude, eq.longitude, earthX, earthY, earthRadius);
        const dist = Math.sqrt((x - eqX) ** 2 + (y - eqY) ** 2);
        if (dist < 12) {
          onEntityClick?.(eq);
          return;
        }
      }
    }
  };

  return (
    <div className="w-full h-full bg-black relative cursor-pointer">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onClick={handleCanvasClick}
      />
      <MapHighlights
        locations={highlightedLocations || []}
        canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
        onLocationClick={(location) => {
          console.log("Location clicked:", location);
        }}
      />
      {(wildfireLoading || earthquakeLoading) && (
        <div className="absolute bottom-4 left-4 text-xs text-slate-400">
          Loading data...
        </div>
      )}
    </div>
  );
};
