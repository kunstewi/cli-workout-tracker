import React from 'react';
import { Box, Text } from 'ink';

interface HelpBarProps {
    mode: 'dashboard' | 'add' | 'config';
}

export const HelpBar: React.FC<HelpBarProps> = ({ mode }) => {
    return (
        <Box
            flexDirection="column"
            marginTop={1}
            borderStyle="single"
            borderColor="gray"
            paddingX={1}
        >
            <Text bold color="cyan">⌨️  Commands</Text>
            <Box marginTop={0} gap={2} flexWrap="wrap">
                <Text><Text color="yellow">←/→</Text> Change day</Text>
                <Text><Text color="yellow">↑/↓</Text> Change week</Text>
                <Text><Text color="yellow">p/n</Text> Prev/Next month</Text>
                <Text><Text color="yellow">t</Text> Go to today</Text>
                <Text><Text color="yellow">a</Text> Add exercise</Text>
                <Text><Text color="yellow">g</Text> Git push</Text>
                <Text><Text color="yellow">q</Text> Quit</Text>
            </Box>
        </Box>
    );
};
