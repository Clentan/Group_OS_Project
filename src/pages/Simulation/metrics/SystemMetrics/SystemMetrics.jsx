import React from 'react';
import './SystemMetrics.css';

const SystemMetrics = () => {
  const metrics = [
    { label: 'CPU', progress: 45, className: 'metrics__progress--cpu' },
    { label: 'Memory', progress: 78, className: 'metrics__progress--memory' },
    { label: 'Disk I/O', progress: 32, className: 'metrics__progress--disk' },
  ];

  return (
    <section className="panel metrics">
      <h2>System Metrics</h2>
      {metrics.map((metric, index) => (
        <div key={index} className="metrics__item">
          <label className="metrics__label">{metric.label}</label>
          <div className="metrics__progress-bar">
            <div 
              className={`metrics__progress ${metric.className}`} 
              style={{ width: `${metric.progress}%` }}
            ></div>
          </div>
          <span className="metrics__percent">{metric.progress}%</span>
        </div>
      ))}
      <div className="metrics__stats">
        <span>Requests: 156</span>
        <span>Success: 134</span>
        <span>Avg Wait: 2.3s</span>
      </div>
    </section>
  );
};

export default SystemMetrics;