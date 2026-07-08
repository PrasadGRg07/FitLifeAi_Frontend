import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const getWeeklyTrend = (userId) => {
  try {
    const key = userId ? `predictions_${userId}` : null;
    if (!key) return [];
    const predictions = JSON.parse(localStorage.getItem(key) || '[]')
    return predictions.map((p) => ({
      day: new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }),
      health: p.output.health_score,
      stress: p.output.stress_score,
      activity: p.output.activity_score,
      sleep: p.output.sleep_quality
    }))
  } catch (error) {
    return []
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, setProfile, fetchProfile } = useProfile();
  const [trendData, setTrendData] = useState([]);
  const [todaySummary, setTodaySummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [navigate, fetchProfile]);

  useEffect(() => {
    if (profile.id) {
      const predKey = `predictions_${profile.id}`;
      const predictions = JSON.parse(localStorage.getItem(predKey) || '[]');
      setTrendData(getWeeklyTrend(profile.id));
      if (predictions.length > 0) {
        const latest = predictions[predictions.length - 1];
        setTodaySummary({
          health: latest.output?.health_score || 0,
          calories: latest.input?.calories_burned || 0,
          sleep: latest.input?.hours_sleep || 0,
          steps: latest.input?.daily_steps || 0,
          stress: latest.output?.stress_level || 0,
        });
      }
    }
  }, [profile.id]);

  useEffect(() => {
    const handleFocus = () => {
      const saved = localStorage.getItem('userProfile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [setProfile]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const [stats, setStats] = useState({
    steps: 8420,
    calories: 2350,
    sleep: 7.2,
    heartRate: 76,
  });

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfile({ ...profile, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleStatChange = (e) => {
    setStats({ ...stats, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex">
        
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-emerald-600 mb-10">FitLife AI</h1>
          <nav className="space-y-4 text-sm">
            <p
              onClick={() => navigate("/activity")}
              className="text-gray-500 cursor-pointer hover:text-green-500 transition"
            >
              Activity
            </p>
            <p
              onClick={() => navigate("/workout")}
              className="text-gray-500 cursor-pointer hover:text-green-500 transition"
            >
              Workout
            </p>
            <p
              onClick={() => navigate("/leaderboard")}
              className="text-gray-500 cursor-pointer hover:text-green-500 transition"
            >
              LeaderBoard
            </p>
            <p
              onClick={() => navigate("/settingprofile")}
              className="text-gray-500 cursor-pointer hover:text-green-500 transition"
            >
              Settings
            </p>
          </nav>
        </aside>

        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="px-6 py-10 space-y-10">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 border shadow max-w-md mx-auto flex flex-col items-center space-y-4">
              <div>
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border-2 border-gray-300">
                    {(profile.name || profile.username || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold">{profile.name || profile.username || 'User'}</h3>
              <div className="flex space-x-6 text-gray-600 text-sm">
                <p>Age: {profile.age ?? '—'}</p>
                <p>Height: {profile.height ?? '—'} {profile.height ? 'cm' : ''}</p>
                <p>Weight: {profile.weight ?? '—'} {profile.weight ? 'kg' : ''}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="text-center mb-6">
              <button
                onClick={() => navigate("/predict")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Health Prediction
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl p-6 border">
                <h3 className="text-xl font-semibold mb-4">Weekly Health Trend</h3>
                <div className="h-64 w-full">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={200}>
                      <LineChart data={trendData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} name="Health" />
                        <Line type="monotone" dataKey="stress" stroke="#3b82f6" strokeWidth={2} name="Stress" />
                        <Line type="monotone" dataKey="activity" stroke="#f59e0b" strokeWidth={2} name="Activity" />
                        <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} name="Sleep" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No prediction data yet. Use Health Prediction to see trends.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-xl font-semibold mb-4">Today's Summary</h3>
                {todaySummary ? (
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li>❤️ Health Score: <span className="font-semibold text-emerald-600">{todaySummary.health}</span></li>
                    <li>🔥 Calories Burned: <span className="font-semibold text-orange-500">{todaySummary.calories}</span></li>
                    <li>😴 Sleep Hours: <span className="font-semibold text-purple-500">{todaySummary.sleep}h</span></li>
                    <li>👟 Daily Steps: <span className="font-semibold text-blue-500">{todaySummary.steps.toLocaleString()}</span></li>
                    <li>😰 Stress Level: <span className="font-semibold text-red-400">{todaySummary.stress}/10</span></li>
                  </ul>
                ) : (
                  <div className="text-center text-gray-400 py-4 space-y-2">
                    <p className="text-3xl">📊</p>
                    <p className="text-sm">No data yet.</p>
                    <p className="text-xs text-emerald-600 "
                    >
                      Run a Health Prediction
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}