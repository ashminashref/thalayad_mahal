import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { Plus, Clock, CheckCircle, FileText } from 'lucide-react';
import './UserMedicinePage.css';
import Floatingnav from '../../Common/User/FloatingNav';

const UserMedicinePage = () => {
  const navigate = useNavigate();

  const myRequests = [
    {
      id: 'MED-001',
      title: 'Monthly Prescription Support',
      amount: '₹5,000',
      status: 'Approved',
      date: '10 Jan 2026',
    },
    {
      id: 'MED-002',
      title: 'Surgery Assistance',
      amount: '₹75,000',
      status: 'Pending',
      date: '14 Feb 2026',
    },
  ];

  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;
  const approvedTotal = myRequests
    .filter(r => r.status === 'Approved')
    .reduce((sum, r) => sum + parseInt(r.amount.replace(/[₹,]/g, '')), 0);

  return (
    <div className="user-medicine-page">

      {/* Header */}
      <div className="medicine-header">
        <div className="medicine-title-row">

          <button
            onClick={() => navigate('/')}
            className="back-btn icon-only"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">Medical Assistance</h1>
            <p>Track and request medicine support</p>
          </div>

        </div>
      </div>

      {/* Summary Cards */}
      <div className="medicine-summary-grid">

        <div className="medicine-card new-request">
          <div className="icon-circle">
            <Plus size={22} />
          </div>
          <span>New Request</span>
        </div>

        <div className="medicine-card">
          <div className="card-row">
            <Clock size={18} />
            <span>Pending Requests</span>
          </div>
          <h2>{pendingCount}</h2>
        </div>

        <div className="medicine-card">
          <div className="card-row">
            <CheckCircle size={18} />
            <span>Total Approved</span>
          </div>
          <h2>₹{approvedTotal.toLocaleString()}</h2>
        </div>

      </div>

      {/* Requests Table */}
      <div className="medicine-table-card">

        <div className="table-header">
          <h3>My Requests</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {myRequests.map(req => (
              <tr key={req.id}>
                <td className="mono">{req.id}</td>

                <td>
                  <div className="title">{req.title}</div>
                  <div className="date">{req.date}</div>
                </td>

                <td className="amount">{req.amount}</td>

                <td>
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </td>

                <td>
                  <button className="icon-btn">
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <Floatingnav />
    </div>
  );
};

export default UserMedicinePage;
