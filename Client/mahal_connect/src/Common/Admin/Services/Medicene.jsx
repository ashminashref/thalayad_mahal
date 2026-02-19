import React, { useState, useMemo } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import { Users, Eye, Check, X, Link as LinkIcon, Landmark } from 'lucide-react';
import './Medicine.css';

const initialRequests = [
  { id: "COM-002", requester: "Fatima Ali", requesterId: "567-GX", title: "Medical Aid for Surgery", type: "Medicine", amount: 75000, status: "pending" },
  { id: "COM-001", requester: "Zaid Ahmed", requesterId: "234-HY", title: "Monthly Prescription Support", type: "Medicine", amount: 5000, status: "approved" },
];

const Medicine = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [filterType, setFilterType] = useState("Medicine");

  // Filtering Logic
  const filteredData = useMemo(() => {
    return requests.filter(req => filterType === "All" || req.type === filterType);
  }, [requests, filterType]);

  const handleStatusChange = (id, newStatus) => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const totalPendingAmount = requests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="animate-fade-in">
      {/* Header & Stats Card */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="community-icon-wrapper">
            <Users size={24} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 page-title">Community Requests</h4>
            <small className="text-muted">{requests.filter(r => r.status === 'pending').length} pending requests</small>
          </div>
        </div>

        {/* Extra: Financial Overview Card */}
        <div className="stats-mini-card d-flex align-items-center gap-3 px-4 py-2 bg-white shadow-sm rounded-pill border">
           <div className="text-success bg-success bg-opacity-10 p-2 rounded-circle">
              <Landmark size={20} />
           </div>
           <div>
              <p className="smallest text-muted mb-0">Pending Funds Needed</p>
              <h6 className="fw-bold mb-0">₹{totalPendingAmount.toLocaleString()}</h6>
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="d-flex justify-content-end mb-3 gap-2 align-items-center">
        <div className="filter-select-wrapper">
          <LinkIcon size={14} className="filter-icon" />
          <Form.Select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="Medicine">Medicine</option>
            <option value="Education">Education</option>
            <option value="General">General</option>
            <option value="All">All Types</option>
          </Form.Select>
        </div>
        <Badge bg="light" className="text-dark border px-3 py-2 rounded-pill fw-normal">
          {filteredData.length} total
        </Badge>
      </div>

      {/* Main Table Card */}
      <Card className="community-card border-0 shadow-sm overflow-hidden rounded-4">
        <div className="table-responsive no-scrollbar">
          <Table hover className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4">Request ID</th>
                <th>Requester</th>
                <th>Title</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((req) => (
                <tr key={req.id}>
                  <td className="ps-4 py-4 fw-medium text-secondary smallest">{req.id}</td>
                  <td>
                    <div className="fw-bold title-text">{req.requester}</div>
                    <div className="subtitle-text smallest text-muted">{req.requesterId}</div>
                  </td>
                  <td className="fw-medium text-dark" style={{fontSize: '0.9rem'}}>{req.title}</td>
                  <td>
                    <Badge className="type-pill-medical d-inline-flex align-items-center gap-1">
                      <LinkIcon size={12} /> {req.type}
                    </Badge>
                  </td>
                  <td className="fw-bold text-dark">₹{req.amount.toLocaleString()}</td>
                  <td>
                    <Badge className={`status-pill ${req.status}`}>
                      {req.status}
                    </Badge>
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-3 align-items-center">
                      <Button variant="link" className="p-0 action-icon text-muted">
                        <Eye size={18} />
                      </Button>
                      {req.status === 'pending' && (
                        <>
                          <Button 
                            variant="link" 
                            className="p-0 text-success action-icon" 
                            onClick={() => handleStatusChange(req.id, 'approved')}
                          >
                            <Check size={18} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-0 text-danger action-icon" 
                            onClick={() => handleStatusChange(req.id, 'rejected')}
                          >
                            <X size={18} />
                          </Button>
                        </>
                      )}
                    </div>
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

export default Medicine;