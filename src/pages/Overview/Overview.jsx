import React from 'react';
import MetricCard from './components/MetricCard/MetricCard';
import DeadlockChart from './components/DeadlockChart/DeadlockChart';
import InsightsPanel from './components/InsightsPanel/InsightsPanel';
import ResolutionLogs from './components/ResolutionLogs/ResolutionLogs';
import ActivityTable from './components/ActivityTable/ActivityTable';
import './Overview.css';

const Overview = () => {
  const metricsData = [
    {
      title: 'Total Activities',
      value: '5382',
      change: '+42%',
      status: 'increase',
      color: 'blue'
    },
    {
      title: 'Total Resolved',
      value: '100',
      status: 'Active',
      color: 'green'
    },
    {
      title: 'Deadlocks',
      value: '4',
      status: 'Critical',
      color: 'red'
    }
  ];

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Deadlock Systems Detector</h1>
      </div>

      {/* Top Metrics Cards */}
      <div className="metrics-cards">
        {metricsData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            status={metric.status}
            color={metric.color}
          />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <DeadlockChart />
        <InsightsPanel />
        <ResolutionLogs />
      </div>

      {/* Recent Resource Activity Table */}
      <ActivityTable />
    </div>
  );
};

export default Overview;