import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";

const EditAnnouncementPage = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: "", subtitle: "", priority: "low", status: "published" });

  useEffect(() => {
    fetchAnnouncementDetails();
  }, []);

  const fetchAnnouncementDetails = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`http://127.0.0.1:8000/api/announcements/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
      ...res.data,
      content: res.data.subtitle || res.data.content // Fallback mapping
    });
    setLoading(false);
    } catch  {
      Swal.fire("Error", "Could not load announcement data", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://127.0.0.1:8000/api/announcements/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire("Updated!", "Announcement has been updated.", "success");
      navigate("/admin/announcements");
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="p-4 border-0 shadow-sm">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
             value={formData.title} 
             onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control 
             as="textarea" 
             value={formData.subtitle || formData.content} 
             onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
          />
        </Form.Group>
        <Button type="submit" variant="dark">Update Announcement</Button>
      </Form>
    </Card>
  );
};

export default EditAnnouncementPage;