import React, { useRef, useEffect } from "react";

interface GlobeProps {
  onEntityClick?: (entityData: any) => void;
  showFires?: boolean;
  showEarthquakes?: boolean;
  showWeather?: boolean;
}

export const Globe: React.FC<GlobeProps> = ({
  onEntityClick,
  showFires = true,
  showEarthquakes = true,
  showWeather = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Draw fire points if enabled
    if (showFires) {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(earthX - earthRadius * 0.3, earthY - earthRadius * 0.1, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw earthquake points if enabled
    if (showEarthquakes) {
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(earthX + earthRadius * 0.2, earthY + earthRadius * 0.15, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw atmosphere glow
    const glowGradient = ctx.createRadialGradient(earthX, earthY, earthRadius, earthX, earthY, earthRadius * 1.2);
    glowGradient.addColorStop(0, "rgba(74, 158, 255, 0.3)");
    glowGradient.addColorStop(1, "rgba(74, 158, 255, 0)");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(earthX, earthY, earthRadius * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }, [showFires, showEarthquakes, showWeather]);

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
      const fireX = earthX - earthRadius * 0.3;
      const fireY = earthY - earthRadius * 0.1;
      const dist = Math.sqrt((x - fireX) ** 2 + (y - fireY) ** 2);
      if (dist < 10) {
        onEntityClick?.({ type: "fire", lat: 37.7749, lon: -122.4194, confidence: 85 });
        return;
      }
    }

    // Check if clicked on earthquake point
    if (showEarthquakes) {
      const eqX = earthX + earthRadius * 0.2;
      const eqY = earthY + earthRadius * 0.15;
      const dist = Math.sqrt((x - eqX) ** 2 + (y - eqY) ** 2);
      if (dist < 10) {
        onEntityClick?.({ type: "earthquake", lat: 34.0522, lon: -118.2437, magnitude: 5.2 });
        return;
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
    </div>
  );
};
