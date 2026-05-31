import React, { useEffect, useMemo, useState } from 'react';
  import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Dumbbell,
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
import { useCurrentWorkout, useToggleWorkoutExercise, getTodayDay } from '../../hooks/useWorkoutPlanner';
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

  // Workout data (separate React Query hook — loads independently)
  const { data: workoutPlan, isLoading: workoutLoading } = useCurrentWorkout();
  const toggleWorkoutMutation = useToggleWorkoutExercise();

  const [generating, setGenerating] = useState(false);
  const [mealBusyId, setMealBusyId] = useState(null);
  const [workoutBusyId, setWorkoutBusyId] = useState(null);
  const [displayDashboard, setDisplayDashboard] = useState(null);
  const [displayMeals, setDisplayMeals] = useState([]);

  const todayWorkoutDay = useMemo(() => getTodayDay(workoutPlan), [workoutPlan]);

  useEffect(() => {
    setDisplayDashboard(dashboard);
  }, [dashboard]);

  useEffect(() => {
    setDisplayMeals(todayMeals);
  }, [todayMeals]);

  useEffect(() => {
    let lastDate = new Date().toDateString();
    const interval = setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        reload();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [reload]);

  const metrics = useMemo(() => {
    const water = waterToday?.totalAmount ?? displayDashboard?.waterIntake ?? 0;
    const steps = googleFit?.steps ?? displayDashboard?.steps ?? 0;
    const caloriesBurned = googleFit?.caloriesBurned ?? displayDashboard?.caloriesBurned ?? 0;
    const completedWorkouts = displayDashboard?.completedWorkouts ?? 0;
    const totalWorkouts = displayDashboard?.totalWorkouts ?? 0;
    const workoutProgress = pct(completedWorkouts, totalWorkouts);

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
        label: 'Workouts',
        value: `${Number(completedWorkouts || 0)} / ${Number(totalWorkouts || 0)}`,
        helper: totalWorkouts ? `${Math.round(workoutProgress)}% complete` : 'Generate a workout plan',
        icon: Dumbbell,
        color: 'text-emerald-500',
        progress: totalWorkouts ? workoutProgress : null,
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
      localStorage.setItem('plan_generation_date', new Date().toISOString());
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

  const handleToggleWorkoutExercise = async (exercise) => {
    const id = exercise.id || exercise.workoutPlanId;
    if (!id) return;
    const nextCompleted = !exercise.isCompleted;

    setWorkoutBusyId(id);
    try {
      await toggleWorkoutMutation.mutateAsync({
        workoutPlanId: id,
        nextCompleted,
      });
      showToast({
        type: 'success',
        title: nextCompleted ? 'Exercise completed' : 'Exercise marked incomplete',
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Exercise update failed', message: err.message });
    } finally {
      setWorkoutBusyId(null);
    }
  };

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  if (showDashboardEmpty) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Today</p>
          <h1 className="mt-2 text-3xl font-bold text-app">Welcome back, {user?.name || user?.email}</h1>
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

  // Today's workout derived from the workout plan query
  const todayIsRest = Boolean(todayWorkoutDay?.isRestDay);
  const todayExercises = Array.isArray(todayWorkoutDay?.exercises) ? todayWorkoutDay.exercises : [];
  const todayExerciseTotal = Number(todayWorkoutDay?.totalExercises || 0);
  const todayExerciseCompleted = Number(todayWorkoutDay?.completedExercises || 0);
  const workoutCompletion = pct(todayExerciseCompleted, todayExerciseTotal);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Today</p>
          <h1 className="mt-2 text-3xl font-bold text-app">Welcome back, {user?.name || user?.email}</h1>
          <p className="mt-2 text-sm text-app-muted">
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
            <Card key={metric.label} className="border border-app">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-app-muted">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold text-app">{metric.value}</p>
                  <p className="mt-1 text-sm text-app-muted">{metric.helper}</p>
                </div>
                <Icon className={`h-7 w-7 ${metric.color}`} />
              </div>
              {metric.progress != null && (
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${metric.progress}%` }} />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* ── Meal Progress + Today's Workout ── */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Meal Progress */}
        <Card className="border border-app">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-app">Meal Progress</h2>
              <p className="text-sm text-app-muted">
                {displayDashboard?.completedMeals || 0} of {displayDashboard?.totalMeals || 0} meals completed
              </p>
            </div>
            <CalendarDays className="h-6 w-6 text-emerald-400" />
          </div>

          <div className="mb-3 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
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
                      : 'border-app bg-app-surface'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${meal.isCompleted ? 'text-emerald-100' : 'text-app'}`}>
                        {meal.nameEn || meal.nameAr}
                      </p>
                      {meal.isCompleted && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-app-muted">
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

        {/* Today's Workout */}
        <Card className="border border-app">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-app">Today's Workout</h2>
              {todayWorkoutDay && !todayIsRest && (
                <p className="text-sm text-app-muted">
                  {todayWorkoutDay.focus ? `${todayWorkoutDay.focus} — ` : ''}
                  {todayExerciseCompleted} of {todayExerciseTotal} exercises
                </p>
              )}
              {todayWorkoutDay && todayIsRest && (
                <p className="text-sm text-app-muted">Recovery day</p>
              )}
              {!todayWorkoutDay && !workoutLoading && (
                <p className="text-sm text-app-muted">No workout scheduled</p>
              )}
            </div>
            <Dumbbell className="h-6 w-6 text-emerald-400" />
          </div>

          {workoutLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : !todayWorkoutDay ? (
            <EmptyState
              title="No workout plan for today"
              message="Generate a workout plan to see today's exercises and track completion."
              action={
                <Button onClick={() => (window.location.href = '/user/workouts')}>
                  <Dumbbell className="h-4 w-4" />
                  Go to Workouts
                </Button>
              }
            />
          ) : todayIsRest ? (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="font-semibold text-app">Today is a recovery day</p>
                  <p className="mt-1 text-sm text-app-muted">
                    Rest, stretch, and recharge for tomorrow's session.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${workoutCompletion}%` }} />
              </div>
              <p className="mb-5 text-sm font-medium text-emerald-300">
                {Math.round(workoutCompletion)}% complete today
              </p>

              {todayExercises.length === 0 ? (
                <EmptyState title="No exercises found." message="Your workout plan has no exercises for today." />
              ) : (
                <div className="space-y-3">
                  {todayExercises.slice(0, 5).map((exercise) => {
                    const exerciseId = exercise.id || exercise.workoutPlanId || exercise.exerciseId;
                    return (
                    <div
                      key={exerciseId}
                      className={`flex items-center justify-between gap-4 rounded-lg border p-4 transition ${
                        exercise.isCompleted
                          ? 'border-emerald-500/60 bg-emerald-500/10'
                          : 'border-app bg-app-surface'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${exercise.isCompleted ? 'text-emerald-100' : 'text-app'}`}>
                            {exercise.exerciseName}
                          </p>
                          {exercise.isCompleted && (
                            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-app-muted">
                          {exercise.sets} sets · {exercise.reps} reps
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`h-5 w-5 ${exercise.isCompleted ? 'text-emerald-300' : 'text-slate-500'}`} />
                        <Button
                          type="button"
                          size="sm"
                          variant={exercise.isCompleted ? 'outline' : 'primary'}
                          onClick={() => handleToggleWorkoutExercise(exercise)}
                          disabled={workoutBusyId === (exercise.id || exercise.workoutPlanId)}
                        >
                          {workoutBusyId === (exercise.id || exercise.workoutPlanId)
                            ? 'Saving...'
                            : exercise.isCompleted
                              ? 'Mark incomplete'
                              : 'Complete'}
                        </Button>
                      </div>
                    </div>
                    );
                  })}
                  {todayExercises.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => (window.location.href = '/user/workouts')}
                    >
                      View all {todayExercises.length} exercises
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* ── Activity Metrics ── */}
      <Card className="border border-app">
        <h2 className="text-xl font-bold text-app">Activity Metrics</h2>
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
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-app pb-3">
      <span className="text-sm text-app-muted">{label}</span>
      <span className="font-semibold text-app">{value}</span>
    </div>
  );
}
