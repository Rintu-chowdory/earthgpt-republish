import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface Earthquake {
  id: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth: number;
  timestamp: Date;
  place: string;
}

export const useEarthquakes = (enabled: boolean = true) => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const earthquakeQuery = trpc.earth.earthquakes.useQuery(
    {
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180,
      daysBack: 7,
    },
    {
      enabled: enabled,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  useEffect(() => {
    if (earthquakeQuery.data) {
      setEarthquakes(earthquakeQuery.data as any);
      setError(null);
    }
    if (earthquakeQuery.error) {
      setError(earthquakeQuery.error.message);
    }
    setIsLoading(earthquakeQuery.isLoading);
  }, [earthquakeQuery.data, earthquakeQuery.error, earthquakeQuery.isLoading]);

  const refetch = useCallback(() => {
    earthquakeQuery.refetch();
  }, [earthquakeQuery]);

  return {
    earthquakes,
    isLoading,
    error,
    refetch,
  };
};
