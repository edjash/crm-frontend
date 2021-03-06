import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { APP_MODE, APP_URL, EVENTS } from '../../app/constants';
import apiClient, { clearSession, csrfCookieExists } from '../../components/apiClient';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import Link from '../../components/Link';
import useOnce from '../../hooks/useOnce';
import { login } from '../../store/reducers/auth/authSlice';
import loginSchema from '../../validation/loginSchema';
import AuthPage from '../AuthPage';

export default function Login() {

    const history = useHistory();
    const dispatch = useDispatch();

    const [state, setState] = useState({
        fieldValues: {},
        isLoading: false,
    });

    const lastError = useRef('');

    useOnce(() => {
        clearSession();
        if (APP_MODE === 'development') {
            const url = new URL(APP_URL);
            if (url.host !== window.location.host &&
                window.location.hostname === 'localhost') {
                window.location.href = APP_URL;
                return;
            }
        }
    });

    const onSubmit = (data: any) => {
        setState({ ...state, isLoading: true });

        apiClient.post('/login', data, { url: '/login' })
            .then((response) => {
                setState({ ...state, isLoading: false });

                if (!csrfCookieExists()) {
                    console.error("Auth Error: CSRF Cookie not set.");
                    PubSub.publishSync(EVENTS.TOAST, {
                        message: "An unexpected error occurred logging you in. Please retry later.",
                        type: 'error',
                        autoHide: false,
                    });
                    return;
                }

                dispatch(login({
                    userInfo: response.data.userInfo,
                    serverCfg: response.data.serverCfg
                }));
                history.push('/');
            })
            .catch((response) => {
                setState({ ...state, isLoading: false });
                lastError.current = `${response?.status}: ${response?.statusText} `
                    + response?.request?.responseText;

                PubSub.publishSync(EVENTS.TOAST, {
                    message: "An unexpected error occurred logging you in.",
                    type: 'error',
                    autoHide: false,
                });
                //apiClient.showErrors(response, formMethods.setError);
            });
    };

    const showError = () => {
        if (lastError.current) {
            return PubSub.publishSync(EVENTS.TOAST, {
                message: lastError.current,
                type: 'error',
                autoHide: false,
            });
        }
    }

    return (
        <AuthPage title="Sign In" isLoading={state.isLoading} onIconClick={showError}>
            <Form onSubmit={onSubmit} validationSchema={loginSchema}>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <Box display="grid" sx={{ rowGap: 1 }}>
                            <TextFieldEx
                                name="email"
                                label="Email Address"
                                required
                                autoComplete="username"
                            />
                            <TextFieldEx
                                name="password"
                                label="Password"
                                type="password"
                                required
                                autoComplete="current-password"
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ mt: 1, mb: 2 }}>
                                Sign In
                            </Button>
                            <Box display="grid" justifyContent="space-between" gap={1}>
                                <Link to="/forgot-password">
                                    Forgot password?
                                </Link>
                                <Link to="/register">
                                    Don't have an account? Sign Up!
                                </Link>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom mb={2}>
                            Alternative Login
                        </Typography>
                        <Button variant="contained" fullWidth onClick={() => {
                            onSubmit({
                                email: 'demo@crmdemo.co.uk',
                                password: 'demo123',
                            });
                        }}>
                            Login as Demo User
                        </Button>
                    </CardContent>
                </Card>
            </Form>
        </AuthPage>
    );
}

