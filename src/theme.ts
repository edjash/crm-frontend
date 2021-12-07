import { createTheme } from '@material-ui/core/styles';


// A custom theme for this app
const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#4db6ac',
      dark: '#212121',
      light: '#FFFFFF',
    },
    secondary: {
      main: '#616161',
      dark: '#616161',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
