import React from 'react';
import { TrendingUp, Users, Activity, Zap } from 'lucide-react';
import { Card } from '../../components/UI/Card';

export function SystemAnalytics() {
  const metrics = [
    { label: 'Daily Active Users', value: '8,234', change: '+12%', icon: Users },
    { label: 'Plans Generated', value: '1,456', change: '+23%', icon: Activity },
    { label: 'Avg Session Time', value: '24 min', change: '+8%', icon: Zap },
    { label: 'User Retention', value: '89%', change: '+5%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">System Analytics</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive platform performance metrics
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-8 h-8 text-emerald-500" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400">{metric.change}</span>
              </div>
              <p className="text-2xl text-gray-900 dark:text-white mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Growth chart visualization</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">Platform Usage</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Usage analytics visualization</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-gray-900 dark:text-white mb-4">Top Features Usage</h3>
        <div className="space-y-4">
          {[
            { feature: 'AI Plan Generator', usage: 87, users: '7,234' },
            { feature: 'Meal Tracker', usage: 76, users: '6,123' },
            { feature: 'Workout Logger', usage: 65, users: '5,456' },
            { feature: 'Restaurant Finder', usage: 54, users: '4,234' },
          ].map((item) => (
            <div key={item.feature}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.feature}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.users} users</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${item.usage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}