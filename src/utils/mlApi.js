const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const preparePayload = (formData) => ({
  age: parseInt(formData.age) || 0,
  height_cm: parseFloat(formData.height_cm) || 0,
  weight_kg: parseFloat(formData.weight_kg) || 0,
  bmi: parseFloat(formData.bmi) || 0,
  calories_burned: parseFloat(formData.calories_burned) || 0,
  avg_heart_rate: parseFloat(formData.avg_heart_rate) || 0,
  daily_steps: parseInt(formData.daily_steps) || 0,
  hours_sleep: parseFloat(formData.hours_sleep) || 0,
  stress_level: parseInt(formData.stress_level) || 0,
  hydration_level: parseInt(formData.hydration_level) || 0,
  resting_heart_rate: 65,
  blood_pressure_systolic: 120,
  blood_pressure_diastolic: 80,
  gender: formData.gender || 'M',
  activity_type: formData.activity_type || 'Running',
  intensity: formData.intensity || 'Medium',
  health_condition: formData.health_condition || 'Unknown',
  smoking_status: formData.smoking_status || 'Never'
});

export const predictAll = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    cache: 'no-store',
    body: JSON.stringify(preparePayload(formData))
  });
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

export const predictActivityLevel = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/activity/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preparePayload(formData))
  });
  return response.json();
};

export const predictStressLevel = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/stress/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preparePayload(formData))
  });
  return response.json();
};

export const predictHealthScore = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/health/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preparePayload(formData))
  });
  return response.json();
};

export const predictStressManagement = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/stress-management/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preparePayload(formData))
  });
  return response.json();
};

export const predictSleepQuality = async (formData) => {
  const response = await fetch(`${BASE_URL}/api/ml/predict/sleep/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preparePayload(formData))
  });
  return response.json();
};
