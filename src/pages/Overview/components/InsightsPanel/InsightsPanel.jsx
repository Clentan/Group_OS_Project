import React from 'react';
import './InsightsPanel.css';

const InsightsPanel = () => {
  const insightMetrics = [
    { label: 'Deadlocks Detected', value: '4' },
    { label: 'Average Resolution Time', value: '2.1s' },
    { label: 'System Availability', value: '98.7%' },
    { label: 'Total Resource Locks', value: '112' }
  ];

  return (
    <div className="dashboard-panel insights-panel">
      <h2>View Insights</h2>
      <div className="insights-content">
        <p>Real-time monitoring of resource conflicts and resolution times</p>
        <div className="insights-metrics">
          {insightMetrics.map((insight, index) => (
            <div key={index} className="insight-item">
              <span className="insight-label">{insight.label}</span>
              <span className="insight-value">{insight.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;