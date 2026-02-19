import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ArrowLeft, RotateCcw } from 'lucide-react';
import { duas } from '../../Data/Duas';
import Topbar from '../../Common/User/Topbar';
import Floatingnav from '../../Common/User/FloatingNav';
import { useNavigate, useParams } from 'react-router-dom';
import './UserDua.css';

const UserDua = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track counts for each Dua locally
  const [userCounts, setUserCounts] = useState({});

  const activeCategory = useMemo(() => {
    if (!categoryName) return "All Duas";
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
  }, [categoryName]);

  const filteredDuas = useMemo(() => {
    return duas.filter(dua => {
      const matchesCategory = activeCategory === "All Duas" || 
        (dua.type && dua.type.toLowerCase() === activeCategory.toLowerCase());
      const search = searchTerm.toLowerCase();
      const matchesSearch = dua.title.toLowerCase().includes(search) || 
                            (dua.translation_ml && dua.translation_ml.includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const handleIncrement = (id) => {
    setUserCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const resetCount = (e, id) => {
    e.stopPropagation(); // Prevent triggering the increment
    setUserCounts(prev => ({ ...prev, [id]: 0 }));
  };

  return (
    <div className="mb-5 pb-5">
      <Topbar />
      <div className="container mt-5 pt-5">
        <header className="certificate-header">
          <button className="certificate-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="certificate-header-text">
            <h1>{activeCategory === "All Duas" ? "Daily Duas" : `${activeCategory} Duas`}</h1>
            <p>Tap card to count</p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="position-relative mb-4">
          <Search className="position-absolute top-50 translate-middle-y ms-3 search-icon" size={18} />
          <input
            type="text"
            className="w-100 search-bar border-0 rounded-pill py-2 ps-5"
            placeholder="Search duas...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="d-flex flex-column gap-4">
          {filteredDuas.map((dua) => {
            const currentProgress = userCounts[dua.id] || 0;
            const targetCount = dua.count || 1;
            const progressPercent = Math.min((currentProgress / targetCount) * 100, 100);
            const isCompleted = currentProgress >= targetCount;

            return (
              <div 
                key={dua.id} 
                className={`dua-card rounded-4 p-4 position-relative overflow-hidden ${isCompleted ? 'completed-border' : ''}`}
                onClick={() => handleIncrement(dua.id)}
                style={{ cursor: 'pointer', transition: '0.3s' }}
              >
                {/* Progress Bar background */}
                <div 
                  className="progress-overlay" 
                  style={{ width: `${progressPercent}%` }}
                ></div>

                <div className="position-relative z-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 rounded dua-icon-box">
                        <BookOpen size={18} />
                      </div>
                      <div>
                        <h5 className="m-0 dua-h5">{dua.title}</h5>
                        <small className="dua-small text-success">{dua.title_ml}</small>
                      </div>
                    </div>
                    
                    {/* Counter UI */}
                    <div className="d-flex flex-column align-items-end">
                      <div className={`counter-badge ${isCompleted ? 'bg-success text-white' : 'bg-light text-dark'}`}>
                        {currentProgress} / {targetCount}
                      </div>
                      <button 
                        className="btn btn-sm text-muted mt-1 p-0" 
                        onClick={(e) => resetCount(e, dua.id)}
                      >
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-end mb-3">
                    <h3 className="arabic-text">{dua.arabic}</h3>
                  </div>

                  <div className="mt-2">
                    <p className="fst-italic mb-1 dua-trans text-muted small">{dua.transliteration}</p>
                    <p className="mb-2 trans-p">{dua.translation_en}</p>
                    <hr className="opacity-10" />
                    <p className="mb-0 trans-p-ml" style={{ fontFamily: 'Manjari, sans-serif' }}>
                      {dua.translation_ml}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
   
    </div>
  );
};

export default UserDua;