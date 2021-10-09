import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Contacts } from '../routes/Contacts';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Login } from '../routes/Login';
import { Register } from '../routes/Register';
import PrivateRoute from '../common/PrivateRoute';
import Toast, { IToastConfig } from './Toast';
import { AppContextProvider } from './AppContext';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

export default function App() {
  const [state, setState] = useState({
    loggedIn: localStorage.getItem('token') ? true : false,
    setLoginStatus: setLoginStatus,
    showToast: showToast,
    hideToast: hideToast,
  });

  const [toastState, setToastState] = useState({
    show: false,
    onClose: hideToast,
  });

  function setLoginStatus(loggedIn: boolean, accessToken: string) {
    if (loggedIn === true && accessToken) {
      localStorage.setItem('token', accessToken);
      setState({
        ...state,
        loggedIn: true,
      });

      showToast({
        ...toastState,
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

  function showToast(cfg: IToastConfig) {
    cfg.show = true;
    setToastState({ ...toastState, ...cfg });
  }

  function hideToast() {
    const cfg: IToastConfig = { show: false };
    setToastState({ ...toastState, ...cfg });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <AppContextProvider value={state}>
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <PrivateRoute
                path="/"
                component={Contacts}
                loggedIn={state.loggedIn}
              />
            </Switch>
          </Router>
        </AppContextProvider>
        <Toast {...toastState} />
      </Container>
    </ThemeProvider>
  );
}
