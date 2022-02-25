import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import AuthPage from '../AuthPage';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import Link from '../../components/Link';
import loginSchema from '../../validation/loginSchema';

export default function Login() {

    const history = useHistory();

    const [state, setState] = useState({
        fieldValues: {},
        isLoading: false,
    });

    const onSubmit = (data: any) => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');

        setState({ ...state, isLoading: true });
        apiClient.post('/login', data, false)
            .then((response) => {
                setState({ ...state, isLoading: false });
                PubSub.publishSync('AUTH.LOGIN', {
                    accessToken: response.data.access_token,
                    userInfo: response.data.user,
                });
                history.push('/');
            })
            .catch((response) => {
                setState({ ...state, isLoading: false })
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

