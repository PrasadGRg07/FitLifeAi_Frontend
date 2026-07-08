import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const getStorageKey = (userId) => `userProfile_${userId}`;

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: null,
    height: null,
    weight: null,
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/users/profile/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();

        // Auto-logout if banned
        if (data.is_banned) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login?banned=1';
          return;
        }

        const userId = data.user?.id;
        const storageKey = getStorageKey(userId);
        const savedLocal = localStorage.getItem(storageKey);
        const localImage = savedLocal ? JSON.parse(savedLocal).image : null;
        const merged = {
          id: userId,
          name: data.name || data.user?.username || "",
          username: data.user?.username || "",
          email: data.user?.email || "",
          age: data.age || null,
          height: data.height || null,
          weight: data.weight || null,
          image: localImage || data.image || null,
        };
        localStorage.setItem(storageKey, JSON.stringify(merged));
        setProfile(merged);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const updateProfile = async (newProfile) => {
    const storageKey = getStorageKey(newProfile.id);
    localStorage.setItem(storageKey, JSON.stringify(newProfile));
    setProfile(newProfile);

    const token = localStorage.getItem('access_token');
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/profile/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProfile.name,
          age: newProfile.age,
          height: newProfile.height,
          weight: newProfile.weight,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...newProfile, name: data.name, age: data.age, height: data.height, weight: data.weight });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // Poll every 30s to detect ban in real-time
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile: updateProfile, loading, fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
