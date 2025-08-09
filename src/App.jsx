import React from 'react';
import ControlsStatus from './components/controls/ControlsStatus/ControlsStatus';
import WFGGraph from './components/graphs/WFGGraph/WFGGraph';
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import SystemMetrics from './components/metrics/SystemMetrics/SystemMetrics';
import ProcessPool from './components/pools/ProcessPool/ProcessPool';
import ResourcePool from './components/pools/ResourcePool/ResourcePool';
import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        <section className="panels">
          <SystemMetrics />
          <WFGGraph />
          <ProcessPool />
          <ResourcePool />
          <ControlsStatus />
        </section>
      </main>
    </div>
  );
}

export default App;
