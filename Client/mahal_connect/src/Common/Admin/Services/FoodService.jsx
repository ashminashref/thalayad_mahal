import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Spinner } from "react-bootstrap";
import { Plus, Users, Trash2, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./FoodService.css";

const FoodServicePage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live data from Django
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/food-services/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Optional: Handle 401 by redirecting to login
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Handle Delete logic
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the event: ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://127.0.0.1:8000/api/food-services/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'The event has been removed.', 'success');
        fetchServices(); // Refresh list
      } catch  {
        Swal.fire('Error', 'Failed to delete the event.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="dark" />
        <p className="mt-2 text-muted">Loading services...</p>
      </div>
    );
  }

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

        <Button
          variant="dark"
          className="rounded-pill px-4"
          onClick={() => navigate("/admin/services/foodservices/add")}
        >
          <Plus size={18} className="me-1" /> Add Food Service
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
                <th>Provider</th>
                <th>Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {services.length > 0 ? (
                services.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{item.event_name}</div>
                    </td>
                    <td>{item.food_name}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border font-weight-normal">
                        {item.provider_name}
                      </Badge>
                    </td>
                    <td className="text-muted small">
                      {new Date(item.date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>

                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          size="sm"
                          variant="outline-dark"
                          className="rounded-pill"
                          onClick={() => navigate(`/admin/services/foodservices/members/${item.id}`)}
                        >
                          <Users size={14} className="me-1" /> Members
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="rounded-pill"
                          onClick={() => handleDelete(item.id, item.event_name)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <Utensils size={40} className="mb-2 opacity-25" />
                    <p>No food services recorded yet.</p>
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

export default FoodServicePage;