import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../../types/complaint.types';
import { UserRole } from '../../types/user.types';
import { useAuth } from '../../hooks/useAuth';
import CommentSection from '../comment/CommentSection';
import './Complaint.css';

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusUpdate: (id: number, status: ComplaintStatus) => void;
  onDelete: (id: number) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onStatusUpdate, onDelete }) => {
  const { user } = useAuth();
  const isConsumer = user?.role === UserRole.CONSUMER;
  const isReviewer = user?.role === UserRole.REVIEWER;
  const isOwner = user?.id === complaint.consumerId;

  const getStatusColor = (status: ComplaintStatus) => {
    switch (status) {
      case ComplaintStatus.PENDING:
        return 'status-pending';
      case ComplaintStatus.IN_PROGRESS:
        return 'status-in-progress';
      case ComplaintStatus.RESOLVED:
        return 'status-resolved';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const [showComments, setShowComments] = useState(false);

  return (
    <div className="complaint-card">
      <div className="complaint-header">
        <h3>{complaint.title}</h3>
        <span className={`status-badge ${getStatusColor(complaint.status)}`}>
          {complaint.status}
        </span>
      </div>
      
      <div className="complaint-body">
        <p>{complaint.description}</p>
        <div className="complaint-meta">
          <span>Created: {formatDate(complaint.createdAt)}</span>
          {complaint.consumer && (
            <span>By: {complaint.consumer.fullName}</span>
          )}
        </div>
      </div>

      <div className="complaint-actions">
        {isReviewer && complaint.status !== ComplaintStatus.RESOLVED && (
          <div className="reviewer-actions">
            <button
              onClick={() => onStatusUpdate(complaint.id, ComplaintStatus.IN_PROGRESS)}
              disabled={complaint.status === ComplaintStatus.IN_PROGRESS}
              className="btn-secondary"
            >
              Mark In Progress
            </button>
            <button
              onClick={() => onStatusUpdate(complaint.id, ComplaintStatus.RESOLVED)}
              className="btn-success"
            >
              Mark Resolved
            </button>
          </div>
        )}
        
        {isConsumer && isOwner && (
          <div className="consumer-actions">
            <button
              onClick={() => onDelete(complaint.id)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        )}

        <button 
          className="btn-comment" 
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>

      {showComments && (
        <CommentSection complaintId={complaint.id.toString()} />
      )}
    </div>
  );
};

export default ComplaintCard;
