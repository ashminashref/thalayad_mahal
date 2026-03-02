import React, { useState, useEffect } from "react";
import { Tabs, Tab, Card, Table, Badge, Button, Spinner, Modal } from "react-bootstrap";
import { Pill, Landmark, GraduationCap, Check, X, Eye, User, FileText } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AdminServices.css";

const ServiceManagement = () => {
  const [activeTab, setActiveTab] = useState("medical");
  const [data, setData] = useState({ medical: [], loans: [], programs: [] });
  const [loading, setLoading] = useState(true);
  const [showProof, setShowProof] = useState(null); // To view Prescription/ID Proof

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const [medRes, loanRes, eduRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/medical-requests/", config),
        axios.get("http://127.0.0.1:8000/api/loan-requests/", config),
        axios.get("http://127.0.0.1:8000/api/programs/", config),
      ]);
      setData({ medical: medRes.data, loans: loanRes.data, programs: eduRes.data });
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (endpoint, id, status, type) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.patch(`http://127.0.0.1:8000/api/${endpoint}/${id}/`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Updated!", `${type} request has been ${status}.`, "success");
      fetchData();
    } catch {
      Swal.fire("Error", "Action failed", "error");
    }
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="admin-service-dashboard p-3 animate-fade-in">
      <div className="dashboard-header mb-4">
        <h2 className="fw-bold">Service Management</h2>
        <p className="text-muted">Review and approve community support requests</p>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="custom-tabs mb-4">
        
        {/* MEDICAL TAB */}
        <Tab eventKey="medical" title={<span><Pill size={18}/> Medical</span>}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr><th>User</th><th>Patient/Disease</th><th>Amount</th><th>Proof</th><th>Status</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {data.medical.map(req => (
                  <tr key={req.id}>
                    <td><strong>{req.username}</strong></td>
                    <td>{req.patient_name} <br/><small className="text-muted">{req.disease}</small></td>
                    <td className="fw-bold text-success">₹{req.amount_needed}</td>
                    <td><Button variant="link" onClick={() => setShowProof(req.proof_image)}><Eye size={18}/></Button></td>
                    <td><Badge bg={req.status === 'APPROVED' ? 'success' : 'warning'}>{req.status}</Badge></td>
                    <td className="text-end">
                      {req.status === 'PENDING' && (
                        <>
                          <Button variant="success" size="sm" className="me-2" onClick={() => handleAction('medical-requests', req.id, 'APPROVED', 'Medical')}><Check size={14}/></Button>
                          <Button variant="danger" size="sm" onClick={() => handleAction('medical-requests', req.id, 'REJECTED', 'Medical')}><X size={14}/></Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        {/* LOAN TAB */}
        <Tab eventKey="loans" title={<span><Landmark size={18}/> Loans</span>}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr><th>User</th><th>Purpose</th><th>Amount/Period</th><th>ID</th><th>Status</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {data.loans.map(loan => (
                  <tr key={loan.id}>
                    <td><strong>{loan.username}</strong></td>
                    <td>{loan.loan_purpose}</td>
                    <td>₹{loan.amount_requested} <br/><small>{loan.repayment_months} Months</small></td>
                    <td><Button variant="link" onClick={() => setShowProof(loan.id_proof)}><FileText size={18}/></Button></td>
                    <td><Badge bg={loan.status === 'APPROVED' ? 'success' : 'warning'}>{loan.status}</Badge></td>
                    <td className="text-end">
                       {loan.status === 'PENDING' && (
                        <div className="d-flex justify-content-end gap-2">
                          <Button variant="success" size="sm" onClick={() => handleAction('loan-requests', loan.id, 'APPROVED', 'Loan')}><Check size={14}/> Approve</Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleAction('loan-requests', loan.id, 'REJECTED', 'Loan')}><X size={14}/></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        {/* EDUCATION TAB */}
        <Tab eventKey="education" title={<span><GraduationCap size={18}/> Education</span>}>
           {/* Add a "Create Program" button here if needed */}
           <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table hover responsive className="align-middle mb-0">
              <thead className="bg-light">
                <tr><th>Class Title</th><th>Teacher</th><th>Date/Time</th><th>Registrations</th><th>Status</th></tr>
              </thead>
              <tbody>
                {data.programs.map(prog => (
                  <tr key={prog.id}>
                    <td className="fw-bold">{prog.title}</td>
                    <td>{prog.teacher}</td>
                    <td>{prog.date} <br/><small>{prog.time}</small></td>
                    <td><Badge bg="info" pill>{prog.registration_count} Joined</Badge></td>
                    <td><Badge bg="dark">{prog.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>
      </Tabs>

      {/* Proof Viewer Modal */}
      <Modal show={!!showProof} onHide={() => setShowProof(null)} centered>
        <Modal.Header closeButton><Modal.Title>Document Verification</Modal.Title></Modal.Header>
        <Modal.Body className="text-center">
          <img src={showProof} alt="Proof" className="img-fluid rounded shadow" />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ServiceManagement;