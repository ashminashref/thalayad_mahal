import React from "react";
import { Card, Button } from "react-bootstrap";
import {
  Utensils,
  HeartPulse,
  GraduationCap,
  HandCoins,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../Admin/Services/Service.css";

const ServicesPage = () => {
  const navigate = useNavigate();

  // ✅ Routes now match: /admin/services/*
  const services = [
    {
      name: "Food Service",
      desc: "Food support on special days & events",
      icon: <Utensils size={28} />,
      route: "/admin/services/foodservices",
    },
    {
      name: "Medical Support",
      desc: "Medical help for needy members",
      icon: <HeartPulse size={28} />,
      route: "/admin/services/medical",
    },
    {
      name: "Educational Classes",
      desc: "Special educational programs & classes",
      icon: <GraduationCap size={28} />,
      route: "/admin/services/education",
    },
    {
      name: "Personal Loan",
      desc: "Interest-free financial assistance",
      icon: <HandCoins size={28} />,
      route: "/admin/services/loan", // ✅ CORRECT
    },
  ];

  return (
    <div className="animate-fade-in px-3 px-md-0">
      <h4 className="fw-bold mb-4 page-title">Services</h4>

      <div className="service-grid">
        {services.map((service, index) => (
          <Card
            key={index}
            className="service-box shadow-sm"
            role="button"
            tabIndex={0}
            onClick={() => navigate(service.route)}
            onKeyDown={(e) =>
              e.key === "Enter" && navigate(service.route)
            }
          >
            {/* ICON */}
            <div className="service-icon">
              {service.icon}
            </div>

            <h6 className="fw-semibold mt-2">
              {service.name}
            </h6>

            <p className="subtitle-text small text-muted">
              {service.desc}
            </p>

            <Button
              size="sm"
              variant="dark"
              className="rounded-pill mt-auto manage-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                navigate(service.route);
              }}
            >
              Manage
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
