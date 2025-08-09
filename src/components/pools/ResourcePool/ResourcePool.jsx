import React, { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import './ResourcePool.css';

const ResourcePool = () => {
  const [rows, setRows] = useState([]);
  const [tot, setTot] = useState({ free: 0, in_use: 0, waiting: 0, total: 0 });

  useEffect(() => {
    const tick = async () => {
      try {
        const { rows, totals } = await api.resources();
        setRows(rows); setTot(totals);
      } catch {}
    };
    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, []);

  return (
    <section className="panel resource-pool">
      <h2>Resource Pool (Free {tot.free} / {tot.total})</h2>
      {rows.map((r) => (
        <div key={r.resource} className="resource">
          <div className="resource__icon">{r.resource}</div>
          <div className="resource__usage">Holder: {r.holder}</div>
          <div className="resource__access">Waiting: {r.queued}</div>
          <div className="resource__count">{r.queue.join(', ')}</div>
        </div>
      ))}
    </section>
  );
};

export default ResourcePool;
