/**
 * CSV Export Utilities
 * Provides functions to export data as CSV files
 */

interface CSVExportOptions {
  filename?: string;
  headers?: string[];
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create header row
  const headerRow = headers.map((h) => `"${h}"`).join(",");

  // Create data rows
  const dataRows = data.map((row) => {
    return headers
      .map((header) => {
        const value = row[header];
        // Handle null/undefined
        if (value === null || value === undefined) {
          return '""';
        }
        // Convert to string and escape quotes
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data as CSV file
 */
export function exportAsCSV(
  data: Record<string, unknown>[],
  options: CSVExportOptions = {}
): void {
  const { filename = `export-${new Date().toISOString().split("T")[0]}.csv` } = options;

  const csvContent = convertToCSV(data);
  downloadCSV(csvContent, filename);
}

/**
 * Export regional data as CSV
 */
export function exportRegionalDataAsCSV(
  data: Array<{
    region: string;
    fires: number;
    earthquakes: number;
    severity: number;
  }>
): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `regional-analysis-${timestamp}.csv`;
  exportAsCSV(data, { filename });
}

/**
 * Export user data as CSV
 */
export function exportUsersAsCSV(
  data: Array<{
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
    lastActive: string;
  }>
): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `users-${timestamp}.csv`;
  exportAsCSV(data, { filename });
}

/**
 * Export analytics data as CSV
 */
export function exportAnalyticsAsCSV(
  data: Array<{
    time?: string;
    day?: string;
    date?: string;
    fires?: number;
    earthquakes?: number;
    users?: number;
    value?: number;
  }>
): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `analytics-${timestamp}.csv`;
  exportAsCSV(data, { filename });
}

/**
 * Export engagement metrics as CSV
 */
export function exportEngagementMetricsAsCSV(
  data: Array<{
    metric: string;
    value: string | number;
    change: string;
  }>
): void {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `engagement-metrics-${timestamp}.csv`;
  exportAsCSV(data, { filename });
}
