export interface WorkoutEntry {
  id: number;
  exercisedId?: number;
  exerciseName?: string;
  sets?: number;
  reps?: number;
  date?: string;
  caloriesBurned?: number;
  duration?: number;
}

export interface LogWorkoutData {
  exercisedId: number;
  sets: number;
  reps: number;
  date: string;
}
