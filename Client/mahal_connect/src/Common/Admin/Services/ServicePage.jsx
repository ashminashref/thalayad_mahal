import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  Utensils,
  HeartPulse,
  GraduationCap,
  HandCoins,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../Admin/Services/Service.css";

const ServicesPage = () => {
  const navigate = useNavigate();

 const services = [
  {
    name: "Food Service",
    desc: "Create food programs and sponsor details",
    icon: <Utensils size={28} />,
    route: "/admin/services/food-manage", // Points to FoodManagement
    color: "#f59e0b"
  },
  {
    name: "Medical Support",
    desc: "Review and approve medical assistance",
    icon: <HeartPulse size={28} />,
    route: "/admin/services/medical-manage", // Points to MedicineManagement
    color: "#ef4444"
  },
  {
    name: "Educational Programs",
    desc: "Create classes and schedule teachers",
    icon: <GraduationCap size={28} />,
    route: "/admin/services/education-manage", // Points to ClassManagement
    color: "#3b82f6"
  },
  {
    name: "Personal Loans",
    desc: "Interest-free financial assistance review",
    icon: <HandCoins size={28} />,
    route: "/admin/services/loan-manage", // Points to AdminLoanManagement
    color: "#10b981"
  },
];

  return (
    <div className="animate-fade-in px-3 px-md-0">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h4 className="fw-bold mb-1 page-title">Service Administration</h4>
          <p className="text-muted small mb-0">Monitor and manage all community welfare services</p>
        </div>
      </div>

      <div className="service-grid">
        {services.map((service, index) => (
          <Card
            key={index}
            className="service-box border-0 shadow-sm"
            role="button"
            tabIndex={0}
            onClick={() => navigate(service.route)}
          >
            <div className="service-icon-wrapper " style={{  color: service.color }}>
              {service.icon}
            </div>

            <div className="mt-3">
              <h6 className="fw-bold mb-1">{service.name}</h6>
              <p className="subtitle-text small text-muted mb-3">{service.desc}</p>
            </div>

            <div className="mt-auto d-flex justify-content-between align-items-center">
              <Button
                size="sm"
                variant="dark"
                className="rounded-pill px-3 manage-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(service.route);
                }}
              >
                Manage
              </Button>
              <ArrowRight size={16} className="text-muted arrow-icon" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;