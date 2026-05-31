import React, { useMemo, useState } from 'react';
import { CheckCircle2, Dumbbell, Loader2, Moon, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { EmptyState, ErrorState, PageLoader } from '../../components/UI/StatusStates';
import { useToast } from '../../context/ToastContext';
import { useCurrentWorkout, useGenerateWorkoutPlan, useToggleWorkoutExercise } from '../../hooks/useWorkoutPlanner';

function pct(value, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, (Number(value || 0) / Number(target)) * 100));
}

function isToday(dateStr) {
  if (!dateStr) return false;
  try {
    const today = new Date();
    const d = new Date(dateStr);
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
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">Workouts</p>
          <h1 className="mt-2 text-3xl font-bold text-app">AI workout planner</h1>
          <p className="mt-2 max-w-2xl text-sm text-app-muted">
            Generate a personalized weekly plan from your saved profile and track exercise completion
            day by day.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={refetch} disabled={isFetching || generateMutation.isPending}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
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
              <Sparkles className="h-4 w-4" />
              Generate workout plan
            </Button>
          }
        />
      ) : (
        <>
          {/* Overall weekly progress */}
          <Card className="border border-app">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-app-muted">Weekly progress</p>
                  <h2 className="mt-1 text-2xl font-bold text-app">
                    {completedWorkouts} / {totalWorkouts} workout days completed
                  </h2>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-black/10 px-3 py-1 text-sm font-semibold text-app dark:bg-white/10">
                {Math.round(overallProgress)}% complete
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </Card>

          {/* Day cards */}
          <div className="space-y-5">
            {days.map((day, idx) => (
              <DayCard
                key={day.date || idx}
                day={day}
                busyId={busyId}
                onToggle={toggleExercise}
                highlight={isToday(day.date)}
              />
            ))}
          </div>
        </>
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
      className={`border ${highlight ? 'border-emerald-500/60 ring-1 ring-emerald-500/30' : 'border-app'}`}
    >
      {/* Day header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-2 ${
              isRest ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {isRest ? <Moon className="h-5 w-5" /> : <Dumbbell className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-app">{day.day || day.date || 'Workout day'}</h3>
              {highlight && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-200">
                  Today
                </span>
              )}
              {isRest && (
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-200">
                  Rest day
                </span>
              )}
            </div>
            <p className="text-sm text-app-muted">
              {formatDate(day.date)}
              {day.focus && !isRest ? ` · ${day.focus}` : ''}
            </p>
          </div>
        </div>

        {!isRest && total > 0 && (
          <div className="text-right">
            <span className="inline-flex items-center rounded-full bg-black/10 px-3 py-1 text-sm font-semibold text-app dark:bg-white/10">
              {completed} / {total} completed
            </span>
            <p className="mt-1 text-sm font-medium text-emerald-500">{Math.round(completion)}%</p>
          </div>
        )}
      </div>

      {/* Progress bar (non-rest days only) */}
      {!isRest && total > 0 && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      )}

      {/* Rest day message */}
      {isRest && (
        <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-app-muted">
          Recovery day — rest, stretch, and recharge for tomorrow's session.
        </p>
      )}

      {/* Exercises */}
      {!isRest && sorted.length > 0 && (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {sorted.map((exercise) => (
            <div
              key={exercise.id || exercise.workoutPlanId || exercise.exerciseId}
              className={`rounded-lg border p-4 transition ${
                exercise.isCompleted
                  ? 'border-emerald-500/60 bg-emerald-500/10'
                  : 'border-app bg-app-surface'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-app">{exercise.exerciseName}</p>
                    {exercise.isCompleted && (
                      <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-200">
                        Done
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-app-muted">
                    {exercise.sets} sets · {exercise.reps} reps
                  </p>
                </div>
                <CheckCircle2
                  className={`h-5 w-5 shrink-0 ${exercise.isCompleted ? 'text-emerald-400' : 'text-app-muted'}`}
                />
              </div>

              {exercise.formTip && (
                <p className="mt-3 rounded-md border border-app bg-app-surface p-2.5 text-xs text-app-muted">
                  💡 {exercise.formTip}
                </p>
              )}

              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant={exercise.isCompleted ? 'outline' : 'primary'}
                  disabled={busyId === (exercise.id || exercise.workoutPlanId)}
                  onClick={() => onToggle(exercise)}
                >
                  {busyId === (exercise.id || exercise.workoutPlanId)
                    ? 'Saving...'
                    : exercise.isCompleted
                      ? 'Mark incomplete'
                      : 'Complete exercise'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
