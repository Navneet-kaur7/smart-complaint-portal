import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import { ComplaintStatus } from '../../types/complaint.types';
import ComplaintCard from './ComplaintCard';
import ComplaintForm from './ComplaintForm';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';
import './Complaint.css';

const ComplaintList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
const { 
  complaints, 
  loading, 
  error, 
  updateComplaintStatus, 
  deleteComplaint, 
  refetch 
} = useComplaints(
  {
    status: statusFilter || undefined,
    search: searchQuery || undefined,
  },
  user?.role || 'CONSUMER'  // default to CONSUMER if user or role undefined
);



  const handleStatusUpdate = async (id: number, status: ComplaintStatus) => {
    try {
      await updateComplaintStatus(id, status);
    } catch (err) {
      console.error('Failed to update complaint status:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await deleteComplaint(id);
      } catch (err) {
        console.error('Failed to delete complaint:', err);
      }
    }
  };

  const handleFormSuccess = () => {
    refetch();
  };

  if (loading) return <div className="loading">Loading complaints...</div>;
  if (error) return <div className="error">Error: {error}<br/><small>Please make sure the backend server is running at http://localhost:3001</small></div>;

  return (
    <div className="complaint-list-container">
      <div className="complaint-list-header">
        <h2>Complaints</h2>
        {user?.role === UserRole.CONSUMER && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create New Complaint
          </button>
        )}
      </div>

      <div className="complaint-filters">
        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ComplaintStatus | '')}
          >
            <option value="">All Status</option>
            <option value={ComplaintStatus.PENDING}>Pending</option>
            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints..."
          />
        </div>
      </div>

      <div className="complaint-list">
        {complaints.length === 0 ? (
          <div className="no-complaints">
            <p>No complaints found.</p>
          </div>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {showForm && (
        <ComplaintForm
          onClose={() => setShowForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ComplaintList;