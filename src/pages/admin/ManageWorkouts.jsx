import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';

export function ManageWorkouts() {
  const workouts = [
    { id: 1, name: 'HIIT Cardio Blast', duration: 30, difficulty: 'Advanced', calories: 350 },
    { id: 2, name: 'Beginner Yoga Flow', duration: 45, difficulty: 'Beginner', calories: 180 },
    { id: 3, name: 'Strength Training', duration: 60, difficulty: 'Intermediate', calories: 420 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-2">Manage Workouts</h2>
          <p className="text-gray-600 dark:text-gray-400">Create and edit workout programs</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Workout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id}>
            <div className="mb-3">
              <h4 className="text-gray-900 dark:text-white mb-1">{workout.name}</h4>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs ${
                  workout.difficulty === 'Beginner'
                    ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                    : workout.difficulty === 'Intermediate'
                    ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                }`}
              >
                {workout.difficulty}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-gray-900 dark:text-white">{workout.duration} min</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Burns</p>
                <p className="text-gray-900 dark:text-white">{workout.calories} kcal</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}