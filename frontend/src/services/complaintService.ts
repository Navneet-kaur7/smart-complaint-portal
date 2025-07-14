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
    return await apiService.post<Complaint>('/complaints', complaintData);
  }

  async getComplaints(filters: ComplaintFilters = {}, role: 'REVIEWER' | 'CONSUMER'): Promise<PaginatedResponse<Complaint>> {
    const params = {
      ...filters,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    const endpoint = role === 'REVIEWER' ? '/complaints' : '/complaints/my-complaints';
    return await apiService.get<PaginatedResponse<Complaint>>(endpoint, { params });
  }

  async getComplaintById(id: number): Promise<Complaint> {
    return await apiService.get<Complaint>(`/complaints/${id}`);
  }

  async updateComplaintStatus(id: number, updateData: UpdateComplaintDto): Promise<Complaint> {
    return await apiService.put<Complaint>(`/complaints/${id}`, updateData);
  }

  async deleteComplaint(id: number): Promise<void> {
    await apiService.delete<void>(`/complaints/${id}`);
  }
}

export const complaintService = new ComplaintService();
