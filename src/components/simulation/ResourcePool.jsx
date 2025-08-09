import React from 'react';
import Resource from './Resource';

const ResourcePool = ({ resources }) => {
  return (
    <section className="panel resource-pool">
      <h2>Resource Pool</h2>
      {resources.map((resource) => (
        <Resource key={resource.id} resource={resource} />
      ))}
    </section>
  );
};

export default ResourcePool;