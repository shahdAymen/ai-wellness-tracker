import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Save } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { workoutAPI } from '../../services/api';

const emptyWorkout = {
  exercisedId: '',
  sets: '',
  reps: '',
  date: new Date().toISOString().slice(0, 10),
};

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

export default function ManageWorkouts() {
  const { showToast } = useToast();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(emptyWorkout);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await workoutAPI.getAll();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveWorkout = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      exercisedId: Number(form.exercisedId),
      sets: Number(form.sets),
      reps: Number(form.reps),
      date: new Date(form.date).toISOString(),
    };

    try {
      if (editingId) {
        await workoutAPI.update(editingId, payload);
        showToast({ type: 'success', title: 'Workout updated' });
      } else {
        await workoutAPI.create(payload);
        showToast({ type: 'success', title: 'Workout created' });
      }
      setEditingId(null);
      setForm(emptyWorkout);
      await load();
    } catch (err) {
      showToast({ type: 'error', title: 'Workout save failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading workouts..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Manage Workouts</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
          Workout completion is intentionally absent because the backend does not expose completion endpoints.
        </p>
      </div>

      {/* Form Panel */}
      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
        <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong mb-5">
          {editingId ? 'Edit Workout Plan' : 'Create New Workout Entry'}
        </h2>
        <form onSubmit={saveWorkout} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-4">
            <NumberField label="Exercise ID" value={form.exercisedId} onChange={(value) => updateForm('exercisedId', value)} />
            <NumberField label="Sets" value={form.sets} onChange={(value) => updateForm('sets', value)} />
            <NumberField label="Reps" value={form.reps} onChange={(value) => updateForm('reps', value)} />
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => updateForm('date', event.target.value)}
                required
                className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-4 py-2.5 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
              />
            </label>
          </div>
          <div className="pt-2">
            <Button type="submit" disabled={saving}>
              {editingId ? <Save className="h-3.5 w-3.5 mr-1" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
              {saving ? 'Saving...' : editingId ? 'Update workout' : 'Add workout'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Workouts Grid */}
      {workouts.length === 0 ? (
        <EmptyState title="No workouts found" />
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {workouts.map((workout) => (
            <motion.div key={workout.id} variants={itemVariants}>
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-4 border-b border-hairline dark:border-hairline-strong mb-4">
                    <div className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong p-2 text-primary">
                      <Dumbbell className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">
                        {workout.exerciseName || `Workout #${workout.id}`}
                      </h2>
                      <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 uppercase tracking-wider font-semibold mt-0.5">
                        {workout.date ? new Date(workout.date).toLocaleDateString() : 'Date not set'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed mb-6">
                    {workout.description || 'Exercise record stored in system database.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Info label="Sets" value={workout.sets || 0} />
                  <Info label="Reps" value={workout.reps || 0} />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</span>
      <input
        type="number"
        min="1"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-4 py-2.5 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
      />
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-3">
      <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 font-semibold uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink dark:text-on-dark">{value}</p>
    </div>
  );
}
