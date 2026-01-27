import React from 'react';
import { Flame, Zap, Droplets, Utensils, Dumbbell, Watch, CheckCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { ProgressCircle } from '../../components/UI/ProgressCircles';
import { Button } from '../../components/UI/Button';

export function UserDashboard() {
  const stats = {
    calories: { current: 1450, target: 2200, unit: 'kcal' },
    burned: { current: 450, target: 600, unit: 'kcal' },
    hydration: { current: 1250, target: 3500, unit: 'ml' },
  };

  const upNext = [
    {
      id: 1,
      icon: Utensils,
      name: 'Salmon Quinoa Bowl',
      time: '12:00 PM',
      calories: '450 kcal',
      color: 'text-orange-500',
      borderColor: 'border-orange-500',
    },
    {
      id: 2,
      icon: Dumbbell,
      name: 'HIIT Cardio Blast',
      time: '17:30 PM',
      calories: '30 mins',
      color: 'text-red-500',
      borderColor: 'border-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Calories</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {stats.calories.current}{' '}
                  <span className="text-sm text-gray-500">/ {stats.calories.target}</span>
                </p>
              </div>
            </div>
            <ProgressCircle
              value={stats.calories.current}
              max={stats.calories.target}
              color="#f97316"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">+30 kcal from yesterday</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Burned</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {stats.burned.current}{' '}
                  <span className="text-sm text-gray-500">/ {stats.burned.target}</span>
                </p>
              </div>
            </div>
            <ProgressCircle
              value={stats.burned.current}
              max={stats.burned.target}
              color="#ef4444"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Keep moving!</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Hydration</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  {stats.hydration.current}{' '}
                  <span className="text-sm text-gray-500">/ {stats.hydration.target}</span>
                </p>
              </div>
            </div>
            <ProgressCircle
              value={stats.hydration.current}
              max={stats.hydration.target}
              color="#3b82f6"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">1.25L to go</p>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Up Next */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 dark:text-white">Up Next</h3>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm rounded-full">
                TODAY
              </span>
            </div>

            <div className="space-y-4">
              {upNext.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${item.borderColor} bg-gray-50 dark:bg-slate-700`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={`w-6 h-6 ${item.color}`} />
                      <div>
                        <p className="text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.calories} • {item.time}
                        </p>
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors">
                      <CheckCircle className="w-5 h-5 mx-auto text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Device Sync */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-950 dark:to-black text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Watch className="w-5 h-5 text-emerald-400" />
              <h4>Device Sync</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 uppercase">Live</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6">Apple Watch Series 8</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl mb-1">112</p>
              <p className="text-xs text-gray-400 uppercase">BPM</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">8.4k</p>
              <p className="text-xs text-gray-400 uppercase">Steps</p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1">7h</p>
              <p className="text-xs text-gray-400 uppercase">Sleep</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="outline" className="w-full justify-center">
          <Zap className="w-5 h-5" />
          Generate AI Plan
        </Button>
        <Button variant="outline" className="w-full justify-center">
          <Utensils className="w-5 h-5" />
          Log Meal
        </Button>
        <Button variant="outline" className="w-full justify-center">
          <Dumbbell className="w-5 h-5" />
          Track Workout
        </Button>
      </div>
    </div>
  );
}
export default UserDashboard