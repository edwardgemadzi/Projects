import React, { useState, useContext } from "react";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Toast } from "bootstrap";

const PostJobPage = () => {
    const { showNotification } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [industry, setIndustry] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let logoURL = '';
        
        if(logoFile) {
            const formData = new FormData();
            formData.append('file', logoFile);

            try {
                const uploadRes = await axiosInstance.post('/upload', formData, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                logoURL = uploadRes.data.url;
            } catch (err) {
                console.error('Image upload failed:', err);
                showNotification('Failed to upload image.');
                return;
            }
        }

        if (!title || !company || !location || !industry || !description) {
            showNotification('All fields are required.');
            return;
        }
        if (title.length < 3) {
            showNotification('Job title must be at least 3 characters.');
            return;
        }
        try {
            const newJob = {
                title,
                company,
                location,
                industry,
                skills: skills.split(',').map(s => s.trim()).filter(Boolean),
                description,
                logo: logoURL
            };
            await axiosInstance.post('/jobs/create', newJob);
            showNotification("Job posted successfully!");
            setTitle('');
            setCompany('');
            setLocation('');
            setIndustry('');
            setSkills('');
            setDescription('');
        } catch (err) {
            showNotification("Failed to post job: " + (err.response?.data?.message || err.message));
        }
    };

    return(
        <div className="container mt-5">
            <h2 className="mb-4">Post a Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Job Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                        type="text"
                        className="form-control"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Industry</label>
                    <input
                        type="text"
                        className="form-control"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Skills (comma separated)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Job Description</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Company Logo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-success">Post Job</button>
            </form>
        </div>
    );
};

export default PostJobPage;