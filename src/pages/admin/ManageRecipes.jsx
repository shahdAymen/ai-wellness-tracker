import React, { useEffect, useState } from 'react';
import { Edit, Plus, Save } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { mealsAPI } from '../../services/api';

const emptyMeal = {
  externalId: '',
  mealName: '',
  description: '',
  mealType: 'Breakfast',
  calories: '',
  protein: '',
  carbs: '',
  fats: '',
};

export default function ManageRecipes() {
  const { showToast } = useToast();
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(emptyMeal);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mealsAPI.adminGetMeals();
      setMeals(Array.isArray(data) ? data : []);
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

  const editMeal = (meal) => {
    setEditingId(meal.id);
    setForm({
      externalId: meal.externalId || '',
      mealName: meal.mealName || meal.nameEn || '',
      description: meal.description || '',
      mealType: meal.mealType || 'Breakfast',
      calories: meal.calories || '',
      protein: meal.protein || '',
      carbs: meal.carbs || '',
      fats: meal.fats ?? meal.fat ?? '',
    });
  };

  const saveMeal = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fats: Number(form.fats),
    };

    try {
      if (editingId) {
        await mealsAPI.adminUpdateMeal(editingId, payload);
        showToast({ type: 'success', title: 'Meal updated' });
      } else {
        await mealsAPI.adminAddMeal(payload);
        showToast({ type: 'success', title: 'Meal added' });
      }
      setEditingId(null);
      setForm(emptyMeal);
      await load();
    } catch (err) {
      showToast({ type: 'error', title: 'Meal save failed', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading meals..." />;
  if (error) return <ErrorState message={error.message} onRetry={load} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Meals</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create and update meal records with the documented admin meal contract.
        </p>
      </div>

      <Card>
        <form onSubmit={saveMeal} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <TextField label="External ID" value={form.externalId} onChange={(value) => updateForm('externalId', value)} />
            <TextField label="Meal name" value={form.mealName} onChange={(value) => updateForm('mealName', value)} required />
            <TextField label="Meal type" value={form.mealType} onChange={(value) => updateForm('mealType', value)} required />
            <TextField label="Calories" type="number" value={form.calories} onChange={(value) => updateForm('calories', value)} required />
            <TextField label="Protein" type="number" value={form.protein} onChange={(value) => updateForm('protein', value)} required />
            <TextField label="Carbs" type="number" value={form.carbs} onChange={(value) => updateForm('carbs', value)} required />
            <TextField label="Fats" type="number" value={form.fats} onChange={(value) => updateForm('fats', value)} required />
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              required
              className="min-h-24 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {saving ? 'Saving...' : editingId ? 'Update meal' : 'Add meal'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyMeal); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {meals.length === 0 ? (
        <EmptyState title="No meals found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {meals.map((meal) => (
            <Card key={meal.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {meal.mealName || meal.nameEn}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {meal.description || meal.mealType || 'Meal'}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => editMeal(meal)}>
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Calories" value={`${meal.calories || 0} kcal`} />
                <Info label="Protein" value={`${meal.protein || 0}g`} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 dark:bg-slate-700">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
