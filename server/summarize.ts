import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const summarizeRouter = router({
  // Generate a summary of active data layers
  layers: publicProcedure
    .input(
      z.object({
        activeLayers: z.array(z.enum(["fires", "earthquakes", "weather"])),
        fireCount: z.number().optional(),
        earthquakeCount: z.number().optional(),
        recentEvents: z.object({
          fires: z.array(z.record(z.string(), z.any())).optional(),
          earthquakes: z.array(z.record(z.string(), z.any())).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Build a context string from active layers and recent events
      let contextString = "Here is the current Earth data status:\n\n";

      if (input.activeLayers.includes("fires")) {
        contextString += `Active Wildfires: ${input.fireCount || 0} detected\n`;
        if (input.recentEvents?.fires && input.recentEvents.fires.length > 0) {
          contextString += "Recent fires:\n";
          input.recentEvents.fires.slice(0, 5).forEach((fire: any, idx: number) => {
            contextString += `  ${idx + 1}. Location: (${fire.latitude?.toFixed(2)}, ${fire.longitude?.toFixed(2)}), Confidence: ${fire.confidence || "N/A"}%\n`;
          });
        }
        contextString += "\n";
      }

      if (input.activeLayers.includes("earthquakes")) {
        contextString += `Recent Earthquakes: ${input.earthquakeCount || 0} detected\n`;
        if (input.recentEvents?.earthquakes && input.recentEvents.earthquakes.length > 0) {
          contextString += "Recent earthquakes:\n";
          input.recentEvents.earthquakes.slice(0, 5).forEach((eq: any, idx: number) => {
            contextString += `  ${idx + 1}. Location: (${eq.latitude?.toFixed(2)}, ${eq.longitude?.toFixed(2)}), Magnitude: ${eq.magnitude || "N/A"}, Depth: ${eq.depth || "N/A"}km\n`;
          });
        }
        contextString += "\n";
      }

      if (input.activeLayers.includes("weather")) {
        contextString += "Weather layers: Cloud coverage and atmospheric data active\n\n";
      }

      const systemPrompt = `You are EarthGPT, an expert Earth data analyst. Provide a concise, engaging summary of the current Earth conditions based on the data provided. Focus on:
- Key trends and patterns
- Notable events or anomalies
- Potential impacts or concerns
- Geographic hotspots

Keep the summary to 2-3 sentences maximum, making it informative yet digestible for a quick briefing.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: contextString },
          ],
        });

        const summary = typeof response === 'string' 
          ? response 
          : response.choices?.[0]?.message?.content || 'No summary available';

        return {
          success: true,
          summary,
          timestamp: new Date(),
          activeLayers: input.activeLayers,
        };
      } catch (error) {
        console.error("[Summarize] LLM error:", error);
        return {
          success: false,
          summary: "Unable to generate summary. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
          activeLayers: input.activeLayers,
        };
      }
    }),

  // Generate a detailed briefing on current conditions
  briefing: publicProcedure
    .input(
      z.object({
        activeLayers: z.array(z.enum(["fires", "earthquakes", "weather"])),
        fireCount: z.number().optional(),
        earthquakeCount: z.number().optional(),
        recentEvents: z.object({
          fires: z.array(z.record(z.string(), z.any())).optional(),
          earthquakes: z.array(z.record(z.string(), z.any())).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Build detailed context
      let briefingContext = "Generate a detailed Earth briefing based on this data:\n\n";

      if (input.activeLayers.includes("fires")) {
        briefingContext += `Total Active Wildfires: ${input.fireCount || 0}\n`;
        if (input.recentEvents?.fires && input.recentEvents.fires.length > 0) {
          const avgConfidence = input.recentEvents.fires.reduce((sum: number, f: any) => sum + (f.confidence || 0), 0) / input.recentEvents.fires.length;
          briefingContext += `Average Confidence Level: ${avgConfidence.toFixed(1)}%\n`;
          briefingContext += `Geographic Distribution: ${JSON.stringify(input.recentEvents.fires.slice(0, 3))}\n\n`;
        }
      }

      if (input.activeLayers.includes("earthquakes")) {
        briefingContext += `Total Recent Earthquakes: ${input.earthquakeCount || 0}\n`;
        if (input.recentEvents?.earthquakes && input.recentEvents.earthquakes.length > 0) {
          const avgMagnitude = input.recentEvents.earthquakes.reduce((sum: number, eq: any) => sum + (eq.magnitude || 0), 0) / input.recentEvents.earthquakes.length;
          const maxMagnitude = Math.max(...input.recentEvents.earthquakes.map((eq: any) => eq.magnitude || 0));
          briefingContext += `Average Magnitude: ${avgMagnitude.toFixed(1)}\n`;
          briefingContext += `Maximum Magnitude: ${maxMagnitude}\n`;
          briefingContext += `Geographic Distribution: ${JSON.stringify(input.recentEvents.earthquakes.slice(0, 3))}\n\n`;
        }
      }

      const systemPrompt = `You are EarthGPT, a professional Earth data analyst. Provide a comprehensive but concise briefing of current Earth conditions. Include:
- Executive summary (1-2 sentences)
- Key findings by data type
- Notable patterns or concerns
- Recommendations for monitoring

Format the response clearly with sections and bullet points where appropriate.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: briefingContext },
          ],
        });

        const briefing = typeof response === 'string' 
          ? response 
          : response.choices?.[0]?.message?.content || 'No briefing available';

        return {
          success: true,
          briefing,
          timestamp: new Date(),
          activeLayers: input.activeLayers,
        };
      } catch (error) {
        console.error("[Briefing] LLM error:", error);
        return {
          success: false,
          briefing: "Unable to generate briefing. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date(),
          activeLayers: input.activeLayers,
        };
      }
    }),
});
