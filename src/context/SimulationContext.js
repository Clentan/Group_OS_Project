import React, { createContext, useContext, useReducer } from 'react';
import { SIMULATION_ACTIONS } from '../utils/constants';

const SimulationContext = createContext();

const initialState = {
  processes: [
    { id: 'P1', status: 'running', execTime: 2.5, holds: [1,0,1], wants: [0,1,0], priority: 1 },
    { id: 'P2', status: 'waiting', execTime: 1.8, holds: [0,1,0], wants: [0,0,1], priority: 2 },
    { id: 'P3', status: 'running', execTime: 3.2, holds: [1,0,0], wants: [0,1,0], priority: 3 },
    { id: 'P4', status: 'blocked', execTime: 0.9, holds: [0,1,0], wants: [1,0,0], priority: 4 }
  ],
  resources: [
    { id: 'DB', type: 'database', usage: 67, maxInstances: 3, currentInstances: 1, accessTime: 150 },
    { id: 'FILE', type: 'file', usage: 100, maxInstances: 2, currentInstances: 0, accessTime: 89 },
    { id: 'NET', type: 'network', usage: 25, maxInstances: 4, currentInstances: 3, accessTime: 45 },
    { id: 'LOCK', type: 'mutex', usage: 100, maxInstances: 2, currentInstances: 0, accessTime: 200 }
  ],
  metrics: {
    cpu: 45,
    memory: 78,
    diskIO: 32,
    requests: 156,
    success: 134,
    avgWait: 2.3,
    throughput: 0.0,
    deadlocks: 2
  },
  simulation: {
    isRunning: false,
    isPaused: false,
    speed: 1,
    autoResolve: false
  }
};

const simulationReducer = (state, action) => {
  switch (action.type) {
    case SIMULATION_ACTIONS.START:
      return { ...state, simulation: { ...state.simulation, isRunning: true, isPaused: false } };
    case SIMULATION_ACTIONS.PAUSE:
      return { ...state, simulation: { ...state.simulation, isPaused: true } };
    case SIMULATION_ACTIONS.RESET:
      return { ...initialState };
    case SIMULATION_ACTIONS.UPDATE_PROCESS:
      return {
        ...state,
        processes: state.processes.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        )
      };
    case SIMULATION_ACTIONS.UPDATE_METRICS:
      return { ...state, metrics: { ...state.metrics, ...action.payload } };
    default:
      return state;
  }
};

export const SimulationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  return (
    <SimulationContext.Provider value={{ state, dispatch }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within SimulationProvider');
  }
  return context;
};