import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Plus, Clock, CheckCircle, FileText, X, Upload, Loader2, ClipboardList } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './UserMedicinePage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserMedicinePage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    patient_name: '', disease: '', medicine_details: '', amount_needed: '', proof_image: null
  });

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/medical-requests/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const token = localStorage.getItem('access_token');
      await axios.post("http://127.0.0.1:8000/api/medical-requests/", data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire({
        icon: 'success',
        title: 'Request Sent',
        text: 'Your application is under review.',
        confirmButtonColor: '#1c3124'
      });
      setShowModal(false);
      fetchRequests();
    } catch { 
      Swal.fire("Error", "Submission failed", "error"); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedTotal = requests
    .filter(r => r.status === 'APPROVED')
    .reduce((sum, r) => sum + parseFloat(r.amount_needed), 0);

  return (
    <div className="user-medicine-page">
      <div className="medicine-main-container">
        
        {/* Header Section */}
        <header className="medicine-header-section">
          <div className="header-content">
            <button onClick={() => navigate('/')} className="back-btn-modern">
              <ArrowLeftIcon />
            </button>
            <div className="header-text">
              <h1 className="curly-txt">Medical Support</h1>
              <p>Apply for financial healthcare assistance</p>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <section className="medicine-dashboard-grid">
          <div className="stat-card action-card" onClick={() => setShowModal(true)}>
            <div className="icon-box green"><Plus /></div>
            <div className="stat-info">
              <h3>New Request</h3>
              <p>Apply Now</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="icon-box orange"><Clock /></div>
            <div className="stat-info">
              <h3>{pendingCount}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-box blue"><CheckCircle /></div>
            <div className="stat-info">
              <h3>₹{approvedTotal.toLocaleString()}</h3>
              <p>Approved</p>
            </div>
          </div>
        </section>

        {/* Requests List */}
        <section className="requests-section">
          <div className="section-header">
            <ClipboardList size={20} />
            <h2>Recent Applications</h2>
          </div>

          <div className="table-container-responsive">
            {loading ? (
              <div className="loader-box"><Loader2 className="spinner" /></div>
            ) : requests.length > 0 ? (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Patient Details</th>
                    <th>Diagnosis</th>
                    <th>Required</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id}>
                      <td>
                        <div className="p-name">{req.patient_name}</div>
                        <div className="p-date">{new Date(req.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-disease">{req.disease}</td>
                      <td className="p-amount">₹{req.amount_needed}</td>
                      <td>
                        <span className={`status-pill ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No requests found</div>
            )}
          </div>
        </section>
      </div>

      {/* Modal - Modernized */}
      {showModal && (
        <div className="medical-modal-overlay">
          <div className="medical-modal-card slide-up">
            <div className="modal-header">
              <h3>New Assistance Request</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient Full Name</label>
                <input type="text" placeholder="Enter name" required onChange={e => setFormData({...formData, patient_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Disease/Medical Condition</label>
                <input type="text" placeholder="Diagnosis" required onChange={e => setFormData({...formData, disease: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Medicine & Treatment Details</label>
                <textarea rows="3" placeholder="Explain the requirement..." required onChange={e => setFormData({...formData, medicine_details: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Amount Requested (₹)</label>
                <input type="number" placeholder="0.00" required onChange={e => setFormData({...formData, amount_needed: e.target.value})} />
              </div>
              <div className="form-group">
                <div className="upload-zone">
                  <input type="file" id="proof" hidden required onChange={e => setFormData({...formData, proof_image: e.target.files[0]})} />
                  <label htmlFor="proof" className="upload-label">
                    <Upload size={20} />
                    <span>{formData.proof_image ? formData.proof_image.name : "Upload Proof (PDF/Image)"}</span>
                  </label>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="submit-btn-premium">
                {submitting ? <Loader2 className="spinner" /> : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
      <Floatingnav />
    </div>
  );
};

export default UserMedicinePage;