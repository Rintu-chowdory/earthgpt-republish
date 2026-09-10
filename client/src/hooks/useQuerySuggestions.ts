import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface QuerySuggestions {
  suggestions: string[];
  examples: string[];
  isLoading: boolean;
}

export const useQuerySuggestions = (activeLayers: string[], fireCount: number, earthquakeCount: number) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [examples, setExamples] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestionsQuery = trpc.query.suggestions.useQuery(
    {
      activeLayers: activeLayers as any,
      fireCount,
      earthquakeCount,
    },
    {
      enabled: activeLayers.length > 0,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const examplesQuery = trpc.query.examples.useQuery(
    {
      activeLayers: activeLayers as any,
    },
    {
      enabled: activeLayers.length > 0,
    }
  );

  useEffect(() => {
    if (suggestionsQuery.data?.suggestions) {
      setSuggestions(suggestionsQuery.data.suggestions);
    }
    if (examplesQuery.data?.examples) {
      setExamples(examplesQuery.data.examples);
    }
    setIsLoading(suggestionsQuery.isLoading || examplesQuery.isLoading);
  }, [suggestionsQuery.data, examplesQuery.data, suggestionsQuery.isLoading, examplesQuery.isLoading]);

  const refreshSuggestions = useCallback(() => {
    suggestionsQuery.refetch();
  }, [suggestionsQuery]);

  return {
    suggestions,
    examples,
    isLoading,
    refreshSuggestions,
  };
};
