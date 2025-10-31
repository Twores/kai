import React, { useState } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import './App.css';

function App() {
  const [screen, setScreen] = useState('login');
  if (screen === 'dashboard') {
    return <DashboardPage />;
  }
  return <LoginPage onLogin={() => setScreen('dashboard')} />;
}

export default App;
