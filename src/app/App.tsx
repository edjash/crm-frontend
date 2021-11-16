import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Contacts } from '../routes/Contacts';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Login } from '../routes/Login';
import { Register } from '../routes/Register';
import PrivateRoute from '../common/PrivateRoute';
import Toast, { ToastConfig } from './Toast';
import { AppContextProvider } from './AppContext';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';
import ModalProvider from 'mui-modal-provider';

export default function App() {

  const [state, setState] = useState({
    loggedIn: localStorage.getItem('token') ? true : false,
    setLoginStatus: setLoginStatus,
    showToast: showToast,
    hideToast: hideToast
  });

  const [toastState, setToastState] = useState<ToastConfig>({
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

  function showToast(cfg: ToastConfig) {
    cfg.show = true;
    setToastState({ ...toastState, ...cfg });
  }

  function hideToast() {
    const cfg: ToastConfig = { show: false };
    setToastState({ ...toastState, ...cfg });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ModalProvider beta={true}>
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
      </ModalProvider>
    </ThemeProvider>
  );
}
