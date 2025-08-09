import React from 'react';
import './ResolutionLogs.css';

const ResolutionLogs = () => {
  const statsData = [
    { value: '4', label: 'Deadlocks Detected' },
    { value: '2.1s', label: 'Average Resolution Time' },
    { value: '98.7%', label: 'System Availability' },
    { value: '112', label: 'Total Resource Locks' }
  ];

  return (
    <div className="dashboard-panel logs-panel">
      <h2>Deadlock Resolution Logs</h2>
      <div className="logs-content">
        <p>Real-time monitoring of resource conflicts and resolution times</p>
        <div className="logs-stats">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResolutionLogs;