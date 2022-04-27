import { Box, SxProps, Tab } from '@mui/material';
import { ReactNode } from 'react';

interface TabPanelProps {
    label?: string;
    children?: ReactNode;
    value?: number;
    isActive?: boolean;
    sx?: SxProps;
}


export default function TabPanel(props: TabPanelProps) {
    return (
        <Box
            sx={{
                ...props.sx,
                visibility: (props.isActive) ? 'visible' : 'hidden',
                order: (props.isActive) ? 1 : 2,
                overflow: 'auto',
                minHeight: '100%'
            }}
        >
            {props.children}
        </Box>
    );
}

export interface TabLabelProps {
    label: string;
    value: number;
    disabled?: boolean;
}

export const TabLabel = (props: TabLabelProps) => {
    return (
        <Tab
            label={props.label}
            key={`tab${props.value}`}
            value={props.value}
        />
    );
}
