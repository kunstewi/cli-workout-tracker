export interface Exercise {
    name: string;
    unit: string;
    dailyTarget: number;
}

export interface DayLog {
    [exerciseName: string]: number;
}

export interface WorkoutData {
    exercises: {
        [name: string]: Omit<Exercise, 'name'>;
    };
    logs: {
        [date: string]: DayLog; // date format: YYYY-MM-DD
    };
}

export interface AppState {
    currentDate: Date;
    viewMode: 'dashboard' | 'add' | 'config';
    selectedExercise: string | null;
    inputValue: string;
}
