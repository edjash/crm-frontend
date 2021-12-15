import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from 'mui-modal-provider';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Home } from '../routes/Home';
import { Login } from '../routes/Login';
import { Register } from '../routes/Register';
import theme from '../theme';
import { AppContextProvider } from './AppContext';
import Toast from './Toast';

export default function App() {

  const [state, setState] = useState({
    loggedIn: localStorage.getItem('token') ? true : false,
    setLoginStatus: setLoginStatus,
  });

  function setLoginStatus(loggedIn: boolean, accessToken: string) {
    if (loggedIn === true && accessToken) {
      localStorage.setItem('token', accessToken);
      setState({
        ...state,
        loggedIn: true,
      });
      PubSub.publish('TOAST.SHOW', {
        show: true,
        message: 'Logged In',
        type: 'info',
        autoHide: true,
      });
    } else {
      localStorage.removeItem('token');
      setState({ ...state, loggedIn: false });
    }
  }

  useEffect(() => {
    document.title = import.meta.env.VITE_APP_TITLE;
  }, [])



  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModalProvider beta={true}>
        <AppContextProvider value={state}>
          <Container maxWidth="xl">
            <Router>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <PrivateRoute
                  path="/"
                  component={Home}
                  loggedIn={state.loggedIn}
                />
              </Switch>
            </Router>
          </Container>
        </AppContextProvider>
        <Toast />
      </ModalProvider>
    </ThemeProvider>
  );
}
