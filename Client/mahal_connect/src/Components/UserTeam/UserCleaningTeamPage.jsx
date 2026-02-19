import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Users, CalendarDays, Sparkles } from 'lucide-react';
import './UserCleaningTeamPage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserCleaningTeamPage = () => {
  const navigate = useNavigate();

  const team = {
    name: 'Cleaning Team',
    description:
      'Responsible for maintaining cleanliness of the Masjid and community areas. Includes weekly cleaning and special event preparation.',
    status: 'Active',
    nextDuty: 'Friday – 7:30 AM',
    members: [
      'Ahmed Ibrahim',
      'Yusuf Ali',
      'Hanna Fathima',
      'Omar Farooq',
      'Zayan Ali',
    ],
  };

  return (
    <div className="user-cleaning-page">

      {/* Header */}
      <div className="cleaning-header">
        <div className="cleaning-title-row">

          <button
            onClick={() => navigate('/')}
            className="back-btn icon-only"
            aria-label="Go to home"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">{team.name}</h1>
            <p>{team.description}</p>
          </div>

        </div>
      </div>

      {/* Info Card */}
      <div className="cleaning-info-card">

        <span className={`status ${team.status.toLowerCase()}`}>
          {team.status}
        </span>

        <div className="cleaning-meta">
          <div>
            <CalendarDays size={18} />
            <span>Next Duty: {team.nextDuty}</span>
          </div>

          <div>
            <Users size={18} />
            <span>{team.members.length} Members</span>
          </div>
        </div>

      </div>

      {/* Members */}
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

export default UserCleaningTeamPage;
