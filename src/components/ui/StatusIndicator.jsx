import React from 'react';

const StatusIndicator = ({ status }) => {
  const getStatusClass = () => {
    switch(status) {
      case 'running': return 'status-indicator green';
      case 'waiting': return 'status-indicator yellow';
      case 'blocked': return 'status-indicator red';
      default: return 'status-indicator';
    }
  };

  return <div className={getStatusClass()}></div>;
};

export default StatusIndicator;