import { Box, Tab } from '@mui/material';
import { SystemProps } from '@mui/system';


interface TabPanelProps {
    children?: React.ReactNode;
    ident: any;
    value: any;
    sx?: Record<string, any>
}

export default function TabPanel(props: TabPanelProps) {
    const { children, value, ident, sx, ...other } = props;

    let styles = {
        zIndex: 2,
        display: 'grid',
        flexGrow: 1,
        height: '100%',
        ...sx,
    } as SystemProps;

    if (value !== ident) {
        styles = {
            position: 'absolute',
            top: 0,
            left: -9000,
            zIndex: 1,
            height: '100%'
        } as SystemProps;
    }

    return (
        <Box
            sx={{ ...styles }}
            role="tabpanel"
            id={`nav-tabpanel-${ident}`}
            aria-labelledby={`nav-tab-${ident}`}
            {...other}
        >
            {children}
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

