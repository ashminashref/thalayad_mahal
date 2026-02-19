import React, { useState, useMemo } from 'react'; // Added useState and useMemo
import { Button, Card, Table, Badge, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Download, Search, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import './Payments.css';

const paymentsData = [
  { id: 1, user: "Ahmed Hassan", amount: "₹5,000", type: "contribution", method: "Upi", status: "completed", reference: "TXN001234", date: "2024-01-15" },
  { id: 2, user: "Fatima Khan", amount: "₹2,500", type: "madrassa", method: "Bank Transfer", status: "completed", reference: "TXN001235", date: "2024-01-14" },
  { id: 3, user: "Mohammed Ali", amount: "₹10,000", type: "zakat", method: "Upi", status: "pending", reference: "TXN001236", date: "2024-01-13" },
  { id: 4, user: "Aisha Begum", amount: "₹1,500", type: "donation", method: "Cash", status: "completed", reference: "TXN001237", date: "2024-01-12" },
  { id: 5, user: "Yusuf Ibrahim", amount: "₹3,000", type: "contribution", method: "Upi", status: "failed", reference: "TXN001238", date: "2024-01-11" },
];

const AdminPaymentPage = () => {
  // 1. Setup State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");

  // 2. Logic to filter data based on user selection
  const filteredData = useMemo(() => {
    return paymentsData.filter((item) => {
      const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter.toLowerCase();
      
      const matchesType = typeFilter === "All Types" || item.type === typeFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={14} className="me-1" />;
      case 'pending': return <Clock size={14} className="me-1" />;
      case 'failed': return <XCircle size={14} className="me-1" />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="payment-icon-wrapper">
            <CreditCard size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 page-title">Payments</h4>
            {/* 3. Updated dynamic count */}
            <small className="subtitle-text">Showing: <strong>{filteredData.length}</strong> transactions</small>
          </div>
        </div>
        <Button variant="outline-dark" className="btn-custom py-2 px-4 d-flex align-items-center gap-2">
          <Download size={18} /> Export
        </Button>
      </div>

      <Row className="mb-4 g-3">
        <Col lg={6}>
          <InputGroup className="search-input-group">
            <InputGroup.Text className=" border-end-0 input border-0 rounded-start-pill">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search by name or reference..." 
              className="border-start-0 rounded-end-pill py-2 border-0 input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={6} lg={3}>
          <Form.Select 
            className="rounded-pill input border-0 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </Form.Select>
        </Col>
        <Col xs={6} lg={3}>
          <Form.Select 
            className="rounded-pill border-0 input py-2"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All Types</option>
            <option>Contribution</option>
            <option>Madrassa</option>
            <option>Zakat</option>
          </Form.Select>
        </Col>
      </Row>

      <Card className="payment-card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive no-scrollbar">
          <Table hover className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4">User</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Method</th>
                <th>Status</th>
                <th>Reference</th>
                <th className="pe-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {/* 4. Map through filteredData instead of paymentsData */}
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4 py-4 title-text">{item.user}</td>
                    <td className="fw-bold">{item.amount}</td>
                    <td>
                      <Badge className="type-badge">{item.type}</Badge>
                    </td>
                    <td className="subtitle-text small">{item.method}</td>
                    <td>
                      <Badge className={`status-pill ${item.status}`}>
                        <span className="d-flex align-items-center">
                          {getStatusIcon(item.status)} {item.status}
                        </span>
                      </Badge>
                    </td>
                    <td className=" small font-monospace">{item.reference}</td>
                    <td className=" small pe-4">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">No records found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPaymentPage;