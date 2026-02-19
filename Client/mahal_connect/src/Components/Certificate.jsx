import React, { useState, useRef } from 'react';
import { ArrowLeft, Baby, Heart, GraduationCap, User, Calendar, Upload, Hash, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../src/Components/Certificate.css';
import Topbar from '../Common/User/Topbar';
import Floatingnav from '../Common/User/FloatingNav';

const CertificateRequest = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    certificate_type: 'Birth',
    full_name: '',
    event_date: '',
    bride_name: '',
    groom_name: '',
    bride_guardian: '',
    groom_guardian: '',
    father_name: '',
    mother_name: '',
    address: '',
    institution_name: '',
    reg_no: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const certificateTypes = [
    { id: 'Birth', title: 'Birth Certificate', sub: 'For newborn registration', icon: <Baby size={20} /> },
    { id: 'Marriage', title: 'Marriage Certificate', sub: 'For nikah registration', icon: <Heart size={20} /> },
    { id: 'Education', title: 'Educational Certificate', sub: 'For school records', icon: <GraduationCap size={20} /> },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.certificate_type === 'Birth' && formData.event_date >= today) {
      return Swal.fire("Invalid Date", "Date of Birth must be in the past.", "error");
    }

    if (!selectedFile) return Swal.fire("Required", "Please upload supporting documents", "warning");

    setLoading(true);
    const data = new FormData();
    
    // Append all data, filtering education/marriage fields based on type
    Object.keys(formData).forEach(key => {
        if (['institution_name', 'reg_no'].includes(key) && formData.certificate_type !== 'Education') return;
        if (['bride_name', 'groom_name', 'bride_guardian', 'groom_guardian'].includes(key) && formData.certificate_type !== 'Marriage') return;
        data.append(key, formData[key]);
    });
    data.append('document', selectedFile);

    try {
      const token = localStorage.getItem('access_token');
      await axios.post("http://127.0.0.1:8000/api/certificate-requests/", data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
        }
      });

      await Swal.fire("Success", "Application submitted! You will receive an email update.", "success");
      navigate('/certificates'); 
      
    } catch (err) {
      const errorData = err.response?.data;
      const errorMessage = errorData ? Object.values(errorData).flat().join("\n") : "Submission failed.";
      Swal.fire("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificate-page-wrapper">
      <Topbar />
      <form onSubmit={handleSubmit} className="certificate-content-container mt-5 py-5 pt-5">
        
        <header className="certificate-header">
          <button type="button" className="certificate-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
          </button>
          <div className="certificate-header-text">
            <h1>Request Certificate</h1>
            <p>Submit your application</p>
          </div>
        </header>

        <section className="certificate-section">
          <h2 className="certificate-section-label">Certificate Type</h2>
          <div className="certificate-type-list">
            {certificateTypes.map((type) => (
              <div
                key={type.id}
                className={`certificate-type-item ${formData.certificate_type === type.id ? 'active' : ''}`}
                onClick={() => setFormData({...formData, certificate_type: type.id})}
              >
                <div className="certificate-icon-box">
                  <div className="certificate-icon-inner">{type.icon}</div>
                </div>
                <div className="certificate-type-info">
                  <h3>{type.title}</h3>
                  <p>{type.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="certificate-form-card">
          <div className="certificate-input-field">
            <label>Applicant Full Name</label>
            <div className="certificate-input-wrapper">
              <User size={18} className="certificate-field-icon" />
              <input name="full_name" required type="text" placeholder="Enter full name" onChange={handleInputChange} />
            </div>
          </div>

          <div className="certificate-row">
            <div className="certificate-input-field">
              <label>
                {formData.certificate_type === 'Marriage' ? 'Date of Marriage' : 
                 formData.certificate_type === 'Education' ? 'Date of Admission' : 'Date of Birth'}
              </label>
              <div className="certificate-input-wrapper">
                <Calendar size={18} className="certificate-field-icon" />
                <input name="event_date" required type="date" onChange={handleInputChange} />
              </div>
            </div>

            {formData.certificate_type === 'Education' && (
              <div className="certificate-input-field">
                <label>Admission / Reg No.</label>
                <div className="certificate-input-wrapper">
                  <Hash size={18} className="certificate-field-icon" />
                  <input name="reg_no" type="text" placeholder="Reg number" onChange={handleInputChange} />
                </div>
              </div>
            )}
          </div>

          {/* Conditional Marriage Fields */}
          {formData.certificate_type === 'Marriage' && (
            <div className="animate-fade-in">
              <div className="certificate-row">
                <div className="certificate-input-field">
                  <label>Bride's Name</label>
                  <div className="certificate-input-wrapper no-icon">
                    <input name="bride_name" required type="text" placeholder="Bride's name" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="certificate-input-field">
                  <label>Groom's Name</label>
                  <div className="certificate-input-wrapper no-icon">
                    <input name="groom_name" required type="text" placeholder="Groom's name" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="certificate-row">
                <div className="certificate-input-field">
                  <label>Bride's Guardian</label>
                  <div className="certificate-input-wrapper no-icon">
                    <input name="bride_guardian" required type="text" placeholder="Guardian name" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="certificate-input-field">
                  <label>Groom's Guardian</label>
                  <div className="certificate-input-wrapper no-icon">
                    <input name="groom_guardian" required type="text" placeholder="Guardian name" onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.certificate_type === 'Education' && (
            <div className="certificate-input-field">
              <label>Institution Name</label>
              <div className="certificate-input-wrapper">
                <School size={18} className="certificate-field-icon" />
                <input name="institution_name" type="text" placeholder="Institution name" onChange={handleInputChange} />
              </div>
            </div>
          )}

          <div className="certificate-row">
            <div className="certificate-input-field">
              <label>Father's Name</label>
              <div className="certificate-input-wrapper no-icon">
                <input name="father_name" required type="text" placeholder="Father's name" onChange={handleInputChange} />
              </div>
            </div>
            <div className="certificate-input-field">
              <label>Mother's Name</label>
              <div className="certificate-input-wrapper no-icon">
                <input name="mother_name" required type="text" placeholder="Mother's name" onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="certificate-input-field">
            <label>Address</label>
            <div className="certificate-input-wrapper no-icon">
              <input name="address" required type="text" placeholder="Permanent address" onChange={handleInputChange} />
            </div>
          </div>
        </section>

        <section className="certificate-form-card">
          <h2 className="certificate-section-label">Supporting Documents</h2>
          <div className="certificate-upload-zone" onClick={() => fileInputRef.current.click()}>
            <Upload size={24} color="#6b7280" />
            <p>{selectedFile ? `File: ${selectedFile.name}` : "Click to upload Proof (ID/Nikah/Birth record)"}</p>
          </div>
          <input type="file" ref={fileInputRef} hidden accept=".pdf,image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
        </section>

        <button type="submit" className="certificate-submit-btn w-100" disabled={loading}>
          {loading ? "Uploading..." : "Submit Request"}
        </button>

      </form>
      <Floatingnav />
    </div>
  );
};

export default CertificateRequest;