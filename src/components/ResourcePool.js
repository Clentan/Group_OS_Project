import React from 'react';

const ResourcePool = () => {
  const resources = [
    { icon: 'fas fa-database', name: 'DB', progress: 67, className: 'db-progress', access: '150ms', count: '1/3' },
    { icon: 'fas fa-file', name: 'FILE', progress: 100, className: 'file-progress', access: '89ms', count: '0/2' },
    { icon: 'fas fa-network-wired', name: 'NET', progress: 25, className: 'net-progress', access: '45ms', count: '3/4' },
    { icon: 'fas fa-lock', name: 'LOCK', progress: 100, className: 'lock-progress', access: '200ms', count: '0/2' },
  ];

  return (
    <section className="panel resource-pool">
      <h2>Resource Pool</h2>
      {resources.map((resource, index) => (
        <div key={index} className="resource" id={`resource${resource.name}`}>
          <div className="resource-icon">
            <i className={resource.icon}></i> {resource.name}
          </div>
          <div className="progress-bar">
            <div 
              className={`progress ${resource.className}`} 
              style={{ width: `${resource.progress}%` }}
            ></div>
          </div>
          <div className="usage-text">Usage</div>
          <div className="access-text">Access: {resource.access}</div>
          <div className="resource-count">{resource.count}</div>
        </div>
      ))}
    </section>
  );
};

export default ResourcePool;