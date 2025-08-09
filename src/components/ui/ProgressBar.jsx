import React from 'react';

const ProgressBar = ({ value, max = 100, variant = 'default' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getProgressClass = () => {
    switch(variant) {
      case 'cpu': return 'progress cpu-progress';
      case 'memory': return 'progress memory-progress';
      case 'disk': return 'progress disk-progress';
      case 'db': return 'progress db-progress';
      case 'file': return 'progress file-progress';
      case 'net': return 'progress net-progress';
      case 'lock': return 'progress lock-progress';
      default: return 'progress';
    }
  };

  return (
    <div className="progress-bar">
      <div 
        className={getProgressClass()}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;