import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const AdminManageUsers = () => {
  const { showNotification } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  
  // For editing users
  const [editingUser, setEditingUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  
  // For editing jobs
  const [editingJob, setEditingJob] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, jobsRes] = await Promise.all([
          axiosInstance.get('/admin/users'),
          axiosInstance.get('/admin/jobs')
        ]);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      } catch {
        showNotification('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [showNotification]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        showNotification('User deleted successfully');
      } catch {
        showNotification('Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axiosInstance.delete(`/admin/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
        showNotification('Job deleted successfully');
      } catch {
        showNotification('Failed to delete job');
      }
    }
  };

  const startEditUser = (user) => {
    setEditingUser(user);
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
  };

  const startEditJob = (job) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setJobCompany(job.company);
    setJobLocation(job.location);
    setJobDescription(job.description);
  };

  const saveUserEdit = async () => {
    try {
      await axiosInstance.put(`/admin/users/${editingUser._id}`, {
        name: userName,
        email: userEmail,
        role: userRole
      });
      
      setUsers(users.map(user => 
        user._id === editingUser._id 
          ? {...user, name: userName, email: userEmail, role: userRole} 
          : user
      ));
      
      setEditingUser(null);
      showNotification('User updated successfully');
    } catch {
      showNotification('Failed to update user');
    }
  };

  const saveJobEdit = async () => {
    try {
      await axiosInstance.put(`/admin/jobs/${editingJob._id}`, {
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

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Admin Management</h2>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('jobs')}
          >
            Manage Jobs
          </button>
        </li>
      </ul>
      
      {activeTab === 'users' && (
        <>
          <h3>Users</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2" 
                        onClick={() => startEditUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {editingUser && (
            <div className="card mt-4 p-3">
              <h4>Edit User</h4>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select 
                  className="form-control" 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <option value="jobseeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <button className="btn btn-success me-2" onClick={saveUserEdit}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'jobs' && (
        <>
          <h3>Jobs</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Posted By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>{job.location}</td>
                    <td>
                      {/* Add null check before accessing name property */}
                      {job.createdBy ? (typeof job.createdBy === 'object' ? job.createdBy.name : job.createdBy) : 'Unknown'}
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary me-2" 
                        onClick={() => startEditJob(job)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {editingJob && (
            <div className="card mt-4 p-3">
              <h4>Edit Job</h4>
              <div className="mb-3">
                <label className="form-label">Title</label>
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
                  value={jobDescription} 
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                ></textarea>
              </div>
              <div>
                <button className="btn btn-success me-2" onClick={saveJobEdit}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditingJob(null)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminManageUsers;