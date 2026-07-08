import { useState } from 'react'
import { 
  predictActivityLevel, 
  predictStressLevel, 
  predictHealthScore, 
  predictStressManagement, 
  predictSleepQuality 
} from '../utils/mlApi'

function ModelPredictor() {
  const [activeTab, setActiveTab] = useState('activity')
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
    stress_level: '',
    hydration_level: '',
    activity_type: 'Running',
    intensity: 'Medium',
    health_condition: 'Unknown',
    smoking_status: 'Never'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    
    if (name === 'height_cm' || name === 'weight_kg') {
      const height = name === 'height_cm' ? parseFloat(value) : formData.height_cm
      const weight = name === 'weight_kg' ? parseFloat(value) : formData.weight_kg
      if (height && weight) {
        newFormData.bmi = (weight / ((height / 100) ** 2)).toFixed(1)
      }
    }
    setFormData(newFormData)
  }

  const handlePredict = async () => {
    setLoading(true)
    setResult(null)
    try {
      let data
      switch(activeTab) {
        case 'activity':
          data = await predictActivityLevel(formData)
          break
        case 'stress':
          data = await predictStressLevel(formData)
          break
        case 'health':
          data = await predictHealthScore(formData)
          break
        case 'stress-mgmt':
          data = await predictStressManagement(formData)
          break
        case 'sleep':
          data = await predictSleepQuality(formData)
          break
      }
      setResult(data)
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'activity', label: '🏃 Activity Level', key: 'activity_level' },
    { id: 'stress', label: '😰 Stress Level', key: 'stress_level' },
    { id: 'health', label: '❤️ Health Score', key: 'health_score' },
    { id: 'stress-mgmt', label: '🧘 Stress Management', key: 'stress_management' },
    { id: 'sleep', label: '😴 Sleep Quality', key: 'sleep_quality' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Individual Model Predictions</h2>
      
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setResult(null); }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="height_cm"
            value={formData.height_cm}
            onChange={handleChange}
            placeholder="Height (cm)"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="weight_kg"
            value={formData.weight_kg}
            onChange={handleChange}
            placeholder="Weight (kg)"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            readOnly
            placeholder="BMI (auto)"
            className="px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="number"
            name="calories_burned"
            value={formData.calories_burned}
            onChange={handleChange}
            placeholder="Calories Burned"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="avg_heart_rate"
            value={formData.avg_heart_rate}
            onChange={handleChange}
            placeholder="Heart Rate (bpm)"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="daily_steps"
            value={formData.daily_steps}
            onChange={handleChange}
            placeholder="Daily Steps"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="hours_sleep"
            value={formData.hours_sleep}
            onChange={handleChange}
            placeholder="Sleep Hours"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="stress_level"
            value={formData.stress_level}
            onChange={handleChange}
            placeholder="Stress Level (1-10)"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
          <input
            type="number"
            name="hydration_level"
            value={formData.hydration_level}
            onChange={handleChange}
            placeholder="Hydration (glasses)"
            className="px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>

        {result && (
          <div className="mt-6 p-6 bg-green-100 dark:bg-green-900 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h3>
            <div className="text-4xl font-bold">
              {result[tabs.find(t => t.id === activeTab)?.key]}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelPredictor
