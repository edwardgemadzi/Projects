import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../components/ui/NotificationProvider';

const AdminReportsPage = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState({
        users: [],
        jobs: [],
        applications: [],
        statistics: {
            totalUsers: 0,
            totalJobs: 0,
            totalApplications: 0,
            activeJobs: 0,
            verifiedUsers: 0,
            pendingApplications: 0
        },
        userGrowth: [],
        jobGrowth: [],
        applicationStats: [],
        topEmployers: [],
        popularIndustries: []
    });
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState('30');

    useEffect(() => {
        fetchReportData();
    }, [dateRange]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            
            // Fetch data with better error handling
            const [usersRes, jobsRes, applicationsRes] = await Promise.allSettled([
                axiosInstance.get('/admin/users'),
                axiosInstance.get('/admin/jobs'),
                axiosInstance.get('/admin/applications')
            ]);

            const users = usersRes.status === 'fulfilled' ? (usersRes.value.data || []) : [];
            const jobs = jobsRes.status === 'fulfilled' ? (jobsRes.value.data || []) : [];
            const applications = applicationsRes.status === 'fulfilled' ? (applicationsRes.value.data || []) : [];

            // Calculate statistics
            const statistics = {
                totalUsers: users.length,
                totalJobs: jobs.length,
                totalApplications: applications.length,
                activeJobs: jobs.filter(job => new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
                verifiedUsers: users.filter(user => user.isEmailVerified).length,
                pendingApplications: applications.filter(app => app.status === 'applied').length
            };

            // Calculate user growth (last 30 days)
            const userGrowth = calculateGrowth(users, 'createdAt', 30);
            const jobGrowth = calculateGrowth(jobs, 'createdAt', 30);

            // Application statistics
            const applicationStats = [
                { status: 'Applied', count: applications.filter(app => app.status === 'applied').length },
                { status: 'Under Review', count: applications.filter(app => app.status === 'under_review').length },
                { status: 'Accepted', count: applications.filter(app => app.status === 'accepted').length },
                { status: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
            ];

            // Top employers by job count
            const topEmployers = jobs.reduce((acc, job) => {
                const employer = job.createdBy?.name || 'Unknown';
                acc[employer] = (acc[employer] || 0) + 1;
                return acc;
            }, {});

            const topEmployersArray = Object.entries(topEmployers)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Popular industries
            const popularIndustries = jobs.reduce((acc, job) => {
                acc[job.industry] = (acc[job.industry] || 0) + 1;
                return acc;
            }, {});

            const popularIndustriesArray = Object.entries(popularIndustries)
                .map(([industry, count]) => ({ industry, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            setReportData({
                users,
                jobs,
                applications,
                statistics,
                userGrowth,
                jobGrowth,
                applicationStats,
                topEmployers: topEmployersArray,
                popularIndustries: popularIndustriesArray
            });
        } catch (error) {
            console.error('Error fetching report data:', error);
            showNotification('Failed to load report data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const calculateGrowth = (data, dateField, days) => {
        const growth = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            const count = data.filter(item => {
                const itemDate = new Date(item[dateField]);
                return itemDate >= startOfDay && itemDate <= endOfDay;
            }).length;

            growth.push({
                date: startOfDay.toLocaleDateString(),
                count
            });
        }
        return growth;
    };

    const exportReport = (type) => {
        let data = [];
        let filename = '';

        switch (type) {
            case 'users':
                data = reportData.users.map(user => ({
                    Name: user.name,
                    Email: user.email,
                    Role: user.role,
                    'Email Verified': user.isEmailVerified ? 'Yes' : 'No',
                    'Created At': new Date(user.createdAt).toLocaleDateString()
                }));
                filename = 'users_report.csv';
                break;
            case 'jobs':
                data = reportData.jobs.map(job => ({
                    Title: job.title,
                    Company: job.company,
                    Location: job.location,
                    Industry: job.industry,
                    'Created By': job.createdBy?.name || 'Unknown',
                    'Created At': new Date(job.createdAt).toLocaleDateString()
                }));
                filename = 'jobs_report.csv';
                break;
            case 'applications':
                data = reportData.applications.map(app => ({
                    Job: app.job?.title || 'Unknown',
                    Applicant: app.applicant?.name || 'Unknown',
                    Status: app.status,
                    'Applied At': new Date(app.createdAt).toLocaleDateString()
                }));
                filename = 'applications_report.csv';
                break;
        }

        if (data.length > 0) {
            const csvContent = [
                Object.keys(data[0]).join(','),
                ...data.map(row => Object.values(row).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotification(`${type} report exported successfully`, 'success');
        } else {
            showNotification('No data available to export', 'warning');
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-ban me-2"></i>
                    Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner message="Loading reports..." />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-chart-bar me-2"></i>
                    Admin Reports & Analytics
                </h2>
                <div className="d-flex gap-2">
                    <select 
                        className="form-select" 
                        value={dateRange} 
                        onChange={(e) => setDateRange(e.target.value)}
                        style={{ width: 'auto' }}
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Report Navigation */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="btn-group" role="group">
                        <button 
                            type="button" 
                            className={`btn ${selectedReport === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedReport('overview')}
                        >
                            <i className="fas fa-tachometer-alt me-2"></i>
                            Overview
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${selectedReport === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedReport('users')}
                        >
                            <i className="fas fa-users me-2"></i>
                            Users
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${selectedReport === 'jobs' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedReport('jobs')}
                        >
                            <i className="fas fa-briefcase me-2"></i>
                            Jobs
                        </button>
                        <button 
                            type="button" 
                            className={`btn ${selectedReport === 'applications' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedReport('applications')}
                        >
                            <i className="fas fa-file-alt me-2"></i>
                            Applications
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Report */}
            {selectedReport === 'overview' && (
                <div className="row">
                    {/* Statistics Cards */}
                    <div className="col-md-3 mb-4">
                        <div className="card bg-primary text-white">
                            <div className="card-body text-center">
                                <i className="fas fa-users fa-2x mb-3"></i>
                                <h4>{reportData.statistics.totalUsers}</h4>
                                <p className="card-text">Total Users</p>
                                <small>{reportData.statistics.verifiedUsers} verified</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card bg-success text-white">
                            <div className="card-body text-center">
                                <i className="fas fa-briefcase fa-2x mb-3"></i>
                                <h4>{reportData.statistics.totalJobs}</h4>
                                <p className="card-text">Total Jobs</p>
                                <small>{reportData.statistics.activeJobs} active</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card bg-info text-white">
                            <div className="card-body text-center">
                                <i className="fas fa-file-alt fa-2x mb-3"></i>
                                <h4>{reportData.statistics.totalApplications}</h4>
                                <p className="card-text">Applications</p>
                                <small>{reportData.statistics.pendingApplications} pending</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-4">
                        <div className="card bg-warning text-white">
                            <div className="card-body text-center">
                                <i className="fas fa-chart-line fa-2x mb-3"></i>
                                <h4>{reportData.statistics.totalJobs > 0 ? Math.round((reportData.statistics.totalApplications / reportData.statistics.totalJobs) * 100) : 0}%</h4>
                                <p className="card-text">Application Rate</p>
                                <small>per job</small>
                            </div>
                        </div>
                    </div>

                    {/* Growth Charts */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-chart-line me-2"></i>
                                    User Growth (Last {dateRange} days)
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>New Users</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.userGrowth.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.date}</td>
                                                    <td>{item.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-chart-bar me-2"></i>
                                    Application Status Distribution
                                </h5>
                            </div>
                            <div className="card-body">
                                {reportData.applicationStats.map((stat, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                        <span>{stat.status}</span>
                                        <span className="badge bg-primary">{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Employers */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-trophy me-2"></i>
                                    Top Employers
                                </h5>
                            </div>
                            <div className="card-body">
                                {reportData.topEmployers.length > 0 ? (
                                    reportData.topEmployers.map((employer, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                            <span>{employer.name}</span>
                                            <span className="badge bg-success">{employer.count} jobs</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No employer data available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Popular Industries */}
                    <div className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-industry me-2"></i>
                                    Popular Industries
                                </h5>
                            </div>
                            <div className="card-body">
                                {reportData.popularIndustries.length > 0 ? (
                                    reportData.popularIndustries.map((industry, index) => (
                                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                            <span>{industry.industry}</span>
                                            <span className="badge bg-info">{industry.count} jobs</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">No industry data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Users Report */}
            {selectedReport === 'users' && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="fas fa-users me-2"></i>
                            Users Report
                        </h5>
                        <button 
                            className="btn btn-success btn-sm"
                            onClick={() => exportReport('users')}
                        >
                            <i className="fas fa-download me-2"></i>
                            Export CSV
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Verified</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.users.length > 0 ? (
                                        reportData.users.map((user) => (
                                            <tr key={user._id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'employer' ? 'warning' : 'primary'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`badge bg-${user.isEmailVerified ? 'success' : 'secondary'}`}>
                                                        {user.isEmailVerified ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-muted">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Jobs Report */}
            {selectedReport === 'jobs' && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="fas fa-briefcase me-2"></i>
                            Jobs Report
                        </h5>
                        <button 
                            className="btn btn-success btn-sm"
                            onClick={() => exportReport('jobs')}
                        >
                            <i className="fas fa-download me-2"></i>
                            Export CSV
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Industry</th>
                                        <th>Posted By</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.jobs.length > 0 ? (
                                        reportData.jobs.map((job) => (
                                            <tr key={job._id}>
                                                <td>{job.title}</td>
                                                <td>{job.company}</td>
                                                <td>{job.location}</td>
                                                <td>{job.industry}</td>
                                                <td>{job.createdBy?.name || 'Unknown'}</td>
                                                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted">No jobs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Applications Report */}
            {selectedReport === 'applications' && (
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="fas fa-file-alt me-2"></i>
                            Applications Report
                        </h5>
                        <button 
                            className="btn btn-success btn-sm"
                            onClick={() => exportReport('applications')}
                        >
                            <i className="fas fa-download me-2"></i>
                            Export CSV
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Job</th>
                                        <th>Applicant</th>
                                        <th>Status</th>
                                        <th>Applied</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.applications.length > 0 ? (
                                        reportData.applications.map((application) => (
                                            <tr key={application._id}>
                                                <td>{application.job?.title || 'Unknown'}</td>
                                                <td>{application.applicant?.name || 'Unknown'}</td>
                                                <td>
                                                    <span className={`badge bg-${
                                                        application.status === 'accepted' ? 'success' :
                                                        application.status === 'rejected' ? 'danger' :
                                                        application.status === 'under_review' ? 'warning' : 'primary'
                                                    }`}>
                                                        {application.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted">No applications found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportsPage; 