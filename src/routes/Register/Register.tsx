import { Box, Button, Card, CardContent } from '@mui/material';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import AuthPage from '../AuthPage';
import Form from '../../components/Form/Form';
import TextFieldEx from '../../components/Form/TextFieldEx';
import Link from '../../components/Link';
import registerSchema from '../../validation/registerSchema';
import { APP_MODE } from '../../app/constants';

export default function Register() {

    const history = useHistory();

    const [state, setState] = useState({
        isLoading: false,
        disabled: (APP_MODE === 'production'),
    });

    const onSubmit = (data: any) => {

        setState({ ...state, isLoading: true });
        localStorage.removeItem('userInfo');

        apiClient.post('/register', data)
            .then((response) => {
                setState({ ...state, isLoading: false });
                if (response.statusText === 'OK') {
                    PubSub.publishSync('AUTH.LOGIN', {
                        userInfo: response.data.user,
                    });
                    history.push('/');
                }
            })
            .catch((response) => {
                setState({ ...state, isLoading: false });
                //apiClient.showErrors(response, setError);
            });
    };

    return (
        <AuthPage title="Register" isLoading={state.isLoading}>
            <Form onSubmit={onSubmit} validationSchema={registerSchema}>
                {state.disabled &&
                    <h2>Registration is disabled for this demo</h2>
                }
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'grid', rowGap: 1 }}>
                            <TextFieldEx
                                label="Email Address"
                                name="email"
                                required
                                autoComplete="username"
                            />
                            <TextFieldEx
                                label="Password"
                                name="password"
                                required
                                autoComplete="new-password"
                            />
                            <TextFieldEx
                                label="Confirm Password"
                                name="confirmPassword"
                                required
                                autoComplete="new-password"
                            />
                            <Button type="submit" fullWidth variant="contained" color="primary" disabled={state.disabled} sx={{ mt: 1, mb: 2 }}>
                                Register
                            </Button>
                            <Link to="/login">
                                Already have an account? Sign in
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Form>
        </AuthPage>
    );
}
