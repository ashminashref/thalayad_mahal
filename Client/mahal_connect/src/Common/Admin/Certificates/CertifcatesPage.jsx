import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Badge, Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { FileText, Check, X, Eye, Search } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Certificates.css';

const CertificatesPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch live data from Backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/admin/certificate-requests/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.response?.status === 403) {
        Swal.fire("Access Denied", "You do not have admin permissions.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 2. Filter & Search Logic
  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const statusMatch = filterStatus === "All" || req.status.toUpperCase() === filterStatus.toUpperCase();
      const searchMatch = req.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.username?.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [requests, filterStatus, searchTerm]);

  // 3. Status Update Logic (Optimistic UI + DB Persistence)
  const handleUpdateStatus = async (e, id, newStatus) => {
    if (e) e.preventDefault(); // Prevents button from triggering any form refreshes
    
    const statusUpper = newStatus.toUpperCase();

    const result = await Swal.fire({
      title: `Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}?`,
      text: `Marking this as ${statusUpper} will notify the user via email.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'approved' ? '#28a745' : '#dc3545',
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        
        // 1. Update the backend permanently
        await axios.patch(`http://127.0.0.1:8000/api/certificate-requests/${id}/`, 
          { status: statusUpper }, 
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        // 2. CRITICAL: Update local state immediately
        // This causes the component to re-render, changing the badge and hiding buttons
        setRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === id ? { ...req, status: statusUpper } : req
          )
        );

        Swal.fire("Success", `Application has been ${newStatus}.`, "success");
      } catch (err) {
        console.error("Update error:", err);
        Swal.fire("Error", "Could not save to database. Please check your connection.", "error");
      }
    }
  };

  const pendingCount = requests.filter(req => req.status.toUpperCase() === 'PENDING').length;

  if (loading) return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="primary" />
      <p className="mt-2 text-muted">Syncing with database...</p>
    </div>
  );

  return (
    <div className="animate-fade-in p-4">
      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="cert-icon-wrapper bg-primary text-white p-2 rounded-3 shadow-sm">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0">Certificate Management</h4>
            <small className="text-muted">{pendingCount} pending requests in system</small>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2">
          {/* Search Input */}
          <InputGroup size="sm" style={{ width: '250px' }}>
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={14} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {/* Filter Dropdown */}
          <Form.Select 
            size="sm" 
            className="rounded shadow-sm" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Select>
        </div>
      </div>

      {/* Requests Table */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0 custom-table text-nowrap">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 py-3">Applicant</th>
                <th className="py-3">Type</th>
                <th className="py-3">Applied On</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4 py-4">
                      <div className="fw-bold text-dark">{req.full_name}</div>
                      <div className="smallest text-muted">User: {req.username}</div>
                    </td>
                    <td>
                      <Badge bg="info" className="text-capitalize px-3 py-2 rounded-pill fw-normal">
                        {req.certificate_type}
                      </Badge>
                    </td>
                    <td className="small text-muted">
                      {new Date(req.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td>
                      <Badge bg={
                        req.status.toUpperCase() === 'APPROVED' ? 'success' : 
                        req.status.toUpperCase() === 'REJECTED' ? 'danger' : 'warning'
                      } className="rounded-pill px-3 py-2 fw-bold">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2 align-items-center">
                        {/* View Action */}
                        <Button 
                          variant="light" size="sm" className="rounded-circle border shadow-sm"
                          onClick={() => window.open(req.document, "_blank")}
                          title="View Document"
                        >
                          <Eye size={16} className="text-secondary" />
                        </Button>
                        
                        {/* Decision Buttons - Visible ONLY if Pending */}
                        {req.status.toUpperCase() === 'PENDING' && (
                          <div className="ms-2 d-flex gap-2">
                            <Button 
                              type="button"
                              variant="outline-success" 
                              size="sm" 
                              className="rounded-pill px-3 py-1 fw-bold extra-small"
                              onClick={(e) => handleUpdateStatus(e, req.id, 'approved')}
                            >
                              <Check size={14} className="me-1"/> Approve
                            </Button>
                            <Button 
                              type="button"
                              variant="outline-danger" 
                              size="sm" 
                              className="rounded-pill px-3 py-1 fw-bold extra-small"
                              onClick={(e) => handleUpdateStatus(e, req.id, 'rejected')}
                            >
                              <X size={14} className="me-1"/> Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No requests found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default CertificatesPage;