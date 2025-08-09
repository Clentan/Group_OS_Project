import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SIMULATION_ACTIONS } from '../../utils/constants';
import Button from '../ui/Button';

const ControlsStatus = ({ timer, simulation }) => {
  const { dispatch } = useSimulation();
  const [statusLog, setStatusLog] = useState(['System ready...']);
  const [speed, setSpeed] = useState(1);

  const addToLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setStatusLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleStart = () => {
    timer.start();
    dispatch({ type: SIMULATION_ACTIONS.START });
    addToLog(`Simulation started at ${speed}x speed`);
  };

  const handlePause = () => {
    timer.pause();
    dispatch({ type: SIMULATION_ACTIONS.PAUSE });
    addToLog('Simulation paused');
  };

  const handleReset = () => {
    timer.reset();
    dispatch({ type: SIMULATION_ACTIONS.RESET });
    setStatusLog(['System reset...']);
  };

  return (
    <section className="panel controls-status">
      <div className="controls">
        <Button variant="start" onClick={handleStart}>▶ Start</Button>
        <Button variant="pause" onClick={handlePause}>⏸ Pause</Button>
        <Button variant="reset" onClick={handleReset}>⟲ Reset</Button>
        <Button variant="scan" onClick={() => addToLog('Scanning...')}>🔍 Scan</Button>
        <Button variant="resolve" onClick={() => addToLog('Resolving...')}>⚡ Resolve</Button>
        <Button variant="danger" onClick={() => addToLog('Force lock...')}>☠ Force Lock</Button>
      </div>
      <div className="system-status">
        <h3>System Status</h3>
        <div className="status-log">
          {statusLog.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ControlsStatus;