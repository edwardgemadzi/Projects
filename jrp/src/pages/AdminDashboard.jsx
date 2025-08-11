import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useNotification } from "../components/ui/NotificationProvider";
import { useAsync } from "../hooks/useAsync";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [showDatabaseInfo, setShowDatabaseInfo] = useState(false);

    const {
        loading: usersLoading,
        execute: fetchUsersExecute
    } = useAsync();

    const {
        loading: jobsLoading,
        execute: fetchJobsExecute
    } = useAsync();

    const fetchUsers = useCallback(async () => {
        try {
            const result = await fetchUsersExecute(async () => {
                const res = await axiosInstance.get('/admin/users');
                return res.data || [];
            });
            setUsers(result);
        } catch {
            showNotification('Failed to load users', 'error');
        }
    }, [fetchUsersExecute, showNotification]);

    const fetchJobs = useCallback(async () => {
        try {
            const result = await fetchJobsExecute(async () => {
                const res = await axiosInstance.get('/admin/jobs');
                return res.data || [];
            });
            setJobs(result);
        } catch {
            showNotification('Failed to load jobs', 'error');
        }
    }, [fetchJobsExecute, showNotification]);

    const handleDatabaseClick = () => {
        setShowDatabaseInfo(!showDatabaseInfo);
        showNotification('Database information loaded', 'info');
    };

    useEffect(() => {
        if (user?.role === "admin") {
            fetchUsers();
            fetchJobs();
        }
    }, [user, fetchUsers, fetchJobs]);

    if (!user || user.role !== "admin") {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-ban me-2"></i>
                    Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Admin Dashboard
                </h2>
                <div className="badge bg-primary fs-6">
                    System Overview
                </div>
            </div>

            {/* Dashboard Stats Cards */}
            <div className="row mb-5">
                <div className="col-md-3">
                    <div className="card bg-primary text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-users fa-2x mb-3"></i>
                            <h4>{users ? users.length : 0}</h4>
                            <p className="card-text">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-briefcase fa-2x mb-3"></i>
                            <h4>{jobs ? jobs.length : 0}</h4>
                            <p className="card-text">Active Jobs</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-chart-line fa-2x mb-3"></i>
                            <h4>8</h4>
                            <p className="card-text">New This Week</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-file-alt fa-2x mb-3"></i>
                            <h4>24</h4>
                            <p className="card-text">Applications</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Navigation */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-cogs me-2"></i>
                                Admin Tools
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/users" className="btn btn-outline-primary w-100">
                                        <i className="fas fa-users-cog me-2"></i>
                                        Manage Users
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/reports" className="btn btn-outline-success w-100">
                                        <i className="fas fa-chart-bar me-2"></i>
                                        View Reports
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <Link to="/admin/settings" className="btn btn-outline-warning w-100">
                                        <i className="fas fa-cog me-2"></i>
                                        System Settings
                                    </Link>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button 
                                        className="btn btn-outline-info w-100"
                                        onClick={handleDatabaseClick}
                                    >
                                        <i className="fas fa-database me-2"></i>
                                        Database
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Database Information */}
            {showDatabaseInfo && (
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-database me-2"></i>
                                    Database Information
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6>Users Collection</h6>
                                                <h4>{users ? users.length : 0}</h4>
                                                <small className="text-muted">Total Records</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6>Jobs Collection</h6>
                                                <h4>{jobs ? jobs.length : 0}</h4>
                                                <small className="text-muted">Total Records</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="card bg-light">
                                            <div className="card-body text-center">
                                                <h6>Applications Collection</h6>
                                                <h4>0</h4>
                                                <small className="text-muted">Total Records</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <h6>Database Status:</h6>
                                    <div className="d-flex gap-3">
                                        <span className="badge bg-success">Connected</span>
                                        <span className="badge bg-info">MongoDB</span>
                                        <span className="badge bg-secondary">Production Ready</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Data Tables */}
            {!usersLoading && !jobsLoading && (
                <div className="row">
                    {/* Users Section */}
                    <div className="col-lg-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">
                                    <i className="fas fa-users me-2"></i>
                                    Recent Users
                                </h4>
                            </div>
                            <div className="card-body">
                                {users && users.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.slice(0, 5).map(user => (
                                                    <tr key={user._id}>
                                                        <td>
                                                            <strong>{user.name}</strong>
                                                        </td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            <span className={`badge bg-${
                                                                user.role === 'admin' ? 'danger' : 
                                                                user.role === 'employer' ? 'warning' : 'primary'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted">No users found.</p>
                                )}
                                <div className="text-center mt-3">
                                    <Link to="/admin/users" className="btn btn-primary">
                                        <i className="fas fa-users-cog me-2"></i>
                                        Manage All Users
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Section */}
                    <div className="col-lg-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="mb-0">
                                    <i className="fas fa-briefcase me-2"></i>
                                    Recent Jobs
                                </h4>
                            </div>
                            <div className="card-body">
                                {jobs && jobs.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Job Title</th>
                                                    <th>Company</th>
                                                    <th>Location</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobs.slice(0, 5).map(job => (
                                                    <tr key={job._id}>
                                                        <td>
                                                            <strong>{job.title}</strong>
                                                        </td>
                                                        <td>{job.company}</td>
                                                        <td className="text-muted">{job.location}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-muted">No jobs found.</p>
                                )}
                                <div className="text-center mt-3">
                                    <Link to="/admin/users" className="btn btn-primary">
                                        <i className="fas fa-briefcase me-2"></i>
                                        Manage All Jobs
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats Row */}
            <div className="row mt-4">
                <div className="col-md-3">
                    <div className="card text-center bg-primary text-white">
                        <div className="card-body">
                            <h3>{users ? users.filter(u => u.role === 'admin').length : 0}</h3>
                            <p className="mb-0">Admins</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-success text-white">
                        <div className="card-body">
                            <h3>{users ? users.filter(u => u.role === 'employer').length : 0}</h3>
                            <p className="mb-0">Employers</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-info text-white">
                        <div className="card-body">
                            <h3>{users ? users.filter(u => u.role === 'jobseeker').length : 0}</h3>
                            <p className="mb-0">Job Seekers</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card text-center bg-warning text-white">
                        <div className="card-body">
                            <h3>{jobs ? jobs.length : 0}</h3>
                            <p className="mb-0">Total Jobs</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;