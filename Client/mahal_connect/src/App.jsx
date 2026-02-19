import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./Theme/Themecontext";

/* ================= AUTH GUARDS ================= */

// PUBLIC ROUTE: Blocks access to Login/Signup if a session exists
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (token) {
    // If they click 'back' to login, instantly kick them to their correct home
    // 'replace' overwrites the history entry so the back button is neutralized
    return <Navigate to={isAdmin ? "/admin" : "/home"} replace />;
  }
  return children;
};

// PROTECTED ROUTE: Ensures only logged-in members can see user pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

// ADMIN ROUTE: Strictly blocks non-admins and handles unauthorized access
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return children;
};

/* ================= USER PAGES ================= */
import Home from "./Pages/User/Home";
import Notifications from "./Pages/User/Notifications";
import Profile from "./Pages/User/Profile";
import PaymentPage from "./Components/Payment";
import Certificate from "./Components/Certificate";
import UserDua from "./Pages/User/UserDua";
import Typedua from "./Components/User/Duas/Typedua";

/* ================= ADMIN PAGES ================= */
import AdminLayout from "./Common/Admin/Home/AdminLayout";
import AnnouncementsPage from "./Common/Admin/Announcements/AnnouncementPage";
import AddAnnouncementPage from "./Common/Admin/Announcements/CreateAnnouncementModel";
import UsersPage from "./Common/Admin/Users/UserPage";
import AddUserPage from "./Common/Admin/Users/AddUserPage";
import AdminPaymentPage from "./Common/Admin/Payments/AdminPaymentPage";
import TeamsPage from "./Common/Admin/Teams/TeamsPage";
import AddTeamPage from "./Common/Admin/Teams/CreateTeam";
import LibraryPage from "./Common/Admin/Library/LibraryPage";
import CertificatesPage from "./Common/Admin/Certificates/CertifcatesPage";
import AnalyticsPage from "./Common/Admin/Analytics/AnalyticsPage";

/* ================= SERVICES ================= */
import ServicesPage from "./Common/Admin/Services/ServicePage";
import FoodServicePage from "./Common/Admin/Services/FoodService";
import AddFoodService from "./Common/Admin/Services/AddFoodService";
import LoanAdminDashboard from "./Common/Admin/Services/PersonalLoan";
import EducationService from "./Common/Admin/Services/EducationalService";
import Medicine from "./Common/Admin/Services/Medicene";
import UserMedicinePage from "./Components/UserServices/UserMedicinePage";
import UserEducationPage from "./Components/UserServices/EducationalSupport";
import UserLoanPage from "./Components/UserServices/UserLoanPage";
import UserUdhiyaTeamPage from "./Components/UserTeam/UserUdhiyaTeamPage";
import UserIftarTeamPage from "./Components/UserTeam/UserIfthar";
import UserCleaningTeamPage from "./Components/UserTeam/UserCleaningTeamPage";
import UserProgrammingTeamPage from "./Components/UserTeam/UserProgrammingTeamPage";
import AdminCreateTeamPage from "./Common/Admin/Services/AdminCreateTeamPage";
import UserFoodServicePage from "./Components/UserServices/UserFoodService";
import UserLibraryPage from "./Components/UserLibrary/UserLibraryPage";
import Signup from "./Common/Login/Signup";
import Login from "./Common/Login/Login";
import EditAnnouncementPage from "./Common/Admin/Announcements/EditAnnouncementPage";
import TeamsManager from "./Common/Admin/Teams/TeamsManager";
import EditBookPage from "./Common/Admin/Library/EditBookPage";
import TeamDetailPage from "./Components/UserTeam/TeamDetailPage";
import MyDocuments from "./Pages/User/MyDocuments";
import SupportPage from "./Pages/User/SupportPage";

function App() {
  return (
    <ThemeProvider>
      <div className="p-3">
        <Routes>

          {/* ========= PUBLIC ROUTES (Auth) ========= */}
          {/* PublicRoute now checks if user is logged in and replaces history */}
          <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

          {/* ========= PROTECTED USER ROUTES ========= */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/teams/:id" element={<TeamDetailPage />} />
          <Route path="/notification" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/userprofile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />

          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
          <Route path="/typedua" element={<ProtectedRoute><Typedua /></ProtectedRoute>} />
          <Route path="/dua" element={<ProtectedRoute><UserDua /></ProtectedRoute>} />
          <Route path="/dua/:categoryName" element={<ProtectedRoute><UserDua /></ProtectedRoute>} />
          <Route path='/foodservice' element={<ProtectedRoute><UserFoodServicePage /></ProtectedRoute>} />
          <Route path="/usermedicine" element={<ProtectedRoute><UserMedicinePage /></ProtectedRoute>} />
          <Route path="/usereducation" element={<ProtectedRoute><UserEducationPage /></ProtectedRoute>} />
          <Route path="/userloan" element={<ProtectedRoute><UserLoanPage /></ProtectedRoute>} />
          <Route path='/ifthar' element={<ProtectedRoute><UserIftarTeamPage /></ProtectedRoute>} />
          <Route path='/uluhiyath' element={<ProtectedRoute><UserUdhiyaTeamPage /></ProtectedRoute>} />
          <Route path="/cleaning" element={<ProtectedRoute><UserCleaningTeamPage /></ProtectedRoute>} />
          <Route path="programming" element={<ProtectedRoute><UserProgrammingTeamPage /></ProtectedRoute>} />
          <Route path="/libraryuser" element={<ProtectedRoute><UserLibraryPage /></ProtectedRoute>} />

          {/* ========= ADMIN ROUTES (Role-Based) ========= */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AnnouncementsPage />} />
            
            <Route path="announcements">
              <Route index element={<AnnouncementsPage />} />
              <Route path="add" element={<AddAnnouncementPage />} />
              <Route path="edit/:id" element={<EditAnnouncementPage />} /> {/* New Edit Route */}
            </Route>

            <Route path="users">
              <Route index element={<UsersPage />} />
              <Route path="add" element={<AddUserPage />} />
            </Route>

            <Route path="payments" element={<AdminPaymentPage />} />

            <Route path="teams">
              <Route index element={<TeamsPage />} />
              <Route path="add" element={<AddTeamPage />} />
              <Route path="edit/:id" element={<TeamsManager />} />
            </Route>

            <Route path="library" element={<LibraryPage />} />
<Route path="library/edit/:id" element={<EditBookPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />

            <Route path="services">
              <Route index element={<ServicesPage />} />
              <Route path="foodservices">
                <Route index element={<FoodServicePage />} />
                <Route path="add" element={<AddFoodService />} />
                <Route path="createteam" element={<AdminCreateTeamPage />} />
              </Route>
              <Route path="medical" element={<Medicine />} />
              <Route path="loan" element={<LoanAdminDashboard />} />
              <Route path="education" element={<EducationService />} />
            </Route>
          </Route>

          {/* ========= 404 ========= */}
          <Route path="*" element={<div>Page Not Found</div>} />

        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;