import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { predictAll } from '../utils/mlApi'

function Predict() {
  const navigate = useNavigate()
  const { profile, fetchProfile } = useProfile()
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [navigate, fetchProfile]);
  
  const [formData, setFormData] = useState({
    age: '',
    gender: 'M',
    height_cm: '',
    weight_kg: '',
    bmi: '',
    calories_burned: '',
    avg_heart_rate: '',
    daily_steps: '',
    hours_sleep: '',
    hydration_level: '',
    activity_type: 'Running',
    intensity: 'Medium',
    health_condition: 'Unknown'
  })

  useEffect(() => {
    if (profile.age) {
      const bmi = profile.weight && profile.height 
        ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1) 
        : '';
      setFormData(prev => ({
        ...prev,
        age: profile.age || '',
        gender: profile.gender || 'M',
        height_cm: profile.height || '',
        weight_kg: profile.weight || '',
        bmi: bmi
      }));
    }
  }, [profile]);

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = {
      ...formData,
      [name]: ['age', 'daily_steps', 'hydration_level', 'participant_id'].includes(name) 
        ? parseInt(value) 
        : ['height_cm', 'weight_kg', 'bmi', 'calories_burned', 'avg_heart_rate', 'hours_sleep'].includes(name)
        ? parseFloat(value)
        : value
    }

    if (name === 'height_cm' || name === 'weight_kg') {
      const height = name === 'height_cm' ? parseFloat(value) : formData.height_cm
      const weight = name === 'weight_kg' ? parseFloat(value) : formData.weight_kg
      if (height && weight) {
        const heightInMeters = height / 100
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1)
        newFormData.bmi = parseFloat(bmi)
      }
    }

    setFormData(newFormData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null) // Clear previous results
    try {
      const data = await predictAll(formData)
      if (data.detail) {
        alert('Error: ' + data.detail)
      } else {
        console.log('API Response:', data) // Debug log
        setResult(data)
        
        const token = localStorage.getItem('access_token');
        const userId = token ? JSON.parse(atob(token.split('.')[1])).user_id : null;
        const predKey = userId ? `predictions_${userId}` : 'predictions';
        const predictions = JSON.parse(localStorage.getItem(predKey) || '[]')
        predictions.push({
          date: new Date().toISOString(),
          input: formData,
          output: data
        })
        if (predictions.length > 7) predictions.shift()
        localStorage.setItem(predKey, JSON.stringify(predictions))

        // Save health score to backend for leaderboard
        if (token) {
          fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/users/score/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ weekly_score: data.health_score })
          })
        }
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500 text-white'
    if (score >= 60) return 'bg-blue-500 text-white'
    if (score >= 40) return 'bg-yellow-500 text-white'
    return 'bg-red-500 text-white'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const getStressLabel = (level) => {
    if (level <= 3) return 'Low Stress'
    if (level <= 6) return 'Medium Stress'
    return 'High Stress'
  }

  const getStressColor = (level) => {
    if (level <= 3) return 'bg-green-500 text-white'
    if (level <= 6) return 'bg-yellow-500 text-white'
    return 'bg-red-500 text-white'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-green-600 hover:text-green-800 font-semibold"
        >
          ← Dashboard
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🏃 FitLife Health Score</h1>
          <p className="text-gray-600 dark:text-gray-300">Enter your daily health metrics to get personalized insights</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow max-w-4xl mx-auto space-y-8">
        
        {/* Personal Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">👤 Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 30"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">18-100 years</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Body Metrics */}
        <div>
          <h3 className="text-xl font-semibold mb-4">📏 Body Metrics</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                placeholder="e.g., 175"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">140-220 cm</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                placeholder="e.g., 70"
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">40-200 kg</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">BMI (Auto-calculated)</label>
              <input
                type="number"
                step="0.1"
                name="bmi"
                value={formData.bmi}
                readOnly
                className="px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 dark:border-gray-700 focus:outline-none"
              />
              <small className="text-gray-500 dark:text-gray-400">Ideal: 18.5-24.9</small>
            </div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div>
          <h3 className="text-xl font-semibold mb-4">💓 Activity Metrics</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">❤️ Heart Rate (bpm)</label>
              <input
                type="number"
                step="0.1"
                name="avg_heart_rate"
                value={formData.avg_heart_rate}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">Normal: 60-100 bpm</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">👟 Daily Steps</label>
              <input
                type="number"
                name="daily_steps"
                value={formData.daily_steps}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">Goal: 8000-10000</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">🔥 Calories Burned</label>
              <input
                type="number"
                step="0.1"
                name="calories_burned"
                value={formData.calories_burned}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">From exercise</small>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Activity Type</label>
              <select
                name="activity_type"
                value={formData.activity_type}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              >
                <option value="Running">Running</option>
                <option value="Walking">Walking</option>
                <option value="Cycling">Cycling</option>
                <option value="Swimming">Swimming</option>
                <option value="Yoga">Yoga</option>
                <option value="Weight Training">Weight Training</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Intensity</label>
              <select
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle Metrics */}
        <div>
          <h3 className="text-xl font-semibold mb-4">🧘 Lifestyle Metrics</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-medium">😴 Sleep Hours</label>
              <input
                type="number"
                step="0.1"
                name="hours_sleep"
                value={formData.hours_sleep}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">Recommended: 7-9</small>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-medium">💧 Hydration (glasses)</label>
              <input
                type="number"
                name="hydration_level"
                value={formData.hydration_level}
                onChange={handleChange}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                required
              />
              <small className="text-gray-500 dark:text-gray-400">Goal: 8 glasses/day</small>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? '🔄 Calculating...' : '📊 Calculate Health Score'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="max-w-6xl mx-auto mt-8 space-y-6">
          {/* Overall Health Score */}
          <div className={`p-6 rounded-xl text-center shadow ${getScoreColor(result.health_score)}`}>
            <h2 className="text-xl font-semibold mb-2">🎯 Overall Health Score</h2>
            <div className="text-5xl font-bold mb-2">{result.health_score}</div>
            <div className="text-lg font-semibold">{result.interpretation}</div>
          </div>

          {/* Detailed Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stress Level */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getStressColor(result.stress_level)}`}>
                <div className="text-3xl mb-1">😰</div>
                <div className="font-semibold">Stress Level</div>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{result.stress_level}</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{getStressLabel(result.stress_level)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Predicted from your health metrics</p>
                <p className="font-medium">Scale: 1-10 (Lower is better)</p>
                <p>Category: {getStressLabel(result.stress_level)}</p>
              </div>
            </div>

            {/* Stress Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getScoreColor(result.stress_score)}`}>
                <div className="text-3xl mb-1">🧘</div>
                <div className="font-semibold">Stress Management</div>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{result.stress_score}</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{getScoreLabel(result.stress_score)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Stress management level - higher means better stress control</p>
                <p className="font-medium">Range: 80-100 (Excellent), 60-80 (Good)</p>
              </div>
            </div>

            {/* Activity Level */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getScoreColor(result.activity_score)}`}>
                <div className="text-3xl mb-1">🏋️</div>
                <div className="font-semibold">Activity Level</div>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{result.activity_score}</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{getScoreLabel(result.activity_score)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Physical activity level based on steps, calories, and heart rate</p>
                <p className="font-medium">Range: 80-100 (Excellent), 60-80 (Good)</p>
              </div>
            </div>

            {/* Sleep Quality */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <div className={`inline-block px-4 py-2 rounded-lg mb-4 ${getScoreColor(result.sleep_quality)}`}>
                <div className="text-3xl mb-1">😴</div>
                <div className="font-semibold">Sleep Quality</div>
              </div>
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{result.sleep_quality}</div>
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">{getScoreLabel(result.sleep_quality)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>Sleep quality based on hours, stress, and hydration</p>
                <p className="font-medium">Range: 80-100 (Excellent), 60-80 (Good)</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold mb-4"> Recommendations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                      rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      'border-green-500 bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {rec.type === 'workout' && '🏋️'}
                        {rec.type === 'rest' && '😴'}
                        {rec.type === 'diet' && '🥗'}
                        {rec.type === 'general' && '✨'}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{rec.message}</p>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <strong>Action:</strong> {rec.action}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Predict
