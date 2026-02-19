import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Plus, Edit2, Trash2, Calendar, Users, Info, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Teams.css';

const TeamsPage = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/teams/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeam = async (id, name) => {
    const result = await Swal.fire({
      title: 'Dissolve Team?',
      text: `Are you sure you want to remove the "${name}" team?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a1a1a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, dissolve'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://127.0.0.1:8000/api/teams/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Dissolved!', 'The team has been removed.', 'success');
        fetchTeams();
      } catch {
        Swal.fire('Error', 'Could not complete request.', 'error');
      }
    }
  };

  return (
    <div className="animate-fade-in dashboard-container">
      {/* Premium Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
        <div>
          <h2 className="fw-bold mb-1 header-main">Operational Teams</h2>
          <p className="text-muted mb-0 sub-header">Managing {teams.length} active volunteer divisions</p>
        </div>
        
        <Button 
          variant="dark" 
          className="btn-premium d-flex align-items-center gap-2 px-4 py-2"
          onClick={() => navigate("add")}
        >
          <Plus size={20} /> Create New Team
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="dark" />
          <p className="mt-3 text-muted">Synchronizing with server...</p>
        </div>
      ) : (
        <Row xs={1} lg={2} xl={3} className="g-4">
          {teams.map((team) => (
            <Col key={team.id}>
              <Card className="premium-team-card border-0 shadow-sm h-100">
                <Card.Header className="bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                  <Badge className={`status-tag ${team.status.toLowerCase()}`}>
                    {team.status}
                  </Badge>
                  <div className="action-icons">
                    <button className="icon-btn edit" onClick={() => navigate(`/admin/teams/edit/${team.id}`)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete" onClick={() => deleteTeam(team.id, team.team_name)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card.Header>

                <Card.Body className="px-4 pb-4">
                  <div className="category-label text-uppercase mb-2">{team.occasion}</div>
                  <h4 className="fw-bold team-title mb-3">{team.team_name}</h4>
                  
                  <p className="team-desc text-muted mb-4">
                    {team.description || "Project parameters and volunteer guidelines not specified."}
                  </p>

                  <div className="meta-info d-flex align-items-center gap-4 mb-4">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={16} className="text-dark" />
                      <span className="small fw-semibold">{new Date(team.target_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Users size={16} className="text-dark" />
                      <span className="small fw-semibold">{team.members?.length || 0} Registered</span>
                    </div>
                  </div>

                  {/* Standardized Member Names List */}
                  <div className="member-roster border-top pt-3">
                    <p className="extra-small text-uppercase fw-bold text-muted mb-2 ls-1">Core Members</p>
                    <div className="member-names-flex">
                      {team.members?.length > 0 ? (
                        team.members.slice(0, 3).map((m, i) => (
                          <span key={i} className="member-name-tag">
                            {m.name} <span className="role-sub text-muted">({m.role})</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small italic">No members assigned yet</span>
                      )}
                      {team.members?.length > 3 && (
                        <span className="more-members">+{team.members.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TeamsPage;