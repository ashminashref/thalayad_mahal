import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, FileText, 
  UsersRound, Settings, LogOut, Menu, X 
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button (Only visible on small screens via CSS) */}
      <button className="mobile-toggle" onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleMenu}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-section">
          <div className="logo-icon">الله</div>
          <div>
            <h3>Al Noor</h3>
            <p>Mahal Community</p>
          </div>
        </div>
        
        <nav className="nav-menu">
          <div className="nav-item active">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <Users size={20} /> <span>Members</span>
          </div>
          <div className="nav-item">
            <CreditCard size={20} /> <span>Payments</span>
          </div>
          <div className="nav-item">
            <FileText size={20} /> <span>Certificates</span>
          </div>
          <div className="nav-item">
            <UsersRound size={20} /> <span>Teams</span>
          </div>
          <div className="nav-item">
            <span className="emoji-icon">📖</span> <span>Library</span>
          </div>
          <div className="nav-item">
            <span className="notif-dot-wrapper">
                <Settings size={20} />
            </span>
            <span>Notifications</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <Settings size={20} /> <span>Settings</span>
          </div>
          <div className="nav-item">
            <LogOut size={20} /> <span>Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;