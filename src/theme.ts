import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    info: {
      main: '#CCCCCC',
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
        body, html, #root {
          width: 100%;
          height: 100vh;
          overflow-x:hidden;
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
