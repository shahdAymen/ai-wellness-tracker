import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmptyStateError, workoutAPI } from '../services/api';

export const workoutQueryKeys = {
  current: ['workout', 'current'],
};

/**
 * Find today's day entry from the workout plan's `days` array by matching
 * the local date string (YYYY-MM-DD) against each day's `date` field.
 */
export function getTodayDay(workoutPlan) {
  if (!workoutPlan || !Array.isArray(workoutPlan.days)) return null;
  const today = new Date();
  return workoutPlan.days.find((day) => {
    if (!day.date) return false;
    try {
      const d = new Date(day.date);
      return d.getFullYear() === today.getFullYear() &&
             d.getMonth() === today.getMonth() &&
             d.getDate() === today.getDate();
    } catch {
      return false;
    }
  }) || null;
}

/**
 * Optimistically toggle an exercise's completion state within the
 * nested  { days: [ { exercises: [...] } ] }  structure returned by the backend.
 */
function updateExerciseCompletion(workoutPlan, workoutPlanId, nextCompleted) {
  if (!workoutPlan || !Array.isArray(workoutPlan.days)) return workoutPlan;

  let changed = false;
  const nextDays = workoutPlan.days.map((day) => {
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    let dayChanged = false;

    const nextExercises = exercises.map((exercise) => {
      const id = exercise.id || exercise.workoutPlanId;
      if (id !== workoutPlanId) return exercise;
      dayChanged = true;
      changed = true;
      return { ...exercise, isCompleted: nextCompleted };
    });

    if (!dayChanged) return day;

    const completedExercises = nextExercises.filter((e) => e.isCompleted).length;
    return {
      ...day,
      exercises: nextExercises,
      completedExercises,
      totalExercises: nextExercises.length,
    };
  });

  if (!changed) return workoutPlan;

  // Recalculate top-level completedWorkouts (days where ALL exercises are completed)
  const completedWorkouts = nextDays.filter((day) => {
    if (day.isRestDay) return false;
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    return exercises.length > 0 && exercises.every((e) => e.isCompleted);
  }).length;

  return {
    ...workoutPlan,
    days: nextDays,
    completedWorkouts,
  };
}

export function useCurrentWorkout() {
  const query = useQuery({
    queryKey: workoutQueryKeys.current,
    queryFn: () => workoutAPI.getCurrent(),
  });

  return {
    ...query,
    isEmpty: isEmptyStateError(query.error),
  };
}

export function useGenerateWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => workoutAPI.generatePlan(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.current });
      window.dispatchEvent(new CustomEvent('vitalityai:dashboard-refresh'));
    },
  });
}

export function useToggleWorkoutExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workoutPlanId, nextCompleted }) => {
      if (nextCompleted) {
        await workoutAPI.completeExercise(workoutPlanId);
      } else {
        await workoutAPI.uncompleteExercise(workoutPlanId);
      }
      return { workoutPlanId, nextCompleted };
    },
    onMutate: async ({ workoutPlanId, nextCompleted }) => {
      await queryClient.cancelQueries({ queryKey: workoutQueryKeys.current });
      const previous = queryClient.getQueryData(workoutQueryKeys.current);
      queryClient.setQueryData(workoutQueryKeys.current, (current) =>
        updateExerciseCompletion(current, workoutPlanId, nextCompleted)
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(workoutQueryKeys.current, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.current });
      window.dispatchEvent(new CustomEvent('vitalityai:dashboard-refresh'));
    },
  });
}
