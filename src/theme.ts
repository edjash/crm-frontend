import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
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
