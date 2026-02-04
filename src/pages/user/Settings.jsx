import React from 'react';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* ---------------- HEADER ---------------- */}
      <div>
        <h2 className="text-gray-900 dark:text-white mb-2">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* ---------------- PROFILE ---------------- */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white">Profile Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <Button>Update Profile</Button>
          </div>
        </Card>

        {/* ---------------- SECURITY ---------------- */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <Button variant="danger">Change Password</Button>
          </div>
        </Card>

        {/* ---------------- NOTIFICATIONS ---------------- */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white">Notifications</h3>
          </div>

          <div className="space-y-4">
            {['Meal Reminders', 'Workout Reminders', 'Hydration Alerts', 'Progress Updates'].map(
              (item) => (
                <label key={item} className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 text-emerald-500 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                </label>
              )
            )}
          </div>
        </Card>

        {/* ---------------- PREFERENCES ---------------- */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-gray-900 dark:text-white">Preferences</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Units</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                <option>Metric (kg, cm)</option>
                <option>Imperial (lbs, ft)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Language</label>
              <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                <option>English</option>
                <option>Arabic</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
