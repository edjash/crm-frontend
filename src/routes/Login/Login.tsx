import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import AuthPage from '../../components/AuthPage';
import { errorResponse } from '../../components/FormError';
import LoginForm from './Login.Form';

export default function Login() {
  const history = useHistory();

  const [state, setState] = useState({
    fieldValues: {},
    isLoading: false,
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
    setState({ ...state, isLoading: true });

    apiClient.post(
      '/login',
      {
        ...state.fieldValues,
      },
      false
    )
      .then((response) => {
        setState({ ...state, isLoading: false });
        PubSub.publishSync('AUTH.LOGIN', {
          accessToken: response.data.access_token
        });
        history.push('/');
      })
      .catch((error) => {
        setState({ ...state, isLoading: false });
        errorResponse(error);
      });
  };

  return (
    <AuthPage title="Sign In" isLoading={state.isLoading}>
      <LoginForm onChange={onChange} onSubmit={onSubmit} />
    </AuthPage>
  );
}
