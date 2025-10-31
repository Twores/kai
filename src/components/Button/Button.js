import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', disabled, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;



