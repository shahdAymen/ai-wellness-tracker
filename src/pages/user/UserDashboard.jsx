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
  Heart,
  Moon,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Utensils,
  Watch,
} from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import AnimatedNumber from '../../components/UI/AnimatedNumber';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useCurrentWorkout, useToggleWorkoutExercise, getTodayDay } from '../../hooks/useWorkoutPlanner';
import { aiAPI, mealsAPI, waterAPI } from '../../services/api';

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

function CircularProgress({ percent, size = 64, strokeWidth = 6, color = 'stroke-primary' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        className="stroke-hairline dark:stroke-hairline-strong fill-transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        className={`${color} fill-transparent transition-all duration-500 ease-out`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
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
  const [loggingWaterAmount, setLoggingWaterAmount] = useState(null);
  const [displayDashboard, setDisplayDashboard] = useState(null);
  const [displayMeals, setDisplayMeals] = useState([]);
  const [activeTab, setActiveTab] = useState('nutrition'); // 'nutrition' | 'workouts'

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

  const activeCalories = displayDashboard?.consumedCalories ?? 0;
  const targetCalories = displayDashboard?.targetCalories ?? 0;
  const remainingCalories = displayDashboard?.remainingCalories ?? 0;
  const currentWater = waterToday?.totalAmount ?? displayDashboard?.waterIntake ?? 0;
  const currentSteps = googleFit?.steps ?? displayDashboard?.steps ?? 0;
  const heartRate = googleFit?.averageHeartRate ?? 0;
  const activeMinutes = googleFit?.activityMinutes ?? 0;
  const sleepHours = googleFit?.sleepHours ?? 0;
  const distanceKm = googleFit?.distanceKm ?? 0;
  const caloriesBurned = googleFit?.caloriesBurned ?? displayDashboard?.caloriesBurned ?? 0;
  const completedWorkouts = displayDashboard?.completedWorkouts ?? 0;
  const totalWorkouts = displayDashboard?.totalWorkouts ?? 0;

  const caloriePercent = pct(activeCalories, targetCalories);
  const waterPercent = pct(currentWater, WATER_GOAL_LITERS);
  const stepPercent = pct(currentSteps, STEP_GOAL);
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

  const handleLogWater = async (amount) => {
    setLoggingWaterAmount(amount);
    try {
      await waterAPI.log(amount);
      showToast({
        type: 'success',
        title: 'Water logged',
        message: `Added ${amount} L to today's hydration.`,
      });
      await reload();
    } catch (err) {
      showToast({ type: 'error', title: 'Hydration log failed', message: err.message });
    } finally {
      setLoggingWaterAmount(null);
    }
  };

  if (loading) return <PageLoader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  if (showDashboardEmpty) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-on-dark">Welcome, {user?.name || user?.email}</h1>
          </div>
        </div>
        <EmptyState
          title="No generated wellness plan."
          message="Generate your customized meal plan to activate calories tracking and progress dashboards."
          action={
            <Button onClick={handleGeneratePlan} disabled={generating}>
              <Sparkles className="h-4 w-4 mr-1 animate-pulse" />
              {generating ? 'Generating plan...' : 'Generate AI plan'}
            </Button>
          }
        />
      </div>
    );
  }

  // Today's workout variables
  const todayIsRest = Boolean(todayWorkoutDay?.isRestDay);
  const todayExercises = Array.isArray(todayWorkoutDay?.exercises) ? todayWorkoutDay.exercises : [];
  const todayExerciseTotal = Number(todayWorkoutDay?.totalExercises || 0);
  const todayExerciseCompleted = Number(todayWorkoutDay?.completedExercises || 0);
  const workoutCompletion = pct(todayExerciseCompleted, todayExerciseTotal);

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">

      {/* Dynamic Welcoming Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary tracking-wider uppercase">
              AI Optimized
            </span>
            <span className="text-[10px] text-ink-mute dark:text-ink-mute-2 flex items-center gap-1">
              <Watch className="h-3 w-3 text-primary" /> Live
            </span>
          </div>
          <h1 className="mt-2.5 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">
            Overview for {user?.name || user?.email}
          </h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2">
            Stay in sync with daily meal completions and optional wearable logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={reload} size="sm">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button onClick={handleGeneratePlan} disabled={generating} size="sm">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            {generating ? 'Generating...' : 'Generate AI plan'}
          </Button>
        </div>
      </div>

      {/* Core Summary Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {/* Calories Card */}
        <motion.div variants={itemVariants}>
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark">Calories Intake</h3>
                  <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 mt-0.5 uppercase tracking-wider">Target vs Consumed</p>
                </div>
                <div className="p-2 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong text-primary">
                  <Flame className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="relative flex items-center justify-center">
                  <CircularProgress percent={caloriePercent} size={76} strokeWidth={7} color="stroke-primary" />
                  <span className="absolute text-xs font-bold text-ink dark:text-on-dark">
                    {Math.round(caloriePercent)}%
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-ink-mute dark:text-ink-mute-2">Consumed:</span>
                    <span className="font-bold text-ink dark:text-on-dark">
                      <AnimatedNumber value={Math.round(activeCalories)} /> kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-hairline-strong dark:bg-hairline-strong" />
                    <span className="text-ink-mute dark:text-ink-mute-2">Target:</span>
                    <span className="font-bold text-ink dark:text-on-dark">
                      <AnimatedNumber value={Math.round(targetCalories)} /> kcal
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline dark:border-hairline-strong flex justify-between items-center text-xs">
              <span className="text-ink-mute dark:text-ink-mute-2 font-medium">Remaining Energy</span>
              <span className={`font-bold ${remainingCalories > 0 ? 'text-primary' : 'text-accent-tomato'}`}>
                <AnimatedNumber value={Math.round(remainingCalories)} /> kcal
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Hydration Card */}
        <motion.div variants={itemVariants}>
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark">Hydration</h3>
                  <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 mt-0.5 uppercase tracking-wider">Goal: {WATER_GOAL_LITERS} Liters</p>
                </div>
                <div className="p-2 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong text-cyan-500">
                  <Droplets className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                {/* Visual water cylinder */}
                <div className="flex flex-col items-center">
                  <div className="h-16 w-8 rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft relative overflow-hidden flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${waterPercent}%` }}
                      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 dark:from-cyan-700 dark:to-cyan-500 shadow-inner"
                    />
                  </div>
                  <span className="mt-1 text-[9px] font-bold text-cyan-500">
                    {Math.round(waterPercent)}%
                  </span>
                </div>

                <div className="flex-1 space-y-2">
                  <p className="text-xs text-ink dark:text-on-dark font-semibold">
                    <AnimatedNumber value={currentWater.toFixed(1)} /> / {WATER_GOAL_LITERS}.0 L
                  </p>

                  {/* Quick tracker buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {[
                      [0.25, '250ml'],
                      [0.5, '500ml'],
                      [1.0, '1.0L'],
                    ].map(([amount, label]) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleLogWater(amount)}
                        disabled={loggingWaterAmount !== null}
                        className="rounded-sm border border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft px-1.5 py-1 text-[9px] font-semibold text-ink dark:text-on-dark hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-500 active:scale-95 transition-all duration-200 select-none flex items-center justify-center gap-0.5"
                      >
                        {loggingWaterAmount === amount ? (
                          <RefreshCw className="h-2.5 w-2.5 animate-spin text-cyan-500" />
                        ) : (
                          <>
                            <Plus className="h-2 w-2" />
                            {label}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline dark:border-hairline-strong flex justify-between items-center text-xs">
              <span className="text-ink-mute dark:text-ink-mute-2 font-medium">Logged Intervals</span>
              <span className="font-bold text-cyan-500">
                {waterToday?.logsCount ?? 0} times
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Steps Card */}
        <motion.div variants={itemVariants}>
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6 relative h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark">Daily Steps</h3>
                  <p className="text-[10px] text-ink-mute dark:text-ink-mute-2 mt-0.5 uppercase tracking-wider">Goal: {STEP_GOAL.toLocaleString()} Steps</p>
                </div>
                <div className="p-2 rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong text-emerald-500">
                  <Footprints className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-6">
                <div className="relative flex items-center justify-center">
                  <CircularProgress percent={stepPercent} size={76} strokeWidth={7} color="stroke-emerald-500" />
                  <span className="absolute text-xs font-bold text-ink dark:text-on-dark">
                    {Math.round(stepPercent)}%
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-ink-mute dark:text-ink-mute-2">Steps logged:</span>
                    <span className="font-bold text-ink dark:text-on-dark">
                      <AnimatedNumber value={Math.round(currentSteps)} />
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-hairline-strong dark:bg-hairline-strong" />
                    <span className="text-ink-mute dark:text-ink-mute-2">Goal target:</span>
                    <span className="font-bold text-ink dark:text-on-dark">
                      {STEP_GOAL.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-hairline dark:border-hairline-strong flex justify-between items-center text-xs">
              <span className="text-ink-mute dark:text-ink-mute-2 font-medium">Distance Traveled</span>
              <span className="font-bold text-emerald-500">
                <AnimatedNumber value={distanceKm.toFixed(1)} /> km
              </span>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Feed Section (Checklists vs Google Fit Vitals) */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* Left column (Checklists for meals & workouts) */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">

            {/* Checklist Tabs */}
            <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-strong pb-4 mb-6">
              <div className="flex gap-4">
                {[
                  ['nutrition', Utensils, 'Nutrition Timeline'],
                  ['workouts', Dumbbell, 'Workout Routine'],
                ].map(([key, Icon, label]) => {
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTab(key)}
                      className={`relative flex items-center gap-2 pb-4 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${isActive ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2 hover:text-ink dark:hover:text-on-dark'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="dashboardActiveTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents */}
            <div>
              <AnimatePresence mode="wait">

                {/* Nutrition Timeline tab */}
                {activeTab === 'nutrition' && (
                  <motion.div
                    key="nutrition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-ink-mute dark:text-ink-mute-2">
                        Today's complete percentage: <span className="font-bold text-primary">{Math.round(mealProgress)}%</span>
                      </span>
                      <span className="text-[10px] rounded bg-canvas-soft dark:bg-canvas-night-soft px-2 py-0.5 border border-hairline dark:border-hairline-strong text-ink dark:text-on-dark">
                        {completedWorkouts} / {totalWorkouts} Workouts logged
                      </span>
                    </div>

                    {displayMeals.length === 0 ? (
                      <EmptyState
                        title="No meals generated for today"
                        message="Get started by generating your customized meal plans."
                        action={
                          <Button onClick={handleGeneratePlan} disabled={generating} size="sm">
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            Generate plan
                          </Button>
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {displayMeals.map((meal) => (
                          <div
                            key={meal.mealPlanId || `${meal.nameEn}-${meal.mealType}`}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border p-4 transition-colors duration-200 ${meal.isCompleted
                              ? 'border-primary/20 bg-primary/5'
                              : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                              }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-canvas dark:bg-canvas-night border border-hairline dark:border-hairline-strong text-ink-mute dark:text-ink-mute-2">
                                  {meal.mealType}
                                </span>
                                <p className={`text-sm font-semibold tracking-tight ${meal.isCompleted ? 'text-primary' : 'text-ink dark:text-on-dark'}`}>
                                  {meal.nameEn || meal.nameAr}
                                </p>
                              </div>
                              <div className="text-[11px] text-ink-mute dark:text-ink-mute-2 mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                                <span>Calories: <span className="font-bold text-ink dark:text-on-dark">{Math.round(meal.calories || 0)} kcal</span></span>
                                {meal.protein ? <span>Protein: <span className="font-bold text-ink dark:text-on-dark">{meal.protein}g</span></span> : null}
                                {meal.carbs ? <span>Carbs: <span className="font-bold text-ink dark:text-on-dark">{meal.carbs}g</span></span> : null}
                                {meal.fat ? <span>Fat: <span className="font-bold text-ink dark:text-on-dark">{meal.fat}g</span></span> : null}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-hairline dark:border-hairline-strong">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className={`h-4 w-4 ${meal.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`} />
                                <span className="text-xs text-ink-mute dark:text-ink-mute-2 sm:hidden">
                                  {meal.isCompleted ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant={meal.isCompleted ? 'secondary' : 'primary'}
                                onClick={() => toggleMeal(meal)}
                                disabled={mealBusyId === meal.mealPlanId}
                                className="w-full sm:w-auto text-center"
                              >
                                {mealBusyId === meal.mealPlanId
                                  ? 'Saving...'
                                  : meal.isCompleted
                                    ? 'Mark incomplete'
                                    : 'Complete'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Workout Checklist tab */}
                {activeTab === 'workouts' && (
                  <motion.div
                    key="workouts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    {workoutLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : !todayWorkoutDay ? (
                      <EmptyState
                        title="No workout scheduled for today"
                        message="Initialize your physical workouts using the custom generation planner."
                        action={
                          <Button onClick={() => navigate('/user/workouts')} size="sm">
                            <Dumbbell className="h-3.5 w-3.5 mr-1" />
                            Workout Setup
                          </Button>
                        }
                      />
                    ) : todayIsRest ? (
                      <div className="rounded-sm border border-accent-purple/20 bg-accent-purple/5 p-5 flex items-start gap-4">
                        <div className="p-2 rounded-sm bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">
                          <Moon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-ink dark:text-on-dark">Active Recovery Day</h4>
                          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed">
                            No training scheduled. Allow your muscles to rest and rebuild. Focus on stretching, quality hydration, and getting 8 hours of sleep.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-ink-mute dark:text-ink-mute-2">
                            Today's focus: <span className="font-bold text-primary uppercase">{todayWorkoutDay.focus || 'General Routine'}</span>
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {Math.round(workoutCompletion)}% complete
                          </span>
                        </div>

                        {todayExercises.length === 0 ? (
                          <EmptyState title="No exercises listed." message="Exercises have not been allocated yet." />
                        ) : (
                          <div className="space-y-3">
                            {todayExercises.map((exercise) => {
                              const exerciseId = exercise.id || exercise.workoutPlanId || exercise.exerciseId;
                              return (
                                <div
                                  key={exerciseId}
                                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-sm border p-4 transition-colors duration-200 ${exercise.isCompleted
                                    ? 'border-primary/20 bg-primary/5'
                                    : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                                    }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className={`text-sm font-semibold tracking-tight ${exercise.isCompleted ? 'text-primary' : 'text-ink dark:text-on-dark'}`}>
                                        {exercise.exerciseName}
                                      </p>
                                    </div>
                                    <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
                                      {exercise.sets} sets · {exercise.reps} reps
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-hairline dark:border-hairline-strong">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle2 className={`h-4 w-4 ${exercise.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`} />
                                      <span className="text-xs text-ink-mute dark:text-ink-mute-2 sm:hidden">
                                        {exercise.isCompleted ? 'Completed' : 'Pending'}
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant={exercise.isCompleted ? 'secondary' : 'primary'}
                                      onClick={() => handleToggleWorkoutExercise(exercise)}
                                      disabled={workoutBusyId === (exercise.id || exercise.workoutPlanId)}
                                      className="w-full sm:w-auto text-center"
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
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Right column (Google Fit, Vitals & Sync status) */}
        <div className="space-y-6">

          {/* Live Vitals card */}
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
            <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark pb-4 border-b border-hairline dark:border-hairline-strong">
              Live Vitals & Sleep
            </h3>

            <div className="mt-5 space-y-6">

              {/* Heart rate monitor with pulse animation */}
              <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-strong pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-accent-tomato/10 text-accent-tomato border border-accent-tomato/20">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1, 1.25, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    >
                      <Heart className="h-4 w-4 fill-accent-tomato" />
                    </motion.div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink dark:text-on-dark">Average Heart Rate</p>
                    <p className="text-[10px] text-ink-mute dark:text-ink-mute-2">From today's logs</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-accent-tomato">
                  {heartRate > 0 ? (
                    <><AnimatedNumber value={Math.round(heartRate)} /> bpm</>
                  ) : (
                    '-- bpm'
                  )}
                </span>
              </div>

              {/* Sleep log */}
              <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-strong pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink dark:text-on-dark">Sleep Duration</p>
                    <p className="text-[10px] text-ink-mute dark:text-ink-mute-2">Wearable sync status</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-accent-purple">
                  {sleepHours > 0 ? (
                    <><AnimatedNumber value={sleepHours.toFixed(1)} /> hrs</>
                  ) : (
                    '-- hrs'
                  )}
                </span>
              </div>

              {/* Active Minutes */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink dark:text-on-dark">Active Minutes</p>
                    <p className="text-[10px] text-ink-mute dark:text-ink-mute-2">Aerobic activity</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-500">
                  {activeMinutes > 0 ? (
                    <><AnimatedNumber value={activeMinutes} /> min</>
                  ) : (
                    '-- min'
                  )}
                </span>
              </div>
            </div>
          </Card>

          {/* Sync Account status */}
          <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
            <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-on-dark mb-4">
              Wearable Accounts
            </h3>

            {emptyStates.googleFitIntegrationMissing ? (
              <div className="space-y-4">
                <p className="text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed">
                  Connect Google Fit to automatically synchronize metrics like steps, distance, active minutes, and sleep.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs font-semibold border-cyan-500 text-cyan-500 hover:bg-cyan-500/5 hover:border-cyan-600"
                  onClick={() => navigate('/user/device-sync')}
                >
                  <Watch className="h-3.5 w-3.5 mr-1" />
                  Link Google Fit
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-canvas-soft dark:bg-canvas-night-soft rounded-sm p-3 border border-hairline dark:border-hairline-strong">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-ink dark:text-on-dark">Google Fit</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">CONNECTED</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate('/user/device-sync')}
                >
                  Manage Connection
                </Button>
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}


