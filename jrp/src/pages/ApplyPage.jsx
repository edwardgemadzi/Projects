import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../components/ui/NotificationProvider';
import axiosInstance from '../api/axios';

const ApplyPage = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        showNotification('Error loading job details', 'error');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId, showNotification, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || user.role !== 'jobseeker') {
      showNotification('You must be logged in as a job seeker to apply', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('coverLetter', coverLetter);
      if (resume) {
        formData.append('resume', resume);
      }

      await axiosInstance.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showNotification('Application submitted successfully!', 'success');
      navigate('/applications');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      showNotification(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Job not found or no longer available.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Apply for Position</h3>
            </div>
            <div className="card-body">
              {/* Job Details */}
              <div className="mb-4 p-3 bg-light rounded">
                <h4>{job.title}</h4>
                <p className="mb-1"><strong>Company:</strong> {job.company}</p>
                <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                {job.industry && (
                  <p className="mb-1"><strong>Industry:</strong> {job.industry}</p>
                )}
              </div>

              {/* Application Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="coverLetter" className="form-label">
                    Cover Letter <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    id="coverLetter"
                    className="form-control"
                    rows={6}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell the employer why you're a great fit for this position..."
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="resume" className="form-label">
                    Resume <span className="text-muted">(PDF or DOC, max 5MB)</span>
                  </label>
                  <input
                    type="file"
                    id="resume"
                    className="form-control"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                  {resume && (
                    <div className="form-text text-success">
                      Selected: {resume.name}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(`/jobs/${jobId}`)}
                  >
                    Back to Job
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;