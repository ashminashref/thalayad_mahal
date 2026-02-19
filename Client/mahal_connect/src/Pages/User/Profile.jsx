import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { FileText, CreditCard, Moon, HelpCircle, ChevronRight, LogOut } from 'lucide-react';
import Usercard from '../../Components/User/Home/Usercard';
import Floatingnav from '../../Common/User/FloatingNav';
import ThemeToggle from '../../UI/ThemeToggle';
import { useTheme } from '../../Theme/UseTheme';
import Swal from 'sweetalert2'; // Assuming you use the premium alerts we set up
import './Profile.css'

/**
 * Dynamically renders either a Link (for navigation) or a Div (for actions like Toggles)
 */
const SettingRow = ({ icon: Icon, title, subtitle, linkTo, action }) => {
  const content = (
    <div className="d-flex align-items-center justify-content-between py-4 ">
      <div className="d-flex align-items-center gap-3">
        <div className="icon-box d-flex align-items-center justify-content-center rounded-3" style={{ width: '42px', height: '42px' }}>
          <Icon size={20} className="Link-icon" />
        </div>
        <div>
          <h6 className="Link-txt">{title}</h6>
          <p className="mb-0 link-p " style={{ fontSize: '0.8rem' }}>{subtitle}</p>
        </div>
      </div>
      
      <div>
        {action ? action : <ChevronRight size={18} className="" />}
      </div>
    </div>
  );

  if (linkTo && !action) {
    return (
      <Link to={linkTo} className="Link-txt">
        {content}
      </Link>
    );
  }

  return <div className="">{content}</div>;
};

function Profile() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Premium Confirmation Dialog
    Swal.fire({
      title: 'Sign Out?',
      text: "Are you sure you want to log out of Mahal Connect?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#1a3024',
      confirmButtonText: 'Yes, Sign Out',
      background: theme === 'dark' ? '#1a1a1a' : '#fff',
      color: theme === 'dark' ? '#fff' : '#000'
    }).then((result) => {
      if (result.isConfirmed) {
        // 2. Clear Local Storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.clear()

        // 3. Navigate and Replace History
        // Using replace: true ensures they can't click "back" to return here
        navigate('/login', { replace: true });
        window.location.reload()
        window.location.replace('login')
      }
    });
  };

  return (
    <div className=" pb-5 mb-5">
      {/* Top User Profile Card */}
      <Usercard />

      {/* Settings List Section */}
      <div className="settings-card rounded-4 shadow-sm p-3 mt-3">
        <SettingRow 
          icon={FileText} 
          title="My Documents" 
          subtitle="View all certificates" 
          linkTo="/documents" 
        />
        
        <SettingRow 
          icon={CreditCard} 
          title="Payment History" 
          subtitle="Track contributions" 
          linkTo="/paymentHistory"
        />

        <SettingRow 
          icon={Moon} 
          title="Dark Mode" 
          subtitle={theme === 'dark' ? 'Currently Dark' : 'COMING SOON'}
          // action={<ThemeToggle />} 
          className="btn-disabled"
        />

        <SettingRow 
          icon={HelpCircle} 
          title="Help & Support" 
          subtitle="FAQs & contact" 
          linkTo="/support"
          isLast={true} 
        />
      </div>

      {/* Sign Out Action */}
      <button 
        onClick={handleLogout} // Trigger the logout logic
        className="btn w-100 mt-4 py-3 rounded-4 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm" 
        style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
      >
        <LogOut size={20} />
        <span className="fw-bold">Sign Out</span>
      </button>

      {/* Persistent Bottom Nav */}
      <Floatingnav />
    </div>
  );
}

export default Profile;