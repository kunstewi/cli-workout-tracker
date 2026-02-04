import React from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { WorkoutData } from '../types/index.js';

interface AddExerciseFormProps {
    data: WorkoutData;
    onSubmit: (exerciseName: string, amount: number) => void;
    onCancel: () => void;
}

export const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
    data,
    onSubmit,
    onCancel
}) => {
    const [step, setStep] = React.useState<'select' | 'amount'>('select');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [amount, setAmount] = React.useState('');

    const exercises = Object.keys(data.exercises);
    const selectedExercise = exercises[selectedIndex];

    useInput((input, key) => {
        if (key.escape) {
            onCancel();
            return;
        }

        if (step === 'select') {
            if (key.upArrow) {
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : exercises.length - 1));
            } else if (key.downArrow) {
                setSelectedIndex(prev => (prev < exercises.length - 1 ? prev + 1 : 0));
            } else if (key.return) {
                setStep('amount');
            }
        }
    });

    const handleAmountSubmit = (value: string) => {
        const num = parseFloat(value);
        if (!isNaN(num) && num > 0) {
            onSubmit(selectedExercise, num);
        }
    };

    return (
        <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
            <Text bold color="cyan">➕ Add Exercise Progress</Text>

            {step === 'select' && (
                <Box flexDirection="column" marginTop={1}>
                    <Text dimColor>Use ↑/↓ to select, Enter to confirm, Esc to cancel</Text>
                    <Box marginTop={1} flexDirection="column">
                        {exercises.map((ex, index) => (
                            <Text key={ex}>
                                <Text color={index === selectedIndex ? 'cyan' : 'white'}>
                                    {index === selectedIndex ? '▶ ' : '  '}
                                </Text>
                                <Text bold={index === selectedIndex}>{ex}</Text>
                                <Text dimColor> ({data.exercises[ex].unit})</Text>
                            </Text>
                        ))}
                    </Box>
                </Box>
            )}

            {step === 'amount' && (
                <Box flexDirection="column" marginTop={1}>
                    <Text>
                        Adding to <Text bold color="yellow">{selectedExercise}</Text>
                        <Text dimColor> ({data.exercises[selectedExercise].unit})</Text>
                    </Text>
                    <Box marginTop={1}>
                        <Text>Amount: </Text>
                        <TextInput
                            value={amount}
                            onChange={setAmount}
                            onSubmit={handleAmountSubmit}
                            placeholder="Enter amount..."
                        />
                    </Box>
                    <Box marginTop={1}><Text dimColor>Press Enter to confirm, Esc to cancel</Text></Box>
                </Box>
            )}
        </Box>
    );
};
