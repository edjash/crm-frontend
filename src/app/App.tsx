import ModalProvider from 'mui-modal-provider';
import ThemeProvider from '../components/ThemeProvider';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Toaster from '../components/Toaster';
import { ForgotPassword } from '../routes/ForgotPassword';
import { Home } from '../routes/Home';
import { Login } from '../routes/Login';
import PrivateRoute from '../routes/PrivateRoute';
import { Register } from '../routes/Register';
import { useStoreSelector } from '../store/store';
import { APP_TITLE } from './constants';
import './app.scss';

export default function App() {

    const auth = useStoreSelector(state => state.auth);

    useEffect(() => {
        document.title = APP_TITLE;
    }, []);

    return (
        <ThemeProvider>
            <ModalProvider beta={true}>
                <Router>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/forgot-password" component={ForgotPassword} />
                        <PrivateRoute
                            path="/"
                            component={Home}
                            loggedIn={auth.loggedIn}
                        >
                        </PrivateRoute>
                    </Switch>
                </Router>
                <Toaster />
            </ModalProvider>
        </ThemeProvider>
    );
}
