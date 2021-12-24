import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
    info: {
      main: '#263238',
    },
  },
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
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
  }
});

export default theme;
