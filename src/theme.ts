import { createTheme, PaletteOptions } from '@mui/material/styles';

declare module "@mui/material/styles/createPalette" {
    export interface PaletteOptions {
        custom?: {
            disabledIcon: string;
            appBarBackground: string;
            appBarText: string;
        };
    }
}

const lightPalette: PaletteOptions = {
    primary: {
        main: '#FF5733'
    },
    custom: {
        disabledIcon: '#263238',
        appBarBackground: '#ff7256',
        appBarText: '#FFFFFF',
    },
};

const darkPalette: PaletteOptions = {
    info: {
        main: '#CCCCCC',
    },
    custom: {
        disabledIcon: '#263238',
        appBarBackground: '#141414',
        appBarText: '#FFFFFF',
    },
};

const theme = (mode: 'dark' | 'light') => {

    const modePalette = (mode === 'dark') ? darkPalette : lightPalette;

    return createTheme({
        palette: {
            ...modePalette,
            mode: mode,
        },
        components: {
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                },
            },
            MuiTextField: {
                defaultProps: {
                    variant: "filled",
                    margin: "dense",
                    fullWidth: true,
                },
            },
        },
        typography: {
            button: {
                textTransform: 'none',
            },
        },
    });
}

export default theme;
