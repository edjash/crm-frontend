import { Box, SxProps, Tab, Tabs } from '@mui/material';
import { ReactElement, ReactNode, useEffect, useState } from 'react';



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

interface TabBoxProps {
    children: ReactElement<TabPanelProps>[];
}

export const TabBox = (props: TabBoxProps) => {

    const [activeTab, setActiveTab] = useState(0);
    const [init, setInit] = useState(0);

    useEffect(() => {
        if (!init) {

            setInit(1);
        }
    }, [init]);

    return (
        <div style={{ display: 'flex' }}>
            <Tabs
                orientation="vertical"
                value={activeTab}
                onChange={(e, n) => {
                    setActiveTab(n);
                }}>
                {props.children.map((child: ReactElement<TabPanelProps>, index: number) =>
                    <Tab label={child.props.label} value={index} />
                )}
            </Tabs>
            <div style={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                {props.children.map((child: ReactElement<TabPanelProps>, index: number) =>
                    <TabPanel value={index} activeTab={activeTab} sx={child.props.sx}>
                        {child.props.children}
                    </TabPanel>
                )}
            </div>
        </div>
    );
}
