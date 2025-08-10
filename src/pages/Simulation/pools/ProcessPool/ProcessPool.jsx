import React, { useState, useEffect } from 'react';
import './ProcessPool.css';

const ProcessPool = ({ allocatedResources = [], onProcessUpdate }) => {
  const [processes, setProcesses] = useState([
    { 
      id: 'P1', 
      name: 'Database Process',
      status: 'waiting', 
      exec: '2.5s', 
      holds: [], 
      wants: ['DB'], // P1 wants only DB
      priority: 1,
      deadlockType: null
    },
    { 
      id: 'P2', 
      name: 'File Handler Process',
      status: 'running', 
      exec: '1.8s', 
      holds: [], 
      wants: ['LOCK'], // P2 wants only LOCK
      priority: 2,
      deadlockType: null
    },
    { 
      id: 'P3', 
      name: 'Network Process',
      status: 'waiting', 
      exec: '3.2s', 
      holds: [], 
      wants: ['NET'], // P3 wants only NET
      priority: 1,
      deadlockType: null
    },
    { 
      id: 'P4', 
      name: 'System Process',
      status: 'blocked', 
      exec: '0.9s', 
      holds: [], 
      wants: ['FILE'], // P4 wants only FILE
      priority: 3,
      deadlockType: null
    },
  ]);

  // Update process holdings based on allocated resources
  useEffect(() => {
    setProcesses(prevProcesses => 
      prevProcesses.map(process => {
        const processAllocations = allocatedResources.filter(
          allocation => allocation.process.id === process.id
        );
        
        const holds = processAllocations.map(allocation => allocation.resource.name);
        
        // Determine status based on holdings and wants
        let status = 'waiting';
        let deadlockType = null;
        
        if (holds.length > 0) {
          const hasAllWanted = process.wants.every(want => holds.includes(want));
          if (hasAllWanted) {
            status = 'running';
          } else {
            status = 'holding';
            // Check for deadlock conditions
            deadlockType = detectDeadlockType(process, holds, prevProcesses, allocatedResources);
            if (deadlockType) {
              status = 'deadlocked';
            }
          }
        } else if (process.wants.length === 0) {
          status = 'completed';
        }
        
        return {
          ...process,
          holds,
          status,
          deadlockType
        };
      })
    );
  }, [allocatedResources]);

  const detectDeadlockType = (currentProcess, currentHolds, allProcesses, allocations) => {
    // Mutual Exclusion: Resources can only be held by one process
    const mutualExclusion = currentHolds.length > 0;
    
    // Hold and Wait: Process holds resources while waiting for others
    const holdAndWait = currentHolds.length > 0 && currentProcess.wants.some(want => !currentHolds.includes(want));
    
    // No Preemption: Resources cannot be forcibly taken
    const noPreemption = true; // Always true in our simulation
    
    // Circular Wait: Check if there's a circular dependency
    const circularWait = checkCircularWait(currentProcess, allProcesses, allocations);
    
    if (mutualExclusion && holdAndWait && noPreemption && circularWait) {
      return 'full-deadlock';
    } else if (holdAndWait && circularWait) {
      return 'circular-wait';
    } else if (holdAndWait) {
      return 'hold-and-wait';
    } else if (mutualExclusion) {
      return 'mutual-exclusion';
    }
    
    return null;
  };

  const checkCircularWait = (currentProcess, allProcesses, allocations) => {
    // Simplified circular wait detection
    const processResourceMap = new Map();
    
    allocations.forEach(allocation => {
      if (!processResourceMap.has(allocation.process.id)) {
        processResourceMap.set(allocation.process.id, []);
      }
      processResourceMap.get(allocation.process.id).push(allocation.resource.name);
    });
    
    // Check if current process wants resources held by others who want current process's resources
    for (const wantedResource of currentProcess.wants) {
      for (const [processId, heldResources] of processResourceMap) {
        if (processId !== currentProcess.id && heldResources.includes(wantedResource)) {
          const otherProcess = allProcesses.find(p => p.id === processId);
          if (otherProcess && otherProcess.wants.some(want => currentProcess.holds.includes(want))) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const getStatusColor = (status, deadlockType) => {
    switch (status) {
      case 'running': return 'green';
      case 'waiting': return 'yellow';
      case 'holding': return 'blue';
      case 'deadlocked': return 'red';
      case 'completed': return 'purple';
      case 'blocked': return 'orange';
      default: return 'gray';
    }
  };

  const getDeadlockTypeDisplay = (deadlockType) => {
    switch (deadlockType) {
      case 'mutual-exclusion': return '🔒 Mutual Exclusion';
      case 'hold-and-wait': return '⏳ Hold & Wait';
      case 'circular-wait': return '🔄 Circular Wait';
      case 'full-deadlock': return '☠️ Full Deadlock';
      default: return null;
    }
  };

  const formatResourceList = (resources) => {
    return resources.length > 0 ? resources.join(', ') : 'None';
  };

  return (
    <section className="panel process-pool">
      <h2>Process Pool</h2>
      {processes.map((process, index) => (
        <div key={index} className={`process process--${process.status}`} id={`process${index + 1}`}>
          <div className={`process__status process__status--${getStatusColor(process.status, process.deadlockType)}`}></div>
          <div className="process__info">
            <div className="process__header">
              <strong>{process.id}</strong>
              <span className="process__name">({process.name})</span>
              {process.deadlockType && (
                <span className="process__deadlock-type">
                  {getDeadlockTypeDisplay(process.deadlockType)}
                </span>
              )}
            </div>
            <div className="process__details">
              <div>Status: <span className={`status-text status-text--${process.status}`}>{process.status.toUpperCase()}</span></div>
              <div>Exec Time: {process.exec}</div>
              <div>Priority: {process.priority}</div>
            </div>
            <div className="process__resources">
              <div className="resource-line">
                <span className="resource-label">Holds:</span>
                <span className={`resource-list ${process.holds.length > 0 ? 'has-resources' : 'no-resources'}`}>
                  {formatResourceList(process.holds)}
                </span>
              </div>
              <div className="resource-line">
                <span className="resource-label">Wants:</span>
                <span className={`resource-list ${process.wants.length > 0 ? 'wants-resources' : 'no-wants'}`}>
                  {formatResourceList(process.wants)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProcessPool;