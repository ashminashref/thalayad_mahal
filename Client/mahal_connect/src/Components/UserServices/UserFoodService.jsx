import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Utensils, Calendar, MapPin, Loader2, ChefHat, ArrowLeft } from "lucide-react";
import axios from "axios";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import "./UserFoodService.css";
import Floatingnav from "../../Common/User/FloatingNav";

const UserFoodServicePage = () => {
  const navigate = useNavigate();
  const [foodServices, setFoodServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFoodServices = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/food-services/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoodServices(res.data);
    } catch (err) {
      console.error("Error fetching food services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodServices();
  }, []);

  return (
    <div className="user-food-portal animate-fade-in">
      {/* Premium Header */}
      <header className="food-hero-section">
        <div className="hero-overlay">
          <button onClick={() => navigate("/")} className="back-btn-glass">
            <ArrowLeftIcon />
          </button>
          <div className="hero-text-content">
            <h1 className="main-title-curly">Food Services</h1>
            <p className="sub-title-text">Nourishing our community, one meal at a time</p>
          </div>
        </div>
      </header>

      <div className="content-container">
        {loading ? (
          <div className="premium-loader">
            <Loader2 className="spinner-icon" />
            <span>Loading active programs...</span>
          </div>
        ) : foodServices.length > 0 ? (
          <div className="food-grid-premium">
            {foodServices.map((item) => (
              <div key={item.id} className="premium-food-card">
                <div className="card-badge">
                   <span className="dot"></span> Active Program
                </div>
                
                <div className="card-body-content">
                  <div className="icon-header">
                    <div className="food-icon-circle">
                      <ChefHat size={24} />
                    </div>
                    <h2 className="event-title-text">{item.event_name}</h2>
                  </div>

                  <div className="detail-stack">
                    <div className="detail-item">
                      <Utensils size={16} className="item-icon" />
                      <div className="item-info">
                        <label>Menu</label>
                        <span>{item.food_name}</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <Calendar size={16} className="item-icon" />
                      <div className="item-info">
                        <label>Date</label>
                        <span>{new Date(item.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sponsor-footer">
                    <div className="sponsor-info">
                      <Users size={14} />
                      <span>By: <strong>{item.provider_name || "Mahal Committee"}</strong></span>
                    </div>
                    <button
                      className="btn-view-details-premium"
                      onClick={() => navigate(`/services/foodservice/${item.id}`)}
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <Utensils size={48} className="empty-icon" />
            <h3>No Scheduled Distributions</h3>
            <p>We'll notify you via email when the next food service is announced.</p>
          </div>
        )}
      </div>

      <Floatingnav />
    </div>
  );
};

export default UserFoodServicePage;