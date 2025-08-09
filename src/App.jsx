import React from 'react';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Simulation from './pages/Simulation/Simulation';
import './styles/global.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Simulation />
      </main>
    </div>
  );
}

export default App;