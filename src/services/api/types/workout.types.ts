export interface WorkoutExerciseItem {
  workoutPlanId: number;
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  isCompleted: boolean;
  formTip?: string | null;
}

export interface CurrentWorkoutResponse {
  date: string;
  day: string;
  focus: string;
  isRestDay: boolean;
  completedExercises: number;
  totalExercises: number;
  exercises: WorkoutExerciseItem[];
}

