import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { ArrowLeft, Send } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Announcements/CreateAnnouncement.css";

const AddAnnouncementPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "low", 
    status: "published",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      // Match these keys EXACTLY to your Django Announcement model
      // If your model uses 'subtitle', change 'content' below to 'subtitle'
      const dataToSend = {
        title: formData.title,
        content: formData.content, 
        priority: formData.priority.toLowerCase(),
        status: formData.status.toLowerCase()
      };

      await axios.post('http://127.0.0.1:8000/api/announcements/', dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Show success message before navigating
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Announcement created and members notified.',
        confirmButtonColor: '#1a3024',
        timer: 2000
      });

      navigate("/admin/announcements", { replace: true });

    } catch (err) {
      // This logs the specific field error (like content or subtitle)
      console.error("Submission error details:", err.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.response?.data?.content || err.response?.data?.subtitle || 'Check your fields.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in container-fluid pb-5">
      <div className="mb-4">
        <Button 
          variant="link" 
          className="text-dark p-0 d-flex align-items-center gap-2 mb-3 text-decoration-none"
          onClick={() => navigate("/admin/announcements")}
        >
          <ArrowLeft size={20} /> Back to Announcements
        </Button>
        <h4 className="fw-bold">Create New Announcement</h4>
      </div>

      <Card className="border-0 shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Ramadan Prayer Times"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Describe the update here..."
              required
            />
          </Form.Group>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Priority</Form.Label>
                <Form.Select 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Status</Form.Label>
                <Form.Select 
                  name="status" 
                  value={formData.status} 
                  onChange={handleChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-3">
            <Button 
              variant="outline-secondary" 
              className="w-50 py-2 fw-bold" 
              onClick={() => navigate("/admin/announcements")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="dark" 
              className="w-50 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : <><Send size={18} /> Create Announcement</>}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddAnnouncementPage;