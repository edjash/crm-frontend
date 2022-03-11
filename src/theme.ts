import { createTheme } from '@mui/material/styles';

declare module "@mui/material/styles/createPalette" {
    export interface PaletteOptions {
        custom: {
            disabledIcon: string;
        };
    }
}
const theme = createTheme({

    palette: {
        mode: 'dark',
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

        MuiCssBaseline: {
            styleOverrides: `
        .MuiDataGrid-columnHeader:focus,
        .MuiDataGrid-columnHeader:focus-within,
        .MuiDataGrid-cell:focus-within,
        .MuiDataGrid-cell:focus {
          outline: none !important;
        },
        .allowWrap.MuiDataGrid-cell {
            white-space:normal !important;
        }
        a.MuiLink-root {
            font-size: 0.875rem;
        }
        .MuiDataGrid-iconSeparator:last-child {
            display:none !important;
        },
      `,
        },
    },
    typography: {
        button: {
            textTransform: 'none',
        },
    },
});

export default theme;
