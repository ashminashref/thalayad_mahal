import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Spinner, Modal, Container } from "react-bootstrap";
import { Landmark, Check, X, Eye, User, ArrowLeft, Calendar, FileText, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminLoanManagement.css";

const AdminLoanManagement = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/loan-requests/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoans(res.data);
    } catch (err) {
      console.error("Failed to fetch loans", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleAction = async (id, status, purpose) => {
    const isApprove = status === "APPROVED";
    const confirmColor = isApprove ? "#1c3124" : "#d33";

    const result = await Swal.fire({
      title: isApprove ? 'Approve Loan?' : 'Reject Request?',
      text: `Are you sure you want to ${status.toLowerCase()} the loan for "${purpose}"?`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      confirmButtonText: `Yes, ${status}`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.patch(`http://127.0.0.1:8000/api/loan-requests/${id}//`, 
          { status: status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Swal.fire({
            title: "Success",
            text: `Application ${status.toLowerCase()} successfully. Email sent.`,
            icon: "success",
            confirmButtonColor: "#1c3124"
        });
        fetchLoans();
      } catch {
        Swal.fire("Error", "Update failed. Please try again.", "error");
      }
    }
  };

  if (loading) return (
    <div className="admin-loader">
      <Spinner animation="grow" variant="success" />
      <p className="mt-3 fw-bold text-muted">Loading Applications...</p>
    </div>
  );

  return (
    <div className="admin-loan-mgmt animate-fade-in">
      <Container fluid className="px-lg-5 py-4">
        {/* Header Section */}
        <div className="admin-header-row mb-5">
          <div className="d-flex align-items-center gap-4">
            <button className="back-btn-premium" onClick={() => navigate("/admin/services")}>
              <ArrowLeft size={22} />
            </button>
            <div className="header-titles">
              <h2 className="fw-bold mb-1">Loan Management</h2>
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Landmark size={16} />
                <span>Total Applications: {loans.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="premium-main-card border-0 shadow-lg">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 premium-table">
              <thead>
                <tr>
                  <th className="ps-4">Applicant</th>
                  <th>Purpose</th>
                  <th>Financing</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Decisions</th>
                </tr>
              </thead>
              <tbody>
                {loans.length > 0 ? loans.map(loan => (
                  <tr key={loan.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-placeholder"><User size={18} /></div>
                        <div>
                          <div className="fw-bold text-dark">{loan.username}</div>
                          <div className="text-muted tiny-text d-flex align-items-center gap-1">
                            <Calendar size={12} /> {new Date(loan.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark mb-1">{loan.loan_purpose}</div>
                      <div className="small text-muted text-truncate" style={{maxWidth: '180px'}}>{loan.description}</div>
                    </td>
                    <td>
                      <div className="fw-bold text-dark d-flex align-items-center gap-1">
                        <IndianRupee size={14} /> {loan.amount_requested}
                      </div>
                      <div className="small text-muted">{loan.repayment_months} Months Tenure</div>
                    </td>
                    <td>
                      <Button variant="link" className="view-proof-btn p-0" onClick={() => setSelectedProof(loan.id_proof)}>
                        <FileText size={16} className="me-2" />
                        <span>View ID Proof</span>
                      </Button>
                    </td>
                    <td>
                      <span className={`status-dot-pill ${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {loan.status === 'PENDING' ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn-action-green" onClick={() => handleAction(loan.id, 'APPROVED', loan.loan_purpose)}>
                            <Check size={18} />
                          </button>
                          <button className="btn-action-red" onClick={() => handleAction(loan.id, 'REJECTED', loan.loan_purpose)}>
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="processed-tag">Processed</div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">No applications found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* Proof Modal */}
      <Modal show={!!selectedProof} onHide={() => setSelectedProof(null)} centered size="lg" className="premium-modal">
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Identity Verification Document</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="modal-img-container shadow-sm border rounded overflow-hidden">
            <img src={selectedProof} alt="ID Proof" className="img-fluid" />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLoanManagement;