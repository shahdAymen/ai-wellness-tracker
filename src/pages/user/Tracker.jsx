import React, { useEffect, useState } from 'react';
import { CheckCircle2, Droplets, Plus, RefreshCw, Save, Scale, Utensils } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { useTrackerData } from '../../hooks/useTrackerData';
import { mealsAPI, statsAPI, waterAPI } from '../../services/api';

const initialStats = {
  currentWeight: '',
  waist: '',
  chest: '',
  bmi: '',
  caloriesConsumed: '',
  waterIntake: '',
  steps: '',
};

export default function Tracker() {
  const { showToast } = useToast();
  const { stats, waterHistory, waterToday, todayMeals, emptyStates, loading, error, reload } = useTrackerData();
  const [activeTab, setActiveTab] = useState('stats');
  const [statsForm, setStatsForm] = useState(initialStats);
  const [waterAmount, setWaterAmount] = useState('0.25');
  const [savingStats, setSavingStats] = useState(false);
  const [loggingWater, setLoggingWater] = useState(false);
  const [mealBusyId, setMealBusyId] = useState(null);
  const [displayMeals, setDisplayMeals] = useState([]);

  useEffect(() => {
    if (!stats) {
      setStatsForm(initialStats);
      return;
    }

    setStatsForm({
      currentWeight: stats.currentWeight ?? '',
      waist: stats.waist ?? '',
      chest: stats.chest ?? '',
      bmi: stats.bmi ?? '',
      caloriesConsumed: stats.caloriesConsumed ?? '',
      waterIntake: stats.waterIntake ?? '',
      steps: stats.steps ?? '',
    });
  }, [stats]);

  useEffect(() => {
    setDisplayMeals(todayMeals);
  }, [todayMeals]);

  const updateStatsField = (field, value) => {
    setStatsForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveStats = async (event) => {
    event.preventDefault();
    setSavingStats(true);
    try {
      await statsAPI.update({
        currentWeight: Number(statsForm.currentWeight),
        waist: Number(statsForm.waist),
        chest: Number(statsForm.chest),
        bmi: Number(statsForm.bmi),
        caloriesConsumed: Number(statsForm.caloriesConsumed),
        waterIntake: Number(statsForm.waterIntake),
        steps: Number(statsForm.steps),
      });
      showToast({ type: 'success', title: 'Daily stats saved' });
      await reload();
    } catch (err) {
      showToast({ type: 'error', title: 'Could not save stats', message: err.message });
    } finally {
      setSavingStats(false);
    }
  };

  const logWater = async () => {
    const amount = Number(waterAmount);
    if (!amount || amount <= 0 || amount > 10) {
      showToast({
        type: 'error',
        title: 'Invalid water amount',
        message: 'Amount must be greater than 0 and less than or equal to 10 liters.',
      });
      return;
    }

    setLoggingWater(true);
    try {
      await waterAPI.log(amount);
      showToast({ type: 'success', title: 'Water logged', message: `${amount} L added.` });
      await reload();
    } catch (err) {
      showToast({ type: 'error', title: 'Could not log water', message: err.message });
    } finally {
      setLoggingWater(false);
    }
  };

  const toggleMeal = async (meal) => {
    if (!meal.mealPlanId) return;

    const nextCompleted = !meal.isCompleted;
    const previousMeals = displayMeals;

    setMealBusyId(meal.mealPlanId);
    setDisplayMeals((prev) =>
      prev.map((item) =>
        item.mealPlanId === meal.mealPlanId
          ? { ...item, isCompleted: nextCompleted }
          : item
      )
    );

    try {
      if (meal.isCompleted) {
        await mealsAPI.uncompleteMeal(meal.mealPlanId);
        showToast({ type: 'success', title: 'Meal marked incomplete' });
      } else {
        await mealsAPI.completeMeal(meal.mealPlanId);
        showToast({ type: 'success', title: 'Meal completed' });
      }
      await reload();
    } catch (err) {
      setDisplayMeals(previousMeals);
      showToast({ type: 'error', title: 'Meal update failed', message: err.message });
    } finally {
      setMealBusyId(null);
    }
  };

  if (loading) return <PageLoader label="Loading tracker..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Tracker</p>
          <h1 className="mt-2 text-3xl font-bold text-app">Daily health tracking</h1>
          <p className="mt-2 text-sm text-app-muted">
            Update body metrics, hydration, and meal completion using the live VitalityAI backend.
          </p>
        </div>
        <Button variant="outline" onClick={reload}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ['stats', Scale, 'Daily metrics'],
          ['water', Droplets, 'Water'],
          ['meals', Utensils, 'Meals'],
        ].map(([key, Icon, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              activeTab === key
                ? 'bg-emerald-500 text-white'
                : 'border border-app text-app-muted hover:border-emerald-400'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'stats' && (
        <Card className="border border-app">
          {emptyStates.stats && (
            <div className="mb-5">
              <EmptyState
                title="No health metrics recorded yet."
                message="Start tracking your health data."
                action={<Button onClick={() => document.getElementById('tracker-currentWeight')?.focus()}>Start tracking your health data</Button>}
              />
            </div>
          )}

          <form onSubmit={saveStats} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <NumberField id="tracker-currentWeight" label="Current weight (kg)" value={statsForm.currentWeight} onChange={(value) => updateStatsField('currentWeight', value)} />
              <NumberField label="Waist (cm)" value={statsForm.waist} onChange={(value) => updateStatsField('waist', value)} />
              <NumberField label="Chest (cm)" value={statsForm.chest} onChange={(value) => updateStatsField('chest', value)} />
              <NumberField label="BMI" value={statsForm.bmi} onChange={(value) => updateStatsField('bmi', value)} />
              <NumberField label="Calories consumed" value={statsForm.caloriesConsumed} onChange={(value) => updateStatsField('caloriesConsumed', value)} />
              <NumberField label="Water intake (L)" value={statsForm.waterIntake} onChange={(value) => updateStatsField('waterIntake', value)} />
              <NumberField label="Steps" value={statsForm.steps} onChange={(value) => updateStatsField('steps', value)} />
            </div>
            <Button type="submit" disabled={savingStats}>
              <Save className="h-4 w-4" />
              {savingStats ? 'Saving...' : 'Save daily metrics'}
            </Button>
          </form>
        </Card>
      )}

      {activeTab === 'water' && (
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr]">
          <Card className="border border-app">
            <p className="text-sm text-app-muted">Today</p>
            <p className="mt-2 text-4xl font-bold text-app">
              {Number(waterToday?.totalAmount || 0).toFixed(1)} L
            </p>
            <div className="mt-5 flex gap-3">
              <input
                type="number"
                min="0.1"
                max="10"
                step="0.05"
                value={waterAmount}
                onChange={(event) => setWaterAmount(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-app bg-app-surface px-4 py-3 text-app"
              />
              <Button onClick={logWater} disabled={loggingWater}>
                <Plus className="h-4 w-4" />
                {loggingWater ? 'Saving...' : 'Add'}
              </Button>
            </div>
          </Card>

          <Card className="border border-app">
            <h2 className="text-xl font-bold text-app">Water history</h2>
            <div className="mt-4 space-y-3">
              {waterHistory.length === 0 ? (
                <EmptyState title="No water logs yet." message="Add your first hydration entry above." />
              ) : (
                waterHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-lg bg-app-surface p-3">
                    <span className="text-app">{entry.amount} L</span>
                    <span className="text-sm text-app-muted">
                      {entry.date ? new Date(entry.date).toLocaleString() : 'Logged'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'meals' && (
        <Card className="border border-app">
          <h2 className="text-xl font-bold text-app">Today&apos;s meal completion</h2>
          <div className="mt-4 space-y-3">
            {displayMeals.length === 0 ? (
              <EmptyState title="No meals available." message="Generate a meal plan before tracking meals." />
            ) : (
              displayMeals.map((meal) => (
                <div
                  key={meal.mealPlanId || `${meal.mealType}-${meal.nameEn}`}
                  className={`flex items-center justify-between gap-4 rounded-lg border p-4 ${
                    meal.isCompleted
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-app bg-app-surface'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-app">{meal.nameEn || meal.nameAr}</p>
                      {meal.isCompleted && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-app-muted">
                      {meal.mealType} - {Math.round(meal.calories || 0)} kcal
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${meal.isCompleted ? 'text-emerald-300' : 'text-slate-500'}`} />
                    <Button
                      type="button"
                      size="sm"
                      variant={meal.isCompleted ? 'outline' : 'primary'}
                      disabled={mealBusyId === meal.mealPlanId}
                      onClick={() => toggleMeal(meal)}
                    >
                      {mealBusyId === meal.mealPlanId
                        ? 'Saving...'
                        : meal.isCompleted
                          ? 'Mark incomplete'
                          : 'Complete meal'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function NumberField({ id, label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-app-muted">{label}</span>
      <input
        id={id}
        type="number"
        step="0.1"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-app bg-app-surface px-4 py-3 text-app"
      />
    </label>
  );
}
