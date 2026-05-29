import React, { useEffect, useState } from 'react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Workouts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Workout completion is intentionally absent because the backend does not expose completion endpoints.
        </p>
      </div>

      <Card>
        <form onSubmit={saveWorkout} className="grid gap-4 md:grid-cols-4">
          <NumberField label="Exercise ID" value={form.exercisedId} onChange={(value) => updateForm('exercisedId', value)} />
          <NumberField label="Sets" value={form.sets} onChange={(value) => updateForm('sets', value)} />
          <NumberField label="Reps" value={form.reps} onChange={(value) => updateForm('reps', value)} />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateForm('date', event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <div className="md:col-span-4">
            <Button type="submit" disabled={saving}>
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving...' : editingId ? 'Update workout' : 'Add workout'}
            </Button>
          </div>
        </form>
      </Card>

      {workouts.length === 0 ? (
        <EmptyState title="No workouts found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <Dumbbell className="h-7 w-7 text-emerald-500" />
              <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                {workout.exerciseName || `Workout #${workout.id}`}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {workout.description || 'Exercise record'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type="number"
        min="1"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}
