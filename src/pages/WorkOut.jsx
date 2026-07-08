import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const workoutCategories = [
  {
    id: "arms",
    label: "Arms",
    emoji: "💪",
    accent: "bg-orange-500",
    light: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-400",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    exercises: ["Barbell Curl", "Hammer Curl", "Concentration Curl", "Cable Curl", "Preacher Curl"],
  },
  {
    id: "legs",
    label: "Legs",
    emoji: "🦵",
    accent: "bg-teal-500",
    light: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-400",
    text: "text-teal-600 dark:text-teal-400",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    exercises: ["Squat", "Leg Press", "Lunges", "Leg Extension", "Romanian Deadlift"],
  },
  {
    id: "bicep",
    label: "Bicep",
    emoji: "🏋️",
    accent: "bg-yellow-500",
    light: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-400",
    text: "text-yellow-600 dark:text-yellow-400",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    exercises: ["Incline Curl", "Zottman Curl", "Cable Rope Curl", "Spider Curl", "21s"],
  },
  {
    id: "tricep",
    label: "Tricep",
    emoji: "🔱",
    accent: "bg-green-500",
    light: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-400",
    text: "text-green-600 dark:text-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    exercises: ["Skull Crusher", "Tricep Dip", "Overhead Extension", "Rope Pushdown", "Close Grip Bench"],
  },
  {
    id: "cardio",
    label: "Cardio",
    emoji: "🏃",
    accent: "bg-red-500",
    light: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-400",
    text: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    exercises: ["Treadmill", "Jump Rope", "Cycling", "Rowing", "Stair Climber"],
  },
  {
    id: "chest",
    label: "Chest",
    emoji: "🫁",
    accent: "bg-purple-500",
    light: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-400",
    text: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    exercises: ["Bench Press", "Incline Press", "Cable Fly", "Push-Up", "Dumbbell Fly"],
  },
  {
    id: "back",
    label: "Back",
    emoji: "🧱",
    accent: "bg-amber-500",
    light: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    exercises: ["Deadlift", "Pull-Up", "Barbell Row", "Lat Pulldown", "Seated Row"],
  },
  {
    id: "shoulders",
    label: "Shoulders",
    emoji: "⚡",
    accent: "bg-sky-500",
    light: "bg-sky-50 dark:bg-sky-900/20",
    border: "border-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    exercises: ["Overhead Press", "Lateral Raise", "Front Raise", "Face Pull", "Arnold Press"],
  },
  {
    id: "core",
    label: "Core",
    emoji: "🎯",
    accent: "bg-orange-400",
    light: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-300",
    text: "text-orange-500 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300",
    exercises: ["Plank", "Crunches", "Russian Twist", "Leg Raise", "Ab Rollout"],
  },

];

const difficultyOptions = [
  { label: "Beginner", color: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700" },
  { label: "Intermediate", color: "bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700" },
  { label: "Advanced", color: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700" },
];

export default function Workout() {
  const navigate = useNavigate();

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [plan, setPlan] = useState([]);
  const [view, setView] = useState("builder"); // builder | plan | active
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({}); // { planItemId: setsCompleted }
  const [resting, setResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [completedIds, setCompletedIds] = useState(new Set());
  const elapsedRef = useRef(null);
  const restRef = useRef(null);

  const startWorkout = () => {
    setActiveIndex(0);
    setCompletedSets({});
    setCompletedIds(new Set());
    setResting(false);
    setRestSeconds(0);
    setElapsed(0);
    setWorkoutDone(false);
    setView("active");
    elapsedRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  };

  const stopWorkout = () => {
    clearInterval(elapsedRef.current);
    clearInterval(restRef.current);
    setView("plan");
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const logSet = () => {
    const item = plan[activeIndex];
    const done = (completedSets[item.id] || 0) + 1;
    setCompletedSets((prev) => ({ ...prev, [item.id]: done }));

    if (done >= item.sets) {
      setCompletedIds((prev) => new Set([...prev, item.id]));
      startRest(15, () => {
        const next = activeIndex + 1;
        if (next >= plan.length) {
          clearInterval(elapsedRef.current);
          setWorkoutDone(true);
        } else {
          setActiveIndex(next);
        }
      });
    } else {
      startRest(60, () => {});
    }
  };

  const startRest = (seconds, onDone) => {
    setResting(true);
    setRestSeconds(seconds);
    clearInterval(restRef.current);
    let remaining = seconds;
    restRef.current = setInterval(() => {
      remaining -= 1;
      setRestSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(restRef.current);
        setResting(false);
        onDone();
      }
    }, 1000);
  };

  const skipRest = () => {
    clearInterval(restRef.current);
    setResting(false);
    setRestSeconds(0);
  };

  const completeExercise = () => {
    clearInterval(restRef.current);
    setResting(false);
    const item = plan[activeIndex];
    setCompletedIds((prev) => new Set([...prev, item.id]));
    const next = activeIndex + 1;
    if (next >= plan.length) {
      clearInterval(elapsedRef.current);
      setWorkoutDone(true);
    } else {
      setActiveIndex(next);
    }
  };

  useEffect(() => () => {
    clearInterval(elapsedRef.current);
    clearInterval(restRef.current);
  }, []);

  const category = workoutCategories.find((c) => c.id === selectedCategoryId);

  const toggleCategory = (id) => {
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      setSelectedExercises([]);
    } else {
      setSelectedCategoryId(id);
      setSelectedExercises([]);
    }
  };

  const toggleExercise = (ex) => {
    setSelectedExercises((prev) =>
      prev.includes(ex) ? prev.filter((e) => e !== ex) : [...prev, ex]
    );
  };

  const addToPlan = () => {
    if (!category || selectedExercises.length === 0) return;
    const newItems = selectedExercises.map((ex) => ({
      id: `${ex}-${Date.now()}-${Math.random()}`,
      exercise: ex,
      category: category.label,
      emoji: category.emoji,
      badge: category.badge,
      text: category.text,
      border: category.border,
      sets,
      reps,
      difficulty,
    }));
    setPlan((prev) => [...prev, ...newItems]);
    setSelectedExercises([]);
    setSelectedCategoryId(null);
  };

  const removeFromPlan = (id) => setPlan((prev) => prev.filter((item) => item.id !== id));

  const totalSets = plan.reduce((acc, i) => acc + i.sets, 0);
  const totalReps = plan.reduce((acc, i) => acc + i.sets * i.reps, 0);
  const muscleGroups = new Set(plan.map((i) => i.category)).size;

  return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-emerald-600 mb-10">FitLife AI</h1>
        <nav className="space-y-4 text-sm">
          
          <p onClick={() => navigate("/activity")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Activity</p>
          <p onClick={() => navigate("/workout")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Workout</p>
          <p onClick={() => navigate("/leaderboard")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Leaderboard</p>
          <p onClick={() => navigate("/settingprofile")} className="text-gray-500 cursor-pointer hover:text-green-500 transition">Settings</p>
        </nav>
      </aside>

            <div className="flex-1"> 
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Workout 🏋️</h2>
          <h2 className="text-3xl font-bold">If you're a gym member
            <p className="text-gray-500 font-bold dark:text-gray-400 mt-1 text-sm">
              Select muscle groups and build your session
            </p></h2> 
            
           
         
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Back to Dashboard
          </button>
        </header>
        <div className="px-6 py-10 max-w-4xl mx-auto">
       

          {/* Tab toggle */}
          <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setView("builder")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "builder"
                  ? "bg-green-500 text-white shadow"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              Builder
            </button>
            <button
              onClick={() => setView("plan")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                view === "plan"
                  ? "bg-green-500 text-white shadow"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
            >
              My Plan
              {plan.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {plan.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ─── BUILDER VIEW ─── */}
        {view === "builder" && (
          <div className="space-y-6">

            {/* Category grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Select Muscle Group</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {workoutCategories.map((cat) => {
                  const isActive = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 font-medium text-sm
                        ${isActive
                          ? `${cat.light} ${cat.border} ${cat.text} scale-105 shadow-md`
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750"
                        }`}
                    >
                      <span className="text-2xl">{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exercises panel */}
            {selectedCategoryId && category && (
              <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow border-2 ${category.border} transition-all`}>
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${category.text}`}>
                  <span>{category.emoji}</span> {category.label} Exercises
                </h2>

                {/* Exercise pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {category.exercises.map((ex) => {
                    const selected = selectedExercises.includes(ex);
                    return (
                      <button
                        key={ex}
                        onClick={() => toggleExercise(ex)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150
                          ${selected
                            ? `${category.light} ${category.border} ${category.text} shadow-sm`
                            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500"
                          }`}
                      >
                        {selected && <span className="mr-1">✓</span>}
                        {ex}
                      </button>
                    );
                  })}
                </div>

                {/* Config row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  {/* Difficulty */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Difficulty</p>
                    <div className="flex gap-2">
                      {difficultyOptions.map((d) => (
                        <button
                          key={d.label}
                          onClick={() => setDifficulty(d.label)}
                          className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all
                            ${difficulty === d.label ? d.color : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"}`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sets */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Sets</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSets(s)}
                          className={`flex-1 py-1.5 rounded-lg border text-sm font-bold transition-all
                            ${sets === s
                              ? `${category.light} ${category.border} ${category.text}`
                              : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reps */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Reps</p>
                    <div className="flex gap-2">
                      {[6, 8, 10, 12, 15].map((r) => (
                        <button
                          key={r}
                          onClick={() => setReps(r)}
                          className={`flex-1 py-1.5 rounded-lg border text-sm font-bold transition-all
                            ${reps === r
                              ? `${category.light} ${category.border} ${category.text}`
                              : "border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500"
                            }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Add button */}
                <button
                  onClick={addToPlan}
                  disabled={selectedExercises.length === 0}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                    ${selectedExercises.length > 0
                      ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {selectedExercises.length > 0
                    ? `+ Add ${selectedExercises.length} Exercise${selectedExercises.length > 1 ? "s" : ""} to Plan`
                    : "Select exercises above"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── PLAN VIEW ─── */}
        {view === "plan" && (
          <div className="space-y-5">
            {plan.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-5xl mb-4">🏋️</p>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Your plan is empty.</p>
                <button
                  onClick={() => setView("builder")}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
                >
                  Start Building →
                </button>
              </div>
            ) : (
              <>
                {/* Stats bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 text-center">
                    <div className="px-4">
                      <p className="text-2xl font-bold text-green-500">{plan.length}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Exercises</p>
                    </div>
                    <div className="px-4">
                      <p className="text-2xl font-bold text-blue-500">{totalSets}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Total Sets</p>
                    </div>
                    <div className="px-4">
                      <p className="text-2xl font-bold text-purple-500">{muscleGroups}</p>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Muscle Groups</p>
                    </div>
                  </div>
                </div>

                {/* Exercise list */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <h2 className="text-lg font-semibold px-6 pt-5 pb-3">Your Workout</h2>
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {plan.map((item) => {
                      const isDone = completedIds.has(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between px-6 py-4 border-l-4 transition-colors ${
                            isDone
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                              : `${item.border} hover:bg-gray-50 dark:hover:bg-gray-750`
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className={`text-2xl ${isDone ? "opacity-50" : ""}`}>{item.emoji}</span>
                            <div>
                              <p className={`font-semibold text-sm ${isDone ? "line-through text-gray-400" : ""}`}>{item.exercise}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {isDone ? (
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                                    ✓ Completed
                                  </span>
                                ) : (
                                  <>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge}`}>{item.category}</span>
                                    <span className="text-xs text-gray-400">{item.sets} sets × {item.reps} reps</span>
                                    <span className={`text-xs font-medium ${item.text}`}>{item.difficulty}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {isDone ? (
                            <button
                              onClick={() => removeFromPlan(item.id)}
                              className="text-xs text-emerald-600 border border-emerald-300 px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => removeFromPlan(item.id)}
                              className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors text-lg leading-none"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setView("builder")}
                    className="flex-1 py-3 rounded-xl border-2 border-green-500 text-green-600 dark:text-green-400 font-semibold text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    + Add More
                  </button>
                  <button
                    onClick={startWorkout}
                    className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    🔥 Start Workout
                  </button>
                </div>

                <button
                  onClick={() => setPlan([])}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Clear Plan
                </button>
              </>
            )}
          </div>
        )}
        {/* ─── ACTIVE WORKOUT VIEW ─── */}
        {view === "active" && (
          <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">

            {/* Timer bar */}
            <div className="flex justify-between items-center bg-white rounded-xl px-6 py-4 border shadow">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Elapsed</p>
                <p className="text-2xl font-bold text-emerald-600">{formatTime(elapsed)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Exercise</p>
                <p className="text-sm font-semibold">{activeIndex + 1} / {plan.length}</p>
              </div>
              <button onClick={stopWorkout} className="text-sm text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50">
                ✕ Quit
              </button>
            </div>

            {workoutDone ? (
              <div className="bg-white rounded-xl p-10 border shadow text-center space-y-4">
                <p className="text-5xl">🎉</p>
                <p className="text-2xl font-bold text-emerald-600">Workout Complete!</p>
                <p className="text-gray-500">Total time: <span className="font-semibold">{formatTime(elapsed)}</span></p>
                <p className="text-gray-500">{plan.length} exercises · {plan.reduce((a, i) => a + i.sets, 0)} sets</p>
                <button
                  onClick={() => { setPlan([]); setView("builder"); }}
                  className="mt-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                {/* Current exercise card */}
                {(() => {
                  const item = plan[activeIndex];
                  const done = completedSets[item.id] || 0;
                  return (
                    <div className={`bg-white rounded-xl p-6 border-2 ${item.border} shadow space-y-4`}>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{item.emoji}</span>
                        <div>
                          <p className="text-xl font-bold">{item.exercise}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge}`}>{item.category}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 text-center bg-gray-50 rounded-xl p-4">
                        <div>
                          <p className="text-2xl font-bold text-emerald-600">{item.reps}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Reps</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-500">{done} / {item.sets}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Sets Done</p>
                        </div>
                        <div>
                          <p className={`text-2xl font-bold ${item.text}`}>{item.difficulty}</p>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">Level</p>
                        </div>
                      </div>

                      {/* Set progress dots */}
                      <div className="flex gap-2 justify-center">
                        {Array.from({ length: item.sets }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                              i < done
                                ? `${item.border} ${item.text} bg-white`
                                : "border-gray-200 text-gray-300"
                            }`}
                          >
                            {i < done ? "✓" : i + 1}
                          </div>
                        ))}
                      </div>

                      {resting ? (
                        <div className="text-center space-y-2">
                          <p className="text-gray-500 text-sm">😮‍💨 Rest time</p>
                          <p className="text-4xl font-bold text-orange-500">{restSeconds}s</p>
                          <button onClick={skipRest} className="text-sm text-gray-400 underline hover:text-gray-600">Skip rest</button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={logSet}
                            className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow transition-all"
                          >
                            ✓ Log Set {done + 1}
                          </button>
                          <button
                            onClick={completeExercise}
                            className="px-5 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm shadow transition-all whitespace-nowrap"
                          >
                            ✅ Complete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Up next */}
                {activeIndex + 1 < plan.length && (
                  <button
                    onClick={completeExercise}
                    className="w-full bg-white rounded-xl px-5 py-4 border shadow flex items-center gap-4 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
                  >
                    <span className="text-2xl">{plan[activeIndex + 1].emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Up Next</p>
                      <p className="font-semibold text-sm">{plan[activeIndex + 1].exercise}</p>
                    </div>
                    <span className="text-emerald-600 text-sm font-semibold">Move on →</span>
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}