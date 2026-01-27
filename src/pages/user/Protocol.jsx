import React, { useState } from 'react';
import { Calendar, Utensils, Dumbbell } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

export function Protocol() {
  const [activeTab, setActiveTab] = useState<'week' | 'day'>('week');

  const weekPlan = [
    { day: 'Monday', meals: 3, workouts: 1, calories: 1850 },
    { day: 'Tuesday', meals: 3, workouts: 1, calories: 1900 },
    { day: 'Wednesday', meals: 3, workouts: 0, calories: 1750 },
    { day: 'Thursday', meals: 3, workouts: 1, calories: 1850 },
    { day: 'Friday', meals: 3, workouts: 1, calories: 1900 },
    { day: 'Saturday', meals: 3, workouts: 1, calories: 2000 },
    { day: 'Sunday', meals: 3, workouts: 0, calories: 1800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 dark:text-white">My Protocol</h2>
        <Button>
          <Calendar className="w-4 h-4" />
          Generate New Plan
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === 'week' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('week')}
        >
          Weekly View
        </Button>
        <Button
          variant={activeTab === 'day' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('day')}
        >
          Daily View
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekPlan.map((day) => (
          <Card key={day.day}>
            <h4 className="text-gray-900 dark:text-white mb-4">{day.day}</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Meals</span>
                </div>
                <span className="text-gray-900 dark:text-white">{day.meals}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Workouts</span>
                </div>
                <span className="text-gray-900 dark:text-white">{day.workouts}</span>
              </div>
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