import {
  Complaint,
  CreateComplaintDto,
  UpdateComplaintDto,
  ComplaintStatus,
} from '../types/complaint.types';
import { PaginatedResponse } from '../types/api.types';
import { apiService } from './api';

export interface ComplaintFilters {
  status?: ComplaintStatus;
  search?: string;
  page?: number;
  limit?: number;
}

class ComplaintService {
  async createComplaint(complaintData: CreateComplaintDto): Promise<Complaint> {
    try {
      console.log('Creating complaint:', complaintData);
      const response = await apiService.post<Complaint>('/complaints', complaintData);
      console.log('Complaint created:', response);
      return response;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async getComplaints(filters: ComplaintFilters = {}, role: 'REVIEWER' | 'CONSUMER'): Promise<PaginatedResponse<Complaint>> {
    try {
      const params = {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10,
      };

      console.log('Fetching complaints with params:', params, 'Role:', role);

      // Try different endpoint patterns your backend might be using
      let endpoint = '/complaints';
      
      // If your backend has specific endpoints for different roles
      if (role === 'CONSUMER') {
        // Try common patterns for user-specific complaints
        endpoint = '/complaints/my'; // or '/user/complaints' or '/complaints/mine'
      }
      
      console.log('Using endpoint:', endpoint);
      
      try {
        const response = await apiService.get<PaginatedResponse<Complaint>>(endpoint, params);
        console.log('Complaints fetched:', response);
        return response;
      } catch (error: any) {
        // If the role-specific endpoint fails, fallback to general endpoint
        if (error.statusCode === 404 && role === 'CONSUMER') {
          console.log('Role-specific endpoint not found, trying general endpoint');
          endpoint = '/complaints';
          const response = await apiService.get<PaginatedResponse<Complaint>>(endpoint, params);
          console.log('Complaints fetched from fallback:', response);
          return response;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  }

  async getComplaintById(id: number): Promise<Complaint> {
    try {
      console.log('Fetching complaint by ID:', id);
      const response = await apiService.get<Complaint>(`/complaints/${id}`);
      console.log('Complaint fetched:', response);
      return response;
    } catch (error) {
      console.error('Error fetching complaint by ID:', error);
      throw error;
    }
  }

  async updateComplaintStatus(id: number, updateData: UpdateComplaintDto): Promise<Complaint> {
    try {
      console.log('Updating complaint status:', id, updateData);
      const response = await apiService.put<Complaint>(`/complaints/${id}`, updateData);
      console.log('Complaint updated:', response);
      return response;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      throw error;
    }
  }

  async deleteComplaint(id: number): Promise<void> {
    try {
      console.log('Deleting complaint:', id);
      await apiService.delete<void>(`/complaints/${id}`);
      console.log('Complaint deleted successfully');
    } catch (error) {
      console.error('Error deleting complaint:', error);
      throw error;
    }
  }
}

export const complaintService = new ComplaintService();