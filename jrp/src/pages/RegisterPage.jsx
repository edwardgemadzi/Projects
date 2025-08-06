import React, {useState, useContext} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { validateEmail, validatePassword } from "../utils/helpers";

function Register (){
    const { showNotification } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("jobseeker");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [termsAccepted, setTermsAccepted] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!name.trim() || name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters long.';
        }
        
        if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            newErrors.password = passwordValidation.message;
        }
        
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        
        if (!termsAccepted) {
            newErrors.terms = 'You must accept the terms and conditions.';
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
            await axiosInstance.post('/auth/register', { name: name.trim(), email, password, role });
            showNotification('Registration successful! Please log in.', 'success');
            navigate('/login');
        } catch (error) {
            showNotification('Registration failed: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (!password) return '';
        const validation = validatePassword(password);
        if (validation.isValid) return 'Strong';
        if (password.length >= 6) return 'Medium';
        return 'Weak';
    };

    const getPasswordStrengthColor = () => {
        const strength = getPasswordStrength();
        if (strength === 'Strong') return 'success';
        if (strength === 'Medium') return 'warning';
        return 'danger';
    };

    if (loading) {
        return <LoadingSpinner message="Creating your account..." />;
    }

    return(
        <div className="container mt-5" style={{maxWidth: '500px'}}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="mb-4 text-center">
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <i className="fas fa-user me-2"></i>
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                value={name} 
                                onChange={(e)=>setName(e.target.value)} 
                                placeholder="Enter your full name"
                                required 
                            />
                            {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                            )}
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <i className="fas fa-envelope me-2"></i>
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={email} 
                                onChange={(e)=>setEmail(e.target.value)} 
                                placeholder="Enter your email"
                                required 
                            />
                            {errors.email && (
                                <div className="invalid-feedback">{errors.email}</div>
                            )}
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <i className="fas fa-lock me-2"></i>
                                Password
                            </label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={password} 
                                onChange={(e)=>setPassword(e.target.value)} 
                                placeholder="Create a strong password"
                                required 
                            />
                            {password && (
                                <div className={`mt-1 text-${getPasswordStrengthColor()}`}>
                                    <small>Password strength: {getPasswordStrength()}</small>
                                </div>
                            )}
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <i className="fas fa-lock me-2"></i>
                                Confirm Password
                            </label>
                            <input 
                                type="password" 
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                value={confirmPassword} 
                                onChange={(e)=>setConfirmPassword(e.target.value)} 
                                placeholder="Confirm your password"
                                required 
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">
                                <i className="fas fa-user-tag me-2"></i>
                                Account Type
                            </label>
                            <select 
                                className="form-control" 
                                value={role} 
                                onChange={e => setRole(e.target.value)} 
                                required
                            >
                                <option value="jobseeker">Job Seeker - Looking for opportunities</option>
                                <option value="employer">Employer - Posting job opportunities</option>
                            </select>
                        </div>
                        
                        <div className="form-group mb-3">
                            <div className="form-check">
                                <input 
                                    type="checkbox" 
                                    className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                                    id="termsCheck"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="termsCheck">
                                    I agree to the <a href="#" className="text-decoration-none">Terms of Service</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                                </label>
                                {errors.terms && (
                                    <div className="invalid-feedback d-block">{errors.terms}</div>
                                )}
                            </div>
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="text-center">
                        <p className="mb-0">
                            Already have an account? 
                            <Link to="/login" className="text-decoration-none ms-1">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;