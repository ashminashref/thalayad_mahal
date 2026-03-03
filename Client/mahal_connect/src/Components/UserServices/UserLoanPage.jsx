import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Landmark, Clock, CheckCircle, Eye, Plus, X, Upload, Loader2, Info } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "./UserLoanPage.css";
import Floatingnav from "../../Common/User/FloatingNav";

const UserLoanPage = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    loan_purpose: '', amount_requested: '', repayment_months: '', description: '', id_proof: null
  });

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/loan-requests/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_proof) {
      return Swal.fire("Required", "Please upload an ID proof image", "warning");
    }

    setSubmitting(true);
    const data = new FormData();
    
    // Explicit appending with Type Casting to satisfy Django Serializer
    data.append("loan_purpose", formData.loan_purpose);
    data.append("amount_requested", parseFloat(formData.amount_requested));
    data.append("repayment_months", parseInt(formData.repayment_months)); // Fixed 400 error cause
    data.append("description", formData.description);
    data.append("id_proof", formData.id_proof);

    try {
      const token = localStorage.getItem('access_token');
      await axios.post("http://127.0.0.1:8000/api/loan-requests/", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({ 
        icon: 'success', 
        title: 'Application Sent', 
        text: 'The committee will review your request and notify you via email.',
        confirmButtonColor: '#1c3124' 
      });
      setShowModal(false);
      fetchLoans();
    } catch (err) {
      console.error("400 Error Details:", err.response?.data);
      const serverErrors = err.response?.data;
      // Show specific field error if available
      const errorMsg = serverErrors ? Object.values(serverErrors)[0][0] : "Check your inputs and try again";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Logic for the monthly installment preview
  const calculateInstallment = () => {
    const amt = parseFloat(formData.amount_requested);
    const months = parseInt(formData.repayment_months);
    if (amt > 0 && months > 0) {
      return (amt / months).toFixed(2);
    }
    return 0;
  };

  return (
    <div className="user-loan-page animate-fade-in">
      <header className="loan-header-section">
        <div className="header-content">
          <button onClick={() => navigate('/')} className="back-btn-modern"><ArrowLeftIcon /></button>
          <div className="header-text">
            <h1 className="curly-txt">Personal Loan</h1>
            <p>Interest-free financial support</p>
          </div>
        </div>
      </header>

      <div className="loan-summary-grid">
        <div className="loan-card action-card bg-dark" onClick={() => setShowModal(true)}>
          <div className="icon-circle"><Plus size={20} /></div>
          <div className="stat-info"><h3>Apply Now</h3><p>New Request</p></div>
        </div>
        <div className="loan-card">
          <div className="icon-box orange"><Clock /></div>
          <div className="stat-info"><h3>{loans.filter(l => l.status === 'PENDING').length}</h3><p>Pending</p></div>
        </div>
        <div className="loan-card">
          <div className="icon-box blue"><CheckCircle /></div>
          <div className="stat-info"><h3>{loans.filter(l => l.status === 'COMPLETED').length}</h3><p>Completed</p></div>
        </div>
      </div>

      <div className="loan-table-card">
        <div className="section-title">
            <Landmark size={18} />
            <h2>Loan History</h2>
        </div>
        <div className="table-container-responsive">
          <table className="modern-table">
            <thead>
              <tr><th>Purpose</th><th>Amount</th><th>Status</th><th>View</th></tr>
            </thead>
            <tbody>
              {loans.length > 0 ? (
                loans.map(loan => (
                  <tr key={loan.id}>
                    <td>
                      <div className="p-name">{loan.loan_purpose}</div>
                      <div className="p-date">{new Date(loan.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-amount">₹{loan.amount_requested}</td>
                    <td><span className={`status-pill ${loan.status.toLowerCase()}`}>{loan.status}</span></td>
                    <td><button className="icon-btn-view"><Eye size={18}/></button></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-4 text-muted">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="medical-modal-overlay">
          <div className="medical-modal-card slide-up">
            <div className="modal-header">
              <h3>Apply for Loan</h3>
              <button onClick={() => setShowModal(false)} className="close-x"><X /></button>
            </div>
            
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Purpose of Loan" required onChange={e => setFormData({...formData, loan_purpose: e.target.value})} />
              </div>
              
              <div className="row g-2">
                <div className="col-7">
                  <input type="number" placeholder="Amount (₹)" required onChange={e => setFormData({...formData, amount_requested: e.target.value})} />
                </div>
                <div className="col-5">
                  <input type="number" placeholder="Months" required onChange={e => setFormData({...formData, repayment_months: e.target.value})} />
                </div>
              </div>

              {/* Installment Preview Box */}
              {(formData.amount_requested && formData.repayment_months) && (
                <div className="installment-preview animate-fade-in">
                  <Info size={16} />
                  <span>Estimated Monthly Installment: <strong>₹{calculateInstallment()}</strong></span>
                </div>
              )}

              <textarea placeholder="Tell us more about your requirement..." rows="3" required onChange={e => setFormData({...formData, description: e.target.value})} />
              
              <div className="upload-zone">
                <input type="file" id="proof" hidden required onChange={e => setFormData({...formData, id_proof: e.target.files[0]})} />
                <label htmlFor="proof" className="upload-label">
                  <Upload size={20} />
                  <span>{formData.id_proof ? formData.id_proof.name : "Upload Identity Proof"}</span>
                </label>
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

export default UserLoanPage;