import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Droplets, Plus, RefreshCw, Save, Scale, Utensils } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { useTrackerData } from '../../hooks/useTrackerData';
import { mealsAPI, statsAPI, waterAPI } from '../../services/api';
import AnimatedNumber from '../../components/UI/AnimatedNumber';

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
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Tracker</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Daily health tracking</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Update body metrics, hydration, and meal completion using the live VitalityAI backend.
          </p>
        </div>
        <Button variant="secondary" onClick={reload}>
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-hairline dark:border-hairline-strong">
        {[
          ['stats', Scale, 'Daily metrics'],
          ['water', Droplets, 'Water logs'],
          ['meals', Utensils, 'Meals checklist'],
        ].map(([key, Icon, label]) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`relative flex items-center gap-2 pb-4 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2 hover:text-ink dark:hover:text-on-dark'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {isActive && (
                <motion.div
                  layoutId="trackerActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                {emptyStates.stats && (
                  <div className="mb-6">
                    <EmptyState
                      title="No health metrics recorded yet."
                      message="Start tracking your daily body metrics to visualize your wellness journey."
                    />
                  </div>
                )}

                <form onSubmit={saveStats} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    <NumberField id="tracker-currentWeight" label="Current weight (kg)" value={statsForm.currentWeight} onChange={(value) => updateStatsField('currentWeight', value)} />
                    <NumberField label="Waist (cm)" value={statsForm.waist} onChange={(value) => updateStatsField('waist', value)} />
                    <NumberField label="Chest (cm)" value={statsForm.chest} onChange={(value) => updateStatsField('chest', value)} />
                    <NumberField label="BMI" value={statsForm.bmi} onChange={(value) => updateStatsField('bmi', value)} />
                    <NumberField label="Calories consumed" value={statsForm.caloriesConsumed} onChange={(value) => updateStatsField('caloriesConsumed', value)} />
                    <NumberField label="Water intake (L)" value={statsForm.waterIntake} onChange={(value) => updateStatsField('waterIntake', value)} />
                    <NumberField label="Steps" value={statsForm.steps} onChange={(value) => updateStatsField('steps', value)} />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" disabled={savingStats}>
                      <Save className="h-4 w-4 mr-1" />
                      {savingStats ? 'Saving...' : 'Save daily metrics'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {activeTab === 'water' && (
            <motion.div
              key="water"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"
            >
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Today's Intake</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink dark:text-on-dark">
                  <AnimatedNumber value={`${Number(waterToday?.totalAmount || 0).toFixed(1)} L`} />
                </p>
                <div className="mt-6 flex gap-3">
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.05"
                    value={waterAmount}
                    onChange={(event) => setWaterAmount(event.target.value)}
                    className="min-w-0 flex-1 rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-4 py-2.5 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
                  />
                  <Button onClick={logWater} disabled={loggingWater}>
                    <Plus className="h-4 w-4 mr-1" />
                    {loggingWater ? 'Saving...' : 'Add'}
                  </Button>
                </div>
              </Card>

              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Water history</h2>
                <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-0.5 mb-5">Your logged hydration intervals for today.</p>
                <div className="space-y-3">
                  {waterHistory.length === 0 ? (
                    <EmptyState title="No water logs yet." message="Add your first hydration entry to start logs." />
                  ) : (
                    waterHistory.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-4">
                        <span className="text-sm font-semibold text-primary">{entry.amount} L</span>
                        <span className="text-xs text-ink-mute dark:text-ink-mute-2">
                          {entry.date ? new Date(entry.date).toLocaleTimeString() : 'Logged'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'meals' && (
            <motion.div
              key="meals"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Today&apos;s meal completion</h2>
                <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-0.5 mb-6">Cross off meals as you consume them to sync daily calorie intake.</p>
                <div className="space-y-3">
                  {displayMeals.length === 0 ? (
                    <EmptyState title="No meals available." message="Generate a meal plan in AI Planner before tracking." />
                  ) : (
                    <AnimatePresence>
                      {displayMeals.map((meal) => (
                        <motion.div
                          key={meal.mealPlanId || `${meal.mealType}-${meal.nameEn}`}
                          layout
                          className={`flex items-center justify-between gap-4 rounded-sm border p-4 transition-colors duration-200 ${
                            meal.isCompleted
                              ? 'border-primary/30 bg-primary/5'
                              : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold tracking-tight ${meal.isCompleted ? 'text-primary' : 'text-ink dark:text-on-dark'}`}>
                                {meal.nameEn || meal.nameAr}
                              </p>
                              {meal.isCompleted && (
                                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
                              {meal.mealType} - {Math.round(meal.calories || 0)} kcal - {meal.protein || 0}g protein
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={`h-4 w-4 ${meal.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`} />
                            <Button
                              type="button"
                              size="sm"
                              variant={meal.isCompleted ? 'secondary' : 'primary'}
                              disabled={mealBusyId === meal.mealPlanId}
                              onClick={() => toggleMeal(meal)}
                            >
                              {mealBusyId === meal.mealPlanId
                                ? 'Saving...'
                                : meal.isCompleted
                                  ? 'Mark incomplete'
                                  : 'Complete'}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function NumberField({ id, label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</span>
      <input
        id={id}
        type="number"
        step="0.1"
        value={value}
        required
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-4 py-2.5 text-sm text-ink dark:text-on-dark focus:border-primary focus:outline-none transition-colors duration-200"
      />
    </label>
  );
}
