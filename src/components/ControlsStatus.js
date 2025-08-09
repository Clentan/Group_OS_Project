import React from 'react';

const ControlsStatus = () => {
  const buttons = [
    { label: '▶ Start', className: 'start-btn' },
    { label: '⏸ Pause', className: 'pause-btn' },
    { label: '⟲ Reset', className: 'reset-btn' },
    { label: '🔍 Scan', className: 'scan-btn' },
    { label: '⚡ Resolve', className: 'resolve-btn' },
    { label: '☠ Force Lock', className: 'force-lock-btn' },
  ];

  return (
    <section className="panel controls-status">
      <div className="controls">
        {buttons.map((button, index) => (
          <button key={index} className={`btn ${button.className}`}>
            {button.label}
          </button>
        ))}
      </div>
      <div className="system-status">
        <h3>System Status</h3>
        <textarea readOnly defaultValue="System ready..."></textarea>
      </div>
    </section>
  );
};

export default ControlsStatus;