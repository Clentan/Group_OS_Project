import React, { useState } from 'react';
import { api } from '../../../api/client';
import './ControlsStatus.css';

const ControlsStatus = () => {
  const [status, setStatus] = useState('System ready...');

  const call = async (fn, label) => {
    try {
      setStatus(`${label}...`);
      await fn();
      setStatus(`${label} OK`);
    } catch (e) {
      setStatus(`${label} failed: ${e.message}`);
    }
  };

  const buttons = [
    { label: '▶ Start', className: 'controls__btn--start', onClick: () => call(api.start, 'Start') },
    { label: '⏸ Stop', className: 'controls__btn--pause', onClick: () => call(api.stop, 'Stop') },
    { label: '⟲ Reset', className: 'controls__btn--reset', onClick: () => call(() => api.reset(10, 6), 'Reset (10x6)') },
    { label: '🔍 Scan', className: 'controls__btn--scan', onClick: () => call(api.scan, 'Scan') },
    { label: '⚡ Resolve', className: 'controls__btn--resolve', onClick: () => call(() => api.resolve('min_cost'), 'Resolve') },
    { label: '☠ Force Lock', className: 'controls__btn--force', onClick: () => call(api.forceDeadlock, 'Force Deadlock') },
  ];

  return (
    <section className="panel controls-status">
      <div className="controls">
        {buttons.map((b, i) => (
          <button key={i} className={`controls__btn ${b.className}`} onClick={b.onClick}>
            {b.label}
          </button>
        ))}
      </div>
      <div className="system-status">
        <h3 className="system-status__title">System Status</h3>
        <div className="system-status__info">{status}</div>
      </div>
    </section>
  );
};

export default ControlsStatus;
