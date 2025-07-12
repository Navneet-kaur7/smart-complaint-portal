import React, { useState } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import './Complaint.css';

interface ComplaintFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const { createComplaint, loading } = useComplaints();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComplaint(formData);
      onSuccess();
      onClose();
    } catch (err) {
      // Error is handled by hook
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Complaint</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;