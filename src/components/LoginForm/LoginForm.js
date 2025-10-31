import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { login } from '../../services/api';
import './LoginForm.css';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.login, formData.password);
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input
        label="Логин:"
        type="text"
        name="login"
        value={formData.login}
        onChange={handleChange}
        placeholder="Введите логин"
      />
      <Input
        label="Пароль:"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль"
      />
      {error && <div className="login-error">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Вход...' : 'Войти'}
      </Button>
    </form>
  );
};

export default LoginForm;
