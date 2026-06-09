import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Calendar, LogOut, Ruler, Scale, Shield, User, UserRound } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { lookupAPI, userAPI } from '../../services/api';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

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
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Settings</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Account and integrations</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
          Manage your personal profile and account sessions.
        </p>
      </div>

      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
            <div className="mb-6 flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-strong">
              <div className="flex items-center gap-2.5">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Profile Details</h2>
              </div>
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
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
                    className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                  />
                </Field>

                <Field label="Gender" error={errors.gender} icon={UserRound}>
                  <select
                    value={form.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
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
                    className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
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
                      className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
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
                      className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                    />
                  </Field>
                </div>

                <Field label="Activity level" error={errors.activityLevelId} icon={Activity}>
                  <select
                    value={form.activityLevelId}
                    onChange={(e) => updateField('activityLevelId', e.target.value)}
                    className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
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
                    className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                  >
                    <option value="">Select goal</option>
                    {goals.map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
            <div className="mb-6 flex items-center gap-2.5 pb-4 border-b border-hairline dark:border-hairline-strong">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Active Session</h2>
            </div>
            <p className="text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed">
              Logout revokes your current session keys, terminates the server-side authentication state, and clears your local storage.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button variant="danger" onClick={logout}>
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-strong pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</span>
      <span className="text-sm font-semibold text-ink dark:text-on-dark">{value}</span>
    </div>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-500">{error}</span>}
    </label>
  );
}
