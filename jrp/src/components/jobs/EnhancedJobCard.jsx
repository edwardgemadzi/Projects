import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import { useNotification } from '../ui/NotificationProvider';

const EnhancedJobCard = ({ 
  job, 
  onViewClick, 
  onApplyClick, 
  showApplicationStatus = true,
  user = null 
}) => {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useNotification();

  const checkApplicationStatus = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/applications/check/${job._id}`);
      setApplicationStatus(response.data);
    } catch (_error) {
      console.error('Error checking application status:', _error);
    }
  }, [job._id]);

  useEffect(() => {
    if (showApplicationStatus && user && user.role === 'jobseeker') {
      checkApplicationStatus();
    }
  }, [job._id, user, showApplicationStatus, checkApplicationStatus]);

  const handleApplyClick = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onApplyClick(job._id);
      // Refresh application status after successful application
      checkApplicationStatus();
    } catch {
      showError('Failed to apply for job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getApplicationButton = () => {
    if (!user || user.role !== 'jobseeker') return null;

    if (applicationStatus?.hasApplied) {
      return (
        <button className="btn btn-success btn-sm" disabled>
          <i className="bi bi-check-circle me-1"></i>
          Applied
        </button>
      );
    }

    return (
      <button 
        className="btn btn-primary btn-sm"
        onClick={handleApplyClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
            Applying...
          </>
        ) : (
          <>
            <i className="bi bi-paper-plane me-1"></i>
            Apply Now
          </>
        )}
      </button>
    );
  };

  return (
    <div className="card mb-4 shadow-sm job-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              {job.logo && (
                <img 
                  src={job.logo} 
                  alt={`${job.company} logo`}
                  className="me-3 rounded"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
              )}
              <div>
                <h5 className="card-title mb-1">{job.title || 'Untitled Job'}</h5>
                <h6 className="card-subtitle text-muted">{job.company || 'Company not specified'}</h6>
              </div>
            </div>
          </div>
          {applicationStatus?.hasApplied && (
            <span className="badge bg-success">
              <i className="bi bi-check-circle me-1"></i>
              Applied
            </span>
          )}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <small className="text-muted">
              <i className="bi bi-geo-alt me-1"></i>
              {job.location || 'Location not specified'}
            </small>
          </div>
          <div className="col-md-6">
            <small className="text-muted">
              <i className="bi bi-building me-1"></i>
              {job.industry || 'Industry not specified'}
            </small>
          </div>
        </div>

        <p className="card-text text-muted mb-3">
          {job.description && job.description.length > 150 
            ? `${job.description.substring(0, 150)}...` 
            : job.description || 'No description available'
          }
        </p>

        {job.skills && job.skills.length > 0 && (
          <div className="mb-3">
            <small className="text-muted d-block mb-1">Skills:</small>
            <div className="d-flex flex-wrap gap-1">
              {job.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="badge bg-light text-dark border">
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="badge bg-light text-muted border">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <i className="bi bi-calendar me-1"></i>
            Posted {job.createdAt ? formatDate(job.createdAt) : 'Date unknown'}
          </small>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => onViewClick(job._id)}
            >
              <i className="bi bi-eye me-1"></i>
              View Details
            </button>
            {getApplicationButton()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
