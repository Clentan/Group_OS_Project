import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SystemMetrics from '../simulation/SystemMetrics';
import ProcessPool from '../simulation/ProcessPool';
import ResourcePool from '../simulation/ResourcePool';
import ControlsStatus from '../simulation/ControlsStatus';
import { useSimulation } from '../../context/SimulationContext';
import useTimer from '../../hooks/useTimer';

const MainLayout = () => {
  const { state } = useSimulation();
  const timer = useTimer();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header timer={timer} metrics={state.metrics} />
        <section className="panels">
          <SystemMetrics metrics={state.metrics} />
          <ProcessPool processes={state.processes} />
          <ResourcePool resources={state.resources} />
          <ControlsStatus timer={timer} simulation={state.simulation} />
        </section>
      </main>
    </div>
  );
};

export default MainLayout;