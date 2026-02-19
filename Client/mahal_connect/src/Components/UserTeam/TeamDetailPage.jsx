import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, Spinner, Badge, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Users, UserPlus, Info, ShieldCheck, UserCircle } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './TeamDetail.css'; // Create this for specific tweaks

const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://127.0.0.1:8000/api/teams/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTeam(res.data);
      } catch  {
        Swal.fire("Error", "Team not found", "error");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [id, navigate]);

  const handleJoin = async () => {
    Swal.fire({
      title: 'Join Team?',
      text: "Your request will be sent to the Mahal Admin for approval.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      confirmButtonText: 'Yes, Request to Join'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Submitted", "Request sent successfully!", "success");
      }
    });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="dark" />
    </div>
  );

  return (
    <Container className="py-4 mb-5 animate-fade-in">
      {/* Header Navigation */}
      <div className="d-flex align-items-center mb-4">
        <Button 
          variant="light" 
          className="rounded-circle shadow-sm me-3" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </Button>
        <h4 className="mb-0 fw-bold">Team Details</h4>
      </div>

      <Row className="g-4">
        {/* Left Col: Team Info */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="p-4 border-bottom bg-white">
              <Badge bg="dark" className="rounded-pill px-3 py-2 mb-2 fw-normal">
                {team.occasion || 'General Volunteer'}
              </Badge>
              <h2 className="fw-bold text-dark display-6 mb-1">{team.team_name}</h2>
              <p className="text-muted d-flex align-items-center small">
                <ShieldCheck size={14} className="me-1 text-primary" /> Verified Mahal Volunteer Group
              </p>
            </div>

            <Card.Body className="p-4">
              <div className="mb-4">
                <h6 className="fw-bold text-uppercase small text-muted mb-3 letter-spacing-1">
                  About Group
                </h6>
                <p className="text-secondary leading-relaxed">
                  {team.description || "No description provided for this group. This team works under the Mahal committee to manage community events and services."}
                </p>
              </div>

              <div className="d-flex gap-3 mt-4">
                <Button variant="dark" className="flex-grow-1 py-3 rounded-4 fw-bold shadow-sm" onClick={handleJoin}>
                  <UserPlus size={18} className="me-2" /> Request to Join
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Col: Members Roster */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-uppercase small text-muted mb-0">Active Roster</h6>
                <Badge bg="light" text="dark" className="rounded-pill border">
                  {team.members_count || 0} Total
                </Badge>
              </div>

              <div className="member-list">
                {team.members && team.members.length > 0 ? (
                  team.members.map((member, index) => (
                    <div key={index} className="d-flex align-items-center p-3 mb-2 rounded-3 hover-bg-light border-bottom-subtle">
                      <div className="me-3">
                        <UserCircle size={32} className="text-muted opacity-50" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark small">{member.name}</div>
                        <div className="text-muted extra-small">{member.role || 'Volunteer'}</div>
                      </div>
                      <Badge bg="success" className="dot-badge" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Users size={30} className="text-muted opacity-25 mb-2" />
                    <p className="text-muted small">No members listed yet.</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TeamDetailPage;