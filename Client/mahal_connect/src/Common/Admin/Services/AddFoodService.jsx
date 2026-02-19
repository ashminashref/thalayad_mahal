import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddFoodServvice.css";

const AddFoodService = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: "",
    foodName: "",
    providerName: "",
    date: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔗 Later connect to backend API
    console.log("Food Service Data:", formData);

    // After save → go back to food services
    navigate("/admin/services/foodservices");
  };

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button
          variant="outline-dark"
          className="rounded-pill"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> 
        </Button>

        <h4 className="fw-bold mb-0">Add Food Service</h4>
      </div>

      {/* Form Card */}
      <Card className="service-card border-0 shadow-sm p-4">
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              name="eventName"
              placeholder=""
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Food Name</Form.Label>
            <Form.Control
              type="text"
              name="foodName"
              placeholder=""
              value={formData.foodName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Food Provider</Form.Label>
            <Form.Control
              type="text"
              name="providerName"
              placeholder=""
              value={formData.providerName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Notes (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button type="submit" variant="dark" className="rounded-pill px-4">
              <Save size={16} /> Save Food Service
            </Button>
          </div>

        </Form>
      </Card>
    </div>
  );
};

export default AddFoodService;
