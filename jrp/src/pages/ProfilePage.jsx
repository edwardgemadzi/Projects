import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

function Profile(){
    const {user, logout, setUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [notification, setNotification] = useState("");

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(""), 5000);
    };

    const handleLogout = ()=>{
        logout();
        navigate('/login');
    };

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = { name, email };
            if (password) {
                if (!oldPassword) {
                    showNotification("Please enter your old password to change to a new one.");
                    return;
                }
                payload.password = password;
                payload.oldPassword = oldPassword;
            }
            const res = await axiosInstance.put('/auth/me', payload);
            setUser(res.data); // Update context so name/email update immediately
            showNotification("Profile updated!");
            setEditing(false);
            setPassword("");
            setOldPassword("");
        } catch (err) {
            showNotification(err.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Profile</h2>
            {notification && (
                <div className="alert alert-info position-fixed top-0 end-0 m-3" style={{zIndex: 9999, minWidth: 250}}>
                    {notification}
                </div>
            )}
            {user ? (
                <div>
                    {!editing ? (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <button className="btn btn-primary me-2" onClick={handleEdit}>Edit Profile</button>
                            <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
                        </>
                    ) : (
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label>Name</label>
                                <input type="text" className="form-control" value={name} onChange={e=>setName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>Old Password</label>
                                <input type="password" className="form-control" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label>New Password</label>
                                <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-success me-2">Save</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                        </form>
                    )}
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
}

export default Profile;