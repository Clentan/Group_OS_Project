import React from 'react';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Header from './components/layout/Header/Header';
import SystemMetrics from './components/metrics/SystemMetrics/SystemMetrics';
import ProcessPool from './components/pools/ProcessPool/ProcessPool';
import ResourcePool from './components/pools/ResourcePool/ResourcePool';
import ControlsStatus from './components/controls/ControlsStatus/ControlsStatus';
import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="panels">
          <SystemMetrics />
          <ProcessPool />
          <ResourcePool />
          <ControlsStatus />
        </section>
      </main>
    </div>
  );
}

export default App;