import React from 'react';
import './ControlsStatus.css';

const ControlsStatus = () => {
  const buttons = [
    { label: '▶ Start', className: 'controls__btn--start' },
    { label: '⏸ Pause', className: 'controls__btn--pause' },
    { label: '⟲ Reset', className: 'controls__btn--reset' },
    { label: '🔍 Scan', className: 'controls__btn--scan' },
    { label: '⚡ Resolve', className: 'controls__btn--resolve' },
    { label: '☠ Force Lock', className: 'controls__btn--force' },
  ];

  return (
    <section className="panel controls-status">
      <div className="controls">
        {buttons.map((button, index) => (
          <button key={index} className={`controls__btn ${button.className}`}>
            {button.label}
          </button>
        ))}
      </div>
      <div className="system-status">
        <h3 className="system-status__title">System Status</h3>
        <div className="system-status__info">System ready...</div>
      </div>
    </section>
  );
};

export default ControlsStatus;