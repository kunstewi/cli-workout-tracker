import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { WorkoutData, DayLog } from '../types/index.js';

const DATA_DIR = path.join(os.homedir(), '.workout');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

const DEFAULT_DATA: WorkoutData = {
    exercises: {
        running: { unit: 'km', dailyTarget: 10 },
        plank: { unit: 'min', dailyTarget: 10 },
        pushups: { unit: 'reps', dailyTarget: 100 },
        pullups: { unit: 'reps', dailyTarget: 50 },
    },
    logs: {},
};

export function ensureDataDir(): void {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function loadData(): WorkoutData {
    ensureDataDir();

    if (!fs.existsSync(DATA_FILE)) {
        saveData(DEFAULT_DATA);
        return DEFAULT_DATA;
    }

    try {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content) as WorkoutData;
    } catch {
        return DEFAULT_DATA;
    }
}

export function saveData(data: WorkoutData): void {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getTodayLog(data: WorkoutData): DayLog {
    const today = formatDate(new Date());
    return data.logs[today] || {};
}

export function updateExercise(exerciseName: string, amount: number, mode: 'add' | 'set' = 'add'): WorkoutData {
    const data = loadData();
    const today = formatDate(new Date());

    if (!data.logs[today]) {
        data.logs[today] = {};
    }

    const currentValue = data.logs[today][exerciseName] || 0;
    data.logs[today][exerciseName] = mode === 'add' ? currentValue + amount : amount;

    saveData(data);
    return data;
}

export function addExercise(name: string, unit: string, dailyTarget: number): WorkoutData {
    const data = loadData();
    data.exercises[name.toLowerCase()] = { unit, dailyTarget };
    saveData(data);
    return data;
}

export function removeExercise(name: string): WorkoutData {
    const data = loadData();
    delete data.exercises[name.toLowerCase()];
    saveData(data);
    return data;
}

export function getDataDir(): string {
    return DATA_DIR;
}

export function getDataFile(): string {
    return DATA_FILE;
}
