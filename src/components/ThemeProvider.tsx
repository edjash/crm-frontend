import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ReactNode, useEffect, useState } from 'react';
import { EVENTS } from '../app/constants';

import theme from '../theme';

interface ThemeProviderProps {
    children: ReactNode;
}

type displayMode = 'dark' | 'light';

export default function ThemeProvider(props: ThemeProviderProps) {

    const defaultMode = useMediaQuery('(prefers-color-scheme: dark)') ? 'dark' : 'light';

    const [mode, setMode] = useState<displayMode>(() => {
        //Retrieve from local storage
        let m = localStorage.getItem('themeMode') ?? defaultMode;
        return (m === 'dark') ? 'dark' : 'light';
    });

    useEffect(() => {
        const s1 = PubSub.subscribe(EVENTS.THEME_TOGGLE, () => {
            setMode((mode) => {
                //Save to local storage
                const newMode = (mode === 'dark') ? 'light' : 'dark';
                localStorage.setItem('themeMode', newMode);
                return newMode;
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
