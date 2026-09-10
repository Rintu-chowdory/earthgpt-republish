import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Save, RotateCcw, Bell, Lock, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings } from "@/hooks/useAdminSettings";

export default function AdminSettings() {
  const { settings, isLoading, isSaving, handleSettingChange, handleSave, handleReset, performAction, isPerformingAction } = useAdminSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  if (!localSettings) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-400">Failed to load settings</p>
        </div>
      </AdminLayout>
    );
  }

  const handleLocalChange = (key: string, value: unknown) => {
    setLocalSettings((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  const handleSaveClick = async () => {
    const changes: Record<string, unknown> = {};
    if (localSettings && settings) {
      Object.keys(localSettings).forEach((key) => {
        const localValue = (localSettings as unknown as Record<string, unknown>)[key];
        const settingsValue = (settings as unknown as Record<string, unknown>)[key];
        if (localValue !== settingsValue) {
          changes[key] = localValue;
        }
      });
    }

    if (Object.keys(changes).length > 0) {
      await handleSave(changes);
    } else {
      toast.info("No changes to save");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Settings</h2>
            <p className="text-slate-400 mt-1">Configure application and system settings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="default" size="sm" className="gap-2" onClick={handleSaveClick} disabled={isSaving}>
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Application Settings */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Application Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Application Name</label>
              <Input
                value={localSettings.appName}
                onChange={(e) => handleLocalChange("appName", e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Application Description</label>
              <Input
                value={localSettings.appDescription}
                onChange={(e) => handleLocalChange("appDescription", e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div>
                <p className="text-white font-medium">Maintenance Mode</p>
                <p className="text-slate-400 text-sm">Disable access for all non-admin users</p>
              </div>
              <Switch
                checked={localSettings.maintenanceMode}
                onCheckedChange={(checked) => handleLocalChange("maintenanceMode", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Feature Toggles */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Feature Toggles
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Analytics</p>
                <p className="text-slate-400 text-sm">Enable usage analytics and tracking</p>
              </div>
              <Switch
                checked={localSettings.enableAnalytics}
                onCheckedChange={(checked) => handleLocalChange("enableAnalytics", checked)}
              />
            </div>
            <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-slate-400 text-sm">Enable system and user notifications</p>
              </div>
              <Switch
                checked={localSettings.enableNotifications}
                onCheckedChange={(checked) => handleLocalChange("enableNotifications", checked)}
              />
            </div>
            <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Debug Mode</p>
                <p className="text-slate-400 text-sm">Enable verbose logging and error details</p>
              </div>
              <Switch
                checked={localSettings.enableDebugMode}
                onCheckedChange={(checked) => handleLocalChange("enableDebugMode", checked)}
              />
            </div>
          </div>
        </Card>

        {/* Performance Settings */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Performance Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">API Rate Limit (requests/hour)</label>
              <Input
                type="number"
                value={localSettings.apiRateLimit}
                onChange={(e) => handleLocalChange("apiRateLimit", parseInt(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-slate-400 text-xs mt-1">Maximum API requests allowed per hour</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Cache TTL (seconds)</label>
              <Input
                type="number"
                value={localSettings.cacheTTL}
                onChange={(e) => handleLocalChange("cacheTTL", parseInt(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-slate-400 text-xs mt-1">Time-to-live for cached data</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Upload Size (MB)</label>
              <Input
                type="number"
                value={localSettings.maxUploadSize}
                onChange={(e) => handleLocalChange("maxUploadSize", parseInt(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-slate-400 text-xs mt-1">Maximum file size for uploads</p>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security Settings
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Session Management</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isPerformingAction}
                onClick={() => performAction("invalidate_sessions")}
              >
                {isPerformingAction ? "Processing..." : "Invalidate All Sessions"}
              </Button>
              <p className="text-slate-400 text-xs mt-2">Force all users to re-authenticate</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-white font-medium mb-2">API Keys</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isPerformingAction}
                onClick={() => performAction("rotate_api_keys")}
              >
                {isPerformingAction ? "Processing..." : "Rotate API Keys"}
              </Button>
              <p className="text-slate-400 text-xs mt-2">Generate new API keys for external integrations</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Database Backup</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={isPerformingAction}
                onClick={() => performAction("create_backup")}
              >
                {isPerformingAction ? "Processing..." : "Create Backup Now"}
              </Button>
              <p className="text-slate-400 text-xs mt-2">Last backup: 2 hours ago</p>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/10 border-red-500/30 p-6">
          <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full text-red-400 hover:text-red-300 border-red-500/30"
              disabled={isPerformingAction}
              onClick={() => performAction("clear_cache")}
            >
              {isPerformingAction ? "Processing..." : "Clear All Cache"}
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-400 hover:text-red-300 border-red-500/30"
              disabled={isPerformingAction}
              onClick={() => performAction("reset_analytics")}
            >
              {isPerformingAction ? "Processing..." : "Reset All Analytics"}
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-400 hover:text-red-300 border-red-500/30"
              disabled={isPerformingAction}
              onClick={() => performAction("delete_user_data")}
            >
              {isPerformingAction ? "Processing..." : "Delete All User Data"}
            </Button>
          </div>
          <p className="text-red-300 text-xs mt-4">
            ⚠️ These actions are irreversible. Please proceed with caution.
          </p>
        </Card>
      </div>
    </AdminLayout>
  );
}
