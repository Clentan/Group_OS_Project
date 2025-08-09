import React from 'react';

const Header = () => {
  return (
    <header className="top-header">
      <div className="header-left">
        <i className="fas fa-lock"></i>
        <h1>Real-Time Deadlock Simulation</h1>
      </div>
      <div className="header-stats">
        <span>Time: <span id="timeStat">0.0s</span></span>
        <span>Throughput: <span id="throughputStat">0.0 req/s</span></span>
        <span>Deadlocks: <span id="deadlocksStat">2</span></span>
      </div>
    </header>
  );
};

export default Header;