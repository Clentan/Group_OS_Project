import React from 'react';
import './DeadlockChart.css';

const DeadlockChart = () => {
  // Static data for demonstration
  const chartData = [
    { time: '00:00', conflicts: 3, resolved: 5, partial: 1 },
    { time: '04:00', conflicts: 7, resolved: 4, partial: 2 },
    { time: '08:00', conflicts: 2, resolved: 8, partial: 1 },
    { time: '12:00', conflicts: 5, resolved: 6, partial: 3 },
    { time: '16:00', conflicts: 4, resolved: 7, partial: 2 },
    { time: '20:00', conflicts: 6, resolved: 5, partial: 1 },
  ];

  const maxValue = Math.max(...chartData.flatMap(d => [d.conflicts, d.resolved, d.partial]));

  return (
    <div className="dashboard-panel chart-panel">
      <div className="chart-header">
        <h2>Deadlock Resolution Logs</h2>
        <div className="chart-controls">
          <button className="control-btn active">Real-time</button>
          <button className="control-btn">Reset Data</button>
        </div>
      </div>
      
      <div className="chart-container">
        <div className="css-chart">
          <div className="chart-grid">
            {/* Y-axis labels */}
            <div className="y-axis">
              {[maxValue, Math.floor(maxValue * 0.75), Math.floor(maxValue * 0.5), Math.floor(maxValue * 0.25), 0].map((value, index) => (
                <div key={index} className="y-label">{value}</div>
              ))}
            </div>
            
            {/* Chart bars */}
            <div className="chart-bars">
              {chartData.map((data, index) => (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div 
                      className="bar conflicts" 
                      style={{ height: `${(data.conflicts / maxValue) * 100}%` }}
                      title={`Conflicts: ${data.conflicts}`}
                    ></div>
                    <div 
                      className="bar resolved" 
                      style={{ height: `${(data.resolved / maxValue) * 100}%` }}
                      title={`Resolved: ${data.resolved}`}
                    ></div>
                    <div 
                      className="bar partial" 
                      style={{ height: `${(data.partial / maxValue) * 100}%` }}
                      title={`Partial: ${data.partial}`}
                    ></div>
                  </div>
                  <div className="x-label">{data.time}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color conflicts"></div>
              <span>Resource Conflicts</span>
            </div>
            <div className="legend-item">
              <div className="legend-color resolved"></div>
              <span>Successful Resolution</span>
            </div>
            <div className="legend-item">
              <div className="legend-color partial"></div>
              <span>Partial Resolution</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Current Conflicts</span>
          <span className="stat-value conflicts">6</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Resolved</span>
          <span className="stat-value resolved">5</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Deadlocks</span>
          <span className="stat-value deadlocks">3</span>
        </div>
      </div>
    </div>
  );
};

export default DeadlockChart;