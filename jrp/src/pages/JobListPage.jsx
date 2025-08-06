import React, { useState, useEffect, useContext } from "react";
import EnhancedJobCard from "../components/jobs/EnhancedJobCard";
import JobFilters from "../components/jobs/JobFilters";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/ui/NotificationProvider";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { useAsync } from "../hooks/useAsync";


const JobListPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industry: '',
    sortBy: 'newest'
  });

  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchResults, setSearchResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6); // Configurable items per page

  const {
    loading,
    error,
    execute: fetchJobs
  } = useAsync();

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const result = await fetchJobs(async () => {
          const res = await axiosInstance.get('/jobs');
          return Array.isArray(res.data.jobs) ? res.data.jobs : [];
        });
        setJobsData(result);
        setFilteredJobs(result);
        setSearchResults(result.length);
      } catch {
        showNotification('Failed to load jobs', 'error');
      }
    };
    loadJobs();
  }, [fetchJobs, showNotification]);

  // Filter and sort jobs when filters change
  useEffect(() => {
    let filtered = [...jobsData];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (job.skills && job.skills.some(skill => 
          skill.toLowerCase().includes(filters.search.toLowerCase())
        ))
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply industry filter
    if (filters.industry) {
      filtered = filtered.filter(job =>
        job.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredJobs(filtered);
    setSearchResults(filtered.length);
    setCurrentPage(1); // Reset to first page when filters change
  }, [jobsData, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      industry: '',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.search || filters.location || filters.industry;

  const handleViewClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <nav aria-label="Job listings pagination" className="d-flex justify-content-center mt-4">
        <ul className="pagination pagination-lg">
          {/* Previous button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <i className="fas fa-chevron-left me-1"></i>
              Previous
            </button>
          </li>

          {/* First page if not visible */}
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <button 
                className="page-link"
                onClick={() => handlePageChange(number)}
                aria-label={`Go to page ${number}`}
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            </li>
          ))}

          {/* Last page if not visible */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </li>
            </>
          )}

          {/* Next button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
              <i className="fas fa-chevron-right ms-1"></i>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mt-5">
      {/* Welcome Section for Job Seekers */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="jumbotron bg-primary text-white rounded p-5 mb-4">
            <h1 className="display-4">
              <i className="fas fa-handshake me-3"></i>
              Welcome, {user?.name}!
            </h1>
            <p className="lead">
              Discover your next career opportunity. Browse through {jobsData?.length || 0} available positions 
              from top companies looking for talented professionals like you.
            </p>
            <div className="d-flex gap-3 mt-4">
              <button 
                className="btn btn-light btn-lg"
                onClick={() => navigate('/applications')}
              >
                <i className="fas fa-file-alt me-2"></i>
                My Applications
              </button>
              <button 
                className="btn btn-outline-light btn-lg"
                onClick={() => navigate('/profile')}
              >
                <i className="fas fa-user me-2"></i>
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-briefcase me-2"></i>
          Available Jobs
        </h2>
        <div className="d-flex align-items-center gap-3">
          {hasActiveFilters && (
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={clearFilters}
            >
              <i className="fas fa-times me-1"></i>
              Clear Filters
            </button>
          )}
          <span className="badge bg-primary fs-6">
            {searchResults} job{searchResults !== 1 ? 's' : ''} found
            {totalPages > 1 && (
              <span className="ms-2">
                (Page {currentPage} of {totalPages})
              </span>
            )}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error.message || error.toString() || 'Failed to load jobs'}
        </div>
      )}

      <JobFilters 
        onFiltersChange={handleFilterChange}
        industries={[...new Set(jobsData?.map(job => job.industry).filter(Boolean))]}
        locations={[...new Set(jobsData?.map(job => job.location).filter(Boolean))]}
      />

      {loading ? (
        <LoadingSpinner message="Loading jobs..." />
      ) : filteredJobs.length > 0 ? (
        <>
          <div className="row">
            {currentJobs.map(job => (
              <div key={job._id} className="col-12 mb-3">
                <EnhancedJobCard
                  job={job}
                  onViewClick={() => handleViewClick(job._id)}
                  user={user}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
              <small className="text-muted">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </small>
              <div className="d-flex align-items-center gap-3">
                <small className="text-muted">Jobs per page:</small>
                <span className="badge bg-secondary">{jobsPerPage}</span>
              </div>
            </div>
          )}
          
          {/* Pagination Controls */}
          {renderPagination()}
        </>
      ) : (
        <EmptyState
          icon="briefcase"
          title="No jobs found"
          description={hasActiveFilters
            ? "No jobs match your current filters. Try adjusting your search criteria."
            : "No jobs are currently available. Check back later for new opportunities."
          }
          actionText={hasActiveFilters ? "Clear Filters" : null}
          onAction={hasActiveFilters ? clearFilters : null}
        />
      )}
    </div>
  );
};

export default JobListPage;