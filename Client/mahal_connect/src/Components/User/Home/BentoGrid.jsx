import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import {
  Wallet, FileText, Users, Users2, Book, Megaphone,
  PlusCircle, HeartHandshake, Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../../UI/Card';
import './BentoGrid.css';

function BentoGrid() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [latestAnnouncement, setLatestAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token.trim()}` } : {};

      try {
        const [payRes, teamsRes, annRes] = await Promise.allSettled([
          axios.get("http://127.0.0.1:8000/api/my-payments/", { headers }),
          axios.get("http://127.0.0.1:8000/api/teams/", { headers }),
          axios.get("http://127.0.0.1:8000/api/announcements/", { headers })
        ]);

        if (payRes.status === 'fulfilled') setPaymentData(payRes.value.data.slice(0, 2));
        
        if (teamsRes.status === 'fulfilled') {
          // Verify that members_count exists in your Serializer
          setTeams(teamsRes.value.data.slice(0, 4));
        }
        
        if (annRes.status === 'fulfilled' && annRes.value.data.length > 0) {
          const sorted = annRes.value.data.sort((a, b) => b.id - a.id);
          setLatestAnnouncement(sorted[0]);
        }
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const isNew = (dateString) => {
    if (!dateString) return false;
    return (new Date() - new Date(dateString)) < (24 * 60 * 60 * 1000); 
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <Container fluid className="px-0 py-4 mb-5 pb-5 animate-fade-in">
      <Row className="g-4">
        {/* Payments */}
        <Col xs={12} md={6}>
          <Card
            title="Payments"
            icon={<Wallet size={20} />}
            subtitle="Manage contributions"
            items={[
              { name: "Declare Cash Payment", sub: "New entry", icon: <PlusCircle size={16} />, onClick: () => navigate('/payment') },
              ...paymentData.map(pay => ({ name: `${pay.month}`, amount: `₹${pay.amount}`, status: pay.status.toLowerCase(), onClick: () => navigate('/payment') }))
            ]}
          />
        </Col>

        {/* Volunteer Teams */}
        <Col xs={12} md={6}>
          <Card
            title="Teams"
            icon={<Users2 size={20} />}
            subtitle="Volunteer groups"
            items={teams.map(team => ({
              name: team.team_name,
              sub: `${team.members_count || 0} Members`, // Ensure this key matches Serializer
              showArrow: true,
              onClick: () => navigate(`/teams/${team.id}`)
            }))}
          />
        </Col>

        {/* Services Section - ADDED BACK */}
        <Col xs={12} md={6}>
          <Card
            title="Services"
            icon={<Briefcase size={20} />}
            subtitle="Mahal support"
            items={[
              { name: "Medicine Support", showArrow: true, onClick: () => navigate('/usermedicine') },
              { name: "Education Support", showArrow: true, onClick: () => navigate('/usereducation') },
              { name: "Personal Loan", showArrow: true, onClick: () => navigate('/userloan') }
            ]}
          />
        </Col>

        {/* Library & Docs */}
        <Col xs={6}>
          <Card title="Library" icon={<Book size={20} />} items={[{ name: "Books", showArrow: true, onClick: () => navigate('/libraryuser') }]} />
        </Col>
        <Col xs={6}>
          <Card title="Docs" icon={<FileText size={20} />} items={[{ name: "Certificates", showArrow: true, onClick: () => navigate('/certificate') }]} />
        </Col>

        {/* Community */}
        <Col xs={12}>
          <Card
            title="Community"
            icon={<Users size={20} />}
            highlight={true}
            items={[
              {
                name: (
                  <div className="d-flex align-items-center gap-2">
                    {latestAnnouncement ? latestAnnouncement.title : "Announcements"}
                    {latestAnnouncement && isNew(latestAnnouncement.created_at) && <Badge bg="danger">NEW</Badge>}
                  </div>
                ),
                sub: latestAnnouncement ? latestAnnouncement.content.substring(0, 40) + "..." : "No recent updates",
                icon: <Megaphone size={16} />,
                onClick: () => navigate('/notification')
              },
              { name: "Daily Duas", sub: "Supplications", icon: <HeartHandshake size={16} />, onClick: () => navigate('/typedua') }
            ]}
            footer="Next Prayer: Maghrib 6:18 PM"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default BentoGrid;