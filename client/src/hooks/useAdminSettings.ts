import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export interface AdminSettings {
  appName: string;
  appDescription: string;
  maintenanceMode: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  apiRateLimit: number;
  cacheTTL: number;
  maxUploadSize: number;
  enableDebugMode: boolean;
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings
  const { data: fetchedSettings, isLoading: isFetching } = trpc.settings.getSettings.useQuery(undefined, {
    enabled: true,
  });

  // Update settings mutation
  const updateMutation = trpc.settings.updateSettings.useMutation({
    onSuccess: (data) => {
      setSettings(data.settings);
      setIsSaving(false);
      toast.success(data.message);
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error(error.message || "Failed to save settings");
    },
  });

  // Reset settings mutation
  const resetMutation = trpc.settings.resetSettings.useMutation({
    onSuccess: (data) => {
      setSettings(data.settings);
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reset settings");
    },
  });

  // Admin action mutation
  const actionMutation = trpc.settings.performAdminAction.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to perform admin action");
    },
  });

  // Update local state when fetched settings change
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
      setIsLoading(false);
    }
  }, [fetchedSettings]);

  // Set initial loading state
  useEffect(() => {
    if (isFetching) {
      setIsLoading(true);
    }
  }, [isFetching]);

  const handleSettingChange = (key: keyof AdminSettings, value: unknown) => {
    if (settings) {
      setSettings({
        ...settings,
        [key]: value,
      });
    }
  };

  const handleSave = async (updatedSettings: Partial<AdminSettings>) => {
    setIsSaving(true);
    await updateMutation.mutateAsync(updatedSettings);
  };

  const handleReset = async () => {
    await resetMutation.mutateAsync();
  };

  const performAction = async (
    action:
      | "invalidate_sessions"
      | "rotate_api_keys"
      | "create_backup"
      | "clear_cache"
      | "reset_analytics"
      | "delete_user_data"
  ) => {
    await actionMutation.mutateAsync({ action });
  };

  return {
    settings,
    isLoading,
    isSaving,
    handleSettingChange,
    handleSave,
    handleReset,
    performAction,
    isPerformingAction: actionMutation.isPending,
  };
}
