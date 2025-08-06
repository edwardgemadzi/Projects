import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import ApplicationStatusBadge from "../components/applications/ApplicationStatusBadge";
import { useNotification } from "../components/ui/NotificationProvider";
import { useAsync } from "../hooks/useAsync";

const ApplicationsPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [sortBy, setSortBy] = useState('date');
    const [filterStatus, setFilterStatus] = useState('all');
    const [applications, setApplications] = useState([]);

    const {
        loading,
        error,
        execute: fetchApplications
    } = useAsync();

    useEffect(() => {
        if (user?.role === "jobseeker") {
            const loadApplications = async () => {
                try {
                    const result = await fetchApplications(async () => {
                        const res = await axiosInstance.get('/applications/user');
                        return res.data || [];
                    });
                    setApplications(result);
                } catch (err) {
                    showNotification('Failed to load applications', 'error');
                }
            };
            loadApplications();
        }
    }, [user, fetchApplications, showNotification]);

    if (!user || user.role !== "jobseeker") {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Access denied. This page is only available to job seekers.
                </div>
            </div>
        );
    }

    const filteredApplications = applications ? applications
        .filter(app => filterStatus === 'all' || app.status === filterStatus)
        .sort((a, b) => {
            switch (sortBy) {
                case 'company':
                    return a.job.company.localeCompare(b.job.company);
                case 'title':
                    return a.job.title.localeCompare(b.job.title);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'date':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        }) : [];

    const statusCounts = applications ? applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
    }, {}) : {};

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-file-alt me-2"></i>
                    My Applications
                </h2>
                <span className="badge bg-primary fs-6">
                    {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    Failed to load applications. Please try again.
                </div>
            )}

            {loading ? (
                <LoadingSpinner message="Loading your applications..." />
            ) : applications && applications.length === 0 ? (
                <EmptyState
                    icon="file-alt"
                    title="No applications yet"
                    description="You haven't applied for any jobs yet. Start browsing jobs and submit your first application!"
                    actionText="Browse Jobs"
                    onAction={() => navigate('/jobs')}
                />
            ) : (
                <>
                    {/* Status Summary Cards */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{statusCounts.applied || 0}</h5>
                                    <p className="card-text small">Applied</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title text-warning">{statusCounts.under_review || 0}</h5>
                                    <p className="card-text small">Under Review</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title text-success">{statusCounts.accepted || 0}</h5>
                                    <p className="card-text small">Accepted</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card text-center">
                                <div className="card-body">
                                    <h5 className="card-title text-danger">{statusCounts.rejected || 0}</h5>
                                    <p className="card-text small">Rejected</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Sorting */}
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <select 
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Applications</option>
                                <option value="applied">Applied</option>
                                <option value="under_review">Under Review</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <select 
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date">Sort by Date</option>
                                <option value="company">Sort by Company</option>
                                <option value="title">Sort by Job Title</option>
                                <option value="status">Sort by Status</option>
                            </select>
                        </div>
                    </div>

                    {/* Applications List */}
                    <div className="row">
                        {filteredApplications.map(app => (
                            <div key={app._id} className="col-12 mb-3">
                                <div className="card application-card">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col-md-8">
                                                <h5 className="card-title mb-1">{app.job.title}</h5>
                                                <h6 className="card-subtitle text-muted mb-2">{app.job.company}</h6>
                                                <p className="card-text small mb-2">
                                                    <i className="fas fa-map-marker-alt me-1"></i>
                                                    {app.job.location}
                                                </p>
                                                <p className="card-text small text-muted">
                                                    <i className="fas fa-calendar me-1"></i>
                                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="col-md-4 text-end">
                                                <ApplicationStatusBadge status={app.status} className="mb-2" />
                                                <div className="d-grid gap-2">
                                                    <button 
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => navigate(`/jobs/${app.job._id}`)}
                                                    >
                                                        <i className="fas fa-eye me-1"></i>
                                                        View Job
                                                    </button>
                                                    {app.resume && (
                                                        <a 
                                                            href={app.resume}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-outline-secondary btn-sm"
                                                        >
                                                            <i className="fas fa-download me-1"></i>
                                                            Download Resume
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {app.coverLetter && (
                                            <div className="mt-3">
                                                <h6>Cover Letter:</h6>
                                                <p className="small text-muted">{app.coverLetter}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ApplicationsPage;