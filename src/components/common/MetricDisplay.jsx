import React from 'react';

const MetricDisplay = ({ label, value, className = '' }) => {
  return (
    <span className={`metric-display ${className}`}>
      {label}: <span className="metric-value">{value}</span>
    </span>
  );
};

export default MetricDisplay;