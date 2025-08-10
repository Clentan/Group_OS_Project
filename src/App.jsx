import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar/Sidebar';
import Simulation from './pages/Simulation/Simulation';
import Overview from './pages/Overview/Overview';
import ResourceExplorer from './pages/ResourceExplorer/ResourceExplorer';
import LogsExplorer from './pages/LogsExplorer/LogsExplorer';
import './styles/global.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Overview');
  const [systemLogs, setSystemLogs] = useState([]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'Overview':
        return <Overview />;
      case 'Simulation':
        return <Simulation setCurrentPage={setCurrentPage} setSystemLogs={setSystemLogs} />;
      case 'Resource Explorer':
        return <ResourceExplorer setCurrentPage={setCurrentPage} />;
      case 'Logs Explorer':
        return <LogsExplorer setCurrentPage={setCurrentPage} logs={systemLogs} />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;