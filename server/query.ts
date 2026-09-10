import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const queryRouter = router({
  // Generate contextual query suggestions based on active layers
  suggestions: publicProcedure
    .input(
      z.object({
        activeLayers: z.array(z.enum(["fires", "earthquakes", "weather"])),
        fireCount: z.number().optional(),
        earthquakeCount: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      // Build context for suggestions
      let context = "Generate 4 specific, actionable questions a user might ask about current Earth data:\n\n";

      if (input.activeLayers.includes("fires")) {
        context += `- There are ${input.fireCount || 0} active wildfires currently being monitored\n`;
      }
      if (input.activeLayers.includes("earthquakes")) {
        context += `- There are ${input.earthquakeCount || 0} recent earthquakes in the database\n`;
      }
      if (input.activeLayers.includes("weather")) {
        context += `- Weather data layers are active\n`;
      }

      context += `\nGenerate exactly 4 questions that users would naturally ask about this data. Format as a JSON array of strings, one question per string. Make questions specific and actionable.`;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates natural language questions about Earth data. Always respond with valid JSON.",
            },
            { role: "user", content: context },
          ],
        });

        const responseText = typeof response === 'string' 
          ? response 
          : response.choices?.[0]?.message?.content || '[]';

        // Ensure responseText is a string before calling match
        const responseStr = typeof responseText === 'string' ? responseText : JSON.stringify(responseText);
        const jsonMatch = responseStr.match(/\[[\s\S]*\]/);
        const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        return {
          success: true,
          suggestions: Array.isArray(suggestions) ? suggestions.slice(0, 4) : [],
        };
      } catch (error) {
        console.error("[Query] Suggestions error:", error);
        // Return default suggestions based on active layers
        const defaults: string[] = [];
        if (input.activeLayers.includes("fires")) {
          defaults.push("Where are the most active wildfires right now?");
          defaults.push("What is the average confidence level of detected fires?");
        }
        if (input.activeLayers.includes("earthquakes")) {
          defaults.push("What was the strongest earthquake detected recently?");
          defaults.push("Which regions are experiencing the most seismic activity?");
        }
        if (input.activeLayers.includes("weather")) {
          defaults.push("What are the current weather patterns?");
          defaults.push("Where is the most severe weather occurring?");
        }

        return {
          success: false,
          suggestions: defaults.slice(0, 4),
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }),

  // Enhance user query with context about active layers
  enhance: publicProcedure
    .input(
      z.object({
        userQuery: z.string(),
        activeLayers: z.array(z.enum(["fires", "earthquakes", "weather"])),
        fireCount: z.number().optional(),
        earthquakeCount: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Build enhanced context
      let enhancedContext = `User query: "${input.userQuery}"\n\nContext about active data layers:\n`;

      if (input.activeLayers.includes("fires")) {
        enhancedContext += `- Wildfires: ${input.fireCount || 0} active fires\n`;
      }
      if (input.activeLayers.includes("earthquakes")) {
        enhancedContext += `- Earthquakes: ${input.earthquakeCount || 0} recent events\n`;
      }
      if (input.activeLayers.includes("weather")) {
        enhancedContext += `- Weather: Active weather data layers\n`;
      }

      const systemPrompt = `You are EarthGPT, an expert Earth data analyst. The user has asked a question about Earth data. 
Based on the active data layers and the user's query, provide a comprehensive, accurate response. 
If the query relates to specific data layers, focus your response on those layers.
Be specific with numbers, locations, and metrics when available.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: enhancedContext },
          ],
        });

        const answerText = typeof response === 'string' 
          ? response 
          : response.choices?.[0]?.message?.content || 'Unable to process query';
        const answer = typeof answerText === 'string' ? answerText : JSON.stringify(answerText);

        return {
          success: true,
          originalQuery: input.userQuery,
          answer,
          contextLayers: input.activeLayers,
        };
      } catch (error) {
        console.error("[Query] Enhance error:", error);
        return {
          success: false,
          originalQuery: input.userQuery,
          answer: "I encountered an error processing your query. Please try again.",
          error: error instanceof Error ? error.message : "Unknown error",
          contextLayers: input.activeLayers,
        };
      }
    }),

  // Get example queries for empty state
  examples: publicProcedure
    .input(
      z.object({
        activeLayers: z.array(z.enum(["fires", "earthquakes", "weather"])),
      })
    )
    .query(({ input }) => {
      const examples: Record<string, string[]> = {
        fires: [
          "Show me the highest confidence wildfires",
          "Which regions have the most active fires?",
          "What's the trend in wildfire activity?",
        ],
        earthquakes: [
          "What was the strongest earthquake today?",
          "Which areas are most seismically active?",
          "Show me earthquakes above magnitude 5",
        ],
        weather: [
          "What's the current cloud coverage?",
          "Where is the most severe weather?",
          "Show me atmospheric temperature anomalies",
        ],
      };

      const relevantExamples: string[] = [];
      input.activeLayers.forEach((layer) => {
        if (examples[layer]) {
          relevantExamples.push(...examples[layer]);
        }
      });

      return {
        success: true,
        examples: relevantExamples.slice(0, 3),
        activeLayers: input.activeLayers,
      };
    }),
});
