import React from "react";
import { Plus, Users, UserCheck, Phone, MapPin, UserCircle } from "lucide-react";
import './Members.css'
import Sidebar from "../Common/User/Sidebar";

const MembersContent = () => {
  const membersData = [
    { id: "p001", name: "Ahmed Ali", phone: "9876543210", address: "Street 1, Kerala", family: 4, status: "active", online: true },
    { id: "p002", name: "Fathima Noor", phone: "9123456780", address: "Street 2, Kerala", family: 3, status: "active", online: false },
    { id: "p003", name: "Mohammed Rashid", phone: "9988776655", address: "Street 3, Kerala", family: 5, status: "active", online: true },
    { id: "p004", name: "Ayesha Begum", phone: "9876123450", address: "Street 4, Kerala", family: 2, status: "active", online: false },
    { id: "p005", name: "Ibrahim Khan", phone: "9123789456", address: "Street 5, Kerala", family: 6, status: "active", online: false },
  ];

  return (
    <div className="main-wrapper">
      {/* Title and Add Member Button */}
            <Sidebar />

      <div className="section-header" style={{ marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Members Directory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage community members and their information
          </p>
        </div>
        <button className="add-btn">
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Top Stats Overview */}
      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <MemberStat icon={<Users size={24} color="#1a4d3c" />} count="5" label="Total Members" />
        <MemberStat icon={<UserCheck size={24} color="#10b981" />} count="4" label="Active Members" />
        <MemberStat icon={null} count="3" label="Currently Online" isOnline />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs" style={{ marginBottom: '25px' }}>
        <button className="tab active">All</button>
        <button className="tab">Active</button>
        <button className="tab">Inactive</button>
      </div>

      {/* Members Grid */}
      <div className="members-grid">
        {membersData.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
};

/* --- Internal Sub-Components --- */

const MemberStat = ({ icon, count, label, isOnline }) => (
  <div className="stat-card" style={{ justifyContent: 'flex-start', gap: '15px' }}>
    <div className="icon-box" style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex' }}>
      {isOnline ? <span style={{ color: '#f59e0b', fontSize: '24px', lineHeight: '1' }}>●</span> : icon}
    </div>
    <div>
      <h2 style={{ margin: 0 }}>{count}</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</p>
    </div>
  </div>
);

const MemberCard = ({ member }) => (
  <div className="card-section member-card-item">
    <div className="member-card-header" style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
      <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem', flexShrink: 0 }}>
        {member.name[0]}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{member.name}</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{member.id}</p>
      </div>
    </div>
    
    <div className="member-details" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="detail-row"><Phone size={14} /> <span>{member.phone}</span></div>
      <div className="detail-row"><MapPin size={14} /> <span>{member.address}</span></div>
      <div className="detail-row"><UserCircle size={14} /> <span>{member.family} family members</span></div>
    </div>

    <div className="member-card-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="badge active" style={{ borderRadius: '20px', fontSize: '10px', padding: '4px 12px' }}>
        {member.status}
      </span>
      {member.online && (
        <span style={{ color: 'var(--accent-green)', fontSize: '0.75rem', fontWeight: 600 }}>
          Online
        </span>
      )}
    </div>
  </div>
);

export default MembersContent;