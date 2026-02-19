import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Users, CalendarDays, Utensils } from 'lucide-react';
import './UserIftharPage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserIftarTeamPage = () => {
  const navigate = useNavigate();

  const iftarSchedule = [
    {
      day: 1,
      date: '2026-03-05',
      menu: 'Chicken Biriyani & Dates',
      members: ['Ahmed Ibrahim', 'Hanna Fathima', 'Yusuf Ali'],
      status: 'Completed',
    },
    {
      day: 2,
      date: '2026-03-06',
      menu: 'Veg Rice & Juice',
      members: ['Omar Farooq', 'Sara Khan'],
      status: 'Active',
    },
    {
      day: 3,
      date: '2026-03-07',
      menu: 'Noodles & Fruits',
      members: ['Mariyam Zayan', 'Ibrahim'],
      status: 'Upcoming',
    },
  ];

  return (
    <div className="user-iftar-page">

      {/* Header */}
      <div className="iftar-header">
        <div className="iftar-title-row">
          <button
            onClick={() => navigate('/')}
            className="back-btn icon-only"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">Iftar Team</h1>
            <p>Ramadan Daily Iftar Assignments</p>
          </div>
        </div>
      </div>

      {/* Day Cards */}
      <div className="iftar-days-grid">
        {iftarSchedule.map(item => (
          <div key={item.day} className="iftar-day-card">

            <div className="day-header">
              <h2>Day {item.day}</h2>
              <span className={`status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>

            <div className="day-meta">
              <CalendarDays size={16} />
              <span>{item.date}</span>
            </div>

            <div className="menu-row">
              <Utensils size={16} />
              <span>{item.menu}</span>
            </div>

            <div className="members-preview">
              <Users size={16} />
              <span>{item.members.length} Volunteers</span>
            </div>

            {/* Avatars */}
            <div className="avatars">
              {item.members.map((m, i) => (
                <span key={i} className="avatar">
                  {m.charAt(0)}
                </span>
              ))}
            </div>

            {/* ✅ Member Names */}
            <div className="member-names">
              {item.members.map((name, i) => (
                <span key={i} className="member-chip">
                  {name}
                </span>
              ))}
            </div>

          </div>
        ))}
      </div>

      <Floatingnav />
    </div>
  );
};

export default UserIftarTeamPage;
