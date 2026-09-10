/**
 * Extract geographic locations and regions from text
 */

export interface ExtractedLocation {
  name: string;
  type: "country" | "region" | "city" | "area" | "ocean" | "generic";
  latitude?: number;
  longitude?: number;
  confidence: number; // 0-1
}

// Common geographic locations with coordinates
const LOCATION_DATABASE: Record<string, { lat: number; lng: number; type: ExtractedLocation["type"] }> = {
  // Continents
  "north america": { lat: 54.5260, lng: -105.2551, type: "area" },
  "south america": { lat: -8.7832, lng: -55.4915, type: "area" },
  "europe": { lat: 54.5973, lng: 15.2551, type: "area" },
  "africa": { lat: -8.7832, lng: 34.5085, type: "area" },
  "asia": { lat: 34.0479, lng: 100.6197, type: "area" },
  "australia": { lat: -25.2744, lng: 133.7751, type: "area" },
  "antarctica": { lat: -82.8628, lng: 135.0, type: "area" },

  // Countries
  "united states": { lat: 37.0902, lng: -95.7129, type: "country" },
  "usa": { lat: 37.0902, lng: -95.7129, type: "country" },
  "canada": { lat: 56.1304, lng: -106.3468, type: "country" },
  "mexico": { lat: 23.6345, lng: -102.5528, type: "country" },
  "brazil": { lat: -14.2350, lng: -51.9253, type: "country" },
  "india": { lat: 20.5937, lng: 78.9629, type: "country" },
  "china": { lat: 35.8617, lng: 104.1954, type: "country" },
  "japan": { lat: 36.2048, lng: 138.2529, type: "country" },

  "indonesia": { lat: -0.7893, lng: 113.9213, type: "country" },
  "philippines": { lat: 12.8797, lng: 121.7740, type: "country" },

  // Regions/States
  "california": { lat: 36.1162, lng: -119.6816, type: "region" },
  "texas": { lat: 31.9686, lng: -99.9018, type: "region" },
  "florida": { lat: 27.9947, lng: -81.7603, type: "region" },
  "new york state": { lat: 42.1657, lng: -74.9481, type: "region" },
  "amazon rainforest": { lat: -3.4653, lng: -62.2159, type: "area" },
  "sahara desert": { lat: 23.4162, lng: 9.9616, type: "area" },

  // Cities
  "new york city": { lat: 40.7128, lng: -74.0060, type: "city" },
  "los angeles": { lat: 34.0522, lng: -118.2437, type: "city" },
  "london": { lat: 51.5074, lng: -0.1278, type: "city" },
  "tokyo": { lat: 35.6762, lng: 139.6503, type: "city" },
  "sydney": { lat: -33.8688, lng: 151.2093, type: "city" },
  "mumbai": { lat: 19.0760, lng: 72.8777, type: "city" },
  "dubai": { lat: 25.2048, lng: 55.2708, type: "city" },

  // Oceans/Water bodies
  "pacific ocean": { lat: 0.0, lng: -155.0, type: "ocean" },
  "atlantic ocean": { lat: 0.0, lng: -30.0, type: "ocean" },
  "indian ocean": { lat: -20.0, lng: 80.0, type: "ocean" },
  "arctic ocean": { lat: 90.0, lng: 0.0, type: "ocean" },
};

/**
 * Extract locations from text
 */
export function extractLocations(text: string): ExtractedLocation[] {
  const locations: ExtractedLocation[] = [];
  const lowerText = text.toLowerCase();

  // Search for known locations
  for (const [locationName, data] of Object.entries(LOCATION_DATABASE)) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${locationName}\\b`, "gi");
    if (regex.test(lowerText)) {
      locations.push({
        name: locationName.charAt(0).toUpperCase() + locationName.slice(1),
        type: data.type,
        latitude: data.lat,
        longitude: data.lng,
        confidence: 0.9,
      });
    }
  }

  // Remove duplicates
  return Array.from(
    new Map(locations.map((loc) => [loc.name.toLowerCase(), loc])).values()
  );
}

/**
 * Get bounding box for a location to center map view
 */
export function getLocationBounds(
  location: ExtractedLocation
): { center: [number, number]; zoom: number } {
  if (!location.latitude || !location.longitude) {
    return { center: [0, 0], zoom: 2 };
  }

  // Adjust zoom based on location type
  const zoomLevels: Record<ExtractedLocation["type"], number> = {
    country: 4,
    region: 5,
    city: 6,
    area: 3,
    ocean: 2,
    generic: 3,
  };

  return {
    center: [location.longitude, location.latitude],
    zoom: zoomLevels[location.type],
  };
}

/**
 * Highlight multiple locations on map
 */
export function createLocationHighlights(locations: ExtractedLocation[]) {
  return locations.map((loc) => ({
    id: `highlight-${loc.name.toLowerCase().replace(/\s+/g, "-")}`,
    location: loc,
    bounds: getLocationBounds(loc),
    color: getColorForType(loc.type),
  }));
}

/**
 * Get color for location type
 */
function getColorForType(type: ExtractedLocation["type"]): string {
  const colors: Record<ExtractedLocation["type"], string> = {
    country: "#3b82f6", // blue
    region: "#8b5cf6", // purple
    city: "#ec4899", // pink
    area: "#f59e0b", // amber
    ocean: "#06b6d4", // cyan
    generic: "#6b7280", // gray
  };
  return colors[type];
}
