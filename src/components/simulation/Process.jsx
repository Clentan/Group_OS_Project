import React from 'react';
import StatusIndicator from '../ui/StatusIndicator';

const Process = ({ process }) => {
  return (
    <div className="process" id={`process${process.id}`}>
      <StatusIndicator status={process.status} />
      <div className="process-info">
        <div><strong>{process.id}</strong></div>
        <div>Exec: {process.execTime}s</div>
        <div>Holds: [{process.holds.join(',')}]</div>
        <div>Wants: [{process.wants.join(',')}]</div>
      </div>
    </div>
  );
};

export default Process;