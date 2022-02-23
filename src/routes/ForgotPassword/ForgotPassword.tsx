import {
    useState,
    ChangeEvent,
    ReactNode,
    SyntheticEvent,
    useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import AuthPage from '../../components/AuthPage';
import ForgotPasswordStep1, {
    title as step1Title,
} from './ForgotPassword.Step1';
import ForgotPasswordStep2, {
    title as step2Title,
} from './ForgotPassword.Step2';
import ForgotPasswordStep3, {
    title as step3Title,
} from './ForgotPassword.Step3';
import { Box } from '@mui/system';

export default function ForgotPassword() {
    const history = useHistory();

    interface FieldValues {
        password?: string;
        confirmPassword?: string;
    }

    const [state, setState] = useState({
        isLoading: false,
        currentStep: 1,
        fieldValues: {} as FieldValues,
    });

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            fieldValues: {
                ...state.fieldValues,
                [e.target.name]: e.target.value.trim(),
            },
        });
    };

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        localStorage.removeItem('token');

        if (state.currentStep === 3) {
            if (
                state.fieldValues['password'] !== state.fieldValues['confirmPassword']
            ) {
                return showError(["Passwords don't match."]);
            }
        }

        setState({ ...state, isLoading: true });

        apiClient
            .post(
                '/forgot-password',
                {
                    ...state.fieldValues,
                    step: state.currentStep,
                },
                false
            )
            .then((response) => {
                setState({ ...state, isLoading: false });

                if (response.statusText === 'OK') {
                    if (state.currentStep === 3) {
                        history.push('/');

                        PubSub.publish('TOAST.SHOW', {
                            type: 'info',
                            autoHide: true,
                            message: 'Your password is now changed, please login.',
                        });
                        return;
                    }
                    setState({
                        ...state,
                        currentStep: state.currentStep + 1,
                        fieldValues: {
                            ...state.fieldValues,
                            ...response.data.fieldValues,
                        },
                    });
                }
            })
            .catch((error) => {
                setState({ ...state, isLoading: false });
                errorResponse(error);

                if (error?.data?.errorType == 'code_sent') {
                    alert('OK');
                }
            });
    };

    useEffect(() => {
        if (state.currentStep === 3) {
            PubSub.publish('TOAST.SHOW', {
                type: 'info',
                message: 'Code accepted, please enter a new password.',
                autoHide: true,
            });
        }
    }, [state.currentStep]);

    let form: ReactNode;
    let title = '';

    switch (state.currentStep) {
        case 1:
        default:
            title = step1Title;
            form = <ForgotPasswordStep1 onChange={onChange} onSubmit={onSubmit} />;
            break;
        case 2:
            title = step2Title;
            form = <ForgotPasswordStep2 onChange={onChange} onSubmit={onSubmit} />;
            break;
        case 3:
            title = step3Title;
            form = <ForgotPasswordStep3 onChange={onChange} onSubmit={onSubmit} />;
            break;
    }

    return (
        <AuthPage title={title} isLoading={state.isLoading}>
            <Box sx={{ display: 'grid', rowGap: 1 }}>
                {form}
            </Box>
        </AuthPage>
    );
}
