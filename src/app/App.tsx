import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from 'mui-modal-provider';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Toaster from '../components/Toaster';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Home } from '../routes/Home';
import { Login } from '../routes/Login';
import PrivateRoute from '../routes/PrivateRoute';
import { Register } from '../routes/Register';
import theme from '../theme';
import { AppContextProvider } from './AppContext';
<<<<<<< HEAD
=======
import { APP_TITLE } from './constants';
>>>>>>> frontend/main

interface AppState {
    loggedIn: boolean;
    userInfo: Record<string, string> | null;
}

interface LoginData {
    userInfo: Record<string, string>;
}

export default function App() {

    const [state, setState] = useState<AppState>(() => {
        let user = localStorage.getItem('userInfo');
        if (!document.cookie.split(';').some(
            item => item.trim().startsWith('XSRF-TOKEN='))) {
            user = null;
            localStorage.setItem('userInfo', '');
        }

        return {
            loggedIn: !!(user),
            userInfo: (user) ? JSON.parse(user) : null,
        };
    });

    useEffect(() => {
<<<<<<< HEAD
        document.title = import.meta.env.VITE_APP_TITLE;
=======
        document.title = APP_TITLE;
>>>>>>> frontend/main

        PubSub.subscribe('AUTH.LOGIN', (msg: string, data: LoginData) => {
            if (data?.userInfo) {
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                setState(state => ({
                    ...state,
                    loggedIn: true,
                    userInfo: data.userInfo,
                }));
            }
        });

        PubSub.subscribe('AUTH.LOGOUT', () => {
            localStorage.removeItem('userInfo');
            setState(state => ({ ...state, loggedIn: false }));
        })

        return () => {
            PubSub.unsubscribe('AUTH');
        }
    }, []);

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
                            >
                            </PrivateRoute>
                        </Switch>
                    </Router>
                </AppContextProvider>
                <Toaster />
            </ModalProvider>
        </ThemeProvider>
    );
}
