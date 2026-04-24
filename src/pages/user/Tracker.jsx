import React, { useState } from 'react';
import { Plus, Utensils, Droplets, Dumbbell } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

export default function Tracker() {
  const [activeTab, setActiveTab] = useState('meals');

  const meals = [
    { id: 1, name: 'Oatmeal with Berries', time: '08:00 AM', calories: 350, protein: 12, carbs: 58, fat: 8 },
    { id: 2, name: 'Grilled Chicken Salad', time: '01:00 PM', calories: 450, protein: 35, carbs: 25, fat: 18 },
  ];

  const waterLog = [
    { id: 1, amount: 250, time: '08:30 AM' },
    { id: 2, amount: 500, time: '11:00 AM' },
    { id: 3, amount: 250, time: '02:00 PM' },
  ];

  const workouts = [
    { id: 1, name: 'Morning Run', duration: 30, calories: 280, time: '07:00 AM' },
    { id: 2, name: 'Weight Training', duration: 45, calories: 320, time: '06:00 PM' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900 dark:text-white">Tracker</h2>
        <Button>
          <Plus className="w-4 h-4" />
          Add Entry
        </Button>
      </div>

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

      {activeTab === 'meals' && (
        <div className="space-y-4">
          {meals.map((meal) => (
            <Card key={meal.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-gray-900 dark:text-white mb-1">{meal.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{meal.time}</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 rounded-full text-sm">
                  {meal.calories} kcal
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'water' && (
        <div className="space-y-4">
          {waterLog.map((entry) => (
            <Card key={entry.id}>
              <p className="text-gray-900 dark:text-white">{entry.amount} ml</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{entry.time}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <h4 className="text-gray-900 dark:text-white">{workout.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{workout.time}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {workout.duration} min • {workout.calories} kcal
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
