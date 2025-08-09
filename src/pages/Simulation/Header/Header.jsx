import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <i className="fas fa-lock"></i>
        <h1>Real-Time Deadlock Simulation</h1>
      </div>
      <div className="header__stats">
        <span>Time: <span id="timeStat">0.0s</span></span>
        <span>Throughput: <span id="throughputStat">0.0 req/s</span></span>
        <span>Deadlocks: <span id="deadlocksStat">2</span></span>
      </div>
    </header>
  );
};

export default Header;