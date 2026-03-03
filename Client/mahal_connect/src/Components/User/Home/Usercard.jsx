import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, ShieldCheck, MapPin, Share2, Award } from 'lucide-react';
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
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        setError(true);
        return;
      }
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
          headers: { Authorization: `Bearer ${token.trim()}` }
        });
        setProfile(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
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

  if (loading) return (
    <div className='mahal-identity-shimmer mt-4'>
      <Loader2 className="animate-spin text-success" size={32} />
    </div>
  );

  if (error || !profile) return (
    <div className='mahal-identity-fallback mt-4'>
      <AlertCircle size={30} className="mb-2 text-danger opacity-50" />
      <p className="small mb-0">Identity synchronization failed.</p>
    </div>
  );

  return (
    <div className='id-card-wrapper mt-4 animate-fade-in'>
      <div className='premium-mahal-card'>
        {/* Modern Depth Layers */}
        <div className="glass-reflection"></div>
        <div className="card-top-accent"></div>
        
        <div className="id-card-content">
          <div className="id-header">
            <div className="org-branding">
              <span className="geo-tag body-txt"><MapPin size={10} /> Kerala, Kozhikode</span>
              <h4 className="masjid-name-premium body-txt">Salafi Masjid Thalayad</h4>
            </div>
            {/* <div className="official-seal">
              <Award size={14} className="me-1" />
              <span>VERIFIED</span>
            </div> */}
          </div>

          <div className="id-body">
            <div className="name-section">
              <span className="label-caption"></span>
              <h2 className="member-name-large mt-4 curly-txt">
                {profile.full_name || profile.first_name || profile.username}
              </h2>
            </div>
          </div>

          <div className="id-footer">
            <div className="meta-grid">
              <div className="meta-item">
                <label className='body-txt'>MEMBER ID</label>
                <span className="mono-text body-txt">#{profile.id.toString().padStart(5, '0')}</span>
              </div>
             
            </div>
            <button className="id-action-btn" title="Share Identity">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usercard;