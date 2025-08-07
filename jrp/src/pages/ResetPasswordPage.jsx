import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useNotification } from '../components/ui/NotificationProvider';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { showNotification } = useNotification();

    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        setLoading(true);

        try {
            await axiosInstance.post('/auth/reset-password', { 
                token, 
                password 
            });
            setSuccess(true);
            showNotification('Password reset successful', 'success');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to reset password';
            showNotification(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body text-center p-5">
                                <div className="mb-4">
                                    <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title mb-3">Invalid Reset Link</h4>
                                <p className="text-muted mb-4">
                                    The password reset link is invalid or has expired.
                                </p>
                                <Link to="/forgot-password" className="btn btn-primary">
                                    <i className="fas fa-redo me-2"></i>
                                    Request New Reset Link
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body text-center p-5">
                                <div className="mb-4">
                                    <i className="fas fa-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                                </div>
                                <h4 className="card-title mb-3">Password Reset Successful!</h4>
                                <p className="text-muted mb-4">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </p>
                                <Link to="/login" className="btn btn-primary">
                                    <i className="fas fa-sign-in-alt me-2"></i>
                                    Go to Login
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
                                <i className="fas fa-key text-primary" style={{ fontSize: '3rem' }}></i>
                                <h3 className="mt-3">Reset Your Password</h3>
                                <p className="text-muted">
                                    Enter your new password below.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        <i className="fas fa-lock me-2"></i>
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        required
                                        minLength="6"
                                    />
                                    <div className="form-text">
                                        Password must be at least 6 characters long
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">
                                        <i className="fas fa-lock me-2"></i>
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
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
                                            Resetting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Reset Password
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

export default ResetPasswordPage; 