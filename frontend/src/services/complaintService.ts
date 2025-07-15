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
        status: filters.status,
        search: filters.search,
        page: filters.page || 1,
        limit: filters.limit || 10,
      };

      // Remove undefined values to avoid sending them as query parameters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });
  
      console.log('Fetching complaints with params:', params, 'Role:', role);
  
      let endpoint = '/complaints';
      
      if (role === 'CONSUMER') {
        endpoint = '/complaints/my-complaints';
      }
      
      console.log('Using endpoint:', endpoint);
      
      const response = await apiService.get<PaginatedResponse<Complaint>>(endpoint, params);
      console.log('Complaints fetched:', response);
      return response;
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