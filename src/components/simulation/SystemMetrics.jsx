import React from 'react';
import ProgressBar from '../ui/ProgressBar';

const SystemMetrics = ({ metrics }) => {
  return (
    <section className="panel system-metrics">
      <h2>System Metrics</h2>
      <div className="metric">
        <label>CPU</label>
        <ProgressBar value={metrics.cpu} variant="cpu" />
        <span className="percent">{metrics.cpu}%</span>
      </div>
      <div className="metric">
        <label>Memory</label>
        <ProgressBar value={metrics.memory} variant="memory" />
        <span className="percent">{metrics.memory}%</span>
      </div>
      <div className="metric">
        <label>Disk I/O</label>
        <ProgressBar value={metrics.diskIO} variant="disk" />
        <span className="percent">{metrics.diskIO}%</span>
      </div>
      <div className="metric-stats">
        <span>Requests: {metrics.requests}</span>
        <span>Success: {metrics.success}</span>
        <span>Avg Wait: {metrics.avgWait}s</span>
      </div>
    </section>
  );
};

export default SystemMetrics;