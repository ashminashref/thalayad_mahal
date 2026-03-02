import React, { useState } from "react";
import { Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { ArrowLeft, Save, Utensils, Info } from "lucide-react"; // Changed icon to Utensils for safety
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AddFoodServvice.css";

const AddFoodService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: "",
    food_name: "",
    provider_name: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("No token found");

      await axios.post("http://127.0.0.1:8000/api/food-services/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        icon: 'success',
        title: 'Event Created',
        text: 'Announcement email has been sent to all members.',
        confirmButtonColor: '#1c3124'
      });
      navigate("/admin/services/foodservices");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.status === 401 ? "Session expired. Please login again." : "Could not save food service.";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-food-container animate-fade-in">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="outline-dark" className="rounded-pill border-0" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> 
        </Button>
        <h4 className="fw-bold mb-0">Add Food Service</h4>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="form-card border-0 shadow-sm p-4">
            <div className="form-header-badge mb-4">
               <Utensils size={18} className="me-2" />
               <span>New Food Event</span>
            </div>

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Event Name</Form.Label>
                    <Form.Control type="text" name="event_name" placeholder="Friday Iftar" value={formData.event_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Food Item</Form.Label>
                    <Form.Control type="text" name="food_name" placeholder="Chicken Biryani" value={formData.food_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Provider</Form.Label>
                    <Form.Control type="text" name="provider_name" placeholder="Committee" value={formData.provider_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Date</Form.Label>
                    <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold">Notes</Form.Label>
                <Form.Control as="textarea" rows={3} name="notes" placeholder="Additional details..." value={formData.notes} onChange={handleChange} />
              </Form.Group>

              <div className="alert-notice mb-4">
                <Info size={16} />
                <span>An automated email will be sent to all community members.</span>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <Button type="submit" variant="dark" className="rounded-pill px-4" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : <><Save size={16} className="me-2" /> Save Service</>}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddFoodService;