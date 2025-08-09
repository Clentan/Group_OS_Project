import React from 'react';
import './ResourcePool.css';

const ResourcePool = () => {
  const resources = [
    { icon: 'fas fa-database', name: 'DB', progress: 67, className: 'resource__progress--db', access: '150ms', count: '1/3' },
    { icon: 'fas fa-file', name: 'FILE', progress: 100, className: 'resource__progress--file', access: '89ms', count: '0/2' },
    { icon: 'fas fa-network-wired', name: 'NET', progress: 25, className: 'resource__progress--net', access: '45ms', count: '3/4' },
    { icon: 'fas fa-lock', name: 'LOCK', progress: 100, className: 'resource__progress--lock', access: '200ms', count: '0/2' },
  ];

  return (
    <section className="panel resource-pool">
      <h2>Resource Pool</h2>
      {resources.map((resource, index) => (
        <div key={index} className="resource" id={`resource${resource.name}`}>
          <div className="resource__icon">
            <i className={resource.icon}></i> {resource.name}
          </div>
          <div className="resource__progress-bar">
            <div 
              className={`resource__progress ${resource.className}`} 
              style={{ width: `${resource.progress}%` }}
            ></div>
          </div>
          <div className="resource__usage">Usage</div>
          <div className="resource__access">Access: {resource.access}</div>
          <div className="resource__count">{resource.count}</div>
        </div>
      ))}
    </section>
  );
};

export default ResourcePool;