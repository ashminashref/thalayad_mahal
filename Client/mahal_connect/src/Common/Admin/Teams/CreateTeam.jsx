import React, { useState } from 'react';
import { Button, Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { UserPlus, Trash2, ArrowLeft, Users, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../Teams/CreateTeam.css';

const AddTeamPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    occasion: 'Eid Celebrations',
    description: '',
    date: '',
    status: 'Upcoming',
    members: [{ name: '', role: 'Member' }] 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMemberChange = (index, field, value) => {
    const members = [...formData.members];
    members[index][field] = value;
    setFormData({ ...formData, members });
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', role: 'Member' }]
    });
  };

  const removeMember = (index) => {
    const members = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      // Mapping frontend state to Django Model keys
      const dataToSubmit = {
        team_name: formData.teamName,
        occasion: formData.occasion,
        description: formData.description,
        target_date: formData.date,
        status: formData.status,
        members: formData.members // Array of {name, role}
      };

      await axios.post('http://127.0.0.1:8000/api/teams/', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Team Created!',
        text: `The team "${formData.teamName}" has been successfully organized.`,
        confirmButtonColor: '#1a1a1a'
      });

      navigate('/admin/teams');

    } catch (err) {
      console.error('Team Creation Error:', err.response?.data);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Please check your data and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in container-fluid pb-5">
      {/* Header */}
      <div className="mb-4">
        <Button 
          variant="link" 
          className="text-dark p-0 d-flex align-items-center gap-2 mb-3 text-decoration-none"
          onClick={() => navigate('/admin/teams')}
        >
          <ArrowLeft size={20} /> Back to Teams
        </Button>
        <h4 className="fw-bold">Create New Team</h4>
        <p className="text-muted small">Fill in the details below to organize a new volunteer group.</p>
      </div>

      <Card className="border-0 shadow-sm p-4">
        <Form onSubmit={handleSubmit}>
          {/* Section 1: Basic Info */}
          <h6 className="fw-bold mb-3 ">Basic Information</h6>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Team Name</Form.Label>
                <Form.Control
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Ramadan Logistics"
                  className="custom-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Occasion/Category</Form.Label>
                <Form.Select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="custom-input"
                >
                  <option>Iftar</option>
                  <option>Udhiya</option>
                  <option>Cleaning</option>
                  <option>Programming</option>
                  <option>Education</option>
                  <option>Food Distribution</option>
                  <option>Medicine Aid</option>
                  <option>Eid Celebrations</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe the team's purpose..."
              className="custom-input"
            />
          </Form.Group>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Target Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="custom-input"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-bold">Initial Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="custom-input"
                >
                  <option>Upcoming</option>
                  <option>Active</option>
                  <option>Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* Section 2: Members List */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0  d-flex align-items-center gap-2">
              <Users size={18} /> Team Members
            </h6>
            <Button 
              variant="dark" 
              size="sm" 
              onClick={addMemberField}
              className="d-flex align-items-center gap-2"
            >
              <UserPlus size={16} /> Add Member
            </Button>
          </div>

          <div className="members-section p-3 rounded bg-light border">
            {formData.members.map((member, index) => (
              <Row key={index} className="mb-3 align-items-end">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted mb-1">Member Name</Form.Label>
                    <Form.Control
                      placeholder="Enter full name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      className="custom-input"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted mb-1">Role</Form.Label>
                    <Form.Select
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                      className="custom-input"
                    >
                      <option value="Lead">Team Lead</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Member">Member</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="text-end">
                  {formData.members.length > 1 && (
                    <Button 
                      variant="outline-danger" 
                      onClick={() => removeMember(index)}
                      className="w-100 py-2 d-flex align-items-center justify-content-center"
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-5">
             <Button 
                variant="outline-secondary" 
                className="w-50 py-2 fw-bold" 
                onClick={() => navigate('/admin/teams')}
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
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <Send size={18} /> Confirm & Create Team
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AddTeamPage;
