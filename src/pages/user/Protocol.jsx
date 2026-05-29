import React, { useState } from 'react';
import {
  Utensils,
  Dumbbell,
  Sparkles,
  Flame
} from 'lucide-react';

export default function Protocol() {
  const [activeTab, setActiveTab] = useState('nutrition');

  // DATA (later from API)
  const protocolDays = [
    {
      day: 1,
      calories: 1960,
      meals: [
        { name: 'Foul with tahini', kcal: 480 },
        { name: 'White beans with chicken', kcal: 630 },
        { name: 'Grilled tilapia', kcal: 510 },
      ],
      workout: {
        title: 'Upper Body Strength',
        duration: '45m',
        exercises: [
          'Dumbbell Bench Press - 4x10',
          'Shoulder Press - 3x12',
          'Tricep Pushdown - 3x15',
        ],
      },
    },

    {
      day: 2,
      calories: 2010,
      meals: [
        { name: 'Foul with greens', kcal: 410 },
        { name: 'Lean beef with vegetables', kcal: 630 },
      ],
      workout: {
        title: 'Recovery Day',
        duration: '20m',
        exercises: ['Stretching', 'Walking', 'Mobility'],
      },
    },

    {
      day: 3,
      calories: 1850,
      meals: [
        { name: 'Greek yogurt bowl', kcal: 350 },
        { name: 'Chicken rice bowl', kcal: 650 },
      ],
      workout: {
        title: 'Leg Day',
        duration: '60m',
        exercises: [
          'Squats - 4x12',
          'Leg Press - 4x10',
          'Lunges - 3x12',
        ],
      },
    },

    {
      day: 4,
      calories: 2100,
      meals: [
        { name: 'Egg sandwich', kcal: 400 },
        { name: 'Salmon with rice', kcal: 700 },
      ],
      workout: {
        title: 'Push Workout',
        duration: '50m',
        exercises: [
          'Bench Press - 4x10',
          'Chest Fly - 3x12',
        ],
      },
    },

    {
      day: 5,
      calories: 1950,
      meals: [
        { name: 'Protein oats', kcal: 420 },
        { name: 'Turkey wrap', kcal: 550 },
      ],
      workout: {
        title: 'Pull Workout',
        duration: '55m',
        exercises: [
          'Lat Pulldown - 4x12',
          'Barbell Row - 4x10',
        ],
      },
    },

    {
      day: 6,
      calories: 2200,
      meals: [
        { name: 'Avocado toast', kcal: 390 },
        { name: 'Chicken pasta', kcal: 760 },
      ],
      workout: {
        title: 'HIIT Cardio',
        duration: '35m',
        exercises: [
          'Jump Rope',
          'Sprint Intervals',
          'Burpees',
        ],
      },
    },

    {
      day: 7,
      calories: 1800,
      meals: [
        { name: 'Fruit smoothie', kcal: 320 },
        { name: 'Grilled chicken salad', kcal: 500 },
      ],
      workout: {
        title: 'Rest Day',
        duration: '0m',
        exercises: ['Full Recovery'],
      },
    },
  ];

  return (
    <div className="min-h-screen overflow-y-auto bg-[#0B1120] text-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Your Custom Protocol
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Personalized nutrition & activity system
          </p>
        </div>

        <button className="text-emerald-400 text-sm font-semibold hover:text-emerald-300 transition">
          Regenerate Plan
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('nutrition')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'nutrition'
              ? 'bg-emerald-500 text-white'
              : 'bg-[#1A2235] text-gray-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          Nutrition Plan
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'activity'
              ? 'bg-red-500 text-white'
              : 'bg-[#1A2235] text-gray-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          Activity Plan
        </button>
      </div>

      {/* CARDS */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-6">
  {protocolDays.map((item) => (
    <div
      key={item.day}
      className="bg-[#182235] rounded-2xl p-4 border border-white/5 shadow-lg h-fit"
    >
      {/* TOP */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">
          Day {item.day}
        </h3>

        <div
          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            activeTab === 'nutrition'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {activeTab === 'nutrition'
            ? `${item.calories} kcal`
            : item.workout.duration}
        </div>
      </div>

      {/* NUTRITION */}
      {activeTab === 'nutrition' && (
        <>
          <p className="text-[10px] tracking-[3px] text-gray-500 mb-3">
            MEALS
          </p>

          <div className="space-y-3">
            {item.meals.map((meal, index) => (
              <div
                key={index}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                  <span className="font-medium text-sm">
                    {meal.name}
                  </span>
                </div>

                <span className="text-gray-400 text-xs">
                  {meal.kcal}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ACTIVITY */}
      {activeTab === 'activity' && (
        <>
          <p className="text-[10px] tracking-[3px] text-gray-500 mb-3">
            ACTIVITY
          </p>

          <div className="bg-[#0E1627] rounded-xl p-4 border border-red-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Flame className="w-4 h-4 text-red-400" />
              </div>

              <div>
                <h4 className="font-bold text-base">
                  {item.workout.title}
                </h4>

                <p className="text-gray-400 text-xs">
                  {item.workout.duration}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {item.workout.exercises.map((exercise, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-300"
                >
                  <Sparkles className="w-3 h-3 text-red-400" />

                  {exercise}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  ))}
</div>
    </div>
  );
}