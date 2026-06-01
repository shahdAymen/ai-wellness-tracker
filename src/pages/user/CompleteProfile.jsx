import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Calendar, Ruler, Scale, UserRound } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { lookupAPI, userAPI } from '../../services/api';

const initialForm = {
  gender: '',
  birthDate: '',
  height: '',
  weight: '',
  activityLevelId: '',
  goalId: '',
};

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, refreshMe } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [activityLevels, setActivityLevels] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      gender: user?.gender || '',
      birthDate: user?.birthDate ? user.birthDate.slice(0, 10) : '',
      height: user?.height || '',
      weight: user?.weight || '',
      activityLevelId: '',
      goalId: '',
    });
  }, [user]);

  const loadLookups = async () => {
    setLoading(true);
    setError(null);
    try {
      const [levels, goalOptions] = await Promise.all([
        lookupAPI.getActivityLevels(),
        lookupAPI.getGoals(),
      ]);
      setActivityLevels(Array.isArray(levels) ? levels : []);
      setGoals(Array.isArray(goalOptions) ? goalOptions : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLookups();
  }, []);

  const maxBirthDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date.toISOString().slice(0, 10);
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const next = {};
    const height = Number(form.height);
    const weight = Number(form.weight);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await userAPI.setupProfile({
        gender: form.gender,
        birthDate: new Date(form.birthDate).toISOString(),
        height: Number(form.height),
        weight: Number(form.weight),
        activityLevelId: Number(form.activityLevelId),
        goalId: Number(form.goalId),
      });
      await refreshMe();
      showToast({
        type: 'success',
        title: 'Profile completed',
        message: 'Your dashboard is ready to use real backend data.',
      });
      navigate('/user', { replace: true });
    } catch (err) {
      showToast({ type: 'error', title: 'Profile setup failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading profile options..." />;
  if (error) return <ErrorState message={error.message} onRetry={loadLookups} />;

  return (
    <div className="mx-auto max-w-4xl space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Profile setup</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Build your VitalityAI baseline</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2 max-w-2xl">
          These fields match the backend profile contract and power calorie targets, AI meal plans, and daily tracking.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Field label="Gender" error={errors.gender} icon={UserRound}>
                <select
                  value={form.gender}
                  onChange={(event) => updateField('gender', event.target.value)}
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
                  max={maxBirthDate}
                  value={form.birthDate}
                  onChange={(event) => updateField('birthDate', event.target.value)}
                  className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                />
              </Field>

              <Field label="Height (cm)" error={errors.height} icon={Ruler}>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={form.height}
                  onChange={(event) => updateField('height', event.target.value)}
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
                  onChange={(event) => updateField('weight', event.target.value)}
                  className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                />
              </Field>

              <Field label="Activity level" error={errors.activityLevelId} icon={Activity}>
                <select
                  value={form.activityLevelId}
                  onChange={(event) => updateField('activityLevelId', event.target.value)}
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
                  onChange={(event) => updateField('goalId', event.target.value)}
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
            </div>

            <div className="flex justify-end pt-4 border-t border-hairline dark:border-hairline-strong">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Complete profile'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
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
