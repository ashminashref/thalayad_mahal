import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Users, Code2, Laptop } from 'lucide-react';
import './UserProgrammingTeamPage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserProgrammingTeamPage = () => {
  const navigate = useNavigate();

  const team = {
    name: 'Programming Team',
    description:
      'Handles digital solutions for the Mahal including website management, system updates, automation, and member services.',
    status: 'Active',
    focus: 'Member Portal Enhancement',
    members: [
      'Ahmed Ibrahim',
      'Hanna Fathima',
      'Yusuf Ali',
      'Omar Farooq',
    ],
  };

  return (
    <div className="user-programming-page">

      {/* Header */}
      <div className="programming-header">
        <div className="programming-title-row">

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
      <div className="programming-info-card">

        <span className={`status ${team.status.toLowerCase()}`}>
          {team.status}
        </span>

        <div className="programming-meta">
          <div>
            <Laptop size={18} />
            <span>Focus: {team.focus}</span>
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

export default UserProgrammingTeamPage;
