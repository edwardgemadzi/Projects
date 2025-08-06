import React, { useEffect, useState, useContext } from "react";
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

    const {
        loading: usersLoading,
        error: usersError,
        execute: fetchUsersExecute
    } = useAsync();

    const {
        loading: jobsLoading,
        execute: fetchJobsExecute
    } = useAsync();

    const fetchUsers = async () => {
        try {
            const result = await fetchUsersExecute(async () => {
                const res = await axiosInstance.get('/admin/users');
                return res.data || [];
            });
            setUsers(result);
        } catch (err) {
            showNotification('Failed to load users', 'error');
        }
    };

    const fetchJobs = async () => {
        try {
            const result = await fetchJobsExecute(async () => {
                const res = await axiosInstance.get('/admin/jobs');
                return res.data || [];
            });
            setJobs(result);
        } catch (err) {
            showNotification('Failed to load jobs', 'error');
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            fetchUsers();
            fetchJobs();
        }
    }, [user]);

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
                            <i className="fas fa-building fa-2x mb-3"></i>
                            <h4>{users ? users.filter(u => u.role === 'employer').length : 0}</h4>
                            <p className="card-text">Employers</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-warning text-white">
                        <div className="card-body text-center">
                            <i className="fas fa-user-tie fa-2x mb-3"></i>
                            <h4>{users ? users.filter(u => u.role === 'jobseeker').length : 0}</h4>
                            <p className="card-text">Job Seekers</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-bolt me-2"></i>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/admin/users" className="btn btn-primary">
                                    <i className="fas fa-users me-2"></i>
                                    Manage Users
                                </Link>
                                <button className="btn btn-success" onClick={() => window.location.reload()}>
                                    <i className="fas fa-sync me-2"></i>
                                    Refresh Data
                                </button>
                                <button className="btn btn-info">
                                    <i className="fas fa-chart-bar me-2"></i>
                                    View Reports
                                </button>
                                <button className="btn btn-warning">
                                    <i className="fas fa-cog me-2"></i>
                                    System Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {usersError && (
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Error loading dashboard data
                </div>
            )}

            {(usersLoading || jobsLoading) ? (
                <LoadingSpinner />
            ) : (
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
                                                    <th>Role</th>
                                                    <th>Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.slice(0, 5).map(user => (
                                                    <tr key={user._id}>
                                                        <td>
                                                            <strong>{user.name}</strong>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${
                                                                user.role === 'admin' ? 'bg-danger' :
                                                                user.role === 'employer' ? 'bg-primary' : 'bg-success'
                                                            }`}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="text-muted">{user.email}</td>
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