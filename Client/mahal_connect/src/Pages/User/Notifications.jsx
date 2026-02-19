import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { ArrowLeft, Bell, Megaphone, Calendar, CheckCheck } from 'lucide-react';
import axios from 'axios';
import './Notification.css';
import Floatingnav from '../../Common/User/FloatingNav';

function NotificationPayment() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readIds, setReadIds] = useState([]);

  // 1. Fetch live announcements
  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/announcements/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
      
      // Load already read IDs from localStorage
      const savedReadIds = JSON.parse(localStorage.getItem('read_announcement_ids') || '[]');
      setReadIds(savedReadIds);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 2. Mark specific notification as seen
  const markAsSeen = (id) => {
    const updatedReadIds = [...new Set([...readIds, id])];
    setReadIds(updatedReadIds);
    localStorage.setItem('read_announcement_ids', JSON.stringify(updatedReadIds));
    
    // Trigger a storage event so FloatingNav updates immediately
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Container className="py-4 mb-5 animate-fade-in">
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" className="me-2 rounded-circle shadow-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <h5 className="mb-0 d-flex align-items-center fw-bold">
          <Bell size={20} className="me-2 text-primary" />
          Mahal Announcements
        </h5>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading updates...</p>
        </div>
      ) : (
        <div className="notification-list">
          {announcements.length > 0 ? (
            announcements.map((note) => {
              const isRead = readIds.includes(note.id);
              return (
                <Card key={note.id} className={`mb-3 border-0 shadow-sm rounded-4 ${!isRead ? 'border-start border-primary border-4' : 'opacity-75'}`}>
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3">
                        <div className={`p-2 rounded-3 ${isRead ? 'bg-light text-muted' : 'bg-primary bg-opacity-10 text-primary'}`}>
                          <Megaphone size={20} />
                        </div>
                        <div>
                          <Card.Title className={`fs-6 mb-1 ${!isRead ? 'fw-bold' : 'text-muted'}`}>
                            {note.title}
                          </Card.Title>
                          <Card.Text className="text-secondary small">
                            {note.content}
                          </Card.Text>
                        </div>
                      </div>
                      
                      {!isRead ? (
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="rounded-pill px-3 py-1 extra-small"
                          onClick={() => markAsSeen(note.id)}
                        >
                          Mark Seen
                        </Button>
                      ) : (
                        <div className="text-success d-flex align-items-center gap-1 extra-small">
                          <CheckCheck size={14} /> Seen
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-top d-flex align-items-center text-muted extra-small">
                      <Calendar size={12} className="me-1" />
                      {new Date(note.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-5">
              <Megaphone size={40} className="text-muted opacity-25 mb-2" />
              <p className="text-muted">No new announcements today.</p>
            </div>
          )}
        </div>
      )}
      <Floatingnav />
    </Container>
  );
}

export default NotificationPayment;