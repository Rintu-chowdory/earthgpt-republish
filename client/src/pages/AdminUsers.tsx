import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Trash2, Edit2, UserPlus, Download } from "lucide-react";
import { exportUsersAsCSV } from "@/utils/csvExport";
import { toast } from "sonner";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [exporting, setExporting] = useState(false);

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 minutes ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-02-20",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-03-10",
      lastActive: "30 minutes ago",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      role: "user",
      status: "inactive",
      joinDate: "2024-01-05",
      lastActive: "5 days ago",
    },
    {
      id: 5,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      status: "active",
      joinDate: "2024-04-01",
      lastActive: "10 minutes ago",
    },
    {
      id: 6,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-20",
      lastActive: "1 minute ago",
    },
  ];

  const stats = [
    { label: "Total Users", value: 1250, color: "blue" },
    { label: "Active Users", value: 1089, color: "green" },
    { label: "Inactive Users", value: 161, color: "yellow" },
    { label: "Admins", value: 8, color: "purple" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleExportUsers = async () => {
    try {
      setExporting(true);
      // Export filtered users
      const exportData = filteredUsers.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: user.joinDate,
        lastActive: user.lastActive,
      }));
      exportUsersAsCSV(exportData);
      toast.success(`Exported ${exportData.length} users successfully!`);
    } catch (error) {
      toast.error("Failed to export users");
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">User Management</h2>
            <p className="text-slate-400 mt-1">Manage users and their permissions</p>
          </div>
          <Button variant="default" className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 p-6">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value.toLocaleString()}</p>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleExportUsers}
              disabled={exporting}
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Users ({filteredUsers.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Active</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {user.role === "admin" && <Shield className="w-4 h-4 text-purple-400" />}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{user.joinDate}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">{user.lastActive}</td>
                    <td className="text-right py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Edit2 className="w-4 h-4" />
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

        {/* Permissions Matrix */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Role Permissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Permission</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Admin</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">User</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { permission: "View Dashboard", admin: true, user: false },
                  { permission: "View Analytics", admin: true, user: false },
                  { permission: "Manage Users", admin: true, user: false },
                  { permission: "View Data", admin: true, user: true },
                  { permission: "Export Data", admin: true, user: true },
                  { permission: "Use Chat", admin: true, user: true },
                  { permission: "Access Globe", admin: true, user: true },
                  { permission: "View System Status", admin: true, user: false },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-700">
                    <td className="py-3 px-4 text-white">{row.permission}</td>
                    <td className="text-center py-3 px-4">
                      {row.admin ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-slate-500">✗</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.user ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-slate-500">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
