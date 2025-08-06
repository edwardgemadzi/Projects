import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ApplicationStatusBadge from '../components/applications/ApplicationStatusBadge';
import { useNotification } from '../components/ui/NotificationProvider';
import { useAsync } from '../hooks/useAsync';
import { formatCurrency } from '../utils/helpers';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const [showApply, setShowApply] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Fetch job details
  const {
    loading: jobLoading,
    error: jobError,
    execute: fetchJob
  } = useAsync();

  // Check application status
  const {
    loading: appLoading,
    execute: checkApplication
  } = useAsync();

  const [job, setJob] = useState(null);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const result = await fetchJob(async () => {
          const res = await axiosInstance.get(`/jobs/${id}`);
          return res.data;
        });
        setJob(result);
      } catch (err) {
        showNotification('Failed to load job details', 'error');
      }
    };
    loadJob();
  }, [id, fetchJob]);

  useEffect(() => {
    const loadApplication = async () => {
      if (!user || user.role !== 'jobseeker') return;
      try {
        const result = await checkApplication(async () => {
          try {
            const res = await axiosInstance.get(`/applications/status/${id}`);
            return res.data;
          } catch (err) {
            return null;
          }
        });
        setApplication(result);
      } catch (err) {
        console.error('Failed to check application:', err);
      }
    };
    loadApplication();
  }, [user, id, checkApplication]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      showNotification("Resume is required.", 'error');
      return;
    }
    
    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('resume', resumeFile);
    formData.append('coverLetter', coverLetter);

    try {
      await axiosInstance.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showNotification("Application submitted successfully!", 'success');
      setShowApply(false);
      setResumeFile(null);
      setCoverLetter('');
      // Refresh application status
      checkApplication();
    } catch (err) {
      if (err.response?.status === 409) {
        showNotification("You have already applied for this job.", 'warning');
      } else {
        showNotification("Failed to submit application. Please try again.", 'error');
      }
    }
  };

  const handleApplyClick = () => {
    if (application) {
      showNotification("You have already applied for this job.", 'info');
      return;
    }
    setShowConfirm(true);
  };

  const confirmApply = () => {
    setShowConfirm(false);
    setShowApply(true);
  };

  if (jobLoading) return <LoadingSpinner message="Loading job details..." />;
  if (jobError || !job) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        Job not found or failed to load.
      </div>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="card-title">{job.title}</h2>
                  <h4 className="text-muted mb-2">{job.company}</h4>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <span className="badge bg-primary">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {job.location}
                    </span>
                    {job.jobType && (
                      <span className="badge bg-info">
                        {job.jobType}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="badge bg-secondary">
                        {job.experienceLevel}
                      </span>
                    )}
                    {job.salary && (
                      <span className="badge bg-success">
                        {formatCurrency(job.salary)}
                      </span>
                    )}
                  </div>
                </div>
                {job.logo && (
                  <img 
                    src={job.logo} 
                    alt={`${job.company} logo`}
                    className="rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                  />
                )}
              </div>

              <div className="mb-4">
                <h5>Job Description</h5>
                <div className="job-description">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {job.requirements && (
                <div className="mb-4">
                  <h5>Requirements</h5>
                  <div className="requirements">
                    {job.requirements.split('\n').map((req, index) => (
                      <p key={index}>{req}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-muted small">
                <i className="fas fa-calendar me-1"></i>
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Application Status</h5>
              
              {user && user.role === 'jobseeker' ? (
                <>
                  {appLoading ? (
                    <div className="text-center">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : application ? (
                    <div>
                      <ApplicationStatusBadge status={application.status} />
                      <p className="mt-2 small text-muted">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-muted mb-3">You haven't applied for this job yet.</p>
                      {!showApply && (
                        <button 
                          className="btn btn-success w-100" 
                          onClick={handleApplyClick}
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Apply for this job
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : user && user.role === 'employer' ? (
                <p className="text-muted">Employer view - cannot apply</p>
              ) : (
                <p className="text-muted">Please log in as a job seeker to apply</p>
              )}

              {showApply && (
                <form className="mt-4" onSubmit={handleApply}>
                  <div className="mb-3">
                    <label className="form-label">Resume (PDF, JPG, PNG) *</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => setResumeFile(e.target.files[0])}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cover Letter (optional)</label>
                    <textarea
                      className="form-control"
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      rows={4}
                      placeholder="Tell us why you're perfect for this role..."
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">
                      Submit Application
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={() => setShowApply(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <button className="btn btn-outline-primary w-100 mt-3" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i>
            Back to Jobs
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="Apply for Job"
        message={`Are you sure you want to apply for the position of ${job.title} at ${job.company}?`}
        confirmText="Yes, Apply"
        cancelText="Cancel"
        onConfirm={confirmApply}
        onCancel={() => setShowConfirm(false)}
        variant="primary"
      />
    </div>
  );
};

export default JobDetailPage;
