import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGetStarted = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/login"); // 👈 go to login first
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          FitLife AI
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Simple AI-powered fitness tracking for a healthier life.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl
                     transition-all duration-300
                     hover:bg-emerald-700 hover:scale-105 hover:shadow-lg"
        >
          {loading ? "Loading..." : "Get Started"}
        </button>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="Track Activity"
            desc="Steps, distance, and workouts in one place."
          />
          <Feature
            title="AI Insights"
            desc="Understand calorie burn and daily patterns."
          />
          <Feature
            title="Health Overview"
            desc="Sleep, heart rate, and wellness summary."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold mb-4">Start Your Fitness Journey</h2>
        <p className="mb-6 text-emerald-100">
          Smarter fitness decisions made easy.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold
                     transition-all duration-300
                     hover:scale-105 hover:shadow-lg"
        >
          {loading ? "Loading..." : "Try FitLife AI"}
        </button>
      </section>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div
      className="group border rounded-2xl p-6 text-center bg-white
                 transition-all duration-300 ease-in-out
                 hover:-translate-y-3 hover:shadow-xl hover:shadow-emerald-200
                 hover:border-emerald-500 cursor-pointer"
    >
      <h3 className="font-semibold text-lg mb-2 transition-colors duration-300 group-hover:text-emerald-600">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}