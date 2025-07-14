import React, { useEffect } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { useAuth } from '../../hooks/useAuth';
import ComplaintList from '../complaint/ComplaintList';
import './Dashboard.css';

const ReviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { complaints, loading } = useComplaints();

  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      total: complaints.length,
    };

    complaints.forEach(complaint => {
      switch (complaint.status) {
        case 'PENDING':
          counts.pending++;
          break;
        case 'IN_PROGRESS':
          counts.inProgress++;
          break;
        case 'RESOLVED':
          counts.resolved++;
          break;
      }
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  useEffect(() => {
    // Trigger animation when component mounts
    const dashboard = document.querySelector('.dashboard');
    if (dashboard) {
      dashboard.classList.add('animate');
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.full_name}</h1>
        <p>Reviewer Dashboard</p>
      </div>

      <div className="dashboard-stats" data-aos="fade-up">
        <div className="stat-card">
          <h3>Total Complaints</h3>
          <p className="stat-number">{statusCounts.total}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-number">{statusCounts.pending}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-number">{statusCounts.inProgress}</p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p className="stat-number">{statusCounts.resolved}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <ComplaintList />
      </div>
    </div>
  );
};

export default ReviewerDashboard;