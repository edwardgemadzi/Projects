import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Route based on user role
            switch (user.role) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'employer':
                    navigate('/employer');
                    break;
                case 'jobseeker':
                    navigate('/jobs');
                    break;
                default:
                    navigate('/login');
            }
        } else if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <LoadingSpinner message="Loading..." />;
    }

    return (
        <div className="container mt-5">
            <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Redirecting...</span>
                </div>
                <p className="mt-2">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
};

export default HomePage;
