import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Users, ClipboardList } from 'lucide-react';
import './AdminCreateTeamPage.css';

const AdminCreateTeamPage = () => {
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState({
    name: '',
    type: 'Iftar',
    status: 'Active',
    description: '',
    members: '',
  });

  const handleChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('New Team:', teamData);
    // API call here
  };

  return (
    <div className="admin-create-team-page">

      {/* Header */}
      <div className="admin-page-header">
        <button
          onClick={() => navigate('/admin/teams')}
          className="back-btn icon-only"
        >
          <ArrowLeftIcon fontSize="small" />
        </button>

        <div>
          <h1>Create Team</h1>
          <p>Add a new community team</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="admin-form-card">

        {/* Team Name */}
        <div className="admin-input-field">
          <label>Team Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter team name"
            value={teamData.name}
            onChange={handleChange}
          />
        </div>

        {/* Row */}
        <div className="admin-row">

          {/* Team Type */}
          <div className="admin-input-field">
            <label>Team Type</label>
            <select
              name="type"
              value={teamData.type}
              onChange={handleChange}
            >
              <option>Iftar</option>
              <option>Udhiya</option>
              <option>Cleaning</option>
              <option>Programming</option>
            </select>
          </div>

          {/* Status */}
          <div className="admin-input-field">
            <label>Status</label>
            <select
              name="status"
              value={teamData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Upcoming</option>
              <option>Inactive</option>
            </select>
          </div>

        </div>

        {/* Description */}
        <div className="admin-input-field">
          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Team description"
            value={teamData.description}
            onChange={handleChange}
          />
        </div>

        {/* Members */}
        <div className="admin-input-field">
          <label>Members (comma separated)</label>
          <textarea
            name="members"
            rows="2"
            placeholder="Ahmed, Yusuf, Hanna"
            value={teamData.members}
            onChange={handleChange}
          />
        </div>

        {/* Submit */}
        <button className="admin-submit-btn" onClick={handleSubmit}>
          Create Team
        </button>

      </div>
    </div>
  );
};

export default AdminCreateTeamPage;
