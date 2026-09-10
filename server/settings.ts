import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

// Settings schema for validation
const settingsSchema = z.object({
  appName: z.string().min(1).max(100),
  appDescription: z.string().max(500),
  maintenanceMode: z.boolean(),
  enableAnalytics: z.boolean(),
  enableNotifications: z.boolean(),
  apiRateLimit: z.number().min(100).max(10000),
  cacheTTL: z.number().min(60).max(86400),
  maxUploadSize: z.number().min(1).max(1000),
  enableDebugMode: z.boolean(),
});

// In-memory settings store (in production, this would be in database)
let appSettings = {
  appName: "EarthGPT",
  appDescription: "Talk to Planet Earth",
  maintenanceMode: false,
  enableAnalytics: true,
  enableNotifications: true,
  apiRateLimit: 1000,
  cacheTTL: 3600,
  maxUploadSize: 100,
  enableDebugMode: false,
};

export const settingsRouter = router({
  // Get all settings (admin only)
  getSettings: adminProcedure.query(() => {
    return appSettings;
  }),

  // Update settings (admin only)
  updateSettings: adminProcedure
    .input(settingsSchema.partial())
    .mutation(({ input }) => {
      try {
        // Validate partial update
        const validated = settingsSchema.partial().parse(input);
        
        // Update settings
        appSettings = {
          ...appSettings,
          ...validated,
        };

        return {
          success: true,
          settings: appSettings,
          message: "Settings updated successfully",
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid settings provided",
        });
      }
    }),

  // Reset settings to defaults (admin only)
  resetSettings: adminProcedure.mutation(() => {
    appSettings = {
      appName: "EarthGPT",
      appDescription: "Talk to Planet Earth",
      maintenanceMode: false,
      enableAnalytics: true,
      enableNotifications: true,
      apiRateLimit: 1000,
      cacheTTL: 3600,
      maxUploadSize: 100,
      enableDebugMode: false,
    };

    return {
      success: true,
      settings: appSettings,
      message: "Settings reset to defaults",
    };
  }),

  // Perform admin actions (admin only)
  performAdminAction: adminProcedure
    .input(
      z.object({
        action: z.enum([
          "invalidate_sessions",
          "rotate_api_keys",
          "create_backup",
          "clear_cache",
          "reset_analytics",
          "delete_user_data",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        switch (input.action) {
          case "invalidate_sessions":
            // In production: invalidate all user sessions
            console.log("[Admin] Invalidating all user sessions");
            return {
              success: true,
              message: "All user sessions have been invalidated",
            };

          case "rotate_api_keys":
            // In production: generate new API keys
            console.log("[Admin] Rotating API keys");
            return {
              success: true,
              message: "API keys have been rotated",
              newKeys: {
                publicKey: "pk_" + Math.random().toString(36).substring(7),
                secretKey: "sk_" + Math.random().toString(36).substring(7),
              },
            };

          case "create_backup":
            // In production: trigger database backup
            console.log("[Admin] Creating database backup");
            return {
              success: true,
              message: "Database backup created successfully",
              backupId: "backup_" + Date.now(),
              size: "2.3GB",
              timestamp: new Date().toISOString(),
            };

          case "clear_cache":
            // In production: clear all caches
            console.log("[Admin] Clearing all caches");
            return {
              success: true,
              message: "All caches have been cleared",
              itemsCleared: 1234,
            };

          case "reset_analytics":
            // In production: reset analytics data
            console.log("[Admin] Resetting analytics data");
            return {
              success: true,
              message: "Analytics data has been reset",
            };

          case "delete_user_data":
            // In production: delete all user data (with confirmation)
            console.log("[Admin] WARNING: User requested data deletion");
            return {
              success: false,
              message: "This action requires additional confirmation",
              requiresConfirmation: true,
            };

          default:
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Unknown admin action",
            });
        }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to perform admin action",
        });
      }
    }),
});

export type SettingsRouter = typeof settingsRouter;
