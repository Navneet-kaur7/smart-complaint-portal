import { useState, useEffect, useRef } from 'react';
import { Comment, CreateCommentDto } from '../types/complaint.types';
import { commentService } from '../services/commentService';

export const useComments = (complaintId?: number | string, pollingInterval: number = 10000) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchComments = async () => {
    if (!complaintId) return;
    
    try {
      setLoading(true);
      setError(null);
      // Ensure complaintId is a number
      const numericComplaintId = typeof complaintId === 'string' ? parseInt(complaintId, 10) : complaintId;
      
      if (isNaN(numericComplaintId)) {
        throw new Error('Invalid complaint ID');
      }
      
      const fetchedComments = await commentService.getCommentsByComplaintId(numericComplaintId);
      setComments(fetchedComments);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch comments';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!complaintId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Ensure complaintId is a number
      const numericComplaintId = typeof complaintId === 'string' ? parseInt(complaintId, 10) : complaintId;
      
      if (isNaN(numericComplaintId)) {
        throw new Error('Invalid complaint ID');
      }
      
      const commentData: CreateCommentDto = {
        content,
        complaintId: numericComplaintId
      };
      const newComment = await commentService.createComment(commentData);
      // Refresh all comments instead of just appending the new one
      await fetchComments();
      return newComment;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      setLoading(true);
      setError(null);
      await commentService.deleteComment(commentId);
      // Refresh all comments instead of just filtering the deleted one
      await fetchComments();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) {
      fetchComments();
      
      // Set up polling to refresh comments periodically
      pollingTimerRef.current = setInterval(() => {
        fetchComments();
      }, pollingInterval);
    }
    
    // Clean up interval on unmount
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [complaintId, pollingInterval]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refetch: fetchComments
  };
};