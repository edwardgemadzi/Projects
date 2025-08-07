import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useNotification } from '../components/ui/NotificationProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axiosInstance.post('/auth/forgot-password', { email });
            setSubmitted(true);
            showNotification('Password reset link sent to your email', 'success');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            showNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body text-center p-5">
                                <div className="mb-4">
                                    <i className="fas fa-envelope-open text-success" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title mb-3">Check Your Email</h4>
                                <p className="text-muted mb-4">
                                    We've sent a password reset link to <strong>{email}</strong>
                                </p>
                                <div className="alert alert-info">
                                    <small>
                                        <i className="fas fa-info-circle me-2"></i>
                                        In development mode, check the console for the reset token.
                                    </small>
                                </div>
                                <Link to="/login" className="btn btn-primary">
                                    <i className="fas fa-arrow-left me-2"></i>
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <i className="fas fa-lock text-primary" style={{ fontSize: '3rem' }}></i>
                                <h3 className="mt-3">Forgot Password?</h3>
                                <p className="text-muted">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        <i className="fas fa-envelope me-2"></i>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane me-2"></i>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link to="/login" className="text-decoration-none">
                                        <i className="fas fa-arrow-left me-1"></i>
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage; 