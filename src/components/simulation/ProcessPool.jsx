import React from 'react';
import Process from './Process';

const ProcessPool = ({ processes }) => {
  return (
    <section className="panel process-pool">
      <h2>Process Pool</h2>
      {processes.map((process) => (
        <Process key={process.id} process={process} />
      ))}
    </section>
  );
};

export default ProcessPool;