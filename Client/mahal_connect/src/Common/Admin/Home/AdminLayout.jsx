import React from 'react';
import { Container, Nav, Button } from 'react-bootstrap';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Premium icon
import Swal from 'sweetalert2'; // For the premium alert
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current tab from the URL path
  const currentTab = location.pathname.split('/').pop() || 'announcements';

  const tabs = [
    "Announcements", "Users", "Payments", 
    "Teams", "Library", "Certificates", "Services", "Analytics"
  ];

  // Global Logout Logic
  const handleLogout = () => {
    Swal.fire({
      title: 'Sign Out',
      text: "Are you sure you want to exit the Admin Dashboard?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1a3024', // Mahal Connect Green
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Sign Out',
      borderRadius: '15px'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear all session data
        localStorage.clear(); 
        
        // Securely redirect to login
        navigate('/login', { replace: true });
        
        // Optional: Force reload to clear any remaining state
        window.location.reload();
      }
    });
  };

  return (
    <div className="admin-bg">
      <Container className="py-4">
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold dashboard-title">Admin Dashboard</h2>
            <p className="dashboard-subtitle mb-0">Manage requests, users, and content</p>
          </div>

          {/* Replaced ThemeToggle with Logout Button */}
          <div className="admin-header-actions">
            <Button 
              onClick={handleLogout}
              variant="outline-danger" 
              className="d-flex align-items-center gap-2 border-0 shadow-sm px-4 py-2"
              style={{ 
                backgroundColor: '#fff5f5', 
                color: '#dc3545', 
                borderRadius: '12px', 
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          </div>
        </header>

        {/* The Navigation Navbar */}
        <Nav 
          variant="pills" 
          activeKey={currentTab} 
          onSelect={(selectedKey) => navigate(selectedKey)} 
          className="admin-navbar gap-3 mb-5 overflow-auto no-scrollbar flex-nowrap"
        >
          {tabs.map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab.toLowerCase()} className="rounded-pill px-4">
                {tab}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* This is where the specific page content will render */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </Container>
    </div>
  );
};

export default AdminLayout;