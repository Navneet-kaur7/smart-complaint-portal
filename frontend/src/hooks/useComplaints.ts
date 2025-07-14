import { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint.types';
import { complaintService, ComplaintFilters } from '../services/complaintService';
import { PaginatedResponse } from '../types/api.types';

export const useComplaints = (filters: ComplaintFilters = {}) => {
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
      const response: PaginatedResponse<Complaint> = await complaintService.getComplaints({
        ...filters,
        ...newFilters,
      });
      setComplaints(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      console.error('Error fetching complaints:', err);
      setError(err.message || 'Failed to fetch complaints. Please check the API connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const createComplaint = async (complaintData: { title: string; description: string }) => {
    try {
      setLoading(true);
      const newComplaint = await complaintService.createComplaint(complaintData);
      setComplaints(prev => [newComplaint, ...prev]);
      return newComplaint;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id: number, status: ComplaintStatus) => {
    try {
      setLoading(true);
      const updatedComplaint = await complaintService.updateComplaintStatus(id, { status });
      setComplaints(prev => 
        prev.map(complaint => 
          complaint.id === id ? updatedComplaint : complaint
        )
      );
      return updatedComplaint;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (id: number) => {
    try {
      setLoading(true);
      await complaintService.deleteComplaint(id);
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
    } catch (err: any) {
      setError(err.message);
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
      setError(err.message);
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