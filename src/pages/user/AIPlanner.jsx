import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { usePlannerData } from '../../hooks/usePlannerData';
import { aiAPI, mealsAPI } from '../../services/api';

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
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">AI Planner</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Weekly and monthly meal plans</h1>
          </div>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? 'Generating plan...' : 'Generate plan'}
          </Button>
        </div>
        <EmptyState
          title="No generated meal plan yet."
          message="Generate a plan after completing your profile. The frontend will then display the persisted backend meals."
          action={
            <Button onClick={handleGenerate} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              Generate plan
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">AI Planner</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Weekly and monthly meal plans</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            VitalityAI calculates target calories from your saved profile, stores the plan server-side,
            and now supports completion actions directly from the planner.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? 'Generating plan...' : 'Generate plan'}
          </Button>
        </div>
      </div>

      <Card className="border border-slate-700 bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1">
            {[
              ['weekly', 'Weekly'],
              ['monthly', 'Monthly'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveView(key)}
                className={`rounded-md px-4 py-2 text-sm font-semibold ${
                  activeView === key ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-800'
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
          <p className="mt-4 text-sm text-slate-400">
            This view is empty right now. Generate a plan to populate it.
          </p>
        )}
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {days.map((day, index) => (
          <Card key={`${day.date || index}-${day.day}`} className="border border-slate-700 bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CalendarDays className="h-4 w-4" />
                  {day.day || `Day ${index + 1}`}
                </div>
                <h2 className="mt-1 text-xl font-bold text-white">
                  {day.date ? new Date(day.date).toLocaleDateString() : `Plan day ${index + 1}`}
                </h2>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-200">
                  {Math.round(day.totalCalories || 0)} kcal
                </span>
                <p className="mt-2 text-sm font-medium text-emerald-300">
                  {getCompletionPercent(day)}% complete
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {(day.meals || []).length === 0 ? (
                <p className="text-sm text-slate-400">No meals stored for this day.</p>
              ) : (
                day.meals.map((meal) => (
                  <div
                    key={`${meal.mealPlanId}-${meal.mealType}-${meal.nameEn}`}
                    className={`rounded-lg border p-4 transition ${
                      meal.isCompleted
                        ? 'border-emerald-500/60 bg-emerald-500/10'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${meal.isCompleted ? 'text-emerald-100' : 'text-white'}`}>
                            {meal.nameEn || meal.nameAr}
                          </p>
                          {meal.isCompleted && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {meal.mealType} - {Math.round(meal.calories || 0)} kcal
                        </p>
                      </div>
                      <CheckCircle2 className={`h-5 w-5 ${meal.isCompleted ? 'text-emerald-300' : 'text-slate-500'}`} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => openMeal(meal)}>
                        Details
                      </Button>
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
        ))}
      </div>

      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-xl border border-slate-700 bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-emerald-400">{selectedMeal.mealType || 'Meal details'}</p>
                <h2 className="mt-1 text-2xl font-bold text-white">
                  {selectedMeal.nameEn || selectedMeal.nameAr}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMeal(null)}>
                Close
              </Button>
            </div>

            {detailsLoading ? (
              <div className="mt-6 flex items-center gap-2 text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading details...
              </div>
            ) : (
              <div className="mt-6 space-y-5">
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
        </div>
      )}
    </div>
  );
}

function SummaryTile({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-200">{label}</p>
      <p className="mt-1 text-sm text-slate-400">{value}</p>
    </div>
  );
}
