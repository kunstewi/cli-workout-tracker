import React from 'react';
import { Box, Text } from 'ink';
import { WorkoutData } from '../types/index.js';
import { formatDate } from '../utils/data.js';

interface ExerciseListProps {
    data: WorkoutData;
    selectedDate: Date;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ data, selectedDate }) => {
    const dateKey = formatDate(selectedDate);
    const dayLog = data.logs[dateKey] || {};
    const exercises = Object.entries(data.exercises);

    const isToday = formatDate(new Date()) === dateKey;

    return (
        <Box flexDirection="column" marginTop={1}>
            <Text bold color="cyan">
                {isToday ? "📋 Today's Exercises" : `📋 Exercises for ${dateKey}`}
            </Text>
            <Box marginTop={1} flexDirection="column">
                {exercises.map(([name, config]) => {
                    const current = dayLog[name] || 0;
                    const target = config.dailyTarget;
                    const percentage = Math.min((current / target) * 100, 100);
                    const completed = current >= target;

                    // Progress bar (dot style)
                    const barWidth = 20;
                    const filled = Math.round((percentage / 100) * barWidth);
                    const empty = barWidth - filled;
                    const progressBar = '•'.repeat(filled) + '·'.repeat(empty);

                    return (
                        <Box key={name} marginBottom={0}>
                            <Text>
                                <Text color={completed ? 'green' : 'yellow'}>
                                    {completed ? '✓' : '○'}
                                </Text>
                                {' '}
                                <Text bold>{name.padEnd(12)}</Text>
                                <Text color={completed ? 'green' : 'white'}>
                                    {String(current).padStart(4)}/{target} {config.unit.padEnd(4)}
                                </Text>
                                {' '}
                                <Text color="green">{'•'.repeat(filled)}</Text>
                                <Text color="white">{'·'.repeat(empty)}</Text>
                                {' '}
                                <Text dimColor>{Math.round(percentage)}%</Text>
                            </Text>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
