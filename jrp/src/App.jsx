import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogIn from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Profile from './pages/ProfilePage';
import JobListPage from './pages/JobListPage';
import JobDetailPage from './pages/JobDetailPage';
import PostJobPage from './pages/PostJobPage';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PrivateRoute from './components/PrivateRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'));
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage'));
const AdminManageUsers = lazy(() => import('./pages/AdminManageUsers'));
const AdminReportsPage = lazy(() => import('./pages/AdminReportsPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'));
const ApplyPage = lazy(() => import('./pages/ApplyPage'));
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><JobListPage /></PrivateRoute>} />
        <Route path="/jobs/:id" element={<PrivateRoute><JobDetailPage /></PrivateRoute>} />
        <Route path="/post-job" element={<PrivateRoute allowedRoles={['employer']}><PostJobPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><Suspense fallback={<LoadingSpinner />}><AdminDashboard /></Suspense></PrivateRoute>} />
        <Route path="/employer" element={<PrivateRoute allowedRoles={['employer']}><Suspense fallback={<LoadingSpinner />}><EmployerDashboard /></Suspense></PrivateRoute>} />
        <Route path="/applications" element={<PrivateRoute allowedRoles={['jobseeker']}><Suspense fallback={<LoadingSpinner />}><ApplicationsPage /></Suspense></PrivateRoute>} />
        <Route 
          path="/admin/users" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminManageUsers />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminReportsPage />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <Suspense fallback={<LoadingSpinner />}>
                <AdminSettingsPage />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/jobs/:jobId/apply" 
          element={
            <PrivateRoute allowedRoles={['jobseeker']}>
              <Suspense fallback={<div>Loading...</div>}>
                <ApplyPage />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
