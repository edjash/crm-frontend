import { createTheme } from '@mui/material/styles';

declare module "@mui/material/styles/createPalette" {
    export interface PaletteOptions {
        custom: {
            disabledIcon: string;
        };
    }
}
const theme = (mode: 'dark' | 'light') => {

    return createTheme({
        palette: {
            mode: mode,
            info: {
                main: '#CCCCCC',
            },
            custom: {
                disabledIcon: '#263238'
            },
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
