import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, change, status, color }) => {
  return (
    <div className={`metric-card metric-card--${color}`}>
      <div className="metric-card__header">
        <h3>{title}</h3>
        {change && <span className="metric-card__change">{change}</span>}
      </div>
      <div className="metric-card__value">{value}</div>
      <div className={`metric-card__status metric-card__status--${color}`}>
        {status}
      </div>
    </div>
  );
};

export default MetricCard;