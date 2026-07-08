import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

const SettingProfilePage = () => {
  const navigate = useNavigate();
  const { profile: globalProfile, setProfile: setGlobalProfile } = useProfile();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "M",
    height: "",
    weight: "",
    image: null,
  });

  useEffect(() => {
    setProfile({
      name: globalProfile.name || "",
      email: globalProfile.email || "",
      dob: "",
      gender: globalProfile.gender || "M",
      height: globalProfile.height || "",
      weight: globalProfile.weight || "",
      image: globalProfile.image || null,
    });
  }, [globalProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, image: reader.result });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const age = profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : globalProfile.age;
    
    const updatedProfile = {
      ...globalProfile,
      name: profile.name,
      email: profile.email,
      age: age,
      gender: profile.gender,
      height: parseInt(profile.height) || globalProfile.height,
      weight: parseInt(profile.weight) || globalProfile.weight,
      image: profile.image,
    };
    
    setGlobalProfile(updatedProfile);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h1 className="text-6xl font-bold mb-6 text-center text-green-600">
          FitLife AI
        </h1>
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            <div className="relative">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold border-2 border-gray-300">
                  {profile.name ? profile.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to upload image</p>
          </div>

          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">Full Name</span>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">Email</span>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">Date of Birth</span>
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
            />
          </label>

          <label className="block">
            <span className="text-sm text-gray-600 dark:text-gray-300">Gender</span>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block">
                <span className="text-sm text-gray-600 dark:text-gray-300">Height (cm)</span>
                <input
                  type="number"
                  name="height"
                  value={profile.height}
                  onChange={handleChange}
                  placeholder="e.g. 170"
                  className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className="text-sm text-gray-600 dark:text-gray-300">Weight (kg)</span>
                <input
                  type="number"
                  name="weight"
                  value={profile.weight}
                  onChange={handleChange}
                  placeholder="e.g. 65"
                  className="mt-1 w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700"
                />
              </label>
            </div>
                  </div>

          <button
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingProfilePage;