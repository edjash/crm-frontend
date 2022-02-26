import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import ModalProvider from 'mui-modal-provider';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SessionExpiredDialog from '../components/Dialogs/SessionExpiredDialog';
import Toast from '../components/Toast';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Home } from '../routes/Home';
import { Login } from '../routes/Login';
import PrivateRoute from '../routes/PrivateRoute';
import { Register } from '../routes/Register';
import theme from '../theme';
import { AppContextProvider } from './AppContext';

interface AppState {
    loggedIn: boolean;
    userInfo: Record<string, string> | null;
    sessionExpired: boolean;
}

interface LoginData {
    userInfo: Record<string, string>;
}

export default function App() {

    const [state, setState] = useState<AppState>(() => {
        const user = localStorage.getItem('userInfo');
        return {
            loggedIn: !!(user),
            userInfo: (user) ? JSON.parse(user) : null,
            sessionExpired: false,
        };
    });

    useEffect(() => {
        document.title = import.meta.env.VITE_APP_TITLE;

        PubSub.subscribe('AUTH.LOGIN', (msg: string, data: LoginData) => {
            if (data?.userInfo) {
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
                setState(state => ({
                    ...state,
                    loggedIn: true,
                    userInfo: data.userInfo,
                    sessionExpired: false,
                }));
            }
        });

        PubSub.subscribe('AUTH.LOGOUT', () => {
            localStorage.removeItem('userInfo');
            setState(state => ({ ...state, loggedIn: false }));
        })

        PubSub.subscribe('AUTH.TIMEOUT', () => {
            setState(state => ({ ...state, sessionExpired: true }));
        });

        return () => {
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
                <SessionExpiredDialog
                    open={state.sessionExpired}
                    userInfo={state.userInfo}
                />
            </ModalProvider>
        </ThemeProvider>
    );
}
