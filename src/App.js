import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SystemMetrics from './components/SystemMetrics';
import ProcessPool from './components/ProcessPool';
import ResourcePool from './components/ResourcePool';
import ControlsStatus from './components/ControlsStatus';
import './App.css'; // This should work once you move the CSS file

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