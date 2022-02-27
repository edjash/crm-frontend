import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient, { csrfCookieExists } from '../../components/apiClient';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import Link from '../../components/Link';
import loginSchema from '../../validation/loginSchema';
import AuthPage from '../AuthPage';

export default function Login() {

    const history = useHistory();

    const [state, setState] = useState({
        fieldValues: {},
        isLoading: false,
    });

    const onSubmit = (data: any) => {
        localStorage.removeItem('userInfo');
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

                PubSub.publishSync('AUTH.LOGIN', {
                    userInfo: response.data.user,
                });
                history.push('/');
            })
            .catch((response) => {
                setState({ ...state, isLoading: false });
                PubSub.publishSync('TOAST.SHOW', {
                    message: "An unexpected error occurred logging you in.",
                    type: 'error',
                    autoHide: false,
                });
                //apiClient.showErrors(response, formMethods.setError);
            });
    };


    const onSubmitError = (data: any) => {
        console.log(data);
    }

    return (
        <AuthPage title="Sign In" isLoading={state.isLoading}>
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
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>
                        Sign In
                    </Button>
                    <Box display="flex" justifyContent="space-between">
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

