import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Container, InputGroup } from "react-bootstrap";
import { Utensils, ArrowLeft, Send, User, Calendar, Info, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./FoodManagement.css";

const FoodManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: "", 
    food_name: "", 
    provider_name: "", 
    date: "", 
    notes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post("http://127.0.0.1:8000/api/food-services/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: 'success',
        title: 'Program Published!',
        text: 'Announcement email has been sent to all members.',
        confirmButtonColor: '#1c3124'
      });
      navigate(-1);
    } catch { 
      Swal.fire("Error", "Could not create event. Please check your connection.", "error"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="food-admin-page animate-fade-in p-3">
      <Container fluid className="px-lg-5">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div className="d-flex align-items-center gap-4">
            <button className="back-btn-premium" onClick={() => navigate(-1)}>
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="fw-bold mb-1">Food Program Management</h2>
              <p className="text-muted small mb-0">Schedule distributions and manage sponsors</p>
            </div>
          </div>
        </div>

        <Row className="justify-content-center">
          <Col lg={11}>
            <Card className="premium-form-card border-0 shadow-lg">
              <Row className="g-0">
                {/* Form Side */}
                <Col md={7} className="p-4 p-lg-5">
                  <div className="form-section-tag mb-4">
                    <Utensils size={18} className="me-2" />
                    <span>Distribution Details</span>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold text-uppercase text-muted">Program Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., Friday Biryani" 
                            className="premium-input"
                            required 
                            onChange={e => setFormData({...formData, event_name: e.target.value})} 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold text-uppercase text-muted">Main Food Item</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., Chicken Biryani" 
                            className="premium-input"
                            required 
                            onChange={e => setFormData({...formData, food_name: e.target.value})} 
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold text-uppercase text-muted">Sponsor / Provider</Form.Label>
                          <InputGroup className="premium-input-group">
                            <InputGroup.Text><User size={18}/></InputGroup.Text>
                            <Form.Control 
                              type="text" 
                              placeholder="Name of Sponsor" 
                              onChange={e => setFormData({...formData, provider_name: e.target.value})} 
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold text-uppercase text-muted">Date</Form.Label>
                          <InputGroup className="premium-input-group">
                            <InputGroup.Text><Calendar size={18}/></InputGroup.Text>
                            <Form.Control 
                              type="date" 
                              required 
                              onChange={e => setFormData({...formData, date: e.target.value})} 
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase text-muted">Volunteers & Team Members</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="List team members or special instructions..." 
                        className="premium-textarea"
                        onChange={e => setFormData({...formData, notes: e.target.value})} 
                      />
                    </Form.Group>

                    <div className="notify-alert mb-4">
                      <Info size={16} />
                      <span>This announcement will be emailed to all community members immediately.</span>
                    </div>

                    <Button type="submit" variant="dark" className="w-100 py-3 rounded-pill fw-bold publish-btn" disabled={loading}>
                      {loading ? "Processing..." : <><Send size={18} className="me-2"/> Broadcast Announcement</>}
                    </Button>
                  </Form>
                </Col>

                {/* Preview Side */}
                <Col md={5} className="preview-panel p-4 p-lg-5 text-white d-none d-md-flex flex-column">
                  <h5 className="fw-bold mb-4 opacity-75 text-white">Announcement Preview</h5>
                  <div className="preview-card-wrapper animate-pop">
                    <div className="preview-card shadow">
                      <div className="p-badge">Special Program</div>
                      <h3 className="mb-3 text-white">{formData.event_name || "Event Title"}</h3>
                      
                      <div className="p-info-row mb-2">
                        <Utensils size={14} /> <span>{formData.food_name || "Food Item"}</span>
                      </div>
                      <div className="p-info-row mb-2">
                        <User size={14} /> <span>Sponsored by: {formData.provider_name || "Sponsor Name"}</span>
                      </div>
                      <div className="p-info-row mb-3">
                        <Calendar size={14} /> <span>{formData.date || "Scheduled Date"}</span>
                      </div>

                      <div className="preview-notes-box">
                        <Users size={14} className="mb-1" />
                        <div className="p-desc text-white-50">
                          {formData.notes || "Volunteer details and extra notes will appear here."}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-top border-white border-opacity-25 small opacity-50">
                    Your distribution details will be visible in the User Food Distribution section.
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FoodManagement;