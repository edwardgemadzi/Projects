import { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [notification, setNotification] = useState("");
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log('Fetching user data...');
                const res = await axiosInstance.get('/auth/me');
                console.log('User data received:', res.data);
                setUser(res.data);
            } catch (err) {
                console.error('Error fetching user:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 5000);
    };

    const login = async (credentials) => {
        try {
            const res = await axiosInstance.post("/auth/login", credentials);
            setUser(res.data);
            navigate('/profile');
        } catch (err) {
            showNotification("Login failed: " + (err.response?.data?.message || err.message));
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
            setUser(null);
            navigate('/login');
        } catch (err) {
            showNotification('Logout failed: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            setUser,
            notification,
            showNotification,
            loading // Expose loading state
        }}>
            {children}
            {notification && (
                <div className="alert alert-info position-fixed top-0 end-0 m-3" style={{ zIndex: 9999, minWidth: 250 }}>
                    {notification}
                </div>
            )}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};