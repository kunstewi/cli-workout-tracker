import React from 'react';
import { Box, Text } from 'ink';
import { WorkoutData } from '../types/index.js';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    getDay,
    isSameDay,
    isToday,
    subMonths,
    addMonths,
} from 'date-fns';

interface CalendarProps {
    data: WorkoutData;
    currentMonth: Date;
    selectedDate: Date;
    onMonthChange?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
    data,
    currentMonth,
    selectedDate
}) => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Calculate padding for first week
    const firstDayOfWeek = getDay(start);

    // Group days into weeks
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = Array(firstDayOfWeek).fill(null);

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

    const getDayStatus = (date: Date): 'complete' | 'partial' | 'none' | 'future' => {
        if (date > new Date()) return 'future';

        const dateKey = format(date, 'yyyy-MM-dd');
        const dayLog = data.logs[dateKey];

        if (!dayLog) return 'none';

        const exercises = Object.keys(data.exercises);
        const completed = exercises.filter(ex => {
            const current = dayLog[ex] || 0;
            const target = data.exercises[ex].dailyTarget;
            return current >= target;
        });

        if (completed.length === exercises.length) return 'complete';
        if (completed.length > 0) return 'partial';
        return 'none';
    };

    return (
        <Box flexDirection="column">
            <Box justifyContent="center" marginBottom={1}>
                <Text bold color="magenta">
                    📅 {format(currentMonth, 'MMMM yyyy')}
                </Text>
            </Box>

            {/* Week day headers */}
            <Box>
                {weekDays.map((day) => (
                    <Box key={day} width={4} justifyContent="center">
                        <Text dimColor bold>{day}</Text>
                    </Box>
                ))}
            </Box>

            {/* Calendar days */}
            {weeks.map((week, weekIndex) => (
                <Box key={weekIndex}>
                    {week.map((day, dayIndex) => {
                        if (!day) {
                            return <Box key={`empty-${dayIndex}`} width={4} />;
                        }

                        const status = getDayStatus(day);
                        const isSelected = isSameDay(day, selectedDate);
                        const isTodayDate = isToday(day);

                        let color: string = 'white';
                        let bgColor: string | undefined;

                        if (status === 'complete') color = 'green';
                        else if (status === 'partial') color = 'yellow';
                        else if (status === 'future') color = 'gray';
                        else if (status === 'none') color = 'red';

                        if (isSelected) bgColor = 'blue';

                        return (
                            <Box key={day.toISOString()} width={4} justifyContent="center">
                                <Text
                                    color={color}
                                    backgroundColor={bgColor}
                                    bold={isTodayDate}
                                    inverse={isSelected}
                                >
                                    {format(day, 'd').padStart(2, ' ')}
                                </Text>
                            </Box>
                        );
                    })}
                </Box>
            ))}

            {/* Legend */}
            <Box marginTop={1} gap={2}>
                <Text><Text color="green">●</Text> Complete</Text>
                <Text><Text color="yellow">●</Text> Partial</Text>
                <Text><Text color="red">●</Text> None</Text>
            </Box>
        </Box>
    );
};
