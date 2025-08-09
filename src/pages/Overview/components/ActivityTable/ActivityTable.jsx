import React from 'react';
import './ActivityTable.css';

const ActivityTable = () => {
  const recentActivity = [
    { resource: 'DB-File', process: 'Database Lock', action: 'WRITE_INTENSIVE', time: '2.5 ms', status: 'ERROR' },
    { resource: 'File-Net', process: 'File Handler', action: 'WRITE_INTENSIVE', time: '700 ms', status: 'PENDING' },
    { resource: 'NET-Lock', process: 'Network Socket', action: 'WRITE_INTENSIVE', time: '900 ms', status: 'PENDING' },
    { resource: 'MISC', process: 'Thread Pool', action: 'WRITE_INTENSIVE', time: '1.2 ms', status: 'ERROR' },
    { resource: 'MISC', process: 'Thread Pool', action: 'WRITE_INTENSIVE', time: '847 ms', status: 'PENDING' }
  ];

  return (
    <div className="dashboard-panel activity-panel">
      <div className="activity-header">
        <h2>Recent Resource Activity</h2>
        <button className="explore-btn">Explore More!</button>
      </div>
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>RESOURCE</th>
              <th>PROCESS TYPE</th>
              <th>PROCESS NAME</th>
              <th>MEMORY</th>
              <th>CPU USAGE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((activity, index) => (
              <tr key={index}>
                <td>{activity.resource}</td>
                <td>{activity.process}</td>
                <td>{activity.action}</td>
                <td>{activity.time}</td>
                <td>--</td>
                <td>
                  <span className={`status-badge status-badge--${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;