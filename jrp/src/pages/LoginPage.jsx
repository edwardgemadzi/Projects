import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNotification } from "../components/ui/NotificationProvider";
import { validateEmail, validatePassword } from "../utils/helpers";
import LoadingSpinner from "../components/ui/LoadingSpinner";


function LogIn() {
    const { login } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        
        if (!validatePassword(password).isValid) {
            newErrors.password = validatePassword(password).message;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        try {
            await login({ email, password });
            showNotification('Login successful! Welcome back.', 'success');
        } catch {
            showNotification('Invalid credentials. Please check your email and password.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Logging you in..." />;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4 text-center">
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Email address</label>
                            <input 
                                type="email" 
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                placeholder="Enter your email"
                                required 
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Enter your password"
                                required 
                            />
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>
                    <div className="text-center">
                        <p className="mb-2">
                            Don't have an account? 
                            <Link to="/register" className="text-decoration-none ms-1">
                                Sign up here
                            </Link>
                        </p>
                        <p className="mb-0">
                            <Link to="/forgot-password" className="text-decoration-none text-muted">
                                Forgot your password?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogIn