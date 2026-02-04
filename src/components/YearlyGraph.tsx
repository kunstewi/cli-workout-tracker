import React from 'react';
import { Box, Text } from 'ink';
import { WorkoutData } from '../types/index.js';
import {
    startOfYear,
    endOfYear,
    eachDayOfInterval,
    format,
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
            case 'future': return 'white';
        }
    };

    // Build horizontal data - all days in sequence
    const dayData: { key: string; status: DayStatus }[] = days.map((day) => ({
        key: day.toISOString(),
        status: getDayStatus(day),
    }));

    return (
        <Box flexDirection="column" marginBottom={1}>
            <Box marginBottom={0}>
                <Text dimColor>{format(year, 'yyyy')} Activity</Text>
            </Box>
            <Box flexWrap="wrap">
                {dayData.map((cell) => (
                    <Text
                        key={cell.key}
                        color={getStatusColor(cell.status)}
                        bold
                    >
                        •
                    </Text>
                ))}
            </Box>
            <Box marginTop={0} gap={2}>
                <Text color="green" bold>• done</Text>
                <Text color="yellow" bold>• half</Text>
                <Text color="red" bold>• missed</Text>
            </Box>
        </Box>
    );
};
