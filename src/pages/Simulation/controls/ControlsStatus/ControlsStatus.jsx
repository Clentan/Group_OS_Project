import React, { useState, useEffect, useRef } from 'react';
import './ControlsStatus.css';

const ControlsStatus = ({ onResourceAllocation, setCurrentPage, onLogsUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState([]);
  const [allocatedResources, setAllocatedResources] = useState([]);
  const [currentAllocationCount, setCurrentAllocationCount] = useState(0);
  const [deadlockDetected, setDeadlockDetected] = useState(false);
  const [deadlockDetails, setDeadlockDetails] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);
  const deadlockTimerRef = useRef(null);

  // Available resources from ResourcePool
  const availableResources = [
    { name: 'DB', fullName: 'Database', icon: 'fas fa-database' },
    { name: 'FILE', fullName: 'File System', icon: 'fas fa-file' },
    { name: 'NET', fullName: 'Network', icon: 'fas fa-network-wired' },
    { name: 'LOCK', fullName: 'Lock Manager', icon: 'fas fa-lock' }
  ];

  // Available processes from ProcessPool
  const availableProcesses = [
    { id: 'P1', name: 'Database Process' },
    { id: 'P2', name: 'File Handler Process' },
    { id: 'P3', name: 'Network Process' },
    { id: 'P4', name: 'System Process' }
  ];

  const addLog = (message, type = 'info', details = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = {
      id: Date.now(),
      timestamp,
      message,
      type,
      details,
      fullTimestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    setLogs(updatedLogs);
    
    // Pass logs to parent component
    if (onLogsUpdate) {
      onLogsUpdate(updatedLogs);
    }
  };

  const getRandomResource = () => {
    const randomIndex = Math.floor(Math.random() * availableResources.length);
    return availableResources[randomIndex];
  };

  const getRandomProcess = () => {
    const randomIndex = Math.floor(Math.random() * availableProcesses.length);
    return availableProcesses[randomIndex];
  };

  const detectDeadlock = (newAllocations) => {
    // Simple deadlock detection algorithm
    const processResourceMap = new Map();
    const processWantsMap = new Map();
    
    // Map current allocations
    newAllocations.forEach(allocation => {
      if (!processResourceMap.has(allocation.process.id)) {
        processResourceMap.set(allocation.process.id, []);
      }
      processResourceMap.get(allocation.process.id).push(allocation.resource.name);
    });
    
    // Define what each process wants (simplified)
    const processWants = {
      'P1': ['DB', 'LOCK'],
      'P2': ['FILE', 'NET'],
      'P3': ['NET', 'DB'],
      'P4': ['LOCK', 'FILE']
    };
    
    // Check for circular wait condition
    for (const [processId, heldResources] of processResourceMap) {
      const wantedResources = processWants[processId] || [];
      
      for (const wantedResource of wantedResources) {
        if (!heldResources.includes(wantedResource)) {
          // Check if another process holds this resource
          for (const [otherProcessId, otherHeldResources] of processResourceMap) {
            if (otherProcessId !== processId && otherHeldResources.includes(wantedResource)) {
              const otherWantedResources = processWants[otherProcessId] || [];
              
              // Check if the other process wants something this process holds
              const circularDependency = otherWantedResources.some(resource => 
                heldResources.includes(resource)
              );
              
              if (circularDependency) {
                return {
                  detected: true,
                  type: 'circular-wait',
                  processes: [processId, otherProcessId],
                  resources: [wantedResource, ...heldResources.filter(r => otherWantedResources.includes(r))],
                  conditions: {
                    mutualExclusion: true,
                    holdAndWait: true,
                    noPreemption: true,
                    circularWait: true
                  }
                };
              }
            }
          }
        }
      }
    }
    
    return { detected: false };
  };

  const allocateRandomResource = () => {
    const resource = getRandomResource();
    const process = getRandomProcess();
    
    // Check if another process already wants this same resource
    const processWants = {
      'P1': ['DB'], // P1 wants only DB
      'P2': ['LOCK'], // P2 wants only LOCK
      'P3': ['NET'], // P3 wants only NET
      'P4': ['FILE'] // P4 wants only FILE
    };
    
    // Find processes that want the same resource
    const competingProcesses = [];
    for (const [processId, wantedResources] of Object.entries(processWants)) {
      if (processId !== process.id && wantedResources.includes(resource.name)) {
        competingProcesses.push(processId);
      }
    }
    
    const allocation = {
      id: Date.now(),
      resource: resource,
      process: process,
      timestamp: new Date().toLocaleTimeString()
    };

    const newAllocations = [...allocatedResources, allocation];
    setAllocatedResources(newAllocations);
    const newCount = currentAllocationCount + 1;
    setCurrentAllocationCount(newCount);
    
    // Pass allocation to parent component
    if (onResourceAllocation) {
      onResourceAllocation(newAllocations);
    }
    
    addLog(`🔄 Resource ${resource.name} (${resource.fullName}) allocated to ${process.name} (${process.id})`, 'allocation');
    
    // Check for natural deadlock detection
    const deadlockResult = detectDeadlock(newAllocations);
    if (deadlockResult.detected) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      clearTimeout(deadlockTimerRef.current);
      setDeadlockDetected(true);
      setDeadlockDetails(deadlockResult);
      addLog(
        `☠️ NATURAL DEADLOCK DETECTED: ${deadlockResult.type} between processes ${deadlockResult.processes.join(', ')}`,
        'deadlock',
        deadlockResult
      );
      addLog('🛑 APPLICATION STOPPED: Natural deadlock detected', 'error');
    }
  };

  const triggerScheduledDeadlock = () => {
    // Stop the allocation process
    setIsRunning(false);
    clearInterval(intervalRef.current);
    
    // Create a natural deadlock scenario with single resources
    const deadlockScenario = {
      id: Date.now(),
      resource: { name: 'DB', fullName: 'Database' },
      process: { id: 'P1', name: 'Database Process' },
      timestamp: new Date().toLocaleTimeString()
    };
    
    const deadlockScenario2 = {
      id: Date.now() + 1,
      resource: { name: 'LOCK', fullName: 'Lock Manager' },
      process: { id: 'P2', name: 'File Handler Process' },
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Add scenario where P1 now wants LOCK (which P2 holds) and P2 wants DB (which P1 holds)
    const newAllocations = [...allocatedResources, deadlockScenario, deadlockScenario2];
    setAllocatedResources(newAllocations);
    setCurrentAllocationCount(prev => prev + 2);
    
    if (onResourceAllocation) {
      onResourceAllocation(newAllocations);
    }
    
    setDeadlockDetected(true);
    setDeadlockDetails({
      detected: true,
      type: 'circular-wait',
      processes: ['P1', 'P2'],
      resources: ['DB', 'LOCK'],
      conditions: {
        mutualExclusion: true,
        holdAndWait: true,
        noPreemption: true,
        circularWait: true
      },
      description: 'P1 holds DB and wants LOCK, P2 holds LOCK and wants DB - classic circular wait with single resources'
    });
    
    addLog('⏰ 6 seconds elapsed - natural deadlock triggered', 'system');
    addLog('☠️ CIRCULAR DEADLOCK: P1 holds DB and wants LOCK, P2 holds LOCK and wants DB', 'deadlock');
    addLog('🛑 APPLICATION STOPPED: Single resource circular wait deadlock', 'error');
    addLog('⚡ Press RESOLVE button to clear deadlock and continue', 'info');
  };

  const startAllocation = () => {
    if (!isRunning && !deadlockDetected) {
      setIsRunning(true);
      setIsPaused(false);
      setStartTime(Date.now());
      addLog('🚀 Resource allocation simulation started', 'system');
      addLog('⏰ Deadlock will occur naturally after 6 seconds', 'info');
      
      // Set up 6-second timer for natural deadlock
      deadlockTimerRef.current = setTimeout(() => {
        triggerScheduledDeadlock();
      }, 6000);
      
      intervalRef.current = setInterval(() => {
        allocateRandomResource();
      }, 2000);
    } else if (deadlockDetected) {
      addLog('🚫 Cannot start: Deadlock active. Please resolve first.', 'error');
    }
  };

  const pauseAllocation = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      clearInterval(intervalRef.current);
      clearTimeout(deadlockTimerRef.current);
      addLog('⏸️ Resource allocation paused', 'system');
    } else if (isPaused) {
      setIsPaused(false);
      addLog('▶️ Resource allocation resumed', 'system');
      
      // Calculate remaining time for deadlock
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 6000 - elapsed);
      
      if (remaining > 0) {
        deadlockTimerRef.current = setTimeout(() => {
          triggerScheduledDeadlock();
        }, remaining);
      }
      
      intervalRef.current = setInterval(() => {
        allocateRandomResource();
      }, 2000);
    }
  };

  const resetAllocation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setAllocatedResources([]);
    setCurrentAllocationCount(0);
    setDeadlockDetected(false);
    setDeadlockDetails(null);
    setStartTime(null);
    setLogs([]);
    clearInterval(intervalRef.current);
    clearTimeout(deadlockTimerRef.current);
    if (onResourceAllocation) {
      onResourceAllocation([]);
    }
    addLog('🔄 System reset - all allocations cleared', 'system');
  };

  const scanForDeadlocks = () => {
    addLog('🔍 Scanning for potential deadlocks...', 'scan');
    setTimeout(() => {
      const deadlockResult = detectDeadlock(allocatedResources);
      if (deadlockResult.detected) {
        setDeadlockDetected(true);
        setDeadlockDetails(deadlockResult);
        addLog('⚠️ Deadlock confirmed during manual scan', 'warning');
      } else {
        addLog('✅ No deadlocks detected - system running smoothly', 'success');
      }
    }, 1000);
  };

  const resolveDeadlocks = () => {
    if (deadlockDetected) {
      addLog('⚡ Resolving deadlock...', 'resolve');
      setTimeout(() => {
        // Remove conflicting allocations
        const resolvedAllocations = allocatedResources.slice(0, -1);
        setAllocatedResources(resolvedAllocations);
        setDeadlockDetected(false);
        setDeadlockDetails(null);
        if (onResourceAllocation) {
          onResourceAllocation(resolvedAllocations);
        }
        addLog('✅ Deadlock resolved - conflicting allocations removed', 'success');
        addLog('🔄 Auto-resuming simulation...', 'info');
        
        // Auto-resume the simulation
        setTimeout(() => {
          setIsRunning(true);
          setIsPaused(false);
          addLog('▶️ Simulation automatically resumed after deadlock resolution', 'system');
          addLog('👀 Monitoring for new random deadlocks...', 'info');
          
          intervalRef.current = setInterval(() => {
            allocateRandomResource();
          }, 2000);
        }, 1000);
        
      }, 1500);
    } else {
      addLog('ℹ️ No active deadlocks to resolve', 'info');
    }
  };

  const forceLock = () => {
    addLog('☠️ Forcing artificial deadlock scenario...', 'warning');
    setTimeout(() => {
      // Create a forced deadlock scenario
      const forcedAllocations = [
        { id: Date.now() + 1, resource: { name: 'DB', fullName: 'Database' }, process: { id: 'P1', name: 'Database Process' }, timestamp: new Date().toLocaleTimeString() },
        { id: Date.now() + 2, resource: { name: 'FILE', fullName: 'File System' }, process: { id: 'P2', name: 'File Handler Process' }, timestamp: new Date().toLocaleTimeString() },
        { id: Date.now() + 3, resource: { name: 'NET', fullName: 'Network' }, process: { id: 'P3', name: 'Network Process' }, timestamp: new Date().toLocaleTimeString() },
        { id: Date.now() + 4, resource: { name: 'LOCK', fullName: 'Lock Manager' }, process: { id: 'P4', name: 'System Process' }, timestamp: new Date().toLocaleTimeString() }
      ];
      
      setAllocatedResources(prev => [...prev, ...forcedAllocations]);
      if (onResourceAllocation) {
        onResourceAllocation([...allocatedResources, ...forcedAllocations]);
      }
      
      setDeadlockDetected(true);
      setDeadlockDetails({
        detected: true,
        type: 'forced-circular-wait',
        processes: ['P1', 'P2', 'P3', 'P4'],
        resources: ['DB', 'FILE', 'NET', 'LOCK'],
        conditions: {
          mutualExclusion: true,
          holdAndWait: true,
          noPreemption: true,
          circularWait: true
        }
      });
      
      addLog('🔒 Artificial deadlock created - all processes in circular wait', 'error');
    }, 1000);
  };

  const openLogsExplorer = () => {
    if (setCurrentPage) {
      setCurrentPage('Logs Explorer');
    }
  };

  const buttons = [
    { label: '▶ Start', className: 'controls__btn--start', onClick: startAllocation, disabled: (isRunning && !isPaused) || deadlockDetected },
    { label: '⏸ Pause', className: 'controls__btn--pause', onClick: pauseAllocation, disabled: !isRunning || deadlockDetected },
    { label: '⟲ Reset', className: 'controls__btn--reset', onClick: resetAllocation },
    { label: '🔍 Scan', className: 'controls__btn--scan', onClick: scanForDeadlocks },
    { label: '⚡ Resolve', className: 'controls__btn--resolve', onClick: resolveDeadlocks, disabled: !deadlockDetected },
    { label: '☠ Force Lock', className: 'controls__btn--force', onClick: forceLock },
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (deadlockTimerRef.current) {
        clearTimeout(deadlockTimerRef.current);
      }
    };
  }, []);

  const getStatusText = () => {
    if (deadlockDetected) return 'Deadlocked';
    if (isRunning && isPaused) return 'Paused';
    if (isRunning) return 'Running';
    return 'Stopped';
  };

  const getStatusClass = () => {
    if (deadlockDetected) return 'status--deadlocked';
    if (isRunning && isPaused) return 'status--paused';
    if (isRunning) return 'status--running';
    return 'status--stopped';
  };

  return (
    <section className="panel controls-status">
      <div className="controls">
        {buttons.map((button, index) => (
          <button 
            key={index} 
            className={`controls__btn ${button.className}`}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </button>
        ))}
      </div>
      
      <div className="system-status">
        <h3 className="system-status__title">System Status</h3>
        
        <div className="status-overview">
          <div className={`status-indicator ${getStatusClass()}`}>
            Status: {getStatusText()}
          </div>
          <div className="allocation-counter">
            Resources Allocated: {currentAllocationCount}
          </div>
          <div className="active-processes">
            Active Processes: {availableProcesses.length}
          </div>
          {deadlockDetected && (
            <div className="deadlock-alert">
              ⚠️ DEADLOCK ACTIVE
            </div>
          )}
        </div>

        {deadlockDetected && deadlockDetails && (
          <div className="deadlock-details">
            <h4>🚨 Deadlock Analysis:</h4>
            <div className="deadlock-info">
              <div><strong>Type:</strong> {deadlockDetails.type}</div>
              <div><strong>Affected Processes:</strong> {deadlockDetails.processes.join(', ')}</div>
              <div><strong>Involved Resources:</strong> {deadlockDetails.resources.join(', ')}</div>
              <div className="deadlock-conditions">
                <strong>Conditions Met:</strong>
                <ul>
                  <li>🔒 Mutual Exclusion: {deadlockDetails.conditions.mutualExclusion ? '✓' : '✗'}</li>
                  <li>⏳ Hold and Wait: {deadlockDetails.conditions.holdAndWait ? '✓' : '✗'}</li>
                  <li>🚫 No Preemption: {deadlockDetails.conditions.noPreemption ? '✓' : '✗'}</li>
                  <li>🔄 Circular Wait: {deadlockDetails.conditions.circularWait ? '✓' : '✗'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {allocatedResources.length > 0 && (
          <div className="recent-allocations">
            <h4>Recent Allocations:</h4>
            <div className="allocation-list">
              {allocatedResources.slice(-3).reverse().map((allocation) => (
                <div key={allocation.id} className="allocation-item">
                  <span className="allocation-resource">{allocation.resource.name}</span>
                  <span className="allocation-arrow">→</span>
                  <span className="allocation-process">{allocation.process.id}</span>
                  <span className="allocation-time">{allocation.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="system-logs">
          <div className="logs-header">
            <h4>System Logs:</h4>
            <button className="explore-logs-btn" onClick={openLogsExplorer}>
              📋 Explore All Logs
            </button>
          </div>
          <div className="logs-container">
            {logs.length === 0 ? (
              <div className="log-entry log--info">
                [System] Ready for random resource allocation...
              </div>
            ) : (
              logs.slice(0, 10).map((log) => (
                <div key={log.id} className={`log-entry log--${log.type}`}>
                  <span className="log-timestamp">[{log.timestamp}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ControlsStatus;