import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Dumbbell, Loader2, Moon, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { useCurrentWorkout, useGenerateWorkoutPlan, useToggleWorkoutExercise } from '../../hooks/useWorkoutPlanner';
import AnimatedNumber from '../../components/UI/AnimatedNumber';

function pct(value, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, (Number(value || 0) / Number(target)) * 100));
}

function isToday(dateStr) {
  if (!dateStr) return false;
  try {
    const today = new Date();
    const cleanDateStr = typeof dateStr === 'string' && dateStr.includes('-')
      ? dateStr.replace(/-/g, '/')
      : dateStr;
    const d = new Date(cleanDateStr);
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  } catch {
    return false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const cleanDateStr = typeof dateStr === 'string' && dateStr.includes('-')
      ? dateStr.replace(/-/g, '/')
      : dateStr;
    return new Date(cleanDateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
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

export default function Workouts() {
  const { showToast } = useToast();
  const { data: workoutPlan, isLoading, isFetching, error, isEmpty, refetch } = useCurrentWorkout();
  const generateMutation = useGenerateWorkoutPlan();
  const toggleMutation = useToggleWorkoutExercise();
  const [busyId, setBusyId] = useState(null);

  const days = useMemo(() => {
    return Array.isArray(workoutPlan?.days) ? workoutPlan.days : [];
  }, [workoutPlan]);

  const completedWorkouts = Number(workoutPlan?.completedWorkouts || 0);
  const totalWorkouts = Number(workoutPlan?.totalWorkouts || 0);
  const overallProgress = pct(completedWorkouts, totalWorkouts);

  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync();
      showToast({
        type: 'success',
        title: 'Workout plan generated',
        message: 'Your personalized weekly plan is ready.',
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Workout generation failed', message: err.message });
    }
  };

  const toggleExercise = async (exercise) => {
    const id = exercise.id || exercise.workoutPlanId;
    if (!id) return;
    const nextCompleted = !exercise.isCompleted;

    setBusyId(id);
    try {
      await toggleMutation.mutateAsync({
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
      setBusyId(null);
    }
  };

  if (isLoading) return <PageLoader label="Loading workout plan..." />;
  if (error && !isEmpty) return <ErrorState message={error.message} onRetry={refetch} />;

  const hasWorkout = days.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-hairline dark:border-hairline-strong pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Workouts</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink dark:text-on-dark">AI workout planner</h1>
          <p className="mt-1 text-xs text-ink-mute dark:text-ink-mute-2 max-w-2xl">
            Generate a personalized weekly plan from your saved profile and track exercise completion day by day.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={refetch} disabled={isFetching || generateMutation.isPending}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            {generateMutation.isPending ? 'Generating...' : 'Generate workout plan'}
          </Button>
        </div>
      </div>

      {!hasWorkout || isEmpty ? (
        <EmptyState
          title="No workout plan generated yet."
          message="Generate a workout plan after completing your profile to see your weekly exercises."
          action={
            <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Generate workout plan
            </Button>
          }
        />
      ) : (
        <motion.div 
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Overall weekly progress */}
          <motion.div variants={cardVariants}>
            <Card className="border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong p-2.5 text-primary">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-mute dark:text-ink-mute-2">Weekly progress</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-ink dark:text-on-dark">
                      <AnimatedNumber value={completedWorkouts} /> of <AnimatedNumber value={totalWorkouts} /> workout days completed
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong px-2.5 py-1 text-xs text-ink dark:text-on-dark font-medium">
                    <AnimatedNumber value={`${Math.round(overallProgress)}%`} /> complete
                  </span>
                </div>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </Card>
          </motion.div>

          {/* Day cards */}
          <div className="space-y-6">
            {days.map((day, idx) => (
              <motion.div key={day.date || idx} variants={cardVariants}>
                <DayCard
                  day={day}
                  busyId={busyId}
                  onToggle={toggleExercise}
                  highlight={isToday(day.date)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────── Day Card ─────────────────────────── */

function DayCard({ day, busyId, onToggle, highlight }) {
  const total = Number(day.totalExercises || 0);
  const completed = Number(day.completedExercises || 0);
  const completion = pct(completed, total);
  const isRest = Boolean(day.isRestDay);
  const sorted = useMemo(() => {
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    return [...exercises].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [day.exercises]);

  return (
    <Card
      className={`border p-6 bg-canvas dark:bg-canvas-night transition-all duration-200 ${
        highlight 
          ? 'border-primary ring-1 ring-primary/20' 
          : 'border-hairline dark:border-hairline-strong'
      }`}
    >
      {/* Day header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-hairline dark:border-hairline-strong mb-5">
        <div className="flex items-start gap-4">
          <div
            className={`rounded-sm p-2 border ${
              isRest 
                ? 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20' 
                : 'bg-canvas-soft dark:bg-canvas-night-soft text-primary border-hairline dark:border-hairline-strong'
            }`}
          >
            {isRest ? <Moon className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-ink dark:text-on-dark">{day.day || day.date || 'Workout day'}</h3>
              {highlight && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Today
                </span>
              )}
              {isRest && (
                <span className="rounded-full bg-accent-yellow/20 px-2 py-0.5 text-[10px] font-semibold text-accent-yellow">
                  Rest day
                </span>
              )}
            </div>
            <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
              {formatDate(day.date)}
              {day.focus && !isRest ? ` · ${day.focus}` : ''}
            </p>
          </div>
        </div>

        {!isRest && total > 0 && (
          <div className="text-left sm:text-right">
            <span className="rounded-sm bg-canvas-soft dark:bg-canvas-night-soft border border-hairline dark:border-hairline-strong px-2.5 py-1 text-xs text-ink dark:text-on-dark font-medium">
              {completed} / {total} exercises completed
            </span>
            <p className="mt-2 text-xs font-semibold text-primary">{Math.round(completion)}% complete</p>
          </div>
        )}
      </div>

      {/* Progress bar (non-rest days only) */}
      {!isRest && total > 0 && (
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-hairline dark:bg-hairline-strong">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      )}

      {/* Rest day message */}
      {isRest && (
        <div className="rounded-sm border border-accent-yellow/20 bg-accent-yellow/5 p-4">
          <p className="text-xs text-ink-mute dark:text-ink-mute-2 leading-relaxed">
            Recovery day — rest, stretch, and recharge for tomorrow's session.
          </p>
        </div>
      )}

      {/* Exercises */}
      {!isRest && sorted.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <AnimatePresence>
            {sorted.map((exercise) => (
              <motion.div
                key={exercise.id || exercise.workoutPlanId || exercise.exerciseId}
                layout
                className={`rounded-sm border p-4 transition-colors duration-200 ${
                  exercise.isCompleted
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-hairline dark:border-hairline-strong bg-canvas-soft dark:bg-canvas-night-soft'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold tracking-tight ${exercise.isCompleted ? 'text-primary' : 'text-ink dark:text-on-dark'}`}>{exercise.exerciseName}</p>
                      {exercise.isCompleted && (
                        <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-mute dark:text-ink-mute-2 mt-1">
                      {exercise.sets} sets · {exercise.reps} reps
                    </p>
                  </div>
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${exercise.isCompleted ? 'text-primary' : 'text-ink-mute dark:text-ink-mute-2'}`}
                  />
                </div>

                {exercise.formTip && (
                  <div className="mt-3 rounded-sm border border-hairline dark:border-hairline-strong bg-canvas dark:bg-canvas-night p-3 text-xs text-ink-mute dark:text-ink-mute-2">
                    <span className="font-semibold text-ink dark:text-on-dark">Tip:</span> {exercise.formTip}
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    type="button"
                    size="sm"
                    variant={exercise.isCompleted ? 'secondary' : 'primary'}
                    disabled={busyId === (exercise.id || exercise.workoutPlanId)}
                    onClick={() => onToggle(exercise)}
                  >
                    {busyId === (exercise.id || exercise.workoutPlanId)
                      ? 'Saving...'
                      : exercise.isCompleted
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
  );
}
