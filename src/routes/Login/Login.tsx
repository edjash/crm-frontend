import { useState, SyntheticEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../components/apiClient';
import { errorResponse } from '../../components/FormError';
import AuthPage from '../../components/AuthPage';
import LoginForm from './Login.Form';
import { useAppContext } from '../../app/AppContext';

export default function Login() {
  const appContext = useAppContext();
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

    apiClient
      .post(
        '/login',
        {
          ...state.fieldValues,
        },
        false
      )
      .then((response) => {
        setState({ ...state, isLoading: false });
        if (response.statusText === 'OK') {
          appContext.setLoginStatus(true, response.data.access_token);
          appContext.showToast({
            show: true,
            message: 'Successfully Logged In',
            autoHide: true,
          });
          history.push('/');
        }
      })
      .catch((error) => {
        setState({ ...state, isLoading: false });
        errorResponse(appContext, error);
      });
  };

  return (
    <AuthPage title="Sign In" isLoading={state.isLoading}>
      <LoginForm onChange={onChange} onSubmit={onSubmit} />
    </AuthPage>
  );
}
