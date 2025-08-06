import React, { useState } from 'react';

const JobFilters = ({ onFiltersChange, industries = [], locations = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industry: '',
    sortBy: 'newest'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      industry: '',
      sortBy: 'newest'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.location || filters.industry || filters.sortBy !== 'newest';

  return (
    <div className="mb-4">
      {/* Clickable Filter Button */}
      <button 
        className={`btn btn-outline-primary w-100 p-3 text-start ${isExpanded ? 'active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ borderStyle: 'dashed' }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-filter me-2"></i>
            <strong>Filter & Sort Jobs</strong>
            {hasActiveFilters && (
              <span className="badge bg-primary ms-2">
                {[filters.search && 'Search', filters.location && 'Location', filters.industry && 'Industry'].filter(Boolean).length} active
              </span>
            )}
          </div>
          <div className="d-flex align-items-center gap-2">
            {hasActiveFilters && (
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilters();
                }}
              >
                <i className="fas fa-times me-1"></i>
                Clear
              </button>
            )}
            <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </div>
        </div>
      </button>
      
      {/* Expandable Filter Panel */}
      {isExpanded && (
        <div className="card mt-2">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-6">
                <label className="form-label small">Search Keywords</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Job title, company, skills..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="col-md-3">
                <label className="form-label small">Location</label>
                <select
                  className="form-select"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry */}
              <div className="col-md-3">
                <label className="form-label small">Industry</label>
                <select
                  className="form-select"
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                >
                  <option value="">All Industries</option>
                  {industries.map((industry, index) => (
                    <option key={index} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="col-md-6">
                <label className="form-label small">Sort By</label>
                <select
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="company">Company A-Z</option>
                  <option value="title">Job Title A-Z</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="col-12">
                <label className="form-label small">Quick Filters</label>
                <div className="d-flex flex-wrap gap-2">
                  <button 
                    className={`btn btn-sm ${filters.search.includes('remote') ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleFilterChange('search', filters.search.includes('remote') ? '' : 'remote')}
                  >
                    <i className="bi bi-house me-1"></i>
                    Remote
                  </button>
                  <button 
                    className={`btn btn-sm ${filters.search.includes('full-time') ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleFilterChange('search', filters.search.includes('full-time') ? '' : 'full-time')}
                  >
                    <i className="bi bi-clock me-1"></i>
                    Full-time
                  </button>
                  <button 
                    className={`btn btn-sm ${filters.search.includes('part-time') ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handleFilterChange('search', filters.search.includes('part-time') ? '' : 'part-time')}
                  >
                    <i className="bi bi-clock-history me-1"></i>
                    Part-time
                  </button>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-top">
                <small className="text-muted">Active filters:</small>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {filters.search && (
                    <span className="badge bg-primary">
                      Search: {filters.search}
                      <button 
                        className="btn-close btn-close-white ms-1" 
                        style={{ fontSize: '0.7em' }}
                        onClick={() => handleFilterChange('search', '')}
                      ></button>
                    </span>
                  )}
                  {filters.location && (
                    <span className="badge bg-primary">
                      Location: {filters.location}
                      <button 
                        className="btn-close btn-close-white ms-1" 
                        style={{ fontSize: '0.7em' }}
                        onClick={() => handleFilterChange('location', '')}
                      ></button>
                    </span>
                  )}
                  {filters.industry && (
                    <span className="badge bg-primary">
                      Industry: {filters.industry}
                      <button 
                        className="btn-close btn-close-white ms-1" 
                        style={{ fontSize: '0.7em' }}
                        onClick={() => handleFilterChange('industry', '')}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
