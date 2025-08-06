import React from 'react';

const ApplicationStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'submitted':
        return {
          className: 'bg-warning text-dark',
          icon: 'bi-clock',
          text: 'Pending Review'
        };
      case 'reviewing':
      case 'under review':
        return {
          className: 'bg-info',
          icon: 'bi-eye',
          text: 'Under Review'
        };
      case 'shortlisted':
        return {
          className: 'bg-primary',
          icon: 'bi-star',
          text: 'Shortlisted'
        };
      case 'interview':
      case 'interview scheduled':
        return {
          className: 'bg-purple',
          icon: 'bi-camera-video',
          text: 'Interview Scheduled'
        };
      case 'rejected':
        return {
          className: 'bg-danger',
          icon: 'bi-x-circle',
          text: 'Not Selected'
        };
      case 'hired':
      case 'accepted':
        return {
          className: 'bg-success',
          icon: 'bi-check-circle',
          text: 'Hired'
        };
      default:
        return {
          className: 'bg-secondary',
          icon: 'bi-question-circle',
          text: status || 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`badge ${config.className}`}>
      <i className={`${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

export default ApplicationStatusBadge;
