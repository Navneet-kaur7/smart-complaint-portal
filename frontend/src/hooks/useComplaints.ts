import { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint.types';
import { complaintService, ComplaintFilters } from '../services/complaintService';
import { PaginatedResponse } from '../types/api.types';

export const useComplaints = (
  filters: ComplaintFilters = {},
  userRole: 'REVIEWER' | 'CONSUMER'
) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchComplaints = async (newFilters: ComplaintFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...newFilters };
      console.log('Fetching complaints with filters:', mergedFilters, 'Role:', userRole);
      
      const response: PaginatedResponse<Complaint> = await complaintService.getComplaints(
        mergedFilters,
        userRole
      );

      console.log('API Response:', response);

      setComplaints(response.data || []);
      setPagination({
        total: response.pagination?.total || 0,
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        totalPages: response.pagination?.totalPages || 0,
      });
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      let errorMessage = 'Failed to fetch complaints.';
      
      if (err.statusCode === 404) {
        errorMessage = 'Complaints endpoint not found. Please check if the backend server is running correctly.';
      } else if (err.statusCode === 401) {
        errorMessage = 'You are not authorized to view complaints. Please log in again.';
      } else if (err.statusCode === 403) {
        errorMessage = 'You do not have permission to view these complaints.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if userRole is valid
    if (userRole && (userRole === 'REVIEWER' || userRole === 'CONSUMER')) {
      fetchComplaints();
    }
  }, [userRole, filters.status, filters.search, filters.page]);

  const createComplaint = async (complaintData: { title: string; description: string }) => {
    try {
      setLoading(true);
      setError(null);
      const newComplaint = await complaintService.createComplaint(complaintData);
      setComplaints(prev => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create complaint';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id: number, status: ComplaintStatus) => {
    try {
      setLoading(true);
      setError(null);
      const updatedComplaint = await complaintService.updateComplaintStatus(id, { status });
      setComplaints(prev =>
        prev.map(complaint => (complaint.id === id ? updatedComplaint : complaint))
      );
      return updatedComplaint;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update complaint status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await complaintService.deleteComplaint(id);
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete complaint';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    complaints,
    loading,
    error,
    pagination,
    fetchComplaints,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint,
    refetch: () => fetchComplaints(),
  };
};

export const useComplaint = (id: number) => {
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintService.getComplaintById(id);
      setComplaint(response);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch complaint';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComplaint();
    }
  }, [id]);

  return {
    complaint,
    loading,
    error,
    refetch: fetchComplaint,
  };
};