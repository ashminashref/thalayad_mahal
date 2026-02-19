import React, { useState } from "react";
import { Card, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../Users/AddUserPage.css";

const AddUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "User@123", // Default password for admin-created users
    is_staff: false,
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Prepare data specifically for Django
      const dataToSubmit = {
        username: formData.email, // Django requires a username
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
        is_active: formData.is_active,
        is_staff: formData.is_staff
      };

      // 2. Get the admin token for authorization
      const token = localStorage.getItem('access_token');
      
      // 3. Send POST request
      await axios.post("http://127.0.0.1:8000/api/register/", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: `${formData.first_name} has been added to the Mahal database.`,
        confirmButtonColor: '#1a1a1a'
      });

      navigate("/admin/users");

    } catch (err) {
      console.error("SERVER ERROR:", err.response?.data);
      // Extract the specific field error from Django
      const errorMsg = err.response?.data 
        ? Object.values(err.response.data).flat()[0] 
        : "Registration failed. Check your connection.";
      Swal.fire('Error', errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in add-user-page container-fluid py-4">
      <div className="add-user-container mx-auto" style={{ maxWidth: '600px' }}>
        
        {/* Header Section */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <Button variant="link" className="text-dark p-0" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </Button>
          <h4 className="fw-bold mb-0">Register New Member</h4>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    placeholder="Ahmed"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    placeholder="Hassan"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="ahmed@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone_number"
                placeholder="+91 ..."
                value={formData.phone_number}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold">Temporary Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">Users can change this after their first login.</Form.Text>
            </Form.Group>

            <Row className="mb-4">
              <Col xs={6}>
                <Form.Check 
                  type="switch"
                  id="staff-switch"
                  label="Grant Admin Access"
                  name="is_staff"
                  checked={formData.is_staff}
                  onChange={handleChange}
                />
              </Col>
              <Col xs={6}>
                <Form.Check 
                  type="switch"
                  id="active-switch"
                  label="Account Active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Button 
              type="submit" 
              variant="dark" 
              className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" 
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <UserPlus size={18} /> 
                  <span>Register Member</span>
                </>
              )}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AddUserPage;