import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, GraduationCap, User as UserIcon, Clock, Loader2, Check } from "lucide-react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { IconButton } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import Floatingnav from "../../Common/User/FloatingNav";
import "./EducationalSupport.css";

const UserEducationPage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/programs/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(res.data);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleRegister = async (programId, title) => {
    const result = await Swal.fire({
      title: 'Join Class?',
      text: `Do you want to register for ${title}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1c3124',
    });

    if (result.isConfirmed) {
      setRegisteringId(programId);
      try {
        const token = localStorage.getItem('access_token');
        await axios.post(`http://127.0.0.1:8000/api/programs/${programId}/register/`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire("Registered!", "Check your email for details.", "success");
        fetchPrograms(); // Refresh to update UI
      } catch  {
        Swal.fire("Note", "You are already registered for this program.", "info");
      } finally {
        setRegisteringId(null);
      }
    }
  };

  return (
    <div className="user-edu-page animate-fade-in">
      <div className="user-edu-header-row">
        <IconButton onClick={() => navigate("/")} className="edu-back-btn"><ArrowLeftIcon fontSize="small" /></IconButton>
        <div className="edu-header">
          <h2 className="curly-txt"><GraduationCap size={22} /> Educational Programs</h2>
          <p>Explore scheduled learning sessions & workshops</p>
        </div>
      </div>

      <div className="edu-list">
        {loading ? (
          <div className="text-center py-5"><Loader2 className="animate-spin" /></div>
        ) : (
          <>
            <h4><CalendarDays size={18} /> Available Programs</h4>
            {programs.map((p) => (
              <div key={p.id} className={`edu-card ${p.status}`}>
                <div className="edu-card-header">
                  <div>
                    <h5>{p.title}</h5>
                    <small><UserIcon size={14} /> {p.teacher}</small>
                  </div>
                  <span className={`status-tag ${p.status}`}>{p.status}</span>
                </div>
                <div className="edu-meta">
                  <span><CalendarDays size={14} /> {p.date}</span>
                  <span><Clock size={14} /> {p.time}</span>
                </div>
                <p className="desc">{p.description}</p>
                
                {p.status !== "completed" && (
                  <button 
                    className="register-btn" 
                    disabled={registeringId === p.id}
                    onClick={() => handleRegister(p.id, p.title)}
                  >
                    {registeringId === p.id ? <Loader2 size={16} className="animate-spin" /> : "Register Now"}
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      <Floatingnav />
    </div>
  );
};

export default UserEducationPage;