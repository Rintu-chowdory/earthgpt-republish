import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getWildfiresByBoundingBox, getEarthquakesByBoundingBox, upsertWildfire, upsertEarthquake } from "./db";


// Fetch wildfires from NASA FIRMS API and cache in database
async function fetchAndCacheWildfires(minLat: number, maxLat: number, minLon: number, maxLon: number) {
  try {
    // This would call NASA FIRMS API in production
    // For now, we'll return cached data from the database
    const fires = await getWildfiresByBoundingBox(minLat, maxLat, minLon, maxLon, 1);
    return fires;
  } catch (error) {
    console.error("[Earth API] Failed to fetch wildfires:", error);
    return [];
  }
}

// Fetch earthquakes from USGS API and cache in database
async function fetchAndCacheEarthquakes(minLat: number, maxLat: number, minLon: number, maxLon: number) {
  try {
    // This would call USGS API in production
    // For now, we'll return cached data from the database
    const earthquakes = await getEarthquakesByBoundingBox(minLat, maxLat, minLon, maxLon, 7);
    return earthquakes;
  } catch (error) {
    console.error("[Earth API] Failed to fetch earthquakes:", error);
    return [];
  }
}

export const earthRouter = router({
  // Get wildfires for a bounding box
  wildfires: publicProcedure
    .input(
      z.object({
        minLat: z.number(),
        maxLat: z.number(),
        minLon: z.number(),
        maxLon: z.number(),
        daysBack: z.number().optional().default(1),
      })
    )
    .query(async ({ input }) => {
      return await fetchAndCacheWildfires(input.minLat, input.maxLat, input.minLon, input.maxLon);
    }),

  // Get earthquakes for a bounding box
  earthquakes: publicProcedure
    .input(
      z.object({
        minLat: z.number(),
        maxLat: z.number(),
        minLon: z.number(),
        maxLon: z.number(),
        daysBack: z.number().optional().default(7),
      })
    )
    .query(async ({ input }) => {
      return await fetchAndCacheEarthquakes(input.minLat, input.maxLat, input.minLon, input.maxLon);
    }),

  // Get AI explanation for a specific event
  explain: publicProcedure
    .input(
      z.object({
        eventType: z.enum(["fire", "earthquake"]),
        latitude: z.number(),
        longitude: z.number(),
        eventData: z.record(z.string(), z.any()),
      })
    )
    .mutation(async ({ input }) => {
      // This would call the LLM in production
      // For now, return a placeholder
      return {
        explanation: `Event at ${input.latitude}, ${input.longitude}`,
        stats: input.eventData,
      };
    }),
});
