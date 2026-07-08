import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Activity() {
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      const userId = token ? JSON.parse(atob(token.split(".")[1])).user_id : null;
      const predKey = userId ? `predictions_${userId}` : null;
      if (!predKey) return;

      const predictions = JSON.parse(localStorage.getItem(predKey) || "[]");
      const data = predictions.map((p) => ({
        day: new Date(p.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        steps: p.input?.daily_steps || 0,
        calories: p.input?.calories_burned || 0,
        sleep: p.input?.hours_sleep || 0,
        health: p.output?.health_score || 0,
      }));
      setActivityData(data);
    } catch {
      setActivityData([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-emerald-600 mb-10">FitLife AI</h1>
        <nav className="space-y-4 text-sm">
          <p className="font-semibold">Activity</p>
          <p onClick={() => navigate("/workout")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Workout</p>
          <p onClick={() => navigate("/leaderboard")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Leaderboard</p>
          <p onClick={() => navigate("/settingprofile")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Settings</p>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Activity Overview</h2>
          <button onClick={() => navigate("/dashboard")} className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Back to Dashboard
          </button>
        </header>

        <main className="px-6 py-8 space-y-6">
          {activityData.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center text-gray-400 space-y-2">
              <p className="text-4xl">📊</p>
              <p className="font-semibold text-gray-500">No activity data yet</p>
              <p className="text-sm">
                Go to{" "}
                <span onClick={() => navigate("/predict")} className="text-emerald-600 cursor-pointer underline">
                  Health Prediction
                </span>{" "}
                to start tracking your activity.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Avg Steps", value: Math.round(activityData.reduce((s, d) => s + d.steps, 0) / activityData.length).toLocaleString(), icon: "👟", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Avg Calories", value: Math.round(activityData.reduce((s, d) => s + d.calories, 0) / activityData.length).toLocaleString(), icon: "🔥", color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Avg Sleep", value: (activityData.reduce((s, d) => s + d.sleep, 0) / activityData.length).toFixed(1) + "h", icon: "😴", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Avg Health", value: Math.round(activityData.reduce((s, d) => s + d.health, 0) / activityData.length), icon: "❤️", color: "text-red-500", bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl p-5 border shadow-sm">
                    <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Steps & Calories Chart */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Steps & Calories Burned</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} name="Steps" dot={true} />
                      <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} name="Calories" dot={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sleep & Health Chart */}
              <div className="bg-white rounded-xl p-6 border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sleep Hours & Health Score</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep (hrs)" dot={true} />
                      <Line type="monotone" dataKey="health" stroke="#3b82f6" strokeWidth={2} name="Health Score" dot={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
