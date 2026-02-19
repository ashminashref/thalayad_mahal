import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, UserPlus, Trash2 } from 'lucide-react'; 
import axios from 'axios';
import Swal from 'sweetalert2';

const TeamsManager = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    team_name: '',
    occasion: '',
    description: '',
    target_date: '',
    status: 'Upcoming',
    members: [] // Start with empty array
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://127.0.0.1:8000/api/teams/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data); // Backend now includes members array
        setLoading(false);
      } catch  {
        navigate('/admin/teams');
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Member Management Logic
  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, members: updatedMembers });
  };

  const addMemberField = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { name: '', role: 'Member' }]
    });
  };

  const removeMember = (index) => {
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updatedMembers });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://127.0.0.1:8000/api/teams/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('Updated!', 'Team and roster saved.', 'success');
      navigate('/admin/teams'); 
    } catch (err) {
      console.error("Save Error:", err.response?.data);
      Swal.fire('Error', 'Failed to update. Check member names.', 'error');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <div className="body-txt pb-5">
      <Container className="pt-4">
        <Button variant="link" onClick={() => navigate('/admin/teams')} className="mb-3 p-0 text-dark text-decoration-none">
          <ArrowLeft size={20} className="me-2" /> Back
        </Button>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Header className="bg-dark text-white py-3 rounded-top-4">
            <h5 className="mb-0">Edit Team Roster & Details</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSave}>
              <Row className="mb-4">
                <Col md={6}>
                  <Form.Label className="small fw-bold">Team Name</Form.Label>
                  <Form.Control name="team_name" value={formData.team_name} onChange={handleInputChange} required />
                </Col>
                <Col md={6}>
                  <Form.Label className="small fw-bold">Status</Form.Label>
                  <Form.Select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </Form.Select>
                </Col>
              </Row>

              <hr />

              {/* MEMBERS SECTION */}
              <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                <h6 className="fw-bold mb-0">Volunteer Roster</h6>
                <Button variant="outline-dark" size="sm" onClick={addMemberField}>
                  <UserPlus size={16} className="me-2" /> Add Member
                </Button>
              </div>

              <div className="bg-light p-3 rounded-3 border">
                {formData.members.map((member, index) => (
                  <Row key={index} className="mb-2 g-2 align-items-center">
                    <Col md={7}>
                      <Form.Control 
                        placeholder="Member Name" 
                        value={member.name} 
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        required 
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Select 
                        value={member.role} 
                        onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                      >
                        <option value="Lead">Lead</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Member">Member</option>
                      </Form.Select>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button variant="link" className="text-danger" onClick={() => removeMember(index)}>
                        <Trash2 size={18} />
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>

              <div className="d-flex gap-2 mt-5">
                <Button variant="light" className="w-50" onClick={() => navigate('/admin/teams')}>Cancel</Button>
                <Button type="submit" variant="dark" className="w-50"><Save size={18} className="me-2" /> Save Roster</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default TeamsManager;