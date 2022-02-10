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
import Toast from '../components/Toast';

interface LoginData {
    accessToken: string;
}

export default function App() {

    const [state, setState] = useState({
        loggedIn: localStorage.getItem('token') ? true : false,
    });

    useEffect(() => {
        document.title = import.meta.env.VITE_APP_TITLE;
    }, []);

    useEffect(() => {
        PubSub.subscribe('AUTH.LOGIN', (msg: string, data: LoginData) => {
            if (!data?.accessToken) {
                return false;
            }
            localStorage.setItem('token', data.accessToken);
            setState(state => ({
                ...state,
                loggedIn: true,
            }));

            PubSub.publish('TOAST.SHOW', {
                show: true,
                message: 'Logged In',
                type: 'info',
                autoHide: true,
            });

            return true;
        });

        PubSub.subscribe('AUTH.LOGOUT', () => {
            localStorage.removeItem('token');
            setState(state => ({ ...state, loggedIn: false }));
        })

        return () => {
            localStorage.removeItem('token');
            PubSub.unsubscribe('AUTH');
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ModalProvider beta={true}>
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
            </ModalProvider>
        </ThemeProvider>
    );
}
