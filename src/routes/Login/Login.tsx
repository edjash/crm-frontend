import { Box, Button } from '@mui/material';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient, { csrfCookieExists, clearSession } from '../../components/apiClient';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import Link from '../../components/Link';
import useOnce from '../../hooks/useOnce';
import loginSchema from '../../validation/loginSchema';
import AuthPage from '../AuthPage';
import { APP_URL, APP_MODE } from '../../app/constants';
import { useDispatch } from 'react-redux';
import { login } from '../../store/reducers/auth/authSlice';

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
                    PubSub.publishSync('TOAST.SHOW', {
                        message: "An unexpected error occurred logging you in. Please retry later.",
                        type: 'error',
                        autoHide: false,
                    });
                    return;
                }

                dispatch(login(response.data.userInfo));
                history.push('/');
            })
            .catch((response) => {
                setState({ ...state, isLoading: false });
                lastError.current = `${response?.status}: ${response?.statusText} `
                    + response?.request?.responseText;

                PubSub.publishSync('TOAST.SHOW', {
                    message: "An unexpected error occurred logging you in.",
                    type: 'error',
                    autoHide: false,
                });
                //apiClient.showErrors(response, formMethods.setError);
            });
    };

    const showError = () => {
        if (lastError.current) {
            return PubSub.publishSync('TOAST.SHOW', {
                message: lastError.current,
                type: 'error',
                autoHide: false,
            });
        }
    }

    return (
        <AuthPage title="Sign In" isLoading={state.isLoading} onIconClick={showError}>
            <Form onSubmit={onSubmit} validationSchema={loginSchema}>
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
            </Form>
        </AuthPage>
    );
}

