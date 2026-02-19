import React from "react";
import "./EducationalSupport.css";
import {
  CalendarDays,
  GraduationCap,
  User,
  Clock,
} from "lucide-react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Floatingnav from "../../Common/User/FloatingNav";

const UserEducationPage = () => {
  const navigate = useNavigate();

  const programs = [
    {
      id: 1,
      title: "Qur'an Tajweed Class",
      teacher: "Usthad Ahmed",
      date: "2026-02-15",
      time: "6:00 PM",
      description: "Special tajweed rules for intermediate students",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Islamic History Workshop",
      teacher: "Dr. Ibrahim",
      date: "2026-02-20",
      time: "4:30 PM",
      description: "Exploring Islamic contributions to science & arts",
      status: "active",
    },
    {
      id: 3,
      title: "Youth Career Guidance",
      teacher: "Career Committee",
      date: "2026-01-10",
      time: "5:00 PM",
      description: "Completed mentorship session",
      status: "completed",
    },
  ];

  return (
    <div className="user-edu-page">

      {/* Header */}
      <div className="user-edu-header-row">
        <IconButton
          onClick={() => navigate("/")}
          className="edu-back-btn"
        >
          <ArrowLeftIcon fontSize="small" />
        </IconButton>

        <div className="edu-header">
          <h2 className="curly-txt">
            <GraduationCap size={22} /> Educational Programs
          </h2>
          <p>Explore scheduled learning sessions & workshops</p>
        </div>
      </div>

      {/* Program List */}
      <div className="edu-list">
        <h4>
          <CalendarDays size={18} /> Available Programs
        </h4>

        {programs.map((p) => (
          <div
            key={p.id}
            className={`edu-card ${p.status}`}
          >
            <div className="edu-card-header">
              <div>
                <h5>{p.title}</h5>
                <small>
                  <User size={14} /> {p.teacher}
                </small>
              </div>

              <span className={`status ${p.status}`}>
                {p.status}
              </span>
            </div>

            <div className="edu-meta">
              <span>
                <CalendarDays size={14} /> {p.date}
              </span>
              <span>
                <Clock size={14} /> {p.time}
              </span>
            </div>

            <p className="desc">{p.description}</p>

            {/* Optional Action */}
            {p.status !== "completed" && (
              <button className="register-btn">
                Register
              </button>
            )}
          </div>
        ))}
      </div>

      <Floatingnav />
    </div>
  );
};

export default UserEducationPage;
