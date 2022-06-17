import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';
import { EVENTS } from '../app/constants';

import theme from '../theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export default function ThemeProvider(props: ThemeProviderProps) {

    const [mode, setMode] = useState<'dark' | 'light'>('dark');

    useEffect(() => {
        const s1 = PubSub.subscribe(EVENTS.THEME_TOGGLE, () => {
            setMode((mode) => {
                return (mode === 'dark') ? 'light' : 'dark';
            });
        });

        return () => {
            PubSub.unsubscribe(s1);
        }
    }, []);

    return (
        <MuiThemeProvider theme={theme(mode)}>
            <CssBaseline enableColorScheme={true} />
            {props.children}
        </MuiThemeProvider>
    );

}
