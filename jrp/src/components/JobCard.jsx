import React from "react";

const JobCard = ({title, company, location, description, onViewClick, logo }) => {
    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                {logo && (
                    <img
                        src={logo}
                        alt={`${company} logo`}
                        style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '10px' }}
                    />
                )}
                <h5 className="card-title">{title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{company}</h6>
                <p className="card-text"><strong>Location:</strong>{location}</p>
                <p className="card-text">{description}</p>
                <button className="btn btn-primary" onClick={onViewClick}>View Details</button>
            </div>
        </div>
    );
};

export default JobCard;