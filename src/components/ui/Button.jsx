import React from 'react';

const Button = ({ children, variant = 'default', onClick, disabled = false, ...props }) => {
  const getButtonClass = () => {
    const baseClass = 'btn';
    switch(variant) {
      case 'start': return `${baseClass} start-btn`;
      case 'pause': return `${baseClass} pause-btn`;
      case 'reset': return `${baseClass} reset-btn`;
      case 'scan': return `${baseClass} scan-btn`;
      case 'resolve': return `${baseClass} resolve-btn`;
      case 'danger': return `${baseClass} force-lock-btn`;
      default: return baseClass;
    }
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;