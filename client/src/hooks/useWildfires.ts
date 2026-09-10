import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface Wildfire {
  id: string;
  latitude: number;
  longitude: number;
  confidence: number;
  brightness: number;
  timestamp: Date;
}

export const useWildfires = (enabled: boolean = true) => {
  const [wildfires, setWildfires] = useState<Wildfire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wildfireQuery = trpc.earth.wildfires.useQuery(
    {
      minLat: -90,
      maxLat: 90,
      minLon: -180,
      maxLon: 180,
      daysBack: 1,
    },
    {
      enabled: enabled,
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  useEffect(() => {
    if (wildfireQuery.data) {
      setWildfires(wildfireQuery.data as any);
      setError(null);
    }
    if (wildfireQuery.error) {
      setError(wildfireQuery.error.message);
    }
    setIsLoading(wildfireQuery.isLoading);
  }, [wildfireQuery.data, wildfireQuery.error, wildfireQuery.isLoading]);

  const refetch = useCallback(() => {
    wildfireQuery.refetch();
  }, [wildfireQuery]);

  return {
    wildfires,
    isLoading,
    error,
    refetch,
  };
};
