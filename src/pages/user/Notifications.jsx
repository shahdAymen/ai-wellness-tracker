import React from 'react';
import { Bell, Droplets, Utensils, Zap, CheckCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';

export function Notifications() {
  const notifications = [
    {
      id: 1,
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-950',
      title: 'Hydration Reminder',
      message: 'Time to drink water! You need 500ml more to reach your goal.',
      time: '10 minutes ago',
      unread: true,
    },
    {
      id: 2,
      icon: Utensils,
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-950',
      title: 'Meal Time',
      message: 'Your lunch is scheduled in 30 minutes - Salmon Quinoa Bowl',
      time: '30 minutes ago',
      unread: true,
    },
    {
      id: 3,
      icon: Zap,
      color: 'text-emerald-500',
      bg: 'bg-emerald-100 dark:bg-emerald-950',
      title: 'Goal Achievement',
      message: 'Congratulations! You reached your daily calorie goal.',
      time: '2 hours ago',
      unread: false,
    },
    {
      id: 4,
      icon: CheckCircle,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-950',
      title: 'Workout Complete',
      message: 'Great job completing your HIIT session! 450 calories burned.',
      time: '1 day ago',
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-white mb-2">Notifications</h2>
          <p className="text-gray-600 dark:text-gray-400">Stay updated on your wellness journey</p>
        </div>
        <Bell className="w-6 h-6 text-gray-400" />
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card
              key={notification.id}
              className={notification.unread ? 'border-l-4 border-l-emerald-500' : ''}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg ${notification.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${notification.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-gray-900 dark:text-white">{notification.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export default Notifications;