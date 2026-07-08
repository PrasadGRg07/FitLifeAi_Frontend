import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const MOCK_ANALYTICS = [
  { month: "Jan", users: 120, workouts: 540, active: 98 },
  { month: "Feb", users: 145, workouts: 620, active: 112 },
  { month: "Mar", users: 180, workouts: 780, active: 140 },
  { month: "Apr", users: 210, workouts: 910, active: 175 },
  { month: "May", users: 265, workouts: 1100, active: 220 },
  { month: "Jun", users: 310, workouts: 1350, active: 260 },
];

const MOCK_CONTENT = [
  { id: 1, title: "Beginner Full Body Workout", category: "Workout", status: "published", views: 1240 },
  { id: 2, title: "High Protein Meal Plan", category: "Nutrition", status: "published", views: 890 },
  { id: 3, title: "30-Day Cardio Challenge", category: "Challenge", status: "draft", views: 0 },
  { id: 4, title: "Muscle Recovery Guide", category: "Tips", status: "published", views: 456 },
];

const TABS = ["Overview", "Users", "Analytics"];

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const adminFetch = async (url, options = {}) => {
  const token = localStorage.getItem("admin_token");
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const statusBadge = (status) => {
  const map = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-500",
    banned: "bg-red-100 text-red-600",
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-yellow-100 text-yellow-700",
  };
  return `text-xs px-2.5 py-0.5 rounded-full font-medium ${map[status] || "bg-gray-100 text-gray-500"}`;
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_users: 0, active_users: 0, banned_users: 0, total_workouts: 0 });
  const [analytics, setAnalytics] = useState([]);
  const [content, setContent] = useState(MOCK_CONTENT);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState({ title: "", category: "Workout", status: "draft" });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { navigate("/admin/login"); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, statsData, analyticsData] = await Promise.all([
        adminFetch("/api/users/admin/users/"),
        adminFetch("/api/users/admin/stats/"),
        adminFetch("/api/users/admin/analytics/"),
      ]);
      setUsers(usersData);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch {
      navigate("/admin/login");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await adminFetch(`/api/users/admin/users/${id}/`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setStats((prev) => ({ ...prev, total_users: prev.total_users - 1 }));
      showToast("User deleted");
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await adminFetch(`/api/users/admin/users/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      // refresh stats
      const statsData = await adminFetch("/api/users/admin/stats/");
      setStats(statsData);
      showToast(`User ${status === "banned" ? "banned" : status === "active" ? "activated" : "deactivated"}`);
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const saveEditUser = async () => {
    try {
      await adminFetch(`/api/users/admin/users/${editUser.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: editUser.status }),
      });
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? editUser : u)));
      setEditUser(null);
      showToast("User updated");
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  const deleteContent = (id) => {
    setContent((prev) => prev.filter((c) => c.id !== id));
    showToast("Content deleted");
  };

  const addContent = () => {
    if (!newContent.title.trim()) return;
    setContent((prev) => [...prev, { ...newContent, id: Date.now(), views: 0 }]);
    setNewContent({ title: "", category: "Workout", status: "draft" });
    setShowAddContent(false);
    showToast("Content added");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">

      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex-col hidden md:flex flex-shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-emerald-600">FitLife AI</h1>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${activeTab === tab ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
            >
              {tab === "Overview" && "📊 "}
              {tab === "Users" && "👥 "}
              {tab === "Analytics" && "📈 "}
              {tab === "Content" && "📝 "}
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p  className="w-full text-xs text-gray-400 hover:text-emerald-600 transition-colors mb-2">
            ← Back to App
          </p>
          <button onClick={handleLogout} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-sm font-medium transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">{activeTab}</h2>
            <p className="text-xs text-gray-400 mt-0.5">FitLife AI · Admin</p>
          </div>
          <div className="flex gap-1 md:hidden">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === t ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                {t}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto space-y-6">

          {/* OVERVIEW */}
          {activeTab === "Overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: stats.total_users, icon: "👥", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Active Users", value: stats.active_users, icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Total Exercises", value: stats.total_workouts, icon: "💪", color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Banned", value: stats.banned_users, icon: "🚫", color: "text-red-600", bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-5 border shadow-sm">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-4">User Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} name="Total Users" dot={false} />
                      <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} name="Active Users" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Recent Users</h3>
                  <button onClick={() => setActiveTab("Users")} className="text-xs text-emerald-600 hover:underline">View all →</button>
                </div>
                <div className="divide-y">
                  {users.slice(0, 4).map((u) => (
                    <div key={u.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                          {u.name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name || u.username}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                      <span className={statusBadge(u.status)}>{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* USERS */}
          {activeTab === "Users" && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search by name, email or username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                />
                <span className="text-xs text-gray-400">{filteredUsers.length} users</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {["User", "Username", "Health Score", "Joined", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600 flex-shrink-0">
                              {u.name?.[0]?.toUpperCase() || u.username?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{u.name || "-"}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{u.username}</td>
                        <td className="px-6 py-4 font-medium text-emerald-600">{u.weekly_score}</td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{u.joined}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.status}
                            onChange={(e) => updateUserStatus(u.id, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none
                              ${u.status === "active" ? "bg-green-100 text-green-700" :
                                u.status === "banned" ? "bg-red-100 text-red-600" :
                                "bg-gray-100 text-gray-500"}`}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                            <option value="banned">banned</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setEditUser({ ...u })}
                              className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium">
                              Edit
                            </button>
                            <button onClick={() => deleteUser(u.id)}
                              className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors font-medium">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "Analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Total Users", value: stats.total_users, color: "text-emerald-600" },
                  { label: "Active Users", value: stats.active_users, color: "text-blue-600" },
                  { label: "Banned Users", value: stats.banned_users, color: "text-red-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-5 border shadow-sm">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-4">Monthly User Trends</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} name="Total Users" />
                      <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} name="Active Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="font-semibold mb-4">Avg Health Score per Month</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="scores" fill="#10b981" radius={[6, 6, 0, 0]} name="Health Scores" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {activeTab === "Content" && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={() => setShowAddContent(true)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                  + Add Content
                </button>
              </div>
              {showAddContent && (
                <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                  <h3 className="font-semibold">New Content</h3>
                  <input type="text" placeholder="Title" value={newContent.title}
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50" />
                  <div className="flex gap-3">
                    <select value={newContent.category} onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50">
                      {["Workout", "Nutrition", "Challenge", "Tips"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <select value={newContent.status} onChange={(e) => setNewContent({ ...newContent, status: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={addContent} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">Add</button>
                    <button onClick={() => setShowAddContent(false)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {["Title", "Category", "Views", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {content.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{c.title}</td>
                        <td className="px-6 py-4"><span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-medium">{c.category}</span></td>
                        <td className="px-6 py-4 text-gray-500">{c.views.toLocaleString()}</td>
                        <td className="px-6 py-4"><span className={statusBadge(c.status)}>{c.status}</span></td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setContent((prev) => prev.map((item) => item.id === c.id ? { ...item, status: item.status === "published" ? "draft" : "published" } : item)); showToast("Content status updated"); }}
                              className="text-xs px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors font-medium">Toggle</button>
                            <button onClick={() => deleteContent(c.id)}
                              className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-lg">Edit User — {editUser.username}</h3>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Status</label>
              <select value={editUser.status} onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={saveEditUser} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">Save Changes</button>
              <button onClick={() => setEditUser(null)} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all
          ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}
    </div>
  );
}
