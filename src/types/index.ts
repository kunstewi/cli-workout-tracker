export interface Exercise {
    name: string;
    unit: string;
    dailyTarget: number;
}

export interface DayLog {
    [exerciseName: string]: number;
}

export interface WorkoutTemplate {
    exerciseName: string;
    reps: number;
}

export interface WeeklyTemplate {
    monday: WorkoutTemplate[];
    tuesday: WorkoutTemplate[];
    wednesday: WorkoutTemplate[];
    thursday: WorkoutTemplate[];
    friday: WorkoutTemplate[];
    saturday: WorkoutTemplate[];
}

export interface WorkoutData {
    exercises: {
        [name: string]: Omit<Exercise, 'name'>;
    };
    logs: {
        [date: string]: DayLog; // date format: YYYY-MM-DD
    };
    weeklyTemplate?: WeeklyTemplate;
}

export interface AppState {
    currentDate: Date;
    viewMode: 'dashboard' | 'add' | 'config' | 'weekly';
    selectedExercise: string | null;
    inputValue: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
