import React from 'react';

const ProcessPool = () => {
  const processes = [
    { id: 'P1', status: 'green', exec: '2.5s', holds: '[1,0,1]', wants: '[0,1,0]' },
    { id: 'P2', status: 'yellow', exec: '1.8s', holds: '[0,1,0]', wants: '[0,0,1]' },
    { id: 'P3', status: 'green', exec: '3.2s', holds: '[1,0,0]', wants: '[0,1,0]' },
    { id: 'P4', status: 'red', exec: '0.9s', holds: '[0,1,0]', wants: '[1,0,0]' },
  ];

  return (
    <section className="panel process-pool">
      <h2>Process Pool</h2>
      {processes.map((process, index) => (
        <div key={index} className="process" id={`process${index + 1}`}>
          <div className={`status-indicator ${process.status}`}></div>
          <div className="process-info">
            <div><strong>{process.id}</strong></div>
            <div>Exec: {process.exec}</div>
            <div>Holds: {process.holds}</div>
            <div>Wants: {process.wants}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProcessPool;