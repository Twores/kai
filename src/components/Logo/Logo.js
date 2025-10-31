import React from 'react';
import './Logo.css';
import Icon from '../Icon/Icon';

const Logo = () => {
  return (
    <div className="logo-container">
      <Icon name="logi-enerance" width={500} height={113} className="logo-image" alt="КАИ логистик" />
    </div>
  );
};

export default Logo;
