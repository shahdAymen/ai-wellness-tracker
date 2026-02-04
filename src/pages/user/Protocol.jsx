import React, { useState, useEffect } from 'react';
import { Calendar, Utensils, Dumbbell, Moon, Sun } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function Protocol() {
  const [activeTab, setActiveTab] = useState('week'); // 'week' أو 'day'
  const [darkMode, setDarkMode] = useState(false);

  const weekPlan = [
    { day: 'Monday', meals: 3, workouts: 1, calories: 1850 },
    { day: 'Tuesday', meals: 3, workouts: 1, calories: 1900 },
    { day: 'Wednesday', meals: 3, workouts: 0, calories: 1750 },
    { day: 'Thursday', meals: 3, workouts: 1, calories: 1850 },
    { day: 'Friday', meals: 3, workouts: 1, calories: 1900 },
    { day: 'Saturday', meals: 3, workouts: 1, calories: 2000 },
    { day: 'Sunday', meals: 3, workouts: 0, calories: 1800 },
  ];

  // ---------------- Dark Mode Toggle ----------------
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="space-y-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-gray-900 dark:text-white">My Protocol</h2>

        <div className="flex gap-2">
          {/* Dark/Light Toggle */}
          <Button
            variant="ghost"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button>
            <Calendar className="w-4 h-4" />
            Generate New Plan
          </Button>
        </div>
      </div>

      {/* ---------------- TABS ---------------- */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'week' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('week')}
        >
          Weekly Plan
        </Button>
        <Button
          variant={activeTab === 'day' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('day')}
        >
          Daily Plan
        </Button>
      </div>

      {/* ---------------- WEEKLY PLAN CARDS ---------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekPlan.map((day) => (
          <Card key={day.day}>
            <h4 className="text-gray-900 dark:text-white mb-4">{day.day}</h4>

            <div className="space-y-3">
              {/* Meals */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Meals</span>
                </div>
                <span className="text-gray-900 dark:text-white">{day.meals}</span>
              </div>

              {/* Workouts */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Workouts</span>
                </div>
                <span className="text-gray-900 dark:text-white">{day.workouts}</span>
              </div>

              {/* Total Calories */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: <span className="text-gray-900 dark:text-white">{day.calories} kcal</span>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
export { Protocol };
