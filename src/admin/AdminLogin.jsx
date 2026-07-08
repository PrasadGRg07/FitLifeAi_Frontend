import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${BASE_URL}/api/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();

      // Verify the user is actually an admin/staff
      const profileRes = await fetch(`${BASE_URL}/api/users/admin/stats/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      if (!profileRes.ok) throw new Error("Access denied. Admin only.");

      localStorage.setItem("admin_token", data.access);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-600">FitLife AI</h1>
          <p className="text-gray-500 mt-1 text-sm">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome back, Admin</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to your admin account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your admin username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>


        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-sm text-gray-400 hover:text-emerald-600 mt-4 transition-colors"
        >
          ← Back to App
        </button>
      </div>
    </div>
  );
}