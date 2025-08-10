import React, { useState, useEffect } from 'react';
import './LogsExplorer.css';

const LogsExplorer = ({ setCurrentPage, logs = [] }) => {
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setFilteredLogs(logs);
  }, [logs]);

  useEffect(() => {
    let filtered = logs;
    
    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.fullTimestamp);
      const dateB = new Date(b.fullTimestamp);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredLogs(filtered);
  }, [logs, filterType, searchTerm, sortOrder]);

  const getLogTypeColor = (type) => {
    const colors = {
      system: '#17a2b8',
      allocation: '#28a745',
      deadlock: '#dc3545',
      'deadlock-analysis': '#fd7e14',
      warning: '#ffc107',
      error: '#dc3545',
      success: '#28a745',
      scan: '#6f42c1',
      resolve: '#007bff',
      info: '#6c757d'
    };
    return colors[type] || '#6c757d';
  };

  const formatFullTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: formatFullTimestamp(log.fullTimestamp),
      type: log.type,
      message: log.message,
      details: log.details ? JSON.stringify(log.details) : 'N/A'
    }));
    
    const csvContent = [
      'Timestamp,Type,Message,Details',
      ...logData.map(log => 
        `"${log.timestamp}","${log.type}","${log.message}","${log.details}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderDeadlockDetails = (details) => {
    if (!details) return null;
    
    return (
      <div className="deadlock-details-expanded">
        <div className="detail-section">
          <strong>Deadlock Type:</strong> 
          <span className={`deadlock-type deadlock-type--${details.type}`}>
            {details.type.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        
        {details.processes && (
          <div className="detail-section">
            <strong>Affected Processes:</strong>
            <div className="process-list">
              {details.processes.map(process => (
                <span key={process} className="process-tag">{process}</span>
              ))}
            </div>
          </div>
        )}
        
        {details.resources && (
          <div className="detail-section">
            <strong>Contested Resources:</strong>
            <div className="resource-list">
              {details.resources.map(resource => (
                <span key={resource} className="resource-tag">{resource}</span>
              ))}
            </div>
          </div>
        )}
        
        {details.conditions && (
          <div className="detail-section">
            <strong>Deadlock Conditions:</strong>
            <div className="conditions-grid">
              <div className={`condition ${details.conditions.mutualExclusion ? 'met' : 'not-met'}`}>
                <span className="condition-icon">{details.conditions.mutualExclusion ? '✓' : '✗'}</span>
                Mutual Exclusion
              </div>
              <div className={`condition ${details.conditions.holdAndWait ? 'met' : 'not-met'}`}>
                <span className="condition-icon">{details.conditions.holdAndWait ? '✓' : '✗'}</span>
                Hold & Wait
              </div>
              <div className={`condition ${details.conditions.noPreemption ? 'met' : 'not-met'}`}>
                <span className="condition-icon">{details.conditions.noPreemption ? '✓' : '✗'}</span>
                No Preemption
              </div>
              <div className={`condition ${details.conditions.circularWait ? 'met' : 'not-met'}`}>
                <span className="condition-icon">{details.conditions.circularWait ? '✓' : '✗'}</span>
                Circular Wait
              </div>
            </div>
          </div>
        )}
        
        {details.description && (
          <div className="detail-section">
            <strong>Description:</strong>
            <p className="deadlock-description">{details.description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="logs-explorer-container">
      <div className="logs-explorer-header">
        <div className="header-top">
          <button 
            className="back-btn"
            onClick={() => setCurrentPage('Simulation')}
          >
            ← Back to Simulation
          </button>
          <h1>📋 System Logs Explorer</h1>
          <button className="export-btn" onClick={exportLogs}>
            📥 Export CSV
          </button>
        </div>
        
        <div className="filters-section">
          <div className="filter-group">
            <label>Filter by Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="system">System</option>
              <option value="allocation">Allocation</option>
              <option value="deadlock">Deadlock</option>
              <option value="deadlock-analysis">Deadlock Analysis</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
              <option value="scan">Scan</option>
              <option value="resolve">Resolve</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Search:</label>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label>Sort:</label>
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="logs-stats">
        <div className="stat-item">
          <span className="stat-label">Total Logs:</span>
          <span className="stat-value">{logs.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Filtered:</span>
          <span className="stat-value">{filteredLogs.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Deadlocks:</span>
          <span className="stat-value stat-value--danger">
            {logs.filter(log => log.type === 'deadlock').length}
          </span>
        </div>
      </div>
      
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Message</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className={`log-row log-row--${log.type}`}>
                <td className="timestamp-cell">
                  <div className="timestamp-short">{log.timestamp}</div>
                  <div className="timestamp-full">{formatFullTimestamp(log.fullTimestamp)}</div>
                </td>
                <td className="type-cell">
                  <span 
                    className="type-badge"
                    style={{ backgroundColor: getLogTypeColor(log.type) }}
                  >
                    {log.type.toUpperCase()}
                  </span>
                </td>
                <td className="message-cell">{log.message}</td>
                <td className="details-cell">
                  {log.details ? (
                    log.type === 'deadlock' ? (
                      <details className="details-expandable deadlock-details">
                        <summary>View Deadlock Analysis</summary>
                        {renderDeadlockDetails(log.details)}
                      </details>
                    ) : (
                      <details className="details-expandable">
                        <summary>View Details</summary>
                        <pre className="details-content">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )
                  ) : (
                    <span className="no-details">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLogs.length === 0 && (
          <div className="no-logs">
            <div className="no-logs-icon">📝</div>
            <div className="no-logs-message">No logs match your current filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsExplorer;