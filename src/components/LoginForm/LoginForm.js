import React, { useState } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './LoginForm.css';

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSuccess) onSuccess();
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
      <Button type="submit">Войти</Button>
    </form>
  );
};

export default LoginForm;
