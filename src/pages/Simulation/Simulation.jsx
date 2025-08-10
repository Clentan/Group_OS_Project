import React, { useState } from 'react';
import Header from './Header/Header';
import SystemMetrics from './metrics/SystemMetrics/SystemMetrics';
import ProcessPool from './pools/ProcessPool/ProcessPool';
import ResourcePool from './pools/ResourcePool/ResourcePool';
import ControlsStatus from './controls/ControlsStatus/ControlsStatus';
import './Simulation.css';

function Simulation({ setCurrentPage, setSystemLogs }) {
  const [allocatedResources, setAllocatedResources] = useState([]);

  const handleResourceExplorer = () => {
    setCurrentPage('Resource Explorer');
  };

  const handleResourceAllocation = (newAllocations) => {
    setAllocatedResources(newAllocations);
  };

  const handleLogsUpdate = (logs) => {
    setSystemLogs(logs);
  };

  return (
    <div className="simulation-container">
      <Header />
      <section className="simulation-panels">
        <SystemMetrics />
        <ProcessPool 
          allocatedResources={allocatedResources}
        />
        <ResourcePool />
        <ControlsStatus 
          onResourceAllocation={handleResourceAllocation}
          setCurrentPage={setCurrentPage}
          onLogsUpdate={handleLogsUpdate}
        />
      </section>
      
      <div className="simulation-actions">
        <button 
          className="resource-explorer-btn"
          onClick={handleResourceExplorer}
        >
          <i className="fas fa-search"></i>
          Explore Resource Types
        </button>
      </div>
    </div>
  );
}

export default Simulation;