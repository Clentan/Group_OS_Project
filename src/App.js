import React from 'react';
import { SimulationProvider } from './context/SimulationContext';
import MainLayout from './components/layout/MainLayout';
import './styles.css';

function App() {
  return (
    <SimulationProvider>
      <div className="App">
        <MainLayout />
      </div>
    </SimulationProvider>
  );
}

export default App;