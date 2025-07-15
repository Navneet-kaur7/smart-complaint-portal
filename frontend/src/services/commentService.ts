import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { Comment, CreateCommentDto } from '../types/complaint.types';

class CommentService {
  async getCommentsByComplaintId(complaintId: number): Promise<Comment[]> {
    try {
      console.log('Fetching comments for complaint:', complaintId);
      // Convert complaintId to string to ensure it's properly formatted in the URL
      const endpoint = `${API_ENDPOINTS.COMMENTS.BY_COMPLAINT}/${complaintId.toString()}`;
      const response = await apiService.get<{comments: Comment[], pagination: any}>(endpoint);
      console.log('Comments fetched:', response);
      return response.comments || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async createComment(commentData: CreateCommentDto): Promise<Comment> {
    try {
      console.log('Creating comment:', commentData);
      const response = await apiService.post<Comment>(API_ENDPOINTS.COMMENTS.BASE, commentData);
      console.log('Comment created:', response);
      return response;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      console.log('Deleting comment:', commentId);
      await apiService.delete(`${API_ENDPOINTS.COMMENTS.BASE}/${commentId}`);
      console.log('Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export const commentService = new CommentService();