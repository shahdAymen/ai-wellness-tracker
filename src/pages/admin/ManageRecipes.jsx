import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    // Scroll to form smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b border-hairline dark:border-hairline-strong pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Manage Meals</h1>
        <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
          Create and update meal records with the admin meal contract.
        </p>
      </div>

      {/* Form Panel */}
      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
        <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong mb-5">
          {editingId ? 'Edit Meal Recipe' : 'Add New Meal Recipe'}
        </h2>
        <form onSubmit={saveMeal} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <TextField label="External ID" value={form.externalId} onChange={(value) => updateForm('externalId', value)} />
            <TextField label="Meal name" value={form.mealName} onChange={(value) => updateForm('mealName', value)} required />
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Meal type</span>
              <select
                value={form.mealType}
                onChange={(event) => updateForm('mealType', event.target.value)}
                required
                className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-3 py-2 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </label>
            <TextField label="Calories" type="number" value={form.calories} onChange={(value) => updateForm('calories', value)} required />
            <TextField label="Protein" type="number" value={form.protein} onChange={(value) => updateForm('protein', value)} required />
            <TextField label="Carbs" type="number" value={form.carbs} onChange={(value) => updateForm('carbs', value)} required />
            <TextField label="Fats" type="number" value={form.fats} onChange={(value) => updateForm('fats', value)} required />
          </div>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Description / Preparation</span>
            <textarea
              value={form.description}
              onChange={(event) => updateForm('description', event.target.value)}
              required
              className="min-h-24 w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-4 py-3 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
            />
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving}>
              {editingId ? <Save className="h-3.5 w-3.5 mr-1" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
              {saving ? 'Saving...' : editingId ? 'Update meal' : 'Add meal'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setForm(emptyMeal); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Meals List */}
      {meals.length === 0 ? (
        <EmptyState title="No meals found" />
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {meals.map((meal) => (
            <motion.div key={meal.id} variants={itemVariants}>
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline dark:border-hairline-strong mb-4">
                    <div>
                      <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">
                        {meal.mealName || meal.nameEn}
                      </h2>
                      <span className="inline-block mt-1.5 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">
                        {meal.mealType || 'Meal'}
                      </span>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => editMeal(meal)}>
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed mb-6">
                    {meal.description || 'No description provided.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Info label="Calories" value={`${meal.calories || 0} kcal`} />
                  <Info label="Protein" value={`${meal.protein || 0}g`} />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
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
