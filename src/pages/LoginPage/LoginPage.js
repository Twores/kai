import React from 'react';
import Logo from '../../components/Logo/Logo';
import LoginForm from '../../components/LoginForm/LoginForm';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-page">
      <div className="login-content">
        <Logo />
        <LoginForm onSuccess={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
