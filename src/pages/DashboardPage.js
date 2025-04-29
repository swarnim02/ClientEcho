import React from 'react';
import Dashboard from '../components/Dashboard';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of customer feedback</p>
      </header>
      <Dashboard />
    </div>
  );
}

export default DashboardPage; 