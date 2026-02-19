import React, { useState } from "react";
import { Check, Eye, X, Landmark } from "lucide-react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./PersonalLoan.css";

const LoanAdminDashboard = () => {
  const navigate = useNavigate();

  const [loanRequests, setLoanRequests] = useState([
    {
      id: "LN-001",
      requesterName: "Aisha Rahman",
      memberId: "345-IX",
      purpose: "House Repair Loan",
      amount: "50,000",
      isCompleted: false,
    },
    {
      id: "LN-002",
      requesterName: "Fathima Sahla",
      memberId: "102-IV",
      purpose: "Education Fees",
      amount: "25,000",
      isCompleted: true,
    },
  ]);

  const toggleLoanCompletion = (id) => {
    setLoanRequests((prev) =>
      prev.map((loan) =>
        loan.id === id
          ? { ...loan, isCompleted: !loan.isCompleted }
          : loan
      )
    );
  };

  return (
    <div className="loan-page">
      {/* Header with Back Button */}
      <div className="loan-header-row">
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="back-btn"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <div className="loan-header">
          <h1>Personal Loan Requests</h1>
          <p>Manage and track loan completion status</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="loan-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requester</th>
              <th>Purpose</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loanRequests.map((loan) => (
              <tr
                key={loan.id}
                className={loan.isCompleted ? "row-completed" : ""}
              >
                <td data-label="Request ID">{loan.id}</td>

                <td data-label="Requester">
                  <div className="requester">
                    <span>{loan.requesterName}</span>
                    <small>{loan.memberId}</small>
                  </div>
                </td>

                <td data-label="Purpose">
                  <div className="purpose">
                    <Landmark size={14} />
                    {loan.purpose}
                  </div>
                </td>

                <td data-label="Amount">₹{loan.amount}</td>

                <td data-label="Status">
                  <span
                    className={`status-pill ${
                      loan.isCompleted ? "completed" : "pending"
                    }`}
                  >
                    ● {loan.isCompleted ? "Completed" : "Pending"}
                  </span>
                </td>

                <td data-label="Actions">
                  <div className="actions">
                    <Eye size={18} />
                    <button
                      className={`btn-complete ${
                        loan.isCompleted ? "done" : ""
                      }`}
                      onClick={() => toggleLoanCompletion(loan.id)}
                    >
                      <Check size={18} />
                    </button>
                    <X size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanAdminDashboard;
