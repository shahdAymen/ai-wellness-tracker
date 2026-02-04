import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card } from '../../components/UI/Card';

export default function Analytics() {
  const stats = [
    { label: 'Weight Change', value: '-2.5 kg', trend: 'down', change: '5%', period: 'Last 30 days' },
    { label: 'Avg Calories', value: '1,850', trend: 'up', change: '3%', period: 'Last 7 days' },
    { label: 'Workout Streak', value: '12 days', trend: 'up', change: 'New Record!', period: 'Current' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">Progress Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your wellness journey with detailed insights
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              {stat.trend === 'up' ? (
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-emerald-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs rounded">
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{stat.period}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">Weight Progress</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">Calories Trend</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
