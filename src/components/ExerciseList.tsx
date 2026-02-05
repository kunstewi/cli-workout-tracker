import React from 'react';
import { Box, Text } from 'ink';
import { WorkoutData } from '../types/index.js';
import { formatDate, getDayOfWeek } from '../utils/data.js';

interface ExerciseListProps {
    data: WorkoutData;
    selectedDate: Date;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ data, selectedDate }) => {
    const dateKey = formatDate(selectedDate);
    const dayLog = data.logs[dateKey] || {};
    const exercises = Object.entries(data.exercises);

    const isToday = formatDate(new Date()) === dateKey;

    // Get weekly template for this day
    const dayOfWeek = getDayOfWeek(selectedDate);
    const weeklyWorkouts = dayOfWeek !== 'sunday' ? (data.weeklyTemplate?.[dayOfWeek] || []) : [];
    const weeklyExerciseMap = new Map(weeklyWorkouts.map(w => [w.exerciseName, w.reps]));

    return (
        <Box flexDirection="column" marginTop={1}>
            <Text bold color="cyan">
                {isToday ? "📋 Today's Exercises" : `📋 Exercises for ${dateKey}`}
            </Text>

            {/* Show weekly template info if applicable */}
            {weeklyWorkouts.length > 0 && (
                <Box marginTop={1} marginBottom={1}>
                    <Text dimColor>
                        📅 {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}'s scheduled: {weeklyWorkouts.map(w => w.exerciseName).join(', ')}
                    </Text>
                </Box>
            )}

            <Box marginTop={1} flexDirection="column">
                {exercises.map(([name, config]) => {
                    const current = dayLog[name] || 0;
                    const target = config.dailyTarget;
                    const percentage = Math.min((current / target) * 100, 100);
                    const completed = current >= target;
                    const isScheduled = weeklyExerciseMap.has(name);
                    const scheduledReps = weeklyExerciseMap.get(name);

                    // Progress bar (dot style)
                    const barWidth = 20;
                    const filled = Math.round((percentage / 100) * barWidth);
                    const empty = barWidth - filled;

                    return (
                        <Box key={name} marginBottom={0}>
                            <Text>
                                <Text color={completed ? 'green' : 'yellow'}>
                                    {completed ? '✓' : '○'}
                                </Text>
                                {' '}
                                {isScheduled && <Text color="cyan">📅 </Text>}
                                <Text bold>{name.padEnd(12)}</Text>
                                <Text color={completed ? 'green' : 'white'}>
                                    {String(current).padStart(4)}/{target} {config.unit.padEnd(4)}
                                </Text>
                                {' '}
                                <Text color="green">{'•'.repeat(filled)}</Text>
                                <Text color="white">{'·'.repeat(empty)}</Text>
                                {' '}
                                <Text dimColor>{Math.round(percentage)}%</Text>
                                {isScheduled && scheduledReps && (
                                    <Text dimColor> (plan: {scheduledReps})</Text>
                                )}
                            </Text>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

