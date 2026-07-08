function PlansPage() {
  return (
    <div>
      {/* Workouts */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Workout Categories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Gym */}
          <WorkoutCard
            title="Gym Training"
            desc="Strength training, weight lifting, and muscle building exercises."
            btn="Explore Gym"
          />
   {/* Yoga 
          <WorkoutCard
            title="Yoga"
            desc="Improve flexibility, balance, and mental wellness with guided yoga."
            btn="Start Yoga"
          />

           Running 
          <WorkoutCard
            title="Running"
            desc="Track your runs, improve endurance, and burn calories effectively."
            btn="Start Running"
          />

           Cardio 
          <WorkoutCard
            title="Cardio"
            desc="Boost heart health with high-energy cardio workouts and routines."
            btn="Do Cardio"
          />

          Home Workout 
          <WorkoutCard
            title="Home Workout"
            desc="No equipment workouts you can do anytime, anywhere."
            btn="Start at Home"
          />

           Meditation 
          <WorkoutCard
            title="Meditation"
            desc="Relax your mind, reduce stress, and improve focus daily."
            btn="Relax Now"
          /> 
          */}
          

        </div>
      </section>
    </div>
  );
}

function WorkoutCard({ title, desc, btn }) {
  return (
    <div
      className="group border rounded-2xl p-6 text-center bg-white
                 transition-all duration-300 ease-in-out
                 hover:-translate-y-3 hover:shadow-xl hover:shadow-emerald-200
                 hover:border-emerald-500 cursor-pointer"
    >
      <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-emerald-600">
        {title}
      </h3>

      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        {desc}
      </p>

      <button
        className="bg-emerald-600 text-white px-5 py-2 rounded-lg
                   transition-all duration-300
                   hover:bg-emerald-700 hover:scale-105 hover:shadow-md"
      >
        {btn}
      </button>
    </div>
  );
}

export default PlansPage;