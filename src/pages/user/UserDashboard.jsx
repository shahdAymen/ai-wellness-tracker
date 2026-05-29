import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Droplets,
  Flame,
  Footprints,
  Moon,
  RefreshCw,
  Sparkles,
  Utensils,
} from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { aiAPI, mealsAPI } from '../../services/api';

const WATER_GOAL_LITERS = 3;
const STEP_GOAL = 10000;

function pct(value, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, (Number(value || 0) / Number(target)) * 100));
}

export default function UserDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    dashboard,
    todayMeals,
    waterToday,
    googleFit,
    emptyStates,
    loading,
    error,
    reload,
  } = useDashboardData();
  const [generating, setGenerating] = useState(false);
  const [mealBusyId, setMealBusyId] = useState(null);
  const [displayDashboard, setDisplayDashboard] = useState(null);
  const [displayMeals, setDisplayMeals] = useState([]);

  useEffect(() => {
    setDisplayDashboard(dashboard);
  }, [dashboard]);

  useEffect(() => {
    setDisplayMeals(todayMeals);
  }, [todayMeals]);

  const metrics = useMemo(() => {
    const water = waterToday?.totalAmount ?? displayDashboard?.waterIntake ?? 0;
    const steps = googleFit?.steps ?? displayDashboard?.steps ?? 0;
    const caloriesBurned = googleFit?.caloriesBurned ?? displayDashboard?.caloriesBurned ?? 0;

    return [
      {
        label: 'Target calories',
        value: Math.round(displayDashboard?.targetCalories || 0),
        helper: 'kcal goal',
        icon: Flame,
        color: 'text-orange-500',
      },
      {
        label: 'Consumed',
        value: Math.round(displayDashboard?.consumedCalories || 0),
        helper: `${Math.round(displayDashboard?.remainingCalories || 0)} kcal remaining`,
        icon: Utensils,
        color: 'text-emerald-500',
        progress: pct(displayDashboard?.consumedCalories, displayDashboard?.targetCalories),
      },
      {
        label: 'Calories burned',
        value: Math.round(caloriesBurned),
        helper: 'from daily activity',
        icon: Activity,
        color: 'text-rose-500',
      },
      {
        label: 'Water intake',
        value: `${Number(water || 0).toFixed(1)} L`,
        helper: `${WATER_GOAL_LITERS} L daily goal`,
        icon: Droplets,
        color: 'text-cyan-500',
        progress: pct(water, WATER_GOAL_LITERS),
      },
      {
        label: 'Steps',
        value: Number(steps || 0).toLocaleString(),
        helper: `${STEP_GOAL.toLocaleString()} step goal`,
        icon: Footprints,
        color: 'text-blue-500',
        progress: pct(steps, STEP_GOAL),
      },
      {
        label: 'Sleep',
        value: `${Number(googleFit?.sleepHours || 0).toFixed(1)} h`,
        helper: googleFit ? 'Google Fit summary' : 'Connect Google Fit',
        icon: Moon,
        color: 'text-violet-500',
      },
    ];
  }, [displayDashboard, googleFit, waterToday]);

  const mealProgress = pct(displayDashboard?.completedMeals, displayDashboard?.totalMeals);
  const showDashboardEmpty = emptyStates.dashboard && !displayDashboard && displayMeals.length === 0;

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      await aiAPI.generateWeeklyPlan();
      showToast({
        type: 'success',
        title: 'AI plan generated',
        message: 'Your weekly and monthly meal plans have been refreshed.',
      });
      await reload();
    } catch (err) {
      showToast({ type: 'error', title: 'AI generation failed', message: err.message });
    } finally {
      setGenerating(false);
    }
  };

  const toggleMeal = async (meal) => {
    if (!meal.mealPlanId) return;

    const nextCompleted = !meal.isCompleted;
    const previousMeals = displayMeals;
    const previousDashboard = displayDashboard;

    setMealBusyId(meal.mealPlanId);
    setDisplayMeals((prev) =>
      prev.map((item) =>
        item.mealPlanId === meal.mealPlanId
          ? { ...item, isCompleted: nextCompleted }
          : item
      )
    );
    setDisplayDashboard((prev) => {
      if (!prev) return prev;
      const completedMeals = Number(prev.completedMeals || 0) + (nextCompleted ? 1 : -1);
      return {
        ...prev,
        completedMeals: Math.max(0, Math.min(Number(prev.totalMeals || 0), completedMeals)),
      };
    });

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
      setDisplayDashboard(previousDashboard);
      showToast({ type: 'error', title: 'Meal update failed', message: err.message });
    } finally {
      setMealBusyId(null);
    }
  };

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  if (showDashboardEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Today</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Welcome back, {user?.name || user?.email}</h1>
        </div>
        <EmptyState
          title="No dashboard data available yet."
          message="Generate a meal plan and start tracking to unlock calories, hydration, and progress metrics."
          action={
            <Button onClick={handleGeneratePlan} disabled={generating}>
              <Sparkles className="h-4 w-4" />
              {generating ? 'Generating...' : 'Generate a meal plan'}
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
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Today</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Welcome back, {user?.name || user?.email}</h1>
          <p className="mt-2 text-sm text-slate-300">
            Your dashboard is powered by live VitalityAI metrics for meals, stats, hydration, and
            optional Google Fit activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleGeneratePlan} disabled={generating}>
            <Sparkles className="h-4 w-4" />
            {generating ? 'Generating...' : 'Generate AI plan'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="border border-slate-700 bg-slate-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{metric.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{metric.helper}</p>
                </div>
                <Icon className={`h-7 w-7 ${metric.color}`} />
              </div>
              {metric.progress != null && (
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${metric.progress}%` }} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="border border-slate-700 bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Meal Progress</h2>
              <p className="text-sm text-slate-400">
                {displayDashboard?.completedMeals || 0} of {displayDashboard?.totalMeals || 0} meals completed
              </p>
            </div>
            <CalendarDays className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${mealProgress}%` }} />
          </div>
          <p className="mb-5 text-sm font-medium text-emerald-300">{Math.round(mealProgress)}% complete today</p>

          {displayMeals.length === 0 ? (
            <EmptyState
              title="No meal plan for today"
              message="Generate an AI plan to persist meals before tracking completion."
              action={
                <Button onClick={handleGeneratePlan} disabled={generating}>
                  <Sparkles className="h-4 w-4" />
                  Generate plan
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {displayMeals.slice(0, 5).map((meal) => (
                <div
                  key={meal.mealPlanId || `${meal.nameEn}-${meal.mealType}`}
                  className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition ${
                    meal.isCompleted
                      ? 'border-emerald-500/60 bg-emerald-500/10'
                      : 'border-slate-700 bg-slate-950'
                  }`}
                >
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
                    <p className="text-sm text-slate-400">
                      {meal.mealType} - {Math.round(meal.calories || 0)} kcal - {meal.protein || 0}g protein
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${meal.isCompleted ? 'text-emerald-300' : 'text-slate-500'}`} />
                    <Button
                      type="button"
                      size="sm"
                      variant={meal.isCompleted ? 'outline' : 'primary'}
                      onClick={() => toggleMeal(meal)}
                      disabled={mealBusyId === meal.mealPlanId}
                    >
                      {mealBusyId === meal.mealPlanId
                        ? 'Saving...'
                        : meal.isCompleted
                          ? 'Mark incomplete'
                          : 'Complete meal'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="border border-slate-700 bg-slate-900">
          <h2 className="text-xl font-bold text-white">Activity Metrics</h2>
          {emptyStates.googleFitIntegrationMissing ? (
            <div className="mt-5">
              <EmptyState
                title="No Google Fit account connected."
                message="Connect Google Fit to bring in steps, distance, heart rate, and sleep."
                action={<Button onClick={() => (window.location.href = '/user/device-sync')}>Connect Google Fit</Button>}
              />
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-4">
                <MetricRow label="Distance" value={`${Number(googleFit?.distanceKm || 0).toFixed(1)} km`} />
                <MetricRow label="Active minutes" value={`${Number(googleFit?.activityMinutes || 0)} min`} />
                <MetricRow label="Average heart rate" value={`${Number(googleFit?.averageHeartRate || 0).toFixed(0)} bpm`} />
              </div>
              {!googleFit && (
                <p className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
                  Google Fit data is optional. Activity cards fall back to backend daily stats when available.
                </p>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
