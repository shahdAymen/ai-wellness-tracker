import React, { useEffect, useState } from 'react';
import { Activity, Calendar, Link, LogOut, Ruler, Scale, Shield, User, UserRound } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authAPI, lookupAPI, userAPI } from '../../services/api';

export default function Settings() {
  const { user, logout, refreshMe } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [activityLevels, setActivityLevels] = useState([]);
  const [goals, setGoals] = useState([]);

  // Form state
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    activityLevelId: '',
    goalId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [levels, goalOptions] = await Promise.all([
          lookupAPI.getActivityLevels(),
          lookupAPI.getGoals(),
        ]);
        setActivityLevels(Array.isArray(levels) ? levels : []);
        setGoals(Array.isArray(goalOptions) ? goalOptions : []);
      } catch (err) {
        showToast({ type: 'error', title: 'Failed to load options', message: err.message });
      }
    };
    loadLookups();
  }, [showToast]);

  // Pre-fill form when entering edit mode or when user data loads
  useEffect(() => {
    if (user && activityLevels.length > 0 && goals.length > 0) {
      const currentLevelId = activityLevels.find(l => l.name === user.activityLevel)?.id || '';
      const currentGoalId = goals.find(g => g.name === user.goal)?.id || '';

      setForm({
        fullName: user.fullName || user.name || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
        height: user.height || '',
        weight: user.weight || '',
        activityLevelId: currentLevelId,
        goalId: currentGoalId,
      });
    }
  }, [user, activityLevels, goals, isEditing]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (!form.fullName) next.fullName = 'Name is required.';
    if (!form.gender) next.gender = 'Select your gender.';
    if (!form.birthDate) next.birthDate = 'Birth date is required.';
    if (form.birthDate && new Date(form.birthDate) >= new Date()) {
      next.birthDate = 'Birth date must be in the past.';
    }
    if (!height || height < 100 || height > 250) next.height = 'Height must be 100-250 cm.';
    if (!weight || weight < 30 || weight > 300) next.weight = 'Weight must be 30-300 kg.';
    if (!form.activityLevelId) next.activityLevelId = 'Choose an activity level.';
    if (!form.goalId) next.goalId = 'Choose your goal.';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await userAPI.updateProfile({
        fullName: form.fullName,
        gender: form.gender,
        birthDate: new Date(form.birthDate).toISOString(),
        height: Number(form.height),
        weight: Number(form.weight),
        activityLevelId: Number(form.activityLevelId),
        goalId: Number(form.goalId),
      });
      await refreshMe();
      showToast({ type: 'success', title: 'Profile updated' });
      setIsEditing(false);
      window.dispatchEvent(new CustomEvent('vitalityai:dashboard-refresh'));
    } catch (err) {
      showToast({ type: 'error', title: 'Update failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const maxBirthDate = new Date();
  maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 10);
  const maxBirthDateStr = maxBirthDate.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Settings</p>
        <h1 className="mt-2 text-3xl font-bold text-app">Account and integrations</h1>
        <p className="mt-2 text-sm text-app-muted">
          Manage your personal profile and account sessions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-app">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-app">Profile</h2>
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3">
              <InfoRow label="Name" value={user?.fullName || user?.name || 'Not set'} />
              <InfoRow label="Email" value={user?.email || 'Not set'} />
              <InfoRow label="Gender" value={user?.gender || 'Not set'} />
              <InfoRow label="Birth date" value={user?.birthDate ? new Date(user.birthDate).toLocaleDateString() : 'Not set'} />
              <InfoRow label="Height" value={user?.height ? `${user.height} cm` : 'Not set'} />
              <InfoRow label="Weight" value={user?.weight ? `${user.weight} kg` : 'Not set'} />
              <InfoRow label="Activity level" value={user?.activityLevel || 'Not set'} />
              <InfoRow label="Goal" value={user?.goal || 'Not set'} />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <Field label="Full Name" error={errors.fullName} icon={UserRound}>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                />
              </Field>

              <Field label="Gender" error={errors.gender} icon={UserRound}>
                <select
                  value={form.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <Field label="Birth date" error={errors.birthDate} icon={Calendar}>
                <input
                  type="date"
                  max={maxBirthDateStr}
                  value={form.birthDate}
                  onChange={(e) => updateField('birthDate', e.target.value)}
                  className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Height (cm)" error={errors.height} icon={Ruler}>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={form.height}
                    onChange={(e) => updateField('height', e.target.value)}
                    className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                  />
                </Field>

                <Field label="Weight (kg)" error={errors.weight} icon={Scale}>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    step="0.1"
                    value={form.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                    className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                  />
                </Field>
              </div>

              <Field label="Activity level" error={errors.activityLevelId} icon={Activity}>
                <select
                  value={form.activityLevelId}
                  onChange={(e) => updateField('activityLevelId', e.target.value)}
                  className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                >
                  <option value="">Select activity level</option>
                  {activityLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Goal" error={errors.goalId} icon={Activity}>
                <select
                  value={form.goalId}
                  onChange={(e) => updateField('goalId', e.target.value)}
                  className="w-full rounded-lg border border-app bg-app-surface px-4 py-2 text-app"
                >
                  <option value="">Select goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="mt-5 flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="border border-app h-fit">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-app">Session</h2>
          </div>
          <p className="text-sm text-app-muted">
            Logout revokes the refresh token using the documented auth endpoint, then clears local
            session state.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => (window.location.href = authAPI.getGoogleLoginUrl())}>
              <Link className="h-4 w-4" />
              Connect Google
            </Button>
            <Button variant="danger" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-app pb-3">
      <span className="text-sm text-app-muted">{label}</span>
      <span className="text-right text-sm font-semibold text-app">{value}</span>
    </div>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-app">
        <Icon className="h-4 w-4 text-emerald-400" />
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-rose-400">{error}</span>}
    </label>
  );
}
