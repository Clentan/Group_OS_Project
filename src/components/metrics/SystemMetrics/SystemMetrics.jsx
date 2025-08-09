import React, { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import './SystemMetrics.css';

const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));

const SystemMetrics = () => {
  const [m, setM] = useState({ cpu: 0, mem_mb: 0, threads_alive: 0, resources: 0 });

  useEffect(() => {
    let t = setInterval(async () => {
      try { setM(await api.metrics()); } catch {}
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const cpu = clamp(m.cpu);
  const memPercent = clamp((m.mem_mb / 2048) * 100); // naive bar (normalize to 2GB for display)

  return (
    <section className="panel metrics">
      <h2>System Metrics</h2>

      <div className="metrics__item">
        <label className="metrics__label">CPU</label>
        <div className="metrics__progress-bar"><div className="metrics__progress metrics__progress--cpu" style={{ width: `${cpu}%` }}></div></div>
        <span className="metrics__percent">{cpu}%</span>
      </div>

      <div className="metrics__item">
        <label className="metrics__label">Memory</label>
        <div className="metrics__progress-bar"><div className="metrics__progress metrics__progress--memory" style={{ width: `${memPercent}%` }}></div></div>
        <span className="metrics__percent">{m.mem_mb?.toFixed?.(1)} MB</span>
      </div>

      <div className="metrics__stats">
        <span>Threads alive: {m.threads_alive}</span>
        <span>Resources: {m.resources}</span>
      </div>
    </section>
  );
};

export default SystemMetrics;
