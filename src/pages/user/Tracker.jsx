import React, { useState, useEffect } from 'react';
import { Plus, Utensils, Droplets, Dumbbell } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

import { mealsAPI, waterAPI, workoutAPI } from '../../API';

export default function Tracker() {
  const [activeTab, setActiveTab] = useState('meals');

  // data states
  const [meals, setMeals] = useState([]);
  const [waterLog, setWaterLog] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(false);

  // fetch data
  useEffect(() => {
    if (activeTab === 'meals') fetchMeals();
    if (activeTab === 'water') fetchWater();
    if (activeTab === 'workouts') fetchWorkouts();
  }, [activeTab]);

  // ================= MEALS =================
  const fetchMeals = async () => {
    setLoading(true);
    try {
      const data = await mealsAPI.getToday();
      setMeals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= WATER =================
  const fetchWater = async () => {
    setLoading(true);
    try {
      const history = await waterAPI.getHistory?.();
      setWaterLog(Array.isArray(history) ? history : []);
    } catch (err) {
      console.log(err);
      setWaterLog([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async () => {
    try {
      if (waterAPI.log) {
        await waterAPI.log(250);
      }
      fetchWater();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= WORKOUTS =================
  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await workoutAPI.getAll?.();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 dark:text-white">
  Tracker{' '}
  <span className="text-sm text-gray-500 ml-2">
    {new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })}
  </span>
</h2>
        <Button>
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={activeTab === 'meals' ? 'primary' : 'ghost'} onClick={() => setActiveTab('meals')}>
          <Utensils className="w-4 h-4" />
          Meals
        </Button>

        <Button variant={activeTab === 'water' ? 'primary' : 'ghost'} onClick={() => setActiveTab('water')}>
          <Droplets className="w-4 h-4" />
          Water
        </Button>

        <Button variant={activeTab === 'workouts' ? 'primary' : 'ghost'} onClick={() => setActiveTab('workouts')}>
          <Dumbbell className="w-4 h-4" />
          Workouts
        </Button>
      </div>

      {/* ================= MEALS ================= */}
      {activeTab === 'meals' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            meals.map((meal) => (
              <Card key={meal.id}>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-gray-900 dark:text-white">
                      {meal.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {meal.time || meal.mealType}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-full text-sm">
                    {meal.calories} kcal
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ================= WATER ================= */}
      {activeTab === 'water' && (
        <div className="space-y-4">

          <Button onClick={handleAddWater}>
            <Plus className="w-4 h-4" />
            Add Water 250ml
          </Button>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            waterLog.map((entry) => (
              <Card key={entry.id}>
                <p className="text-gray-900 dark:text-white">
                  {entry.amount} ml
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.time || entry.loggedAt}
                </p>
              </Card>
            ))
          )}
        </div>
      )}

      {/* ================= WORKOUTS ================= */}
      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id}>
                <h4 className="text-gray-900 dark:text-white">
                  {workout.exerciseName || workout.name || `Workout #${workout.id}`}
                </h4>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {workout.date || workout.time}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {workout.duration || 0} min • {workout.caloriesBurned || workout.calories || 0} kcal
                </p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}