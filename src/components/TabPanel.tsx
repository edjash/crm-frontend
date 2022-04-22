import { Box, SxProps, Tab } from '@mui/material';
import { ReactNode } from 'react';

interface TabPanelProps {
    label?: string;
    children?: ReactNode;
    value?: number;
    activeTab?: number;
    sx?: SxProps;
}

export default function TabPanel(props: TabPanelProps) {
    const active = (props.value === props.activeTab);

    return (
        <Box
            sx={{
                ...props.sx,
            }}
            style={{
                visibility: (active) ? 'visible' : 'hidden',
                order: (active) ? 1 : 2,
            }}
        >
            {props.children}
        </Box>
    );
}

interface TabProps {
    label: string;
    value: number;
}

export const TabLabel = (props: TabProps) => {
    return (
        <Tab
            label={props.label}
            key={`tab${props.value}`}
            value={props.value}
        />
    );
}
