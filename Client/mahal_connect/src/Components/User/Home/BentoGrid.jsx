import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import {
  Wallet, FileText, Users, Users2, Book, Megaphone,
  PlusCircle, HeartHandshake, Briefcase, ArrowRight, TrendingUp, Utensils
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../../../UI/Card'; 
import './BentoGrid.css';
import PrayerTimer from './PrayerTimer';

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
        if (teamsRes.status === 'fulfilled') setTeams(teamsRes.value.data.slice(0, 4));
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

  if (loading) return (
    <div className="premium-loader">
      <Spinner animation="grow" variant="success" />
      <p className="fw-bold text-muted mt-3">Refining your dashboard...</p>
    </div>
  );

  return (
    <Container fluid className="px-3 py-4 mb-5 pb-5 bento-container">
      <Row className="g-4">
        
        {/* HERO SECTION: Finance & Updates (Primary 2x2/2x1 weight) */}
        <Col xs={12} lg={7}>
          <Card
            title="Finance Overview"
            icon={<Wallet size={22} className="text-emerald" />}
            subtitle="Recent contributions"
            highlight={true}
            className="h-100 bento-card-primary"
            items={[
              { 
                name: "Declare Payment", 
                sub: "Log a new cash entry", 
                icon: <PlusCircle size={18} />, 
                onClick: () => navigate('/payment'),
                variant: 'action'
              },
              ...paymentData.map(pay => ({ 
                name: `Month: ${pay.month}`, 
                amount: `₹${pay.amount}`, 
                status: pay.status.toLowerCase(), 
                onClick: () => navigate('/payment') 
              }))
            ]}
            footer={<span className="footer-link"><TrendingUp size={14}/> View Full History</span>}
          />
        </Col>

        <Col xs={12} lg={5}>
          <Card
            title="Latest Announcement"
            icon={<Megaphone size={22} className="text-orange" />}
            className="h-100 bento-card-update"
            items={[{
              name: (
                <div className="announcement-header">
                  <span>{latestAnnouncement ? latestAnnouncement.title : "Community News"}</span>
                  {latestAnnouncement && isNew(latestAnnouncement.created_at) && <Badge className="badge-new">NEW</Badge>}
                </div>
              ),
              sub: latestAnnouncement ? latestAnnouncement.content : "Stay informed with the latest Mahal updates",
              onClick: () => navigate('/notification'),
              showArrow: true
            }]}
            footer="Published via Mahal Connect Portal"
          />
        </Col>

        {/* UTILITY ROW: Interactive 1x1 Tiles */}
        <Col xs={12}><h6 className="section-label mt-2">COMMUNITY SERVICES</h6></Col>
        
        <Col xs={6} md={3}>
          <div className="utility-tile" onClick={() => navigate('/usermedicine')}>
            <div className="tile-icon red"><HeartHandshake size={24} /></div>
            <span>Medical</span>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="utility-tile" onClick={() => navigate('/usereducation')}>
            <div className="tile-icon blue"><Book size={24} /></div>
            <span>Education</span>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="utility-tile" onClick={() => navigate('/userloan')}>
            <div className="tile-icon green"><Briefcase size={24} /></div>
            <span>Financing</span>
          </div>
        </Col>
        <Col xs={6} md={3}>
          <div className="utility-tile" onClick={() => navigate('/foodservice')}>
            <div className="tile-icon amber"><Utensils size={24} /></div>
            <span>Kitchen</span>
          </div>
        </Col>

        {/* SECONDARY DATA: Volunteers & Resources */}
        <Col xs={12} md={8}>
          <Card
            title="Volunteer Teams"
            icon={<Users2 size={22} />}
            subtitle="Active community groups"
            items={teams.map(team => ({
              name: team.team_name,
              sub: `${team.members_count || 0} active volunteers`,
              showArrow: true,
              onClick: () => navigate(`/teams/${team.id}`)
            }))}
          />
        </Col>

        {/* Change the Library and Docs section to stack on very small phones */}
<Col xs={12} md={4}>
  <Row className="g-3">
    <Col xs={12} sm={6} md={12}>
      <Card title="Library" icon={<Book size={20} />} items={[{ name: "Browse", showArrow: true, onClick: () => navigate('/libraryuser') }]} />
    </Col>
    <Col xs={12} sm={6} md={12}>
      <Card title="Docs" icon={<FileText size={20} />} items={[{ name: "Certs", showArrow: true, onClick: () => navigate('/certificate') }]} />
    </Col>
  </Row>
</Col>

        {/* PERSISTENT FOOTER: Interactive Prayer Widget */}
        <Col xs={12}>
          <div className="prayer-widget animate-pop shadow-sm">
            <div className="d-flex align-items-center gap-3 w-100">
              <div className="prayer-icon-bg"><Users size={20}/></div>
              <div className="flex-grow-1">
                <span className="small-label">NEXT PRAYER</span>
                <PrayerTimer/>
              </div>
              <button className="btn-action-premium" onClick={() => navigate('/typedua')}>
                Daily Duas <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BentoGrid;