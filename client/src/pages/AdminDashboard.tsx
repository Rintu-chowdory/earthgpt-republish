import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, TrendingUp, Users, Globe, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeUsers: 342,
    totalEvents: 5847,
    systemStatus: "operational",
  });

  // Mock data for charts
  const dailyData = [
    { date: "Mon", fires: 45, earthquakes: 12, users: 120 },
    { date: "Tue", fires: 52, earthquakes: 18, users: 145 },
    { date: "Wed", fires: 48, earthquakes: 15, users: 132 },
    { date: "Thu", fires: 61, earthquakes: 22, users: 165 },
    { date: "Fri", fires: 55, earthquakes: 19, users: 152 },
    { date: "Sat", fires: 67, earthquakes: 25, users: 178 },
    { date: "Sun", fires: 58, earthquakes: 21, users: 155 },
  ];

  const eventDistribution = [
    { name: "Wildfires", value: 3500, color: "#ef4444" },
    { name: "Earthquakes", value: 1200, color: "#eab308" },
    { name: "Weather", value: 1147, color: "#3b82f6" },
  ];

  const systemMetrics = [
    { label: "API Response Time", value: "145ms", status: "good" },
    { label: "Database Load", value: "32%", status: "good" },
    { label: "Cache Hit Rate", value: "87%", status: "good" },
    { label: "Error Rate", value: "0.02%", status: "good" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
            <p className="text-slate-400 mt-1">Real-time monitoring and analytics</p>
          </div>
          <Button variant="default">Refresh Data</Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
            <p className="text-green-400 text-sm mt-4">↑ 12% from last week</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Now</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
              </div>
              <Activity className="w-12 h-12 text-green-500 opacity-20" />
            </div>
            <p className="text-slate-400 text-sm mt-4">27% of total users</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Events</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalEvents.toLocaleString()}</p>
              </div>
              <Globe className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
            <p className="text-slate-400 text-sm mt-4">Last 30 days</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Status</p>
                <p className="text-2xl font-bold text-white mt-2 capitalize">{stats.systemStatus}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
            <p className="text-green-400 text-sm mt-4">99.9% uptime</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Activity Chart */}
          <Card className="bg-slate-800 border-slate-700 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
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
                <Bar dataKey="earthquakes" fill="#eab308" />
                <Bar dataKey="users" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Event Distribution */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Event Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* System Metrics */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-400 text-sm">{metric.label}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      metric.status === "good" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { event: "New user registered", time: "2 minutes ago", type: "info" },
              { event: "Large earthquake detected (7.2 magnitude)", time: "15 minutes ago", type: "alert" },
              { event: "System backup completed", time: "1 hour ago", type: "success" },
              { event: "API rate limit warning", time: "2 hours ago", type: "warning" },
              { event: "Database optimization completed", time: "3 hours ago", type: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 pb-3 border-b border-slate-700 last:border-0">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "alert"
                        ? "bg-red-500"
                        : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.event}</p>
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
