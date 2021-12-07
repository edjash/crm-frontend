import { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home } from '../routes/Home';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Login } from '../routes/Login';
import { Register } from '../routes/Register';
import PrivateRoute from '../components/PrivateRoute';
import Toast from './Toast';
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
                  component={Home}
                  loggedIn={state.loggedIn}
                />
              </Switch>
            </Router>
          </AppContextProvider>
          <Toast />
        </Container>
      </ModalProvider>
    </ThemeProvider>
  );
}
