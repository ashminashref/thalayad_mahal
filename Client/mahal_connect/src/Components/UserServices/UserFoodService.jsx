import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Utensils, CalendarDays } from "lucide-react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import "./UserFoodService.css";
import Floatingnav from "../../Common/User/FloatingNav";

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

const UserFoodServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="user-food-page">

      {/* Header */}
      <div className="food-header">
        <div className="food-title-row">

          <button
            onClick={() => navigate("/")}
            className="back-btn icon-only"
          >
            <ArrowLeftIcon fontSize="small" />
          </button>

          <div>
            <h1 className="curly-txt">Food Services</h1>
            <p>Community food distributions & events</p>
          </div>

        </div>
      </div>

      {/* Food Cards */}
      <div className="food-services-grid">
        {foodServicesData.map((item) => (
          <div key={item.id} className="food-card">

            <div className="food-card-header">
              <span className={`status ${item.status}`}>
                {item.status}
              </span>
            </div>

            <h2>{item.eventName}</h2>

            <div className="food-info">
              <div>
                <Utensils size={16} />
                <span>{item.foodName}</span>
              </div>

              <div>
                <Users size={16} />
                <span>{item.members} Members</span>
              </div>

              <div>
                <CalendarDays size={16} />
                <span>{item.date}</span>
              </div>
            </div>

            <div className="provider">
              Provider: <strong>{item.providerName}</strong>
            </div>

            <button
              className="view-btn"
              onClick={() =>
                navigate(`/services/foodservice/${item.id}`)
              }
            >
              View Details
            </button>

          </div>
        ))}
      </div>

      <Floatingnav />
    </div>
  );
};

export default UserFoodServicePage;
