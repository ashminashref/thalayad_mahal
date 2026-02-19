import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Users, CalendarDays } from 'lucide-react';
import './UserUdhiyaTeamPage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserUdhiyaTeamPage = () => {
  const navigate = useNavigate();

  const team = {
    name: 'Udhiya Team',
    description:
      'This team manages Qurbani arrangements including animal purchase, distribution, and coordination with members.',
    date: '2026-06-07',
    status: 'Active',
    members: [
      'Ahmed Ibrahim',
      'Yusuf Ali',
      'Hanna Fathima',
      'Omar Farooq',
      'Zayan Ali',
    ],
  };

  return (
    <div className="user-udhiya-page">

      {/* Header */}
      <div className="udhiya-header">
        <div className="udhiya-title-row">

          <button
            onClick={() => navigate('/')}
            className="back-btn icon-only"
            aria-label="Go back"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">{team.name}</h1>
            <p>{team.description}</p>
          </div>

        </div>
      </div>

      {/* Team Info Card */}
      <div className="udhiya-info-card">
        <span className={`status ${team.status.toLowerCase()}`}>
          {team.status}
        </span>

        <div className="udhiya-meta">
          <div>
            <CalendarDays size={18} />
            <span>{team.date}</span>
          </div>

          <div>
            <Users size={18} />
            <span>{team.members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="members-card">
        <h2>Team Members</h2>

        <div className="members-grid">
          {team.members.map((member, index) => (
            <div key={index} className="member-row">
              <div className="avatar">
                {member.charAt(0)}
              </div>
              <span>{member}</span>
            </div>
          ))}
        </div>
      </div>

      <Floatingnav />
    </div>
  );
};

export default UserUdhiyaTeamPage;
