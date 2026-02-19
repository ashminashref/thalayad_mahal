import React from "react";
import { Card, Table, Button, Form } from "react-bootstrap";
import { Plus, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import '../Services/FoodMember.css';

const membersData = [
  { id: 1, name: "Ahmed Ali", phone: "9876543210" },
  { id: 2, name: "Fatima Khan", phone: "9876543211" },
  { id: 3, name: "Salman Rahman", phone: "9876543212" },
];

const FoodMembersPage = () => {
  const { id } = useParams();       // Food service ID
  const navigate = useNavigate();   // For back navigation

  return (
    <div className="animate-fade-in">

      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          {/* 🔙 BACK BUTTON */}
          <Button
            variant="outline-dark"
            className="rounded-pill"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </Button>

          <div>
            <h4 className="fw-bold mb-0">Food Service Members</h4>
            <small className="text-muted">
              Food Service ID: {id}
            </small>
          </div>
        </div>

        <Button variant="dark" className="rounded-pill">
          <Plus size={16} /> Add Member
        </Button>
      </div>

      {/* Members Table */}
      <Card className="service-card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4">Member Name</th>
                <th>Phone</th>
                <th>Attendance</th>
              </tr>
            </thead>

            <tbody>
              {membersData.map((member) => (
                <tr key={member.id}>
                  <td className="ps-4 fw-medium">{member.name}</td>
                  <td className="text-muted">{member.phone}</td>
                  <td>
                    <Form.Check
                      type="checkbox"
                      label="Confirmed"
                    />
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

export default FoodMembersPage;
