import { useState, useContext, ChangeEvent, SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import apiClient from '../../common/apiClient';
import { errorResponse } from '../../common/FormError';
import AuthPage from '../../common/AuthPage';
import RegisterForm from './Register.Form';
import { useAppContext } from '../../app/AppContext';

export default function Register() {
  const appContext = useAppContext();

  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, showLoading] = useState(false);

  const showError = (message: string, errorList: string[]) => {
    appContext.showToast({
      show: true,
      message: message,
      list: errorList,
      type: 'error',
    });
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    showLoading(true);
    localStorage.removeItem('token');

    apiClient
      .post(
        '/register',
        {
          email: email,
          password: password,
          password_confirmation: confirmPassword,
        },
        false
      )
      .then((response) => {
        showLoading(false);
        if (response.statusText === 'OK') {
          appContext.setLoginStatus(true, response.data['access_token']);
          history.push('/');
        }
      })
      .catch((error) => {
        showLoading(false);
        errorResponse(appContext, error);
      });
  };

  const validateFields = () => {
    const errors = [];
    if (password && password.length < 5) {
      errors.push('Password must contain at least 5 characters.');
    }
    if (confirmPassword && confirmPassword !== password) {
      errors.push("Passwords don't match.");
    }

    if (errors.length) {
      showError('Please correct the following:', errors);
      return false;
    }
    return true;
  };

  return (
    <AuthPage title="Register" isLoading={isLoading}>
      <RegisterForm onSubmit={onSubmit} onChange={onChange} />
    </AuthPage>
  );
}
