import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Badge } from 'react-bootstrap';
import { Plus, Edit2, Trash2, Calendar, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Announcements.css';

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

const fetchAnnouncements = async () => {
  try {
    const token = localStorage.getItem('access_token'); // Get stored token
    
    if (!token) {
        navigate('/login'); // Redirect if no token exists
        return;
    }

    const res = await axios.get("http://127.0.0.1:8000/api/announcements/", {
      headers: { 
        // IMPORTANT: Must have the space after 'Bearer'
        Authorization: `Bearer ${token.trim()}`
      }
    });
    setAnnouncements(res.data);
  } catch (err) {
    if (err.response?.status === 401) {
       localStorage.removeItem('access_token'); // Clear stale token
       navigate('/login'); // Force fresh login
    }
  }
};
const deleteAnnouncements = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
        try {
            const token = localStorage.getItem('access_token'); //
            await axios.delete(`http://127.0.0.1:8000/api/announcements/${id}/`, {
                headers: { 
                    Authorization: `Bearer ${token}` //
                }
            });
            // Refresh the list after successful deletion
            fetchAnnouncements();
        } catch (err) {
            console.error('Failed to delete announcement:', err);
        }
    }
};

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="announcement-icon-wrapper">
            <Bell size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 page-title">Announcements</h4>
            <small className="sub-title">{announcements.length} total announcements</small>
          </div>
        </div>
        
        <Button 
          variant="dark" 
          className="btn-custom py-2 px-4 d-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate("/admin/announcements/add")}
        >
          <Plus size={18} /> New Announcement
        </Button>
      </div>

      {/* Table Card */}
      <Card className="announcement-card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive no-scrollbar">
          <Table hover className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4 py-3">Title</th>
                <th className="py-3">Priority</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3">Date</th>
                <th className="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length > 0 ? (
                announcements.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 py-4">
                      <div className="mb-0 fw-bold">{item.title}</div>
                      {/* Using subtitle or content based on your Django model */}
                      <div className="small subtitle-text text-muted">
                        {item.subtitle || item.content}
                      </div>
                    </td>
                    <td>
                      <Badge className={`priority-badge ${item.priority?.toLowerCase()}`}>
                        {item.priority}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <Badge className={`status-badge ${item.status?.toLowerCase()}`}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-muted small">
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} /> {item.created_at || item.date}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="link" className="p-1 text-dark action-btn"
                        onClick={() => navigate(`/admin/announcements/edit/${item.id}`)}
                        >
                          <Edit2 size={18} />
                        </Button>
                        <Button 
                          variant="link" 
                          className="p-1 text-danger action-btn"
                          onClick={() => deleteAnnouncements(item.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No announcements found. Click "New Announcement" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AnnouncementsPage;