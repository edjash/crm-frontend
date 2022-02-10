import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import AuthPage from '../../components/AuthPage';
import Link from '../../components/Link';
import TextFieldEx from '../../components/TextFieldEx';
import registerSchema from '../../validation/registerSchema';


export default function Register() {

    const history = useHistory();

    const [state, setState] = useState({
        isLoading: false,
        disabled: (import.meta.env.VITE_MODE == 'Production'),
    });

    const { register, handleSubmit, setError, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = (data: object) => {

        setState({ ...state, isLoading: true });
        localStorage.removeItem('token');

        apiClient.post('/register', data, false)
            .then((response) => {
                setState({ ...state, isLoading: false });
                if (response.statusText === 'OK') {
                    PubSub.publishSync('AUTH.LOGIN', {
                        accessToken: response.data.access_token
                    });
                    history.push('/');
                }
            })
            .catch((response) => {
                setState({ ...state, isLoading: false });
                apiClient.showErrors(response, setError);
            });
    };

    return (
        <AuthPage title="Register" isLoading={state.isLoading}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {state.disabled &&
                    <h2>Registration is disabled for this demo</h2>
                }
                <Box sx={{ display: 'grid', rowGap: 1 }}>
                    <TextFieldEx
                        label="Email Address"
                        {...register('email')}
                        errors={errors?.email}
                        required
                        autoComplete="username"
                    />
                    <TextFieldEx
                        label="Password"
                        {...register('password')}
                        errors={errors?.password}
                        required
                        autoComplete="new-password"
                    />
                    <TextFieldEx
                        label="Confirm Password"
                        {...register('confirmPassword')}
                        errors={errors?.confirmPassword}
                        required
                        autoComplete="new-password"
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" disabled={state.disabled} sx={{ mt: 1 }}>
                        Register
                    </Button>
                    <Link to="/login">
                        Already have an account? Sign in
                    </Link>
                </Box>
            </form>
        </AuthPage>
    );
}
