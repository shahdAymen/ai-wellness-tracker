import React from 'react';
import { Users, UtensilsCrossed, Dumbbell, Store, TrendingUp, Activity } from 'lucide-react';
import { Card } from '../../components/UI/Card';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '12,543', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-950' },
    { label: 'Active Plans', value: '8,234', change: '+8%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-950' },
    { label: 'Total Recipes', value: '1,456', change: '+23', icon: UtensilsCrossed, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-950' },
    { label: 'Workouts', value: '892', change: '+15', icon: Dumbbell, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-950' },
    { label: 'Restaurants', value: '234', change: '+5', icon: Store, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-950' },
    { label: 'Growth Rate', value: '+24%', change: 'This month', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-950' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">System Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor platform performance and user engagement
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{stat.change}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              'New user registered: john@example.com',
              'Recipe added: Mediterranean Bowl',
              'Workout plan created: HIIT Beginner',
              'Restaurant verified: Green Leaf Bistro',
            ].map((activity, i) => (
              <div
                key={i}
                className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
              >
                {activity}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-gray-900 dark:text-white mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Server Load</span>
                <span className="text-sm text-gray-900 dark:text-white">23%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Database Usage</span>
                <span className="text-sm text-gray-900 dark:text-white">67%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">API Response Time</span>
                <span className="text-sm text-gray-900 dark:text-white">142ms</span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default AdminDashboard;
