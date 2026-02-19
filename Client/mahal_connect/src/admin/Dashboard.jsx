import React from "react";
import {
  Search,
  Bell,
  Plus,
  Users,
  CreditCard,
  FileText,
  UsersRound
} from "lucide-react";
import Sidebar from "../Common/User/Sidebar"; // Ensure you have separated this component
import "./Dashboar.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Imported Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content">
        <div className="main-wrapper">

          {/* Header */}
          <header className="top-header">
            <div className="search-bar">
              <Search size={18} />
              <input placeholder="Search members, payments, certificates..." />
            </div>

            <div className="header-actions">
              <span className="status-badge">● 18 Online</span>
              <Bell className="action-icon" size={20} />
              <div className="user-profile">
                <div className="avatar">MA</div>
                <div>
                  <p className="user-name">Mahal Admin</p>
                  <p className="user-role">Admin</p>
                </div>
              </div>
            </div>
          </header>

          {/* Welcome Section */}
          <section className="welcome-section">
            <h1>Assalamu Alaikum, Mahal Admin 👋</h1>
            <p>Here's what's happening at Al Noor Mahal Community today.</p>
          </section>

          {/* Stats Grid */}
          <div className="stats-grid">
            <Stat title="Total Members" value="250" sub="3 online now" icon={<Users />} dark />
            <Stat title="Total Collections" value="₹4,500" sub="↑ 8% this month" icon={<CreditCard />} />
            <Stat title="Pending Requests" value="1" sub="Certificates awaiting" icon={<FileText />} />
            <Stat title="Active Teams" value="2" sub="4 total teams" icon={<UsersRound />} />
          </div>

          {/* Payments & Certificates */}
          <div className="content-grid">
            <Card title="Recent Payments" link>
              <PaymentItem name="Ahmed Ali" type="Monthly Contribution" amount="500" status="paid" method="online" />
              <PaymentItem name="Fathima Noor" type="Donation" amount="1000" status="paid" method="cash" />
              <PaymentItem name="Mohammed Rashid" type="Monthly Contribution" amount="500" status="pending" method="online" />
            </Card>

            <Card title="Certificate Requests">
              <CertItem name="Ahmed Ali" type="Birth Certificate" status="pending" />
              <CertItem name="Fathima Noor" type="Education Certificate" status="approved" />
              <CertItem name="Ahmed Ali" type="Marriage Certificate" status="rejected" />
            </Card>
          </div>

          {/* Teams Section */}
          <section className="teams-section">
            <div className="section-header">
              <h3>Active Teams</h3>
              <button className="add-btn"><Plus size={16} /> Add Team</button>
            </div>

            <div className="teams-grid">
              <TeamCard name="Iftar Team" color="#10b981" members={1} />
              <TeamCard name="Uluhiyath Team" color="#f59e0b" members={1} />
              <TeamCard name="Cleaning Team" color="#3b82f6" members={0} />
              <TeamCard name="Programming Team" color="#8b5cf6" members={0} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

/* --- Reusable Sub-Components --- */

const Stat = ({ title, value, sub, icon, dark }) => (
  <div className={`stat-card ${dark ? "dark-green" : ""}`}>
    <div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span className="stat-sub">{sub}</span>
    </div>
    {icon}
  </div>
);

const Card = ({ title, children, link }) => (
  <div className="card-section">
    <div className="section-header">
      <h3>{title}</h3>
      {link && <a href="#" style={{ color: '#10b981', textDecoration: 'none' }}>View all ↗</a>}
    </div>
    <div className="list-container">{children}</div>
  </div>
);

const PaymentItem = ({ name, type, amount, status, method }) => (
  <div className="list-item">
    <div className="item-info">
      <div className="item-avatar">{name[0]}</div>
      <div>
        <p className="item-name">{name}</p>
        <p className="item-sub">{type}</p>
      </div>
    </div>
    <div className="item-meta">
      <p className="amount">₹{amount}</p>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end' }}>
        <span className={`badge ${status}`}>{status}</span>
        <span className="method">{method}</span>
      </div>
    </div>
  </div>
);

const CertItem = ({ name, type, status }) => (
  <div className="list-item">
    <div>
      <p className="item-name">{name}</p>
      <p className="item-sub">{type}</p>
    </div>
    <span className={`badge ${status}`}>{status}</span>
  </div>
);

const TeamCard = ({ name, color, members }) => (
  <div className="team-card">
    <div className="team-header">
      <span className="dot" style={{ backgroundColor: color }}></span>
      <p style={{ margin: 0, fontWeight: 500 }}>{name}</p>
    </div>
    <div className="team-body">
      {members > 0 ? (
        <div className="member-circle">{name[0]}</div>
      ) : (
        <p className="no-members">No members yet</p>
      )}
      <p className="member-count">{members} members</p>
    </div>
  </div>
);

export default Dashboard;