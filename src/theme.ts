import { createTheme, PaletteOptions } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';

declare module "@mui/material/styles/createPalette" {
    export interface PaletteOptions {
        toolbar?: {
            backgroundColor?: string;
            buttonTextColor?: string;
        },
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
    toolbar: {
        backgroundColor: 'red'
    },
    custom: {
        disabledIcon: '#263238',
        appBarBackground: '#ff7256',
        appBarText: '#FFFFFF',
    },
};

const lightStyles = `
.dialogGrid {
    background: #f7f7f7;
}
.dialogGrid .MuiDataGrid-columnHeaders {
    background: #ff5733 !important;
    color: #FFFFFF;
}
`;

const darkPalette: PaletteOptions = {
    info: {
        main: '#CCCCCC',
    },
    toolbar: {
        backgroundColor: '#212121',
        buttonTextColor: '#eeeeee',
    },
    custom: {
        disabledIcon: '#263238',
        appBarBackground: '#141414',
        appBarText: '#FFFFFF',
    },
};

const darkStyles = `
.dialogGrid,
.dialogPaper
{
    background-color: #2e2e2e !important;
}
.dialogGrid .MuiDataGrid-columnHeaders {
    background: #262626 !important;
}
.dialogGrid .MuiDataGrid-row {
   border-bottom: 1px solid #787878;
}
`;

const theme = (mode: 'dark' | 'light') => {

    const modePalette = (mode === 'dark') ? darkPalette : lightPalette;

    return createTheme({
        palette: {
            ...modePalette,
            mode: mode,
        },
        components: {
            MuiDialog: {
                styleOverrides: {
                    root: {
                        '& .dialogGrid .MuiDataGrid-columnHeader': {
                            background: modePalette.toolbar?.backgroundColor,
                        },
                        '& .dialogGrid .MuiDataGrid-row:not(:hover):nth-of-type(even)': {
                            backgroundColor: '#383838'
                        }
                    }
                }
            },
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
            MuiCssBaseline: {
                styleOverrides: (mode === 'dark') ? darkStyles : lightStyles,
            }
        },
        typography: {
            button: {
                textTransform: 'none',
            },
        },
    });
}

export default theme;
