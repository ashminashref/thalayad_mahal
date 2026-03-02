import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Utensils, Calendar, User, 
  Users, Info, Loader2, MapPin, ChefHat 
} from "lucide-react";
import axios from "axios";
import "./FoodServiceDetails.css";

const FoodServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://127.0.0.1:8000/api/food-services/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) return (
    <div className="details-loader">
      <Loader2 className="spinner" />
      <p>Fetching event details...</p>
    </div>
  );

  if (!event) return <div className="text-center py-5">Event not found.</div>;

  return (
    <div className="food-details-page animate-fade-in">
      <header className="details-header">
        <button onClick={() => navigate(-1)} className="back-btn-glass">
          <ArrowLeft size={20} />
        </button>
        <div className="header-text">
          <h1>{event.event_name}</h1>
          <p>Distribution Overview</p>
        </div>
      </header>

      <div className="details-container">
        <div className="details-grid">
          
          {/* Main Info Card */}
          <div className="info-main-card shadow-sm">
            <div className="section-title">
              <ChefHat size={20} />
              <h3>Program Details</h3>
            </div>
            
            <div className="data-row">
              <Utensils size={18} />
              <div>
                <label>Menu Item</label>
                <p>{event.food_name}</p>
              </div>
            </div>

            <div className="data-row">
              <Calendar size={18} />
              <div>
                <label>Date of Event</label>
                <p>{new Date(event.date).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}</p>
              </div>
            </div>

            <div className="data-row">
              <User size={18} />
              <div>
                <label>Sponsor / Provider</label>
                <p>{event.provider_name || "Mahal Committee"}</p>
              </div>
            </div>
          </div>

          {/* Team & Notes Card */}
          <div className="info-side-card shadow-sm">
            <div className="section-title">
              <Users size={20} />
              <h3>Team & Volunteers</h3>
            </div>
            <div className="notes-box">
              {event.notes ? (
                <p className="pre-wrap-text">{event.notes}</p>
              ) : (
                <p className="text-muted italic">No specific team members listed for this event.</p>
              )}
            </div>

            <div className="instruction-alert mt-4">
              <Info size={18} />
              <p>Please arrive at the Mahal premises 15 minutes before the scheduled time.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FoodServiceDetails;