import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import { Download, Filter } from "lucide-react";
import { exportRegionalDataAsCSV, exportAnalyticsAsCSV, exportEngagementMetricsAsCSV } from "@/utils/csvExport";
import { toast } from "sonner";

export default function AdminAnalytics() {
  const [exportingRegional, setExportingRegional] = useState(false);
  const [exportingAnalytics, setExportingAnalytics] = useState(false);
  const [exportingEngagement, setExportingEngagement] = useState(false);

  const timeSeriesData = [
    { time: "00:00", fires: 12, earthquakes: 3, users: 45 },
    { time: "04:00", fires: 18, earthquakes: 5, users: 62 },
    { time: "08:00", fires: 35, earthquakes: 8, users: 120 },
    { time: "12:00", fires: 52, earthquakes: 15, users: 185 },
    { time: "16:00", fires: 48, earthquakes: 12, users: 165 },
    { time: "20:00", fires: 42, earthquakes: 10, users: 145 },
    { time: "23:59", fires: 28, earthquakes: 6, users: 78 },
  ];

  const regionData = [
    { region: "North America", fires: 245, earthquakes: 32, severity: 7.2 },
    { region: "South America", fires: 189, earthquakes: 28, severity: 6.8 },
    { region: "Europe", fires: 156, earthquakes: 18, severity: 5.4 },
    { region: "Africa", fires: 312, earthquakes: 45, severity: 8.1 },
    { region: "Asia", fires: 428, earthquakes: 67, severity: 8.9 },
    { region: "Oceania", fires: 89, earthquakes: 12, severity: 6.2 },
  ];

  const userEngagement = [
    { metric: "Page Views", value: 125430, change: "+12%" },
    { metric: "Unique Visitors", value: 8942, change: "+8%" },
    { metric: "Avg Session Duration", value: "4m 32s", change: "+15%" },
    { metric: "Bounce Rate", value: "32%", change: "-5%" },
    { metric: "Chat Interactions", value: 3421, change: "+28%" },
    { metric: "Data Queries", value: 5847, change: "+18%" },
  ];

  const handleExportRegional = async () => {
    try {
      setExportingRegional(true);
      exportRegionalDataAsCSV(regionData);
      toast.success("Regional data exported successfully!");
    } catch (error) {
      toast.error("Failed to export regional data");
      console.error(error);
    } finally {
      setExportingRegional(false);
    }
  };

  const handleExportAnalytics = async () => {
    try {
      setExportingAnalytics(true);
      exportAnalyticsAsCSV(timeSeriesData);
      toast.success("Analytics data exported successfully!");
    } catch (error) {
      toast.error("Failed to export analytics data");
      console.error(error);
    } finally {
      setExportingAnalytics(false);
    }
  };

  const handleExportEngagement = async () => {
    try {
      setExportingEngagement(true);
      exportEngagementMetricsAsCSV(userEngagement);
      toast.success("Engagement metrics exported successfully!");
    } catch (error) {
      toast.error("Failed to export engagement metrics");
      console.error(error);
    } finally {
      setExportingEngagement(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Analytics</h2>
            <p className="text-slate-400 mt-1">Detailed performance and usage analytics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Time Series Analysis */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">24-Hour Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleExportAnalytics}
              disabled={exportingAnalytics}
            >
              <Download className="w-4 h-4" />
              {exportingAnalytics ? "Exporting..." : "Export"}
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Legend />
              <Bar dataKey="fires" fill="#ef4444" />
              <Line type="monotone" dataKey="earthquakes" stroke="#eab308" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Regional Analysis */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Regional Distribution</h3>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleExportRegional}
              disabled={exportingRegional}
            >
              <Download className="w-4 h-4" />
              {exportingRegional ? "Exporting..." : "Export"}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Region</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Fires</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Earthquakes</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Max Severity</th>
                </tr>
              </thead>
              <tbody>
                {regionData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-white">{row.region}</td>
                    <td className="text-right py-3 px-4 text-red-400 font-semibold">{row.fires}</td>
                    <td className="text-right py-3 px-4 text-yellow-400 font-semibold">{row.earthquakes}</td>
                    <td className="text-right py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          row.severity >= 8
                            ? "bg-red-500/20 text-red-400"
                            : row.severity >= 7
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Engagement Metrics */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">User Engagement</h3>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleExportEngagement}
              disabled={exportingEngagement}
            >
              <Download className="w-4 h-4" />
              {exportingEngagement ? "Exporting..." : "Export"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userEngagement.map((item, index) => (
              <div key={index} className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-400 text-sm">{item.metric}</p>
                <div className="flex items-end justify-between mt-2">
                  <p className="text-2xl font-bold text-white">{item.value}</p>
                  <span className="text-green-400 text-sm font-medium">{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trend Analysis */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">7-Day Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={[
                { day: "Mon", value: 4200 },
                { day: "Tue", value: 4800 },
                { day: "Wed", value: 4500 },
                { day: "Thu", value: 5200 },
                { day: "Fri", value: 5800 },
                { day: "Sat", value: 6200 },
                { day: "Sun", value: 5900 },
              ]}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </AdminLayout>
  );
}
