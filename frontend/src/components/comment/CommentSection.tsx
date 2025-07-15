import React, { useState } from 'react';
import { Comment } from '../../types/complaint.types';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import { validateComment } from '../../utils/helpers';
import { UserRole } from '../../types/user.types';
import './Comment.css';

interface CommentSectionProps {
  complaintId: number | string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ complaintId }) => {
  // Ensure complaintId is a valid number
  const numericComplaintId = typeof complaintId === 'string' ? parseInt(complaintId, 10) : complaintId;
  
  if (isNaN(numericComplaintId)) {
    return <div className="comment-error">Invalid complaint ID</div>;
  }
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { comments, loading, addComment, deleteComment, refetch } = useComments(complaintId, 5000); // Poll every 5 seconds
  const { user } = useAuth();
  const isReviewer = user?.role === UserRole.REVIEWER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateComment(newComment)) {
      setError('Comment must not be empty and should be less than 500 characters');
      return;
    }
    
    try {
      await addComment(newComment);
      setNewComment('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await deleteComment(commentId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      
      {loading && <p className="loading-text">Loading comments...</p>}
      
      <div className="refresh-container">
        <button 
          className="refresh-btn" 
          onClick={() => refetch()}
          disabled={loading}
        >
          Refresh Comments
        </button>
      </div>
      
      {error && <p className="error-text">{error}</p>}
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.user?.fullName || 'Unknown User'}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
              {(isReviewer || user?.id === comment.userId) && (
                <button 
                  className="delete-comment-btn" 
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="comment-input"
        />
        <button 
          type="submit" 
          className="submit-comment-btn"
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;