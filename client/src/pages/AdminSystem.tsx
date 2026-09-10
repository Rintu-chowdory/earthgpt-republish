import React, { useState, useEffect } from "react";
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
} from "recharts";
import { AlertCircle, CheckCircle, Clock, Zap, Database, Server } from "lucide-react";

export default function AdminSystem() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const systemMetrics = [
    {
      label: "API Response Time",
      value: "145ms",
      status: "healthy",
      icon: Zap,
      change: "-12%",
    },
    {
      label: "Database Load",
      value: "34%",
      status: "healthy",
      icon: Database,
      change: "+5%",
    },
    {
      label: "Server Uptime",
      value: "99.9%",
      status: "healthy",
      icon: Server,
      change: "Stable",
    },
    {
      label: "Cache Hit Rate",
      value: "87%",
      status: "healthy",
      icon: CheckCircle,
      change: "+8%",
    },
  ];

  const apiStatus = [
    { name: "NASA FIRMS", status: "operational", latency: "234ms", requests: "1,245" },
    { name: "USGS Earthquakes", status: "operational", latency: "156ms", requests: "892" },
    { name: "NASA GIBS", status: "operational", latency: "189ms", requests: "2,341" },
    { name: "OpenAI LLM", status: "operational", latency: "1,234ms", requests: "543" },
  ];

  const performanceData = [
    { time: "00:00", cpu: 25, memory: 45, disk: 32 },
    { time: "04:00", cpu: 18, memory: 38, disk: 32 },
    { time: "08:00", cpu: 42, memory: 62, disk: 35 },
    { time: "12:00", cpu: 65, memory: 78, disk: 38 },
    { time: "16:00", cpu: 58, memory: 71, disk: 36 },
    { time: "20:00", cpu: 48, memory: 65, disk: 34 },
    { time: "23:59", cpu: 32, memory: 52, disk: 33 },
  ];

  const systemLogs = [
    { time: "18:45:23", level: "info", message: "User authentication successful", user: "john@example.com" },
    { time: "18:44:15", level: "info", message: "Data export completed", user: "admin" },
    { time: "18:42:08", level: "warning", message: "API rate limit approaching (89%)", service: "FIRMS" },
    { time: "18:40:32", level: "info", message: "Cache refresh completed", records: "12,543" },
    { time: "18:38:45", level: "info", message: "Database backup completed", size: "2.3GB" },
    { time: "18:35:12", level: "error", message: "Failed to fetch earthquake data", retries: "3/3" },
    { time: "18:32:01", level: "info", message: "System health check passed", score: "98%" },
    { time: "18:28:44", level: "info", message: "New user registered", email: "new@example.com" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">System Monitoring</h2>
            <p className="text-slate-400 mt-1">Real-time system health and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
            </Button>
          </div>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{metric.label}</p>
                    <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                    <p className="text-green-400 text-xs mt-2">{metric.change}</p>
                  </div>
                  <Icon className="w-8 h-8 text-green-400" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* API Status */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">External API Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {apiStatus.map((api, index) => (
              <div key={index} className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <p className="text-white font-medium">{api.name}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-green-400">{api.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className="text-white">{api.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Requests:</span>
                    <span className="text-white">{api.requests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Performance (24h)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="cpu" stroke="#ef4444" fillOpacity={1} fill="url(#colorCpu)" />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorMemory)"
              />
              <Area type="monotone" dataKey="disk" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDisk)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* System Logs */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Logs</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {systemLogs.map((log, index) => (
              <div key={index} className="bg-slate-900 rounded p-3 flex gap-3 text-sm">
                <div className="flex-shrink-0 mt-0.5">
                  {log.level === "error" ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : log.level === "warning" ? (
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-slate-500">{log.time}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.level === "error"
                          ? "bg-red-500/20 text-red-400"
                          : log.level === "warning"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {log.level}
                    </span>
                  </div>
                  <p className="text-slate-300">{log.message}</p>
                  {(log.user || log.service || log.records || log.size || log.retries || log.score || log.email) && (
                    <p className="text-slate-500 text-xs mt-1">
                      {log.user && `User: ${log.user}`}
                      {log.service && `Service: ${log.service}`}
                      {log.records && `Records: ${log.records}`}
                      {log.size && `Size: ${log.size}`}
                      {log.retries && `Retries: ${log.retries}`}
                      {log.score && `Score: ${log.score}`}
                      {log.email && `Email: ${log.email}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Health Alerts */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
          <div className="space-y-2">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">API Rate Limit Warning</p>
                <p className="text-yellow-300 text-sm">NASA FIRMS API is at 89% rate limit. Consider implementing request throttling.</p>
              </div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-400 font-medium">All Systems Operational</p>
                <p className="text-green-300 text-sm">Database, APIs, and services are running normally.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
