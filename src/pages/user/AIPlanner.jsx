import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { usePlannerData } from '../../hooks/usePlannerData';
import { aiAPI, mealsAPI } from '../../services/api';
import AnimatedNumber from '../../components/UI/AnimatedNumber';

function getCompletionPercent(day) {
  return day?.totalMeals ? Math.round((day.completedMeals / day.totalMeals) * 100) : 0;
}

function updateDays(days, mealPlanId, nextCompleted) {
  return days.map((day) => {
    let changed = false;
    const nextMeals = (day.meals || []).map((meal) => {
      if (meal.mealPlanId !== mealPlanId) return meal;
      changed = true;
      return { ...meal, isCompleted: nextCompleted };
    });

    if (!changed) return day;

    const completedMeals = Number(day.completedMeals || 0) + (nextCompleted ? 1 : -1);
    return {
      ...day,
      completedMeals: Math.max(0, Math.min(Number(day.totalMeals || 0), completedMeals)),
      meals: nextMeals,
    };
  });
}

export default function AIPlanner() {
  const { showToast } = useToast();
  const { weeklyDays, monthlyDays, emptyStates, loading, error, reload } = usePlannerData();
  const [activeView, setActiveView] = useState('weekly');
  const [generating, setGenerating] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [mealBusyId, setMealBusyId] = useState(null);
  const [displayWeeklyDays, setDisplayWeeklyDays] = useState([]);
  const [displayMonthlyDays, setDisplayMonthlyDays] = useState([]);

  useEffect(() => {
    setDisplayWeeklyDays(weeklyDays);
  }, [weeklyDays]);

  useEffect(() => {
    setDisplayMonthlyDays(monthlyDays);
  }, [monthlyDays]);

  const days = activeView === 'weekly' ? displayWeeklyDays : displayMonthlyDays;
  const totalCalories = useMemo(
    () => days.reduce((sum, day) => sum + Number(day.totalCalories || 0), 0),
    [days]
  );
  const totalMeals = useMemo(
    () => days.reduce((sum, day) => sum + Number(day.totalMeals || 0), 0),
    [days]
  );
  const totalCompletedMeals = useMemo(
    () => days.reduce((sum, day) => sum + Number(day.completedMeals || 0), 0),
    [days]
  );
  const totalCompletion = totalMeals ? Math.round((totalCompletedMeals / totalMeals) * 100) : 0;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await aiAPI.generateWeeklyPlan();
      localStorage.setItem('plan_generation_date', new Date().toISOString());
      showToast({
        type: 'success',
        title: 'Plan generated',
        message: 'The backend persisted your new 4-week meal plan.',
      });
      await reload();
    } catch (err) {
      showToast({ type: 'error', title: 'Generation failed', message: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const openMeal = async (meal) => {
    setSelectedMeal(meal);
    if (!meal.id && !meal.mealId) return;

    setDetailsLoading(true);
    try {
      const details = await mealsAPI.getMealDetails(meal.id || meal.mealId);
      setSelectedMeal({ ...meal, ...details });
    } catch (err) {
      showToast({ type: 'error', title: 'Meal details unavailable', message: err.message });
    } finally {
      setDetailsLoading(false);
    }
  };

  const toggleMeal = async (meal) => {
    if (!meal.mealPlanId) return;

    const nextCompleted = !meal.isCompleted;
    const previousWeeklyDays = displayWeeklyDays;
    const previousMonthlyDays = displayMonthlyDays;

    setMealBusyId(meal.mealPlanId);
    setDisplayWeeklyDays((prev) => updateDays(prev, meal.mealPlanId, nextCompleted));
    setDisplayMonthlyDays((prev) => updateDays(prev, meal.mealPlanId, nextCompleted));

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
      setDisplayWeeklyDays(previousWeeklyDays);
      setDisplayMonthlyDays(previousMonthlyDays);
      showToast({ type: 'error', title: 'Meal update failed', message: err.message });
    } finally {
      setMealBusyId(null);
    }
  };

  if (loading) return <PageLoader label="Loading meal planner..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  if (days.length === 0) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">AI Planner</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Weekly and monthly meal plans</h1>
          </div>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            {generating ? 'Generating plan...' : 'Generate plan'}
          </Button>
        </div>
        <EmptyState
          title="No generated meal plan yet."
          message="Generate a plan after completing your profile. The frontend will then display the persisted backend meals."
          action={
            <Button onClick={handleGenerate} disabled={generating}>
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Generate plan
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">AI Planner</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Weekly and monthly meal plans</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            VitalityAI calculates target calories from your saved profile, stores the plan server-side,
            and supports completion actions directly from the planner.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={reload}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            {generating ? 'Generating plan...' : 'Generate plan'}
          </Button>
        </div>
      </div>

      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-1">
            {[
              ['weekly', 'Weekly'],
              ['monthly', 'Monthly'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveView(key)}
                className={`rounded-sm px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeView === key ? 'bg-primary text-ink' : 'text-ink-mute dark:text-ink-mute-2 hover:bg-hairline-cool dark:hover:bg-canvas-night-soft'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm md:min-w-96">
            <SummaryTile label="Days" value={days.length} />
            <SummaryTile label="Calories" value={Math.round(totalCalories).toLocaleString()} />
            <SummaryTile label="Completion" value={`${totalCompletion}%`} />
          </div>
        </div>
        {(activeView === 'weekly' ? emptyStates.weekly : emptyStates.monthly) && (
          <p className="mt-4 text-xs text-ink-mute dark:text-ink-mute-2">
            This view is empty right now. Generate a plan to populate it.
          </p>
        )}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <AnimatePresence>
          {days.map((day, index) => (
            <motion.div 
              key={`${day.date || index}-${day.day}`}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <div className="mb-5 flex items-start justify-between gap-4 pb-4 border-b border-hairline dark:border-hairline-strong">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {day.day || `Day ${index + 1}`}
                    </div>
                    <h2 className="mt-1 text-base font-semibold tracking-tight text-ink dark:text-on-dark">
                      {day.date ? new Date(day.date).toLocaleDateString() : `Plan day ${index + 1}`}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong px-2.5 py-1 text-xs text-ink dark:text-on-dark font-medium">
                      {Math.round(day.totalCalories || 0)} kcal
                    </span>
                    <p className="mt-2 text-xs font-semibold text-primary">
                      {getCompletionPercent(day)}% complete
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(day.meals || []).length === 0 ? (
                    <p className="text-xs text-ink-mute dark:text-ink-mute-2">No meals stored for this day.</p>
                  ) : (
                    day.meals.map((meal) => (
                      <div
                        key={`${meal.mealPlanId}-${meal.mealType}-${meal.nameEn}`}
                        className={`rounded-sm border p-4 transition-colors duration-200 ${
                          meal.isCompleted
                            ? 'border-primary/30 bg-primary/5'
                            : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
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
                            <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
                              {meal.mealType} - {Math.round(meal.calories || 0)} kcal
                            </p>
                          </div>
                          <CheckCircle2 className={`h-4 w-4 ${meal.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`} />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button type="button" variant="secondary" size="sm" onClick={() => openMeal(meal)}>
                            Details
                          </Button>
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
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full max-w-xl"
            >
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-8 shadow-lg relative">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-hairline dark:border-hairline-strong">
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">{selectedMeal.mealType || 'Meal details'}</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-ink dark:text-on-dark">
                      {selectedMeal.nameEn || selectedMeal.nameAr}
                    </h2>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => setSelectedMeal(null)}>
                    Close
                  </Button>
                </div>

                {detailsLoading ? (
                  <div className="mt-8 flex items-center justify-center gap-2 text-ink-mute dark:text-ink-mute-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading details...</span>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <SummaryTile label="Calories" value={Math.round(selectedMeal.calories || 0)} />
                      <SummaryTile label="Protein" value={`${selectedMeal.protein || 0}g`} />
                      <SummaryTile label="Carbs" value={`${selectedMeal.carbs || 0}g`} />
                      <SummaryTile label="Fat" value={`${selectedMeal.fat || 0}g`} />
                    </div>
                    {selectedMeal.ingredients && <InfoBlock label="Ingredients" value={selectedMeal.ingredients} />}
                    {selectedMeal.tags && <InfoBlock label="Tags" value={selectedMeal.tags} />}
                    {selectedMeal.prepTimeMinutes ? (
                      <InfoBlock label="Prep time" value={`${selectedMeal.prepTimeMinutes} minutes`} />
                    ) : null}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft p-3">
      <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 font-semibold uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink dark:text-on-dark"><AnimatedNumber value={value} /></p>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="border-t border-hairline dark:border-hairline-strong pt-4">
      <p className="text-xs font-semibold text-ink dark:text-on-dark uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-ink-mute dark:text-ink-mute-2 leading-relaxed">{value}</p>
    </div>
  );
}

