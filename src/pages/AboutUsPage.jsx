export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-600">
          Learn more about FitLife AI and our mission to simplify fitness.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        
        {/* Card 1 */}
        <div className="group border rounded-2xl p-6 bg-white
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-3 hover:shadow-xl hover:shadow-blue-200
                        hover:border-green-500 cursor-pointer">
          <h2 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-green-600">
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed">
            FitLife AI is a simple fitness platform that uses artificial intelligence
            to help people understand their daily activity, health, and lifestyle.
            Our goal is to make fitness tracking easy, clear, and useful for everyone.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group border rounded-2xl p-6 bg-white
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-3 hover:shadow-xl hover:shadow-blue-200
                        hover:border-green-500 cursor-pointer">
          <h2 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-green-600">
            What We Do
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We analyze data such as steps, calories burned, sleep hours, heart rate,
            and mood to provide meaningful insights. Instead of complex dashboards,
            we focus on clean summaries that help users make better health decisions.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group border rounded-2xl p-6 bg-white
                        transition-all duration-300 ease-in-out
                        hover:-translate-y-3 hover:shadow-xl hover:shadow-blue-200
                        hover:border-green-500 cursor-pointer">
          <h2 className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:text-green-600">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to empower individuals to live healthier lives using
            data-driven insights. We believe fitness technology should be simple,
            accessible, and motivating.
          </p>
        </div>

      </section>
    </div>
  );
}