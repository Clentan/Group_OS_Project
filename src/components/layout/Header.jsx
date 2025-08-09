import React from 'react';
import MetricDisplay from '../common/MetricDisplay';

const Header = ({ timer, metrics }) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <i className="fas fa-lock"></i>
        <h1>Real-Time Deadlock Simulation</h1>
      </div>
      <div className="header-stats">
        <MetricDisplay 
          label="Time" 
          value={timer.formattedTime}
          className={timer.isRunning ? 'running' : 'paused'}
        />
        <MetricDisplay 
          label="Throughput" 
          value={`${metrics.throughput.toFixed(1)} req/s`}
        />
        <MetricDisplay 
          label="Deadlocks" 
          value={metrics.deadlocks}
          className={metrics.deadlocks > 0 ? 'warning' : 'normal'}
        />
      </div>
    </header>
  );
};

export default Header;