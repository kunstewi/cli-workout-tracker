import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, isSameMonth } from 'date-fns';
import { Calendar } from './Calendar.js';
import { ExerciseList } from './ExerciseList.js';
import { YearlyGraph } from './YearlyGraph.js';
import { AddExerciseForm } from './AddExerciseForm.js';
import { WorkoutData } from '../types/index.js';
import { loadData, saveData, updateExercise, formatDate } from '../utils/data.js';
import { pushToGithub } from '../utils/git.js';

export const Dashboard: React.FC = () => {
    const { exit } = useApp();
    const [data, setData] = useState<WorkoutData>(loadData());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [mode, setMode] = useState<'dashboard' | 'add'>('dashboard');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Reload data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setData(loadData());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Sync currentMonth when selectedDate changes to a different month
    useEffect(() => {
        if (!isSameMonth(selectedDate, currentMonth)) {
            setCurrentMonth(startOfMonth(selectedDate));
        }
    }, [selectedDate]);

    const showStatus = (message: string) => {
        setStatusMessage(message);
        setTimeout(() => setStatusMessage(null), 3000);
    };

    useInput((input, key) => {
        if (mode !== 'dashboard') return;

        // Navigation
        if (key.leftArrow) {
            setSelectedDate(prev => subDays(prev, 1));
        } else if (key.rightArrow) {
            setSelectedDate(prev => addDays(prev, 1));
        } else if (key.upArrow) {
            setSelectedDate(prev => subWeeks(prev, 1));
        } else if (key.downArrow) {
            setSelectedDate(prev => addWeeks(prev, 1));
        }

        // Month navigation
        if (input === 'p' || input === 'P') {
            setCurrentMonth(prev => subMonths(prev, 1));
            setSelectedDate(prev => subMonths(prev, 1));
        } else if (input === 'n' || input === 'N') {
            setCurrentMonth(prev => addMonths(prev, 1));
            setSelectedDate(prev => addMonths(prev, 1));
        }

        // Go to today
        if (input === 't' || input === 'T') {
            setSelectedDate(new Date());
            setCurrentMonth(new Date());
            showStatus('Jumped to today');
        }

        // Add exercise
        if (input === 'a' || input === 'A') {
            setMode('add');
        }

        // Git push
        if (input === 'g' || input === 'G') {
            showStatus('Pushing to GitHub...');
            const result = pushToGithub();
            showStatus(result.message);
        }

        // Quit
        if (input === 'q' || input === 'Q') {
            exit();
        }
    });

    const handleAddSubmit = (exerciseName: string, amount: number) => {
        // Check if selected date is today
        const today = formatDate(new Date());
        const selected = formatDate(selectedDate);

        if (selected !== today) {
            showStatus('Can only add exercises for today');
            setMode('dashboard');
            return;
        }

        const newData = updateExercise(exerciseName, amount, 'add');
        setData(newData);
        showStatus(`Added ${amount} to ${exerciseName}`);
        setMode('dashboard');
    };

    const handleAddCancel = () => {
        setMode('dashboard');
    };

    return (
        <Box flexDirection="column" padding={1}>
            {/* Yearly Activity Graph */}
            <YearlyGraph data={data} />

            {/* Status Message */}
            {statusMessage && (
                <Box justifyContent="center" marginBottom={1}>
                    <Text color="greenBright" bold>
                        💬 {statusMessage}
                    </Text>
                </Box>
            )}

            {/* Main Content */}
            <Box flexDirection="row" gap={4}>
                {/* Calendar */}
                <Box flexDirection="column">
                    <Calendar
                        data={data}
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                    />
                </Box>

                {/* Exercise List or Add Form */}
                <Box flexDirection="column" flexGrow={1}>
                    {mode === 'dashboard' ? (
                        <ExerciseList data={data} selectedDate={selectedDate} />
                    ) : (
                        <AddExerciseForm
                            data={data}
                            onSubmit={handleAddSubmit}
                            onCancel={handleAddCancel}
                        />
                    )}
                </Box>
            </Box>

            {/* Simple help note */}
            <Box marginTop={1}>
                <Text dimColor>Run </Text>
                <Text color="cyan">wout help</Text>
                <Text dimColor> for available commands</Text>
            </Box>
        </Box>
    );
};
