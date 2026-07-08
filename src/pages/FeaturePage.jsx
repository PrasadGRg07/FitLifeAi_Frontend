function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-gray-600 text-lg">
          Everything you need to track, understand, and improve your fitness.
        </p>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="Activity Tracking"
            desc="Track steps, distance, active minutes, and workouts effortlessly."
          />
          {/*<FeatureCard
            title="Calorie Burn Prediction"
            desc="AI-powered estimates based on your activity and workout data."
          />*/}
          
          <FeatureCard
            title="Sleep Monitoring"
            desc="Understand your sleep patterns and recovery quality."
          />
          <FeatureCard
            title="Heart Rate Insights"
            desc="View average heart rate and fitness trends over time."
          />
          <FeatureCard
            title="Mood & Lifestyle"
            desc="Track mood and lifestyle habits to improve overall wellness."
          />
          <FeatureCard
            title="Simple Analytics"
            desc="Clear charts and summaries to help you make better decisions."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div
      className="group border rounded-2xl p-6 bg-white
                 transition-all duration-300 ease-in-out
                 hover:-translate-y-3 hover:shadow-xl hover:shadow-blue-200
                 hover:border-green-500 cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 group-hover:text-green-600">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default FeaturesPage;