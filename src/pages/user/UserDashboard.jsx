import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import AnimatedNumber from '../../components/UI/AnimatedNumber';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useCurrentWorkout, useToggleWorkoutExercise, getTodayDay } from '../../hooks/useWorkoutPlanner';
import { aiAPI, mealsAPI } from '../../services/api';


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

const WATER_GOAL_LITERS = 3;
const STEP_GOAL = 10000;

function pct(value, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, (Number(value || 0) / Number(target)) * 100));
}

export default function UserDashboard() {
  const navigate = useNavigate();
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
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">Welcome back, {user?.name || user?.email}</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Your wellness panel is sync'd with live health metrics and optional Google Fit logs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={reload}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button onClick={handleGeneratePlan} disabled={generating}>
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {generating ? 'Generating...' : 'Generate AI plan'}
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <motion.div key={metric.label} variants={itemVariants}>
              <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{metric.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">
                      <AnimatedNumber value={metric.value} />
                    </p>
                    <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">{metric.helper}</p>
                  </div>
                  <div className="w-10 h-10 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong flex items-center justify-center">
                    <Icon className={`h-5 w-5 text-primary`} />
                  </div>
                </div>
                {metric.progress != null && (
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                      className="h-full rounded-full bg-primary" 
                    />
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Progress checklists */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Meal Progress */}
        <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-strong">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Meal Progress</h2>
              <p className="text-xs text-ink-mute dark:text-ink-mute-2">
                <AnimatedNumber value={displayDashboard?.completedMeals || 0} /> of <AnimatedNumber value={displayDashboard?.totalMeals || 0} /> meals completed
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>

          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${mealProgress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="h-full rounded-full bg-primary" 
            />
          </div>
          <p className="mb-6 text-xs font-semibold text-primary">{Math.round(mealProgress)}% complete today</p>

          {displayMeals.length === 0 ? (
            <EmptyState
              title="No meal plan for today"
              message="Generate an AI plan to persist meals before tracking completion."
              action={
                <Button onClick={handleGeneratePlan} disabled={generating}>
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Generate plan
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {displayMeals.slice(0, 5).map((meal) => (
                  <motion.div
                    key={meal.mealPlanId || `${meal.nameEn}-${meal.mealType}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center justify-between gap-4 rounded-sm border p-4 transition-colors duration-200 ${
                      meal.isCompleted
                        ? 'border-primary/30 bg-primary/5 dark:bg-primary/5'
                        : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                    }`}
                  >
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
                        onClick={() => toggleMeal(meal)}
                        disabled={mealBusyId === meal.mealPlanId}
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
            </div>
          )}
        </Card>

        {/* Today's Workout */}
        <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-hairline dark:border-hairline-strong">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark">Today's Workout</h2>
              {todayWorkoutDay && !todayIsRest && (
                <p className="text-xs text-ink-mute dark:text-ink-mute-2">
                  {todayWorkoutDay.focus ? `${todayWorkoutDay.focus} — ` : ''}
                  {todayExerciseCompleted} of {todayExerciseTotal} exercises
                </p>
              )}
              {todayWorkoutDay && todayIsRest && (
                <p className="text-xs text-ink-mute dark:text-ink-mute-2">Recovery day</p>
              )}
              {!todayWorkoutDay && !workoutLoading && (
                <p className="text-xs text-ink-mute dark:text-ink-mute-2">No workout scheduled</p>
              )}
            </div>
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>

          {workoutLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border border-primary border-t-transparent" />
            </div>
          ) : !todayWorkoutDay ? (
            <EmptyState
              title="No workout plan for today"
              message="Generate a workout plan to see today's exercises and track completion."
              action={
                <Button onClick={() => navigate('/user/workouts')}>
                  <Dumbbell className="h-3.5 w-3.5 mr-1" />
                  Go to Workouts
                </Button>
              }
            />
          ) : todayIsRest ? (
            <div className="rounded-sm border border-accent-purple/20 bg-accent-purple/5 p-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5 text-accent-purple" />
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-on-dark">Today is a recovery day</p>
                  <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
                    Rest, stretch, and recharge for tomorrow's session.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${workoutCompletion}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  className="h-full rounded-full bg-primary" 
                />
              </div>
              <p className="mb-6 text-xs font-semibold text-primary">
                {Math.round(workoutCompletion)}% complete today
              </p>

              {todayExercises.length === 0 ? (
                <EmptyState title="No exercises found." message="Your workout plan has no exercises for today." />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {todayExercises.slice(0, 5).map((exercise) => {
                      const exerciseId = exercise.id || exercise.workoutPlanId || exercise.exerciseId;
                      return (
                        <motion.div
                          key={exerciseId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`flex items-center justify-between gap-4 rounded-sm border p-4 transition-colors duration-200 ${
                            exercise.isCompleted
                              ? 'border-primary/30 bg-primary/5 dark:bg-primary/5'
                              : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-semibold tracking-tight ${exercise.isCompleted ? 'text-primary' : 'text-ink dark:text-on-dark'}`}>
                                {exercise.exerciseName}
                              </p>
                              {exercise.isCompleted && (
                                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  Completed
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
                              {exercise.sets} sets · {exercise.reps} reps
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={`h-4 w-4 ${exercise.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`} />
                            <Button
                              type="button"
                              size="sm"
                              variant={exercise.isCompleted ? 'secondary' : 'primary'}
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
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {todayExercises.length > 5 && (
                    <Button
                      variant="secondary"
                      className="w-full mt-2"
                      onClick={() => navigate('/user/workouts')}
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

      {/* Activity Metrics */}
      <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night">
        <h2 className="text-base font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong mb-4">Activity Metrics</h2>
        {emptyStates.googleFitIntegrationMissing ? (
          <div className="mt-5">
            <EmptyState
              title="No Google Fit account connected."
              message="Connect Google Fit to bring in steps, distance, heart rate, and sleep metrics."
              action={<Button onClick={() => navigate('/user/device-sync')}>Connect Google Fit</Button>}
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
              <p className="mt-5 rounded-sm border border-accent-purple/20 bg-accent-purple/5 p-3 text-xs text-accent-purple">
                Google Fit integration is optional. Activity cards fall back to backend daily logs when available.
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
    <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-strong pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">{label}</span>
      <span className="text-sm font-semibold text-ink dark:text-on-dark">{value}</span>
    </div>
  );
}

