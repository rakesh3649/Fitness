import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!token || !savedUser) {
            navigate('/login');
            return;
        }

        try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setFormData({
                name: userData.name || '',
                phone: userData.phone || ''
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Update local storage
            const updatedUser = { ...user, ...data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            setMessage({
                type: 'success',
                text: 'Profile updated successfully!'
            });

            setEditMode(false);

        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">My Profile</h2>

                {message.text && (
                    <div className={`auth-${message.type}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-info">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3>{user.name}</h3>
                            <p className="profile-email">{user.email}</p>
                            <span className={`profile-badge ${user.role}`}>
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {editMode ? (
                        <form onSubmit={handleUpdate} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={onChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={onChange}
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="auth-btn"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    className="auth-btn secondary"
                                    onClick={() => setEditMode(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Phone:</span>
                                <span className="detail-value">{user.phone || 'Not set'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Member Since:</span>
                                <span className="detail-value">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="profile-actions">
                        {!editMode && (
                            <button 
                                className="auth-btn"
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                        <button 
                            className="auth-btn secondary"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;