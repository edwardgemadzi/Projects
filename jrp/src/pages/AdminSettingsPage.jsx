import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNotification } from '../components/ui/NotificationProvider';

const AdminSettingsPage = () => {
    const { user } = useContext(AuthContext);
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        system: {
            siteName: 'JRP - Job Recruitment Platform',
            siteDescription: 'Connect job seekers with employers',
            maintenanceMode: false,
            registrationEnabled: true,
            emailVerificationRequired: true,
            maxFileSize: 5,
            allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
            sessionTimeout: 7,
            rateLimitRequests: 100,
            rateLimitWindow: 15
        },
        email: {
            smtpHost: '',
            smtpPort: 587,
            smtpUser: '',
            smtpPass: '',
            fromEmail: 'noreply@jrp.com',
            fromName: 'JRP System'
        },
        security: {
            passwordMinLength: 6,
            requireSpecialChars: false,
            requireNumbers: true,
            requireUppercase: true,
            jwtExpiration: 7,
            maxLoginAttempts: 5,
            lockoutDuration: 15
        },
        features: {
            jobAlerts: true,
            emailNotifications: true,
            realTimeUpdates: false,
            analyticsTracking: true,
            socialLogin: false,
            advancedSearch: true
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            // In a real app, you'd fetch settings from the backend
            // For now, we'll use the default settings
            setSettings(settings);
        } catch (error) {
            showNotification('Failed to load settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = async (category) => {
        try {
            setSaving(true);
            // In a real app, you'd save settings to the backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            showNotification(`${category} settings saved successfully`, 'success');
        } catch (error) {
            showNotification('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSystemAction = async (action) => {
        try {
            setSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            
            switch (action) {
                case 'clearCache':
                    showNotification('System cache cleared successfully', 'success');
                    break;
                case 'backupDatabase':
                    showNotification('Database backup initiated', 'success');
                    break;
                case 'optimizeDatabase':
                    showNotification('Database optimization completed', 'success');
                    break;
                case 'clearLogs':
                    showNotification('System logs cleared', 'success');
                    break;
                default:
                    break;
            }
        } catch (error) {
            showNotification('Failed to perform system action', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!user || user.role !== 'admin') {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-ban me-2"></i>
                    Access denied. Admin privileges required.
                </div>
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner message="Loading settings..." />;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i className="fas fa-cog me-2"></i>
                    System Settings
                </h2>
                <div className="badge bg-primary fs-6">
                    Admin Configuration
                </div>
            </div>

            <div className="row">
                {/* System Settings */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fas fa-server me-2"></i>
                                System Configuration
                            </h5>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveSettings('system')}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Site Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.system.siteName}
                                    onChange={(e) => handleSettingChange('system', 'siteName', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Site Description</label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    value={settings.system.siteDescription}
                                    onChange={(e) => handleSettingChange('system', 'siteDescription', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.system.maintenanceMode}
                                        onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                                    />
                                    <label className="form-check-label">Maintenance Mode</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.system.registrationEnabled}
                                        onChange={(e) => handleSettingChange('system', 'registrationEnabled', e.target.checked)}
                                    />
                                    <label className="form-check-label">Enable Registration</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.system.emailVerificationRequired}
                                        onChange={(e) => handleSettingChange('system', 'emailVerificationRequired', e.target.checked)}
                                    />
                                    <label className="form-check-label">Require Email Verification</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Max File Size (MB)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.system.maxFileSize}
                                    onChange={(e) => handleSettingChange('system', 'maxFileSize', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Session Timeout (days)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.system.sessionTimeout}
                                    onChange={(e) => handleSettingChange('system', 'sessionTimeout', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fas fa-shield-alt me-2"></i>
                                Security Settings
                            </h5>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveSettings('security')}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Minimum Password Length</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.security.passwordMinLength}
                                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.security.requireSpecialChars}
                                        onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                                    />
                                    <label className="form-check-label">Require Special Characters</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.security.requireNumbers}
                                        onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
                                    />
                                    <label className="form-check-label">Require Numbers</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.security.requireUppercase}
                                        onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
                                    />
                                    <label className="form-check-label">Require Uppercase</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">JWT Expiration (days)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.security.jwtExpiration}
                                    onChange={(e) => handleSettingChange('security', 'jwtExpiration', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Max Login Attempts</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.security.maxLoginAttempts}
                                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Lockout Duration (minutes)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.security.lockoutDuration}
                                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fas fa-envelope me-2"></i>
                                Email Configuration
                            </h5>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveSettings('email')}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">SMTP Host</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.email.smtpHost}
                                    onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">SMTP Port</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={settings.email.smtpPort}
                                    onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">SMTP Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.email.smtpUser}
                                    onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">SMTP Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={settings.email.smtpPass}
                                    onChange={(e) => handleSettingChange('email', 'smtpPass', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">From Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={settings.email.fromEmail}
                                    onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">From Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={settings.email.fromName}
                                    onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Settings */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="fas fa-toggle-on me-2"></i>
                                Feature Toggles
                            </h5>
                            <button 
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveSettings('features')}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Save
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.jobAlerts}
                                        onChange={(e) => handleSettingChange('features', 'jobAlerts', e.target.checked)}
                                    />
                                    <label className="form-check-label">Job Alerts</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.emailNotifications}
                                        onChange={(e) => handleSettingChange('features', 'emailNotifications', e.target.checked)}
                                    />
                                    <label className="form-check-label">Email Notifications</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.realTimeUpdates}
                                        onChange={(e) => handleSettingChange('features', 'realTimeUpdates', e.target.checked)}
                                    />
                                    <label className="form-check-label">Real-time Updates</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.analyticsTracking}
                                        onChange={(e) => handleSettingChange('features', 'analyticsTracking', e.target.checked)}
                                    />
                                    <label className="form-check-label">Analytics Tracking</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.socialLogin}
                                        onChange={(e) => handleSettingChange('features', 'socialLogin', e.target.checked)}
                                    />
                                    <label className="form-check-label">Social Login</label>
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={settings.features.advancedSearch}
                                        onChange={(e) => handleSettingChange('features', 'advancedSearch', e.target.checked)}
                                    />
                                    <label className="form-check-label">Advanced Search</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Actions */}
                <div className="col-12 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-tools me-2"></i>
                                System Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <button 
                                        className="btn btn-outline-primary w-100"
                                        onClick={() => handleSystemAction('clearCache')}
                                        disabled={saving}
                                    >
                                        <i className="fas fa-broom me-2"></i>
                                        Clear Cache
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button 
                                        className="btn btn-outline-success w-100"
                                        onClick={() => handleSystemAction('backupDatabase')}
                                        disabled={saving}
                                    >
                                        <i className="fas fa-database me-2"></i>
                                        Backup Database
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button 
                                        className="btn btn-outline-warning w-100"
                                        onClick={() => handleSystemAction('optimizeDatabase')}
                                        disabled={saving}
                                    >
                                        <i className="fas fa-tachometer-alt me-2"></i>
                                        Optimize Database
                                    </button>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <button 
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => handleSystemAction('clearLogs')}
                                        disabled={saving}
                                    >
                                        <i className="fas fa-trash me-2"></i>
                                        Clear Logs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage; 