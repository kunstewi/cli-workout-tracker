import React from 'react';
import { Box, Text } from 'ink';
import { WorkoutData } from '../types/index.js';
import {
    startOfYear,
    endOfYear,
    eachDayOfInterval,
    format,
    getDay,
} from 'date-fns';

interface YearlyGraphProps {
    data: WorkoutData;
    year?: Date;
}

type DayStatus = 'complete' | 'partial' | 'none' | 'future';

export const YearlyGraph: React.FC<YearlyGraphProps> = ({
    data,
    year = new Date(),
}) => {
    const start = startOfYear(year);
    const end = endOfYear(year);
    const today = new Date();
    const days = eachDayOfInterval({ start, end });

    const getDayStatus = (date: Date): DayStatus => {
        if (date > today) return 'future';

        const dateKey = format(date, 'yyyy-MM-dd');
        const dayLog = data.logs[dateKey];

        if (!dayLog) return 'none';

        const exercises = Object.keys(data.exercises);
        if (exercises.length === 0) return 'none';

        const completed = exercises.filter(ex => {
            const current = dayLog[ex] || 0;
            const target = data.exercises[ex].dailyTarget;
            return current >= target;
        });

        if (completed.length === exercises.length) return 'complete';
        if (completed.length > 0) return 'partial';
        return 'none';
    };

    const getStatusColor = (status: DayStatus): string => {
        switch (status) {
            case 'complete': return 'green';
            case 'partial': return 'yellow';
            case 'none': return 'red';
            case 'future': return 'gray';
        }
    };

    // Group days into weeks (columns)
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Pad the first week with nulls
    const firstDayOfWeek = getDay(start);
    for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
    }

    days.forEach((day) => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    // Build row data (7 rows for each day of week, columns are weeks)
    const rowData: { key: string; status: DayStatus | null }[][] = Array.from({ length: 7 }, () => []);

    weeks.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
            if (!day) {
                rowData[dayIndex].push({ key: `empty-${weekIndex}-${dayIndex}`, status: null });
            } else {
                rowData[dayIndex].push({ key: day.toISOString(), status: getDayStatus(day) });
            }
        });
    });

    return (
        <Box flexDirection="column" marginBottom={1}>
            <Box marginBottom={0}>
                <Text dimColor>{format(year, 'yyyy')} Activity</Text>
            </Box>
            <Box flexDirection="column">
                {rowData.map((row, rowIndex) => (
                    <Box key={rowIndex}>
                        {row.map((cell) => (
                            <Text
                                key={cell.key}
                                color={cell.status ? getStatusColor(cell.status) : undefined}
                                dimColor={cell.status === null}
                            >
                                •
                            </Text>
                        ))}
                    </Box>
                ))}
            </Box>
            <Box marginTop={0} gap={2}>
                <Text dimColor>
                    <Text color="green">•</Text> done{' '}
                    <Text color="yellow">•</Text> half{' '}
                    <Text color="red">•</Text> missed
                </Text>
            </Box>
        </Box>
    );
};
