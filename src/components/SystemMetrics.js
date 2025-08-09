import React from 'react';

const SystemMetrics = () => {
  const metrics = [
    { label: 'CPU', progress: 45, className: 'cpu-progress' },
    { label: 'Memory', progress: 78, className: 'memory-progress' },
    { label: 'Disk I/O', progress: 32, className: 'disk-progress' },
  ];

  return (
    <section className="panel system-metrics">
      <h2>System Metrics</h2>
      {metrics.map((metric, index) => (
        <div key={index} className="metric">
          <label>{metric.label}</label>
          <div className="progress-bar">
            <div 
              className={`progress ${metric.className}`} 
              style={{ width: `${metric.progress}%` }}
            ></div>
          </div>
          <span className="percent">{metric.progress}%</span>
        </div>
      ))}
      <div className="metric-stats">
        <span>Requests: 156</span>
        <span>Success: 134</span>
        <span>Avg Wait: 2.3s</span>
      </div>
    </section>
  );
};

export default SystemMetrics;