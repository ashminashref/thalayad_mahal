import React, { useState, useEffect, useCallback } from "react";
import "./FloatingNav.css";
import { House, User, Bell } from "lucide-react";
import { NavLink } from "react-router-dom"; 
import axios from "axios";

function Floatingnav() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotificationCount = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const res = await axios.get("http://127.0.0.1:8000/api/announcements/", {
        headers: { Authorization: `Bearer ${token.trim()}` }
      });
      
      const allAnnouncements = res.data;
      
      // Get seen IDs and ensure they are numbers for strict comparison
      const seenIds = JSON.parse(localStorage.getItem('read_announcement_ids') || '[]').map(Number);
      
      // Filter out any announcement whose ID exists in our 'seen' list
      const unreadItems = allAnnouncements.filter(ann => !seenIds.includes(Number(ann.id)));
      
      setUnreadCount(unreadItems.length);
    } catch (err) {
      console.error("Could not fetch notification count", err);
    }
  }, []);

  useEffect(() => {
    fetchNotificationCount();
    
    // Listen for storage changes from other tabs
    window.addEventListener('storage', fetchNotificationCount);
    
    // Custom listener for the same tab (since 'storage' only fires on other tabs)
    window.addEventListener('notificationsUpdated', fetchNotificationCount);
    
    const interval = setInterval(fetchNotificationCount, 120000);
    
    return () => {
      window.removeEventListener('storage', fetchNotificationCount);
      window.removeEventListener('notificationsUpdated', fetchNotificationCount);
      clearInterval(interval);
    };
  }, [fetchNotificationCount]);

  return (
    <nav className="floating-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        <div className="nav-item d-flex flex-column align-items-center justify-content-center">
          <House className="lucide-icon" /> <span>Home</span>
        </div>
      </NavLink>

      <NavLink 
        to="/notification" 
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        <div className="nav-item d-flex flex-column align-items-center justify-content-center position-relative">
          <Bell className="lucide-icon" />
          
          {/* Enhanced Badge Logic */}
          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          <span>Notifications</span>
        </div>
      </NavLink>

      <NavLink 
        to="/userprofile" 
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        <div className="nav-item d-flex flex-column align-items-center justify-content-center">
          <User className="lucide-icon" /> <span>Profile</span>
        </div>
      </NavLink>
    </nav>
  );
}

export default Floatingnav;