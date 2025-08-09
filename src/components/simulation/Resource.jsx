import React from 'react';
import ProgressBar from '../ui/ProgressBar';

const Resource = ({ resource }) => {
  const getProgressVariant = (id) => {
    switch(id) {
      case 'DB': return 'db';
      case 'FILE': return 'file';
      case 'NET': return 'net';
      case 'LOCK': return 'lock';
      default: return 'default';
    }
  };

  return (
    <div className="resource" id={`resource${resource.id}`}>
      <div className="resource-icon">
        <i className={resource.icon}></i> {resource.id}
      </div>
      <ProgressBar 
        value={resource.usage} 
        variant={getProgressVariant(resource.id)}
      />
      <div className="usage-text">Usage</div>
      <div className="access-text">Access: {resource.access}ms</div>
      <div className="resource-count">{resource.count}</div>
    </div>
  );
};

export default Resource;