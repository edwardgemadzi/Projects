import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ApplicationStatusBadge from "../components/applications/ApplicationStatusBadge";

const EmployerDashboard = () => {
    const { user, showNotification } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');
    const [editingJob, setEditingJob] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const [jobCompany, setJobCompany] = useState('');
    const [jobLocation, setJobLocation] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch jobs
                const jobsRes = await axiosInstance.get('/jobs');
                setJobs(jobsRes.data.jobs.filter(job => job.createdBy._id === user.id));
                
                // Fetch applications for employer's jobs
                const appsRes = await axiosInstance.get('/applications/employer');
                setApplications(appsRes.data);
            } catch {
                setJobs([]);
                setApplications([]);
            } finally {
                setLoading(false);
            }
        };
        if (user?.role === "employer") fetchData();
    }, [user]);

    const startEditJob = (job) => {
        setEditingJob(job);
        setJobTitle(job.title);
        setJobCompany(job.company);
        setJobLocation(job.location);
        setJobDescription(job.description);
    };

    const saveJobEdit = async () => {
        try {
            await axiosInstance.put(`/jobs/${editingJob._id}`, {
                title: jobTitle,
                company: jobCompany,
                location: jobLocation,
                description: jobDescription
            });
            
            setJobs(jobs.map(job => 
                job._id === editingJob._id 
                    ? {...job, title: jobTitle, company: jobCompany, location: jobLocation, description: jobDescription} 
                    : job
            ));
            
            setEditingJob(null);
            showNotification('Job updated successfully');
        } catch {
            showNotification('Failed to update job');
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await axiosInstance.put(`/applications/${applicationId}/status`, {
                status: newStatus
            });
            
            setApplications(applications.map(app => 
                app._id === applicationId 
                    ? {...app, status: newStatus} 
                    : app
            ));
            
            showNotification('Application status updated successfully');
        } catch {
            showNotification('Failed to update application status');
        }
    };

    if (!user || user.role !== "employer") {
        return <div className="container mt-5">Access denied.</div>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-building me-2"></i>
                    Company Dashboard
                </h2>
                <div className="badge bg-primary fs-6">
                    Welcome, {user?.name}
                </div>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-briefcase fa-2x mb-3"></i>
                            <h4>{jobs.length}</h4>
                            <p className="card-text">Active Jobs</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-file-alt fa-2x mb-3"></i>
                            <h4>{applications.length}</h4>
                            <p className="card-text">Total Applications</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-eye fa-2x mb-3"></i>
                            <h4>{applications.filter(app => app.status === 'under_review').length}</h4>
                            <p className="card-text">Under Review</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-handshake fa-2x mb-3"></i>
                            <h4>{applications.filter(app => app.status === 'accepted').length}</h4>
                            <p className="card-text">Hired</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('jobs')}
                    >
                        <i className="fas fa-briefcase me-2"></i>
                        Posted Jobs ({jobs.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button 
                        className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        <i className="fas fa-file-alt me-2"></i>
                        Applications ({applications.length})
                    </button>
                </li>
            </ul>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading dashboard...</p>
                </div>
            ) : (
                <>
                    {/* Jobs Tab */}
                    {activeTab === 'jobs' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4>Your Posted Jobs</h4>
                                <a href="/post-job" className="btn btn-primary">
                                    <i className="fas fa-plus me-2"></i>
                                    Post New Job
                                </a>
                            </div>
                            
                            {jobs.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-briefcase fa-3x text-muted mb-3"></i>
                                    <h5>No jobs posted yet</h5>
                                    <p className="text-muted">Get started by posting your first job opening.</p>
                                    <a href="/post-job" className="btn btn-primary">
                                        <i className="fas fa-plus me-2"></i>
                                        Post Your First Job
                                    </a>
                                </div>
                            ) : (
                                <div className="row">
                                    {jobs.map(job => (
                                        <div key={job._id} className="col-12 mb-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div className="flex-grow-1">
                                                            <h5 className="card-title">{job.title}</h5>
                                                            <h6 className="card-subtitle text-muted">{job.company}</h6>
                                                            <p className="card-text">
                                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                                {job.location}
                                                            </p>
                                                            <p className="card-text">
                                                                <small className="text-muted">
                                                                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                                                                </small>
                                                            </p>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button 
                                                                className="btn btn-outline-primary btn-sm" 
                                                                onClick={() => startEditJob(job)}
                                                            >
                                                                <i className="fas fa-edit me-1"></i>
                                                                Edit
                                                            </button>
                                                            <button 
                                                                className="btn btn-outline-info btn-sm"
                                                                onClick={() => {
                                                                    setActiveTab('applications');
                                                                    // Could filter applications for this job
                                                                }}
                                                            >
                                                                <i className="fas fa-users me-1"></i>
                                                                Applications
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <div>
                            <h4>Job Applications</h4>
                            {applications.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5>No applications yet</h5>
                                    <p className="text-muted">Applications for your job postings will appear here.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {applications.map(app => (
                                        <div key={app._id} className="col-12 mb-3">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="row align-items-center">
                                                        <div className="col-md-6">
                                                            <h6 className="card-title mb-1">{app.job.title}</h6>
                                                            <p className="card-text mb-1">
                                                                <strong>Applicant:</strong> {app.applicant.name}
                                                            </p>
                                                            <p className="card-text mb-1">
                                                                <strong>Email:</strong> {app.applicant.email}
                                                            </p>
                                                            <p className="card-text small text-muted">
                                                                Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <ApplicationStatusBadge status={app.status} />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="d-grid gap-2">
                                                                <select 
                                                                    className="form-select form-select-sm"
                                                                    value={app.status}
                                                                    onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                                                >
                                                                    <option value="applied">Applied</option>
                                                                    <option value="under_review">Under Review</option>
                                                                    <option value="accepted">Accepted</option>
                                                                    <option value="rejected">Rejected</option>
                                                                </select>
                                                                {app.resume && (
                                                                    <a 
                                                                        href={app.resume}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-outline-secondary btn-sm"
                                                                    >
                                                                        <i className="fas fa-download me-1"></i>
                                                                        Resume
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {app.coverLetter && (
                                                        <div className="mt-3">
                                                            <h6>Cover Letter:</h6>
                                                            <p className="small">{app.coverLetter}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Edit Job Modal */}
            {editingJob && (
                <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Job</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setEditingJob(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Job Title</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={jobTitle} 
                                        onChange={(e) => setJobTitle(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Company</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={jobCompany} 
                                        onChange={(e) => setJobCompany(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={jobLocation} 
                                        onChange={(e) => setJobLocation(e.target.value)} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea 
                                        className="form-control" 
                                        rows="4"
                                        value={jobDescription} 
                                        onChange={(e) => setJobDescription(e.target.value)} 
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setEditingJob(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    onClick={saveJobEdit}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerDashboard;