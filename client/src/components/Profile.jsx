import { useState, useEffect } from 'react';
import './Profile.css';

function Profile({ user, onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProfileData({
        username: user.username,
        email: `${user.username}@example.com`,
        joinDate: new Date().toLocaleDateString(),
        totalLists: Math.floor(Math.random() * 10) + 1,
        totalTodos: Math.floor(Math.random() * 50) + 1
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <div className="profile-header">
          <h2>Profile</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="profile-content">
            <p><strong>Username:</strong> {profileData.username}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Join Date:</strong> {profileData.joinDate}</p>
            <p><strong>Total Lists:</strong> {profileData.totalLists}</p>
            <p><strong>Total Todos:</strong> {profileData.totalTodos}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
