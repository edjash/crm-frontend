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
        .formIconButton .MuiSvgIcon-root {
            color: #9e9e9e;
        }
        .formIconButton:hover .MuiSvgIcon-root {
            color: #ffffff;
        }
        .pullToRefreshtext {
            display:none;
        }
        .pullToRefreshicon {
            color:#FFFFFF !important;
        },
        .pullToRefreshptr {
            position:absolute !important;
            color:white;
            z-index: 1200 !important;
        }
        .pullToRefreshicon: {
            color: #FFFFFF;
            background:#FFFFFF;
            transform: none !important;
            transition: none !important;

        },
        .pullToRefreshrelease .pullToRefreshicon {
            transform: none !important;
          }
        "@keyframes spin": {
            from {transform: rotate(0deg)}
            to {transform: rotate(360deg)}
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
