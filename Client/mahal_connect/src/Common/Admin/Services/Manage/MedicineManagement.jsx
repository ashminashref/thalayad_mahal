import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Spinner, Modal, Container } from "react-bootstrap";
import { Pill, Check, X, Eye, User, ArrowLeft, Activity, Calendar, Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./MedicineManagement.css";

const MedicineManagement = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);

  const fetchData = async () => {
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

  useEffect(() => { fetchData(); }, []);

 const handleAction = async (id, status, patient) => {
    const isApprove = status === 'APPROVED';
    const result = await Swal.fire({
      title: isApprove ? 'Approve Support?' : 'Reject Request?',
      text: `Confirm medical assistance for ${patient}.`,
      icon: isApprove ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApprove ? '#1c3124' : '#d33',
      confirmButtonText: isApprove ? 'Yes, Approve' : 'Yes, Reject',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        
        // Fix: Explicitly wrap headers and ensure JSON format
        await axios.patch(
          `http://127.0.0.1:8000/api/medical-requests/${id}/`, 
          { status: status }, 
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json' // Forces the correct media type
            } 
          }
        );

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Request ${status.toLowerCase()} successfully.`,
          confirmButtonColor: '#1c3124'
        });
        fetchData();
      } catch (err) { 
        console.error("Patch Error:", err.response?.data);
        Swal.fire("Error", "Unable to update request status.", "error"); 
      }
    }
  };

  if (loading) return (
    <div className="admin-loader">
      <Spinner animation="grow" variant="success" />
      <p>Fetching Medical Requests...</p>
    </div>
  );

  return (
    <div className="medicine-admin-page animate-fade-in">
      <Container fluid className="px-lg-5 py-4">
        {/* Header Section */}
        <div className="admin-header-row mb-5">
          <div className="d-flex align-items-center gap-4">
            <button className="back-btn-premium" onClick={() => navigate(-1)}>
              <ArrowLeft size={22} />
            </button>
            <div className="header-titles">
              <h2 className="fw-bold mb-1">Medical Support Dashboard</h2>
              <div className="d-flex align-items-center gap-2 text-muted small">
                <Activity size={16} />
                <span>Reviewing {requests.length} total applications</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <Card className="premium-main-card">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 premium-table">
              <thead>
                <tr>
                  <th className="ps-4">Applicant</th>
                  <th>Medical Case</th>
                  <th>Medication Details</th>
                  <th>Proof</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Decisions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? requests.map(req => (
                  <tr key={req.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-placeholder"><User size={18} /></div>
                        <div>
                          <div className="fw-bold text-dark">{req.username}</div>
                          <div className="text-muted tiny-text d-flex align-items-center gap-1">
                            <Calendar size={12} /> {new Date(req.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark mb-1">{req.patient_name}</div>
                      <Badge className="badge-soft-info">{req.disease}</Badge>
                    </td>
                    <td>
                      <div className="med-details-box">
                        <Clipboard size={12} className="text-muted" />
                        <span>{req.medicine_details}</span>
                      </div>
                    </td>
                    <td>
                      <Button variant="link" className="view-proof-btn p-0" onClick={() => setSelectedProof(req.proof_image)}>
                        <Eye size={18} className="me-2" />
                        <span>View Document</span>
                      </Button>
                    </td>
                    <td>
                      <span className={`status-dot-pill ${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {req.status === 'PENDING' ? (
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn-action-green" onClick={() => handleAction(req.id, 'APPROVED', req.patient_name)}>
                            <Check size={18} />
                          </button>
                          <button className="btn-action-red" onClick={() => handleAction(req.id, 'REJECTED', req.patient_name)}>
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
                    <td colSpan="6" className="text-center py-5 text-muted">No pending medical requests found.</td>
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
          <Modal.Title className="fw-bold">Medical Documentation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="modal-img-container shadow-sm border rounded">
            <img src={selectedProof} alt="Proof" className="img-fluid rounded" />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MedicineManagement;