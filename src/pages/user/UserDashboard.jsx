import React, { useEffect, useState } from 'react';
import {
  Flame,
  Droplets,
  Utensils,
  CheckCircle,
  Loader2,
  MessageCircle,
  Sparkles,
  Dumbbell
} from 'lucide-react';

import { motion } from 'framer-motion';

import ChatBot from './ChatBot';

import { Card } from '../../components/UI/Card';
import { ProgressCircle } from '../../components/UI/ProgressCircles';
import Button from '../../components/UI/Button';

// MODALS
import { GeneratePlanModal } from '../../components/Modals/GeneratePlanModal';
import { LogMealModal } from '../../components/Modals/LogMealModal';
import { TrackWorkoutModal } from '../../components/Modals/TrackWorkoutModal';

// API
import {
  dashboardAPI,
  mealsAPI,
  workoutAPI
} from '../../API';

export function UserDashboard() {
  const [mounted, setMounted] = useState(false);

  // MODALS
  const [planOpen, setPlanOpen] = useState(false);
  const [mealOpen, setMealOpen] = useState(false);
  const [workoutOpen, setWorkoutOpen] = useState(false);

  // CHATBOT
  const [chatOpen, setChatOpen] = useState(false);

  // DATA
  const [dashboardData, setDashboardData] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
    fetchWorkouts();
  }, []);

  // =========================
  // DASHBOARD DATA
  // =========================
  const fetchDashboardData = async () => {
    try {
      const [dashboard, meals] = await Promise.allSettled([
        dashboardAPI.getUserDashboard(),
        mealsAPI.getToday(),
      ]);

      if (dashboard.status === 'fulfilled') {
        setDashboardData(dashboard.value);
      }

      if (meals.status === 'fulfilled') {
        setTodayMeals(
          Array.isArray(meals.value)
            ? meals.value.slice(0, 3)
            : []
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // WORKOUTS
  // =========================
  const fetchWorkouts = async () => {
    setWorkoutsLoading(true);

    try {
      const data = await workoutAPI.getAll();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setWorkouts([]);
    } finally {
      setWorkoutsLoading(false);
    }
  };

  // =========================
  // COMPLETE MEAL
  // =========================
  const handleCompleteMeal = async (mealPlanId) => {
    if (!mealPlanId) return;

    try {
      await mealsAPI.completeMeal(mealPlanId);

      setTodayMeals((prev) =>
        prev.map((m) =>
          m.mealPlanId === mealPlanId || m.id === mealPlanId
            ? { ...m, isCompleted: true }
            : m
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // STATS
  // =========================
  const stats = {
    calories: {
      current: dashboardData?.calories ?? 0,
      target: dashboardData?.caloriesTarget ?? 2200,
    },

    burned: {
      current: 0,
      target: 600,
    },

    hydration: {
      current: dashboardData?.water ?? 0,
      target: dashboardData?.waterTarget ?? 3500,
    },
  };

  // =========================
  // UP NEXT
  // =========================
  const upNext =
    todayMeals.length > 0
      ? todayMeals
          .filter((m) => !m.isCompleted)
          .map((meal, i) => ({
            id: meal.mealPlanId ?? meal.id,
            icon: Utensils,
            name: meal.name,
            time: meal.time ?? '—',
            calories: `${meal.calories} kcal`,
            color: i % 2 === 0 ? 'text-orange-500' : 'text-lime-400',
            borderColor:
              i % 2 === 0
                ? 'border-orange-500'
                : 'border-lime-400',

            mealPlanId: meal.mealPlanId ?? meal.id,
          }))
      : [];

  return (
    <>
      <motion.div
        className="space-y-6 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black">
            TODAY
          </h1>

          <div className="text-sm text-gray-400">
            Wellness Dashboard
          </div>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Utensils,
              label: 'Calories',
              data: stats.calories,
            },

            {
              icon: Flame,
              label: 'Burned',
              data: stats.burned,
            },

            {
              icon: Droplets,
              label: 'Hydration',
              data: stats.hydration,
            },
          ].map((s, i) => {
            const Icon = s.icon;

            return (
              <Card key={i}>
                <div className="flex justify-between items-center">
                  <div>
                    <Icon className="mb-2" />

                    <p className="text-sm text-gray-400">
                      {s.label}
                    </p>

                    <p className="text-2xl font-bold">
                      {s.data.current}
                    </p>

                    <p className="text-sm text-gray-500">
                      / {s.data.target}
                    </p>
                  </div>

                  <ProgressCircle
                    value={s.data.current}
                    max={s.data.target}
                  />
                </div>
              </Card>
            );
          })}
        </div>

        {/* WORKOUTS */}
        <Card>
          <h3 className="mb-4 text-xl font-bold">
            Workouts
          </h3>

          {workoutsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin" />
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-gray-400">
              No workouts yet
            </p>
          ) : (
            workouts.slice(0, 5).map((w) => (
              <div
                key={w.id}
                className="flex justify-between items-center p-3 border-b border-white/10"
              >
                <div>
                  <p className="font-semibold">
                    {w.exerciseName}
                  </p>

                  <p className="text-xs text-gray-500">
                    {w.duration} min •{' '}
                    {w.caloriesBurned} kcal
                  </p>
                </div>

                <CheckCircle className="text-green-500" />
              </div>
            ))
          )}
        </Card>

        {/* UP NEXT */}
        <Card>
          <h3 className="mb-4 text-xl font-bold">
            Up Next
          </h3>

          {upNext.length === 0 ? (
            <p className="text-gray-400">
              No meals remaining today
            </p>
          ) : (
            upNext.map((task) => {
              const Icon = task.icon;

              return (
                <div
                  key={task.id}
                  className={`flex justify-between items-center p-3 border-l-4 mb-3 rounded-xl bg-white/5 ${task.borderColor}`}
                >
                  <div className="flex gap-3 items-center">
                    <Icon className={task.color} />

                    <div>
                      <p className="font-semibold">
                        {task.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {task.calories} • {task.time}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      handleCompleteMeal(task.mealPlanId)
                    }
                  >
                    <CheckCircle className="hover:text-green-500 transition" />
                  </button>
                </div>
              );
            })
          )}
        </Card>
{/* ACTION BUTTONS */}
<div className="grid md:grid-cols-3 gap-4">
  <Button variant="outline" onClick={() => setPlanOpen(true)}>
    <Sparkles className="w-4 h-4" />
    Generate AI Plan
  </Button>

  <Button variant="outline" onClick={() => setMealOpen(true)}>
    <Utensils className="w-4 h-4" />
    Log Meal
  </Button>

  <Button variant="outline" onClick={() => setWorkoutOpen(true)}>
    <Dumbbell className="w-4 h-4" />
    Track Workout
  </Button>
</div>
      </motion.div>

      {/* CHATBOT FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-lime-400 hover:bg-lime-300 text-black p-4 rounded-full shadow-2xl transition-all duration-300"
          >
            <MessageCircle size={28} />
          </button>
        ) : (
          <div className="relative">
            <div className="w-[370px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#111]">
              <ChatBot />
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="absolute -top-3 -right-3 bg-red-500 w-8 h-8 rounded-full text-white font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      <GeneratePlanModal
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
      />

      <LogMealModal
        isOpen={mealOpen}
        onClose={() => setMealOpen(false)}
      />

      <TrackWorkoutModal
        isOpen={workoutOpen}
        onClose={() => {
          setWorkoutOpen(false);
          fetchWorkouts();
        }}
      />
    </>
  );
}

export default UserDashboard;