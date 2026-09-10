import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const chatRouter = router({
  // Chat completion with context about Earth events
  message: publicProcedure
    .input(
      z.object({
        message: z.string(),
        context: z.object({
          eventType: z.enum(["fire", "earthquake", "general"]).optional(),
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          eventData: z.record(z.string(), z.any()).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const systemPrompt = `You are EarthGPT, an AI assistant specialized in providing information about Earth's natural phenomena, including wildfires, earthquakes, weather patterns, and environmental events. 

You have access to real-time data about:
- Active wildfires (location, confidence level, brightness)
- Recent earthquakes (magnitude, depth, location)
- Weather patterns and atmospheric conditions

Provide accurate, concise, and helpful information about Earth events. When discussing specific events, reference their location coordinates and relevant metrics. Be conversational and engaging while maintaining scientific accuracy.`;

      const userMessage = input.message;

      // Build context-aware message if event data is provided
      let fullMessage = userMessage;
      if (input.context?.eventType && input.context?.eventData) {
        if (input.context.eventType === "fire") {
          fullMessage = `${userMessage}\n\nContext: This is about a wildfire at coordinates (${input.context.latitude}, ${input.context.longitude}). Event data: ${JSON.stringify(input.context.eventData)}`;
        } else if (input.context.eventType === "earthquake") {
          fullMessage = `${userMessage}\n\nContext: This is about an earthquake at coordinates (${input.context.latitude}, ${input.context.longitude}). Event data: ${JSON.stringify(input.context.eventData)}`;
        }
      }

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: fullMessage },
          ],
        });

        return {
          success: true,
          content: typeof response === 'string' ? response : response.choices?.[0]?.message?.content || 'No response',
        };
      } catch (error) {
        console.error("[Chat] LLM error:", error);
        return {
          success: false,
          content: "Sorry, I encountered an error processing your request. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Explain a specific event
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
      const systemPrompt = `You are EarthGPT, an expert in Earth's natural phenomena. Provide a detailed, engaging explanation of the event based on the data provided. Include:
- What is happening
- Why it's significant
- Potential impacts
- Any relevant context or patterns`;

      const eventDescription =
        input.eventType === "fire"
          ? `Wildfire at (${input.latitude.toFixed(2)}, ${input.longitude.toFixed(2)}). Confidence: ${input.eventData.confidence || "N/A"}%, Brightness: ${input.eventData.brightness || "N/A"}`
          : `Earthquake at (${input.latitude.toFixed(2)}, ${input.longitude.toFixed(2)}). Magnitude: ${input.eventData.magnitude || "N/A"}, Depth: ${input.eventData.depth || "N/A"}km`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please explain this ${input.eventType}: ${eventDescription}` },
          ],
        });

        return {
          success: true,
          explanation: typeof response === 'string' ? response : response.choices?.[0]?.message?.content || 'No response',
          eventType: input.eventType,
          location: { latitude: input.latitude, longitude: input.longitude },
        };
      } catch (error) {
        console.error("[Chat] Explain error:", error);
        return {
          success: false,
          explanation: "Unable to generate explanation. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),
});
