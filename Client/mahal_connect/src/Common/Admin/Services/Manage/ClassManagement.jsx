import React, { useState } from "react";
import { Form, Button, Card, Row, Col, Container, InputGroup } from "react-bootstrap";
import { GraduationCap, ArrowLeft, Send, Calendar, Clock, User, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ClassManagement.css";

const ClassManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", teacher: "", date: "", time: "", description: "", status: "upcoming"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post("http://127.0.0.1:8000/api/programs/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        icon: 'success',
        title: 'Program Published!',
        text: 'Announcement email has been broadcasted to all members.',
        confirmButtonColor: '#1c3124'
      });
      navigate(-1);
    } catch { 
      Swal.fire("Error", "Could not publish the program. Check your connection.", "error"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="class-admin-page animate-fade-in">
      <Container className="py-5">
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div className="d-flex align-items-center gap-4">
            <button className="back-btn-premium" onClick={() => navigate(-1)}>
              <ArrowLeft size={22} />
            </button>
            <div>
              <h2 className="fw-bold mb-1">Educational Programs</h2>
              <p className="text-muted small mb-0">Schedule new classes and notify the community</p>
            </div>
          </div>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="premium-form-card border-0 shadow-lg">
              <Row className="g-0">
                {/* Form Side */}
                <Col md={7} className="p-4 p-lg-5">
                  <div className="form-section-tag mb-4">
                    <GraduationCap size={18} className="me-2" />
                    <span>Program Details</span>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase text-muted">Class / Event Name</Form.Label>
                      <InputGroup className="premium-input-group">
                        <InputGroup.Text><FileText size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="text" 
                          placeholder="e.g., Weekly Tajweed Session" 
                          required 
                          onChange={e => setFormData({...formData, title: e.target.value})} 
                        />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase text-muted">Teacher / Speaker</Form.Label>
                      <InputGroup className="premium-input-group">
                        <InputGroup.Text><User size={18}/></InputGroup.Text>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter name" 
                          required 
                          onChange={e => setFormData({...formData, teacher: e.target.value})} 
                        />
                      </InputGroup>
                    </Form.Group>

                    <Row>
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
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label className="small fw-bold text-uppercase text-muted">Time</Form.Label>
                          <InputGroup className="premium-input-group">
                            <InputGroup.Text><Clock size={18}/></InputGroup.Text>
                            <Form.Control 
                              type="time" 
                              required 
                              onChange={e => setFormData({...formData, time: e.target.value})} 
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-bold text-uppercase text-muted">Agenda / Description</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="Provide details about the program..." 
                        className="premium-textarea"
                        required 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                      />
                    </Form.Group>

                    <div className="notify-alert mb-4">
                      <Info size={16} />
                      <span>Saving this will trigger a broadcast email to all registered members.</span>
                    </div>

                    <Button type="submit" variant="dark" className="w-100 py-3 rounded-pill fw-bold publish-btn" disabled={loading}>
                      {loading ? "Publishing..." : <><Send size={18} className="me-2"/> Publish & Notify Members</>}
                    </Button>
                  </Form>
                </Col>

                {/* Preview Side */}
                <Col md={5} className="preview-panel p-4 p-lg-5 text-white d-none d-md-flex flex-column">
                  <h5 className="fw-bold mb-4 opacity-75">Live Preview</h5>
                  <div className="preview-card-wrapper animate-pop">
                    <div className="preview-card">
                      <div className="p-badge">New Class</div>
                      <h3 className="mb-3">{formData.title || "Program Title"}</h3>
                      <div className="p-info-row mb-2">
                        <User size={14} /> <span>{formData.teacher || "Conducted by..."}</span>
                      </div>
                      <div className="p-info-row mb-2">
                        <Calendar size={14} /> <span>{formData.date || "Select Date"}</span>
                      </div>
                      <div className="p-info-row mb-3">
                        <Clock size={14} /> <span>{formData.time || "Select Time"}</span>
                      </div>
                      <div className="p-desc">
                        {formData.description || "The description you write will appear here for the users."}
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-top border-white border-opacity-25 small opacity-50">
                    Your program will be listed in the Educational Programs section of the user home page.
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

export default ClassManagement;