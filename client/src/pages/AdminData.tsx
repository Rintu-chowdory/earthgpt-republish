import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Download, Upload, Search, RefreshCw } from "lucide-react";

export default function AdminData() {
  const [searchQuery, setSearchQuery] = useState("");

  const dataCollections = [
    {
      name: "Wildfires",
      count: 3847,
      lastUpdated: "2 minutes ago",
      size: "245 MB",
      status: "active",
    },
    {
      name: "Earthquakes",
      count: 1256,
      lastUpdated: "5 minutes ago",
      size: "89 MB",
      status: "active",
    },
    {
      name: "Weather Data",
      count: 5432,
      lastUpdated: "1 minute ago",
      size: "512 MB",
      status: "active",
    },
    {
      name: "User Sessions",
      count: 8942,
      lastUpdated: "30 seconds ago",
      size: "156 MB",
      status: "active",
    },
    {
      name: "Chat History",
      count: 12543,
      lastUpdated: "1 hour ago",
      size: "324 MB",
      status: "active",
    },
    {
      name: "System Logs",
      count: 45231,
      lastUpdated: "10 seconds ago",
      size: "678 MB",
      status: "active",
    },
  ];

  const recentOperations = [
    {
      operation: "Data Export",
      collection: "Wildfires",
      status: "completed",
      time: "2 hours ago",
      details: "Exported 3,847 records",
    },
    {
      operation: "Database Backup",
      collection: "All Collections",
      status: "completed",
      time: "4 hours ago",
      details: "Full backup completed successfully",
    },
    {
      operation: "Data Cleanup",
      collection: "System Logs",
      status: "completed",
      time: "1 day ago",
      details: "Removed 12,543 old records",
    },
    {
      operation: "Data Import",
      collection: "Weather Data",
      status: "completed",
      time: "2 days ago",
      details: "Imported 5,432 new records",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Data Management</h2>
            <p className="text-slate-400 mt-1">Manage and monitor all data collections</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <Button variant="outline" size="sm">
              Filter
            </Button>
          </div>
        </Card>

        {/* Data Collections */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Data Collections</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Collection</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Records</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Size</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Updated</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dataCollections.map((collection, index) => (
                  <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{collection.name}</td>
                    <td className="text-right py-3 px-4 text-slate-300">{collection.count.toLocaleString()}</td>
                    <td className="text-right py-3 px-4 text-slate-300">{collection.size}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        {collection.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{collection.lastUpdated}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Storage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm">Total Storage Used</p>
            <p className="text-3xl font-bold text-white mt-2">2.4 TB</p>
            <div className="mt-4 bg-slate-900 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
            </div>
            <p className="text-slate-400 text-xs mt-2">3.7 TB available</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm">Database Performance</p>
            <p className="text-3xl font-bold text-white mt-2">98.5%</p>
            <p className="text-green-400 text-sm mt-2">Optimal performance</p>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm">Last Backup</p>
            <p className="text-2xl font-bold text-white mt-2">4 hours ago</p>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Backup Now
            </Button>
          </Card>
        </div>

        {/* Recent Operations */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Operations</h3>
          <div className="space-y-3">
            {recentOperations.map((op, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-slate-700 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-white font-medium">
                        {op.operation} - {op.collection}
                      </p>
                      <p className="text-slate-400 text-sm">{op.details}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    {op.status}
                  </span>
                  <p className="text-slate-500 text-xs mt-1">{op.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
