import React from 'react';
import Header from './Header/Header';
import SystemMetrics from './metrics/SystemMetrics/SystemMetrics';
import ProcessPool from './pools/ProcessPool/ProcessPool';
import ResourcePool from './pools/ResourcePool/ResourcePool';
import ControlsStatus from './controls/ControlsStatus/ControlsStatus';
import './Simulation.css';

function Simulation() {
  return (
    <div className="simulation-container">
      <Header />
      <section className="simulation-panels">
        <SystemMetrics />
        <ProcessPool />
        <ResourcePool />
        <ControlsStatus />
      </section>
    </div>
  );
}

export default Simulation;