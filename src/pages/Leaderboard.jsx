import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";

const BADGES = ["🥇", "🥈", "🥉"];
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const MODES = [
  { key: 'average', label: '📊 Weekly Average', desc: 'Average health score over the last 7 days' },
  { key: 'best',    label: '🏆 Best Score',     desc: 'Highest single score in the last 7 days' },
  { key: 'streak',  label: '🔥 Streak Bonus',   desc: 'Consistency score: avg × days active this week' },
];

export default function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [mode, setMode] = useState('average');

  useEffect(() => {
    authFetch("/api/users/profile/")
      .then((r) => r.json())
      .then((data) => setCurrentUserId(data?.user?.id))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/api/users/leaderboard/?mode=${mode}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch leaderboard");
        return r.json();
      })
      .then((data) => setUsers(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [mode]);

  const activeMode = MODES.find(m => m.key === mode);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-emerald-600 mb-10">FitLife AI</h1>
        <nav className="space-y-4 text-sm">
          <p onClick={() => navigate("/activity")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Activity</p>
          <p onClick={() => navigate("/workout")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Workout</p>
          <p onClick={() => navigate("/leaderboard")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Leaderboard</p>
          <p onClick={() => navigate("/settingprofile")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Settings</p>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Leaderboard 🏆</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </header>

        <main className="px-6 py-10 max-w-3xl mx-auto space-y-6">
          {/* Mode Tabs */}
          <div className="flex gap-2 flex-wrap">
            {MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  mode === m.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border text-gray-600 hover:border-emerald-400'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm text-center">{activeMode.desc}</p>

          {loading && <p className="text-center text-gray-400 py-10">Loading leaderboard...</p>}

          {error && <p className="text-center text-red-500 bg-red-50 rounded-lg px-4 py-3">⚠️ {error}</p>}

          {!loading && !error && users.length === 0 && (
            <div className="text-center py-16 text-gray-400 space-y-2">
              <p className="text-4xl">🏅</p>
              <p className="font-semibold text-gray-500">No scores yet!</p>
              <p className="text-sm">Be the first — go to <span onClick={() => navigate("/predict")} className="text-emerald-600 cursor-pointer underline">Health Prediction</span> and submit your metrics.</p>
            </div>
          )}

          {!loading && !error && users.length > 0 && (
            <div className="bg-white rounded-xl border shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-emerald-700 text-left">
                  <tr>
                    <th className="px-6 py-3">Rank</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Days Active</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const isMe = user.id === currentUserId;
                    return (
                      <tr
                        key={user.id}
                        className={`border-t transition ${isMe ? "bg-emerald-50 font-semibold" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-6 py-4 text-lg">{BADGES[index] ?? `#${index + 1}`}</td>
                        <td className="px-6 py-4">
                          {user.name}
                          {isMe && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">You</span>}
                        </td>
                        <td className="px-6 py-4 text-emerald-600 font-semibold">{user.score}</td>
                        <td className="px-6 py-4 text-gray-500">{user.days_active} / 7</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
