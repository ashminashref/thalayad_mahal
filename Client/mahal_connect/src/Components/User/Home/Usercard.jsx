import React, { useState, useEffect } from 'react';
import { Hash, Users, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Usercard.css';

function Usercard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // 1. Retrieve and clean token
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.error("No access token found in storage.");
        setLoading(false);
        setError(true);
        return;
      }

      try {
        // 2. Fetch profile with strict Bearer formatting
        const res = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
          headers: { 
            Authorization: `Bearer ${token.trim()}` 
          }
        });
        setProfile(res.data);
        setError(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response?.status === 401) {
          console.warn("Session expired or unauthorized. Redirecting to login...");
          localStorage.removeItem('access_token');
          navigate('/login');
        }
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className='mahal-card mt-4 d-flex justify-content-center align-items-center' style={{ minHeight: '180px' }}>
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className='mahal-card mt-4 d-flex flex-column justify-content-center align-items-center text-white p-3' style={{ minHeight: '180px', background: 'linear-gradient(135deg, #2c3e50, #000000)' }}>
        <AlertCircle size={30} className="mb-2 opacity-50" />
        <p className="small mb-0 opacity-75 text-center">Unable to load Mahal Identity.<br/>Please log in again.</p>
      </div>
    );
  }

  return (
    <div className='mahal-card mt-4 animate-fade-in'>
      {/* Decorative Background Pattern */}
      <div className="card-pattern"></div>
      
      <div className="card-content">
        <p className="card-label">MAHAL IDENTITY</p>
        
        {/* Dynamic Name from Django */}
        <h2 className="card-holder-name curly-txt">
          {profile.full_name || profile.first_name || profile.username}
        </h2>
        
        <div className="card-footer-info">
          {/* Mahal ID Section */}
          <div className="info-group">
            <div className="info-icon">
              <Hash size={24} strokeWidth={1.5} />
            </div>
            <div className="info-text">
              <span className="info-label">Mahal ID</span>
              <span className="info-value">
                {profile.mahal_id || profile.username || 'N/A'}
              </span>
            </div>
          </div>

          {/* Family Head Section */}
          <div className="info-group">
            <div className="info-icon">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <div className="info-text">
              <span className="info-label">Family Head</span>
              <span className="info-value">
                {profile.family_head || 'Self'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usercard;