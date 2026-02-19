import React, { useState } from "react";
import "../Services/EducationalService.css";
import {
  Plus,
  CalendarDays,
  GraduationCap,
  Ban,
} from "lucide-react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminEducationPage = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([
    {
      id: 1,
      title: "Qur'an Tajweed Class",
      teacher: "Usthad Ahmed",
      date: "2026-02-15",
      time: "6:00 PM",
      description: "Special tajweed rules for intermediate students",
      status: "upcoming",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    teacher: "",
    date: "",
    time: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addProgram = () => {
    if (!formData.title || !formData.date || !formData.time) return;

    setPrograms([
      ...programs,
      {
        id: Date.now(),
        ...formData,
        status: "upcoming",
      },
    ]);

    setFormData({
      title: "",
      teacher: "",
      date: "",
      time: "",
      description: "",
    });
  };

  // ✅ Cancel program (status update only)
  const cancelProgram = (id) => {
    setPrograms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "cancelled" } : p
      )
    );
  };

  return (
    <div className="edu-page">
      {/* Header with Back Button */}
      <div className="edu-header-row">
        <IconButton
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="edu-back-btn"
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <div className="edu-header">
          <h2>
            <GraduationCap size={22} /> Educational Programs
          </h2>
          <p>Schedule special educational classes for mahal students</p>
        </div>
      </div>

      {/* Add Program */}
      <div className="edu-form">
        <h4>
          <Plus size={18} /> Add New Program
        </h4>

        <div className="formrow">
          <input
            name="title"
            placeholder="Program Title"
            value={formData.title}
            onChange={handleChange}
          />
          <input
            name="teacher"
            placeholder="Teacher Name"
            value={formData.teacher}
            onChange={handleChange}
          />
        </div>

        <div className="formrow">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Program Description"
          value={formData.description}
          onChange={handleChange}
        />

        <button onClick={addProgram}>Schedule Program</button>
      </div>

      {/* Program List */}
      <div className="edu-list">
        <h4>
          <CalendarDays size={18} /> Scheduled Programs
        </h4>

        {programs.length === 0 ? (
          <p className="empty">No programs scheduled</p>
        ) : (
          programs.map((p) => (
            <div
              key={p.id}
              className={`edu-card ${
                p.status === "cancelled" ? "cancelled" : ""
              }`}
            >
              <div className="edu-card-header">
                <div>
                  <h5>{p.title}</h5>
                  <small>Teacher: {p.teacher || "Not assigned"}</small>
                </div>

                {/* Cancel button */}
                {p.status === "upcoming" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelProgram(p.id)}
                    title="Cancel Program"
                  >
                    <Ban size={16} /> Cancel
                  </button>
                )}
              </div>

              <div className="edu-meta">
                <span>{p.date}</span>
                <span>{p.time}</span>
                <span className={`status ${p.status}`}>
                  {p.status}
                </span>
              </div>

              <p className="desc">{p.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminEducationPage;
