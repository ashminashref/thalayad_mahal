import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Table, Badge, Form, InputGroup, Row, Col, Spinner } from 'react-bootstrap';
import { Download, Search, CreditCard, CheckCircle, Clock, XCircle, Settings, Save, Eye } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Payments.css';

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fee Management State
  const [fees, setFees] = useState({ monthly: 500, madrassa: 1200 });
  const [editingFees, setEditingFees] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // Use your Laptop IP for mobile accessibility
  const BASE_URL = "http://127.0.0.1:8000";

  const fetchPaymentData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return navigate("/login");

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Ensure URLs have trailing slashes to avoid 400/301 errors
      const [payRes, feeRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/payments/`, config),
        axios.get(`${BASE_URL}/api/admin/fee-config/`, config)
      ]);

      setPayments(payRes.data);
      setFees(feeRes.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
          Swal.fire("Session Expired", "Please login again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPaymentData(); }, []);

  const handleUpdateFees = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${BASE_URL}/api/admin/fee-config/`, fees, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingFees(false);
      Swal.fire("Success!", "User payment rates have been updated live.", "success");
    } catch (err) {
      Swal.fire("Error", "Could not update fees. Check admin permissions.", "error");
    }
  };

  const handleVerifyStatus = async (id, newStatus) => {
      try {
          const token = localStorage.getItem('access_token');
          await axios.patch(`${BASE_URL}/api/admin/payments/${id}/`, { status: newStatus }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchPaymentData(); // Refresh list
          Swal.fire("Updated", `Payment marked as ${newStatus}`, "success");
      } catch {
          Swal.fire("Error", "Update failed", "error");
      }
  };

  const filteredData = useMemo(() => {
    return payments.filter((item) => {
      const matchesSearch = item.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.id.toString().includes(searchTerm);
      const matchesStatus = statusFilter === "All Status" || item.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === "All Types" || item.payment_type.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, searchTerm, statusFilter, typeFilter]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>;

  return (
    <div className="animate-fade-in p-4 bg-light min-vh-100">
      {/* FEE CONFIGURATION */}
      <Card className="border-0 shadow-sm rounded-4 mb-4 p-4 fee-config-card bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Settings size={20} className="text-success" />
            <h5 className="fw-bold mb-0 text-dark">Global Fee Configuration</h5>
          </div>
          <Button 
            variant={editingFees ? "success" : "outline-success"} 
            className="rounded-pill px-4"
            size="sm" 
            onClick={editingFees ? handleUpdateFees : () => setEditingFees(true)}
          >
            {editingFees ? <><Save size={16} className="me-1"/> Save Rates</> : "Change Rates"}
          </Button>
        </div>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <Form.Label className="small fw-bold text-muted">Monthly Contribution (₹)</Form.Label>
            <Form.Control 
              type="number" 
              disabled={!editingFees}
              value={fees.monthly}
              onChange={(e) => setFees({...fees, monthly: e.target.value})}
              className="border-0 bg-light rounded-3 py-2 fw-bold"
            />
          </Col>
          <Col md={6}>
            <Form.Label className="small fw-bold text-muted">Madrassa Fee (₹)</Form.Label>
            <Form.Control 
              type="number" 
              disabled={!editingFees}
              value={fees.madrassa}
              onChange={(e) => setFees({...fees, madrassa: e.target.value})}
              className="border-0 bg-light rounded-3 py-2 fw-bold"
            />
          </Col>
        </Row>
      </Card>

      {/* SEARCH AND FILTERS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="payment-icon-wrapper bg-success text-white p-2 rounded-3">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 text-dark">Live Transactions</h4>
            <small className="text-muted">Verification required for <strong>{payments.filter(p => p.status === 'PENDING').length}</strong> items</small>
          </div>
        </div>
      </div>

      <Row className="mb-4 g-3">
        <Col lg={6}>
          <InputGroup className="shadow-sm rounded-pill overflow-hidden border-0">
            <InputGroup.Text className="bg-white border-0 ps-3">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search by username..." 
              className="border-0 shadow-none py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={6} lg={3}>
          <Form.Select className="rounded-pill border-0 shadow-sm py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Rejected</option>
          </Form.Select>
        </Col>
        <Col xs={6} lg={3}>
          <Form.Select className="rounded-pill border-0 shadow-sm py-2" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option>All Types</option>
            <option>MONTHLY</option>
            <option>MADRASSA</option>
            <option>ZAKAT</option>
          </Form.Select>
        </Col>
      </Row>

      {/* TRANSACTION TABLE */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="ps-4 py-3">User</th>
                <th className="py-3">Amount</th>
                <th className="py-3">Proof</th>
                <th className="py-3">Status</th>
                <th className="py-3 pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4 py-4 fw-bold text-dark">{item.username}</td>
                  <td className="text-success fw-bold">₹{item.amount}</td>
                  <td>
                    {item.screenshot ? (
                        <Button variant="light" size="sm" className="rounded-pill" onClick={() => window.open(`${BASE_URL}${item.screenshot}`)}>
                            <Eye size={14} className="me-1" /> View
                        </Button>
                    ) : <span className="text-muted small">N/A (Cash)</span>}
                  </td>
                  <td>
                    <Badge pill bg={item.status === 'VERIFIED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'warning'} className="px-3">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="pe-4 text-end">
                    {item.status === 'PENDING' && (
                        <div className="d-flex gap-2 justify-content-end">
                            <Button variant="success" size="sm" className="rounded-pill px-3" onClick={() => handleVerifyStatus(item.id, 'VERIFIED')}>Approve</Button>
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleVerifyStatus(item.id, 'REJECTED')}>Reject</Button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPaymentPage;