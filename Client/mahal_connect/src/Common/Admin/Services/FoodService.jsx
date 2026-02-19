import React from "react";
import { Card, Table, Button, Badge } from "react-bootstrap";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FoodService.css";

const foodServicesData = [
  {
    id: 1,
    eventName: "Ramadan Iftar",
    foodName: "Chicken Biriyani & Dates",
    providerName: "Ahmed & Family",
    date: "2024-04-10",
    members: 25,
    status: "active",
  },
  {
    id: 2,
    eventName: "Milad Un Nabi",
    foodName: "Veg Rice & Sweet",
    providerName: "Mahal Food Committee",
    date: "2024-09-16",
    members: 40,
    status: "active",
  },
];

const FoodServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0 page-title">Food Services</h4>
          <small className="text-muted">
            Manage food items, providers, and members
          </small>
        </div>

        {/* ✅ FIX: USE ABSOLUTE PATH */}
        <Button
          variant="dark"
          className="rounded-pill"
          onClick={() =>
            navigate("/admin/services/foodservices/add")
          }
        >
          <Plus size={16} /> Add Food Service
        </Button>
      </div>

      {/* Table */}
      <Card className="service-card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th className="ps-4">Event</th>
                <th>Food Name</th>
                <th>Food Provider</th>
                <th>Date</th>
                <th>Members</th>
                <th>Status</th>
                <th className="pe-4 text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              {foodServicesData.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4 fw-semibold">{item.eventName}</td>
                  <td>{item.foodName}</td>
                  <td>{item.providerName}</td>
                  <td className="text-muted small">{item.date}</td>
                  <td>{item.members}</td>

                  <td>
                    <Badge className="status-pill approved">
                      {item.status}
                    </Badge>
                  </td>

                  <td className="pe-4 text-end">
                    {/* ✅ Relative path is OK here */}
                    <Button
                      size="sm"
                      variant="outline-dark"
                      className="rounded-pill"
                      onClick={() =>
                        navigate(
                          `/admin/services/foodservices/members/${item.id}`
                        )
                      }
                    >
                      <Users size={14} /> Add Members
                    </Button>
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

export default FoodServicePage;
