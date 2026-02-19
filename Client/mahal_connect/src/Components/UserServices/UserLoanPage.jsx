import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Landmark, Clock, CheckCircle, Eye } from "lucide-react";
import "./UserLoanPage.css";
import Floatingnav from "../../Common/User/FloatingNav";

const UserLoanPage = () => {
  const navigate = useNavigate();

  const myLoans = [
    {
      id: "LN-001",
      purpose: "House Repair Loan",
      amount: "50,000",
      status: "Pending",
      date: "14 Feb 2026",
    },
    {
      id: "LN-002",
      purpose: "Education Fees",
      amount: "25,000",
      status: "Completed",
      date: "10 Jan 2026",
    },
  ];

  const pendingCount = myLoans.filter(l => l.status === "Pending").length;
  const completedCount = myLoans.filter(l => l.status === "Completed").length;

  return (
    <div className="user-loan-page">

      {/* Header */}
      <div className="loan-header">
        <div className="loan-title-row">

          <button
            onClick={() => navigate("/")}
            className="back-btn icon-only"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">My Loans</h1>
            <p>Track your personal loan requests</p>
          </div>

        </div>
      </div>

      {/* Summary */}
      <div className="loan-summary-grid">

        <div className="loan-card">
          <Clock size={18} />
          <span>Pending</span>
          <h2>{pendingCount}</h2>
        </div>

        <div className="loan-card">
          <CheckCircle size={18} />
          <span>Completed</span>
          <h2>{completedCount}</h2>
        </div>

      </div>

      {/* ✅ Apply Loan Button */}
      <button
        className="apply-loan-btn"
        onClick={() => navigate("/services/loan/apply")}
      >
        <Landmark size={18} />
        Apply for Loan
      </button>

      {/* Loan List */}
      <div className="loan-table-card">

        <h3>Loan History</h3>

        <table className="loan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Purpose</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {myLoans.map((loan) => (
              <tr key={loan.id}>
                <td className="mono">{loan.id}</td>

                <td>
                  <div className="purpose">
                    <Landmark size={14} />
                    {loan.purpose}
                  </div>
                  <small>{loan.date}</small>
                </td>

                <td className="amount">₹{loan.amount}</td>

                <td>
                  <span className={`status ${loan.status.toLowerCase()}`}>
                    {loan.status}
                  </span>
                </td>

                <td>
                  <button className="icon-btn">
                    <Eye size={18} />
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

export default UserLoanPage;
