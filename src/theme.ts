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
        body {
            overscroll-behavior-y: none;
        },
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
        .formIconButton .MuiSvgIcon-root {
            color: #9e9e9e;
        }
        .formIconButton:hover .MuiSvgIcon-root {
            color: #ffffff;
        }
        fieldset {
            border:1px solid #484848;
        }
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
