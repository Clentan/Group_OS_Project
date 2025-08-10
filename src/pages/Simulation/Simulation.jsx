import React from 'react';
import Header from './Header/Header';
import SystemMetrics from './metrics/SystemMetrics/SystemMetrics';
import ProcessPool from './pools/ProcessPool/ProcessPool';
import ResourcePool from './pools/ResourcePool/ResourcePool';
import ControlsStatus from './controls/ControlsStatus/ControlsStatus';
import './Simulation.css';

function Simulation({ setCurrentPage }) {
  const handleResourceExplorer = () => {
    setCurrentPage('Resource Explorer');
  };

  return (
    <div className="simulation-container">
      <Header />
      <section className="simulation-panels">
        <SystemMetrics />
        <ProcessPool />
        <ResourcePool />
        <ControlsStatus />
      </section>
      
      {/* New Resource Explorer Button */}
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