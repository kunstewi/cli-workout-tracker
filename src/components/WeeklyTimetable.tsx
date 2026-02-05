import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { WorkoutData, DayOfWeek } from '../types/index.js';
import { addWeeklyWorkout, removeWeeklyWorkout } from '../utils/data.js';

interface WeeklyTimetableProps {
    data: WorkoutData;
    onBack: () => void;
    onUpdate: () => void;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const WeeklyTimetable: React.FC<WeeklyTimetableProps> = ({ data, onBack, onUpdate }) => {
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);
    const [mode, setMode] = useState<'view' | 'add' | 'edit' | 'delete'>('view');
    const [exerciseInput, setExerciseInput] = useState('');
    const [repsInput, setRepsInput] = useState('');
    const [inputField, setInputField] = useState<'exercise' | 'reps'>('exercise');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedDay = DAYS[selectedDayIndex];
    const workouts = data.weeklyTemplate?.[selectedDay] || [];
    const availableExercises = Object.keys(data.exercises);

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    useInput((input, key) => {
        if (mode === 'view') {
            // Navigation
            if (key.leftArrow && selectedDayIndex > 0) {
                setSelectedDayIndex(prev => prev - 1);
                setSelectedWorkoutIndex(0);
            } else if (key.rightArrow && selectedDayIndex < DAYS.length - 1) {
                setSelectedDayIndex(prev => prev + 1);
                setSelectedWorkoutIndex(0);
            } else if (key.upArrow && selectedWorkoutIndex > 0) {
                setSelectedWorkoutIndex(prev => prev - 1);
            } else if (key.downArrow && selectedWorkoutIndex < workouts.length - 1) {
                setSelectedWorkoutIndex(prev => prev + 1);
            }

            // Actions
            if (input === 'a' || input === 'A') {
                setMode('add');
                setExerciseInput('');
                setRepsInput('');
                setInputField('exercise');
            } else if (input === 'e' || input === 'E') {
                if (workouts.length > 0) {
                    const workout = workouts[selectedWorkoutIndex];
                    setExerciseInput(workout.exerciseName);
                    setRepsInput(String(workout.reps));
                    setInputField('reps');
                    setMode('edit');
                }
            } else if (input === 'd' || input === 'D') {
                if (workouts.length > 0) {
                    setMode('delete');
                }
            } else if (input === 'q' || input === 'Q') {
                onBack();
            }
        } else if (mode === 'add' || mode === 'edit') {
            if (key.escape) {
                setMode('view');
                setExerciseInput('');
                setRepsInput('');
                setErrorMessage(null);
            } else if (key.tab) {
                setInputField(inputField === 'exercise' ? 'reps' : 'exercise');
            } else if (key.return) {
                // Submit
                if (exerciseInput && repsInput) {
                    const reps = parseInt(repsInput);
                    if (!isNaN(reps) && reps > 0) {
                        try {
                            addWeeklyWorkout(selectedDay, exerciseInput, reps);
                            onUpdate();
                            setMode('view');
                            setExerciseInput('');
                            setRepsInput('');
                            setErrorMessage(null);
                        } catch (error) {
                            showError((error as Error).message);
                        }
                    } else {
                        showError('Reps must be a positive number');
                    }
                } else {
                    showError('Please fill in all fields');
                }
            } else if (key.backspace || key.delete) {
                if (inputField === 'exercise') {
                    setExerciseInput(prev => prev.slice(0, -1));
                } else {
                    setRepsInput(prev => prev.slice(0, -1));
                }
            } else if (input && !key.ctrl && !key.meta) {
                if (inputField === 'exercise') {
                    setExerciseInput(prev => prev + input);
                } else if (inputField === 'reps' && /^\d$/.test(input)) {
                    setRepsInput(prev => prev + input);
                }
            }
        } else if (mode === 'delete') {
            if (input === 'y' || input === 'Y') {
                const workout = workouts[selectedWorkoutIndex];
                removeWeeklyWorkout(selectedDay, workout.exerciseName);
                onUpdate();
                setMode('view');
                if (selectedWorkoutIndex >= workouts.length - 1) {
                    setSelectedWorkoutIndex(Math.max(0, workouts.length - 2));
                }
            } else if (input === 'n' || input === 'N' || key.escape) {
                setMode('view');
            }
        }
    });

    return (
        <Box flexDirection="column" padding={1}>
            <Box marginBottom={1}>
                <Text bold color="cyan">📅 Weekly Workout Timetable (Monday - Saturday)</Text>
            </Box>

            {/* Error Message */}
            {errorMessage && (
                <Box justifyContent="center" marginBottom={1}>
                    <Text color="red" bold>
                        ❌ {errorMessage}
                    </Text>
                </Box>
            )}

            {/* Day Tabs */}
            <Box marginBottom={1}>
                {DAYS.map((day, index) => (
                    <Box key={day} marginRight={1}>
                        <Text
                            bold={index === selectedDayIndex}
                            color={index === selectedDayIndex ? 'green' : 'white'}
                            dimColor={index !== selectedDayIndex}
                        >
                            {index === selectedDayIndex ? '▶ ' : '  '}
                            {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                        </Text>
                    </Box>
                ))}
            </Box>

            {/* Workouts List */}
            <Box flexDirection="column" marginBottom={1} borderStyle="round" borderColor="gray" padding={1}>
                <Box marginBottom={1}>
                    <Text bold>{selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Workouts</Text>
                </Box>

                {workouts.length === 0 ? (
                    <Text dimColor>No workouts scheduled. Press 'a' to add.</Text>
                ) : (
                    workouts.map((workout, index) => {
                        const exercise = data.exercises[workout.exerciseName];
                        const isSelected = index === selectedWorkoutIndex && mode === 'view';

                        return (
                            <Box key={index} marginBottom={0}>
                                <Text color={isSelected ? 'green' : 'white'} bold={isSelected}>
                                    {isSelected ? '▶ ' : '  '}
                                    {workout.exerciseName.padEnd(15)} - {workout.reps} {exercise?.unit || 'reps'}
                                </Text>
                            </Box>
                        );
                    })
                )}
            </Box>

            {/* Add/Edit Form */}
            {(mode === 'add' || mode === 'edit') && (
                <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1} marginBottom={1}>
                    <Box marginBottom={1}>
                        <Text bold color="yellow">{mode === 'add' ? '➕ Add Workout' : '✏️  Edit Workout'}</Text>
                    </Box>

                    <Box marginBottom={1}>
                        <Text>Exercise: </Text>
                        <Text color={inputField === 'exercise' ? 'cyan' : 'white'} bold={inputField === 'exercise'}>
                            {exerciseInput || '_'}
                        </Text>
                        {inputField === 'exercise' && <Text color="cyan"> ◀</Text>}
                    </Box>

                    <Box marginBottom={1}>
                        <Text>Reps: </Text>
                        <Text color={inputField === 'reps' ? 'cyan' : 'white'} bold={inputField === 'reps'}>
                            {repsInput || '_'}
                        </Text>
                        {inputField === 'reps' && <Text color="cyan"> ◀</Text>}
                    </Box>

                    <Box marginBottom={1}>
                        <Text dimColor>Available: {availableExercises.join(', ')}</Text>
                    </Box>

                    <Box>
                        <Text dimColor>Tab: Switch field | Enter: Submit | Esc: Cancel</Text>
                    </Box>
                </Box>
            )}

            {/* Delete Confirmation */}
            {mode === 'delete' && workouts.length > 0 && (
                <Box flexDirection="column" borderStyle="round" borderColor="red" padding={1} marginBottom={1}>
                    <Text bold color="red">
                        Delete "{workouts[selectedWorkoutIndex].exerciseName}" from {selectedDay}?
                    </Text>
                    <Text dimColor>Press 'y' to confirm, 'n' to cancel</Text>
                </Box>
            )}

            {/* Help */}
            <Box flexDirection="column" borderStyle="single" borderColor="gray" padding={1}>
                <Text bold>Controls:</Text>
                <Text dimColor>← → : Switch day | ↑ ↓ : Select workout</Text>
                <Text dimColor>a: Add | e: Edit | d: Delete | q: Back to dashboard</Text>
            </Box>
        </Box>
    );
};
