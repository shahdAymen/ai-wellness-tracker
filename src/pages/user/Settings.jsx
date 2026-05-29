import React, { useState } from 'react';
import { User, Lock, Bell, Globe } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityErrors, setSecurityErrors] = useState({});
  const [securitySuccess, setSecuritySuccess] = useState('');

  const handleUpdateProfile = () => {
    setProfileSuccess('');
    const errors = {};
    if (!profileName.trim()) {
      errors.name = 'Name is required';
    }
    if (!profileEmail) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileEmail)) {
      errors.email = 'Invalid email address';
    }

    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setProfileSuccess('Profile updated successfully!');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  const handleChangePassword = () => {
    setSecuritySuccess('');
    const errors = {};
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }

    setSecurityErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSecuritySuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setSecuritySuccess(''), 4000);
  };

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

          {profileSuccess && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              {profileSuccess}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                  if (profileErrors.name) setProfileErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                  profileErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {profileErrors.name && (
                <span className="text-red-500 dark:text-rose-400 text-xs mt-1 block font-medium">
                  {profileErrors.name}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => {
                  setProfileEmail(e.target.value);
                  if (profileErrors.email) setProfileErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                  profileErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {profileErrors.email && (
                <span className="text-red-500 dark:text-rose-400 text-xs mt-1 block font-medium">
                  {profileErrors.email}
                </span>
              )}
            </div>
            <Button onClick={handleUpdateProfile}>Update Profile</Button>
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

          {securitySuccess && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              {securitySuccess}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (securityErrors.currentPassword) setSecurityErrors(prev => ({ ...prev, currentPassword: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                  securityErrors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {securityErrors.currentPassword && (
                <span className="text-red-500 dark:text-rose-400 text-xs mt-1 block font-medium">
                  {securityErrors.currentPassword}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (securityErrors.newPassword) setSecurityErrors(prev => ({ ...prev, newPassword: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition ${
                  securityErrors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {securityErrors.newPassword && (
                <span className="text-red-500 dark:text-rose-400 text-xs mt-1 block font-medium">
                  {securityErrors.newPassword}
                </span>
              )}
            </div>
            <Button variant="danger" onClick={handleChangePassword}>Change Password</Button>
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
