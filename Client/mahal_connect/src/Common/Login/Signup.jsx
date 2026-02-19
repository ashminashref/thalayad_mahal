import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* --- Premium Custom Alert --- */
const PremiumAlert = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const isError = type === 'error';
    return (
        <div style={{
            position: 'fixed', top: '30px', right: '30px', zIndex: 2000, minWidth: '350px',
            padding: '24px', borderRadius: '16px', backdropFilter: 'blur(10px)',
            backgroundColor: isError ? 'rgba(255, 245, 245, 0.95)' : 'rgba(244, 249, 246, 0.95)',
            border: `1px solid ${isError ? '#feb2b2' : '#c6f6d5'}`,
            borderLeft: `8px solid ${isError ? '#e53e3e' : '#1a3024'}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)', animation: 'slideIn 0.4s ease-out'
        }}>
            <h6 style={{ margin: 0, fontWeight: '800', color: isError ? '#c53030' : '#1a3024', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                {isError ? 'Action Required' : 'Success'}
            </h6>
            <p style={{ margin: '8px 0 0', color: '#4a5568', fontSize: '0.95rem', fontWeight: '500' }}>{message}</p>
            <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>&times;</button>
        </div>
    );
};


const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', address: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const showAlert = (message, type = 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 6000);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            username: formData.email,
            email: formData.email,
            password: formData.password,
            house_name: formData.address,
            phone_number: formData.phone,
            first_name: formData.fullName
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/register/', payload);
            showAlert("Welcome aboard! Your Mahal ID is ready.", "success");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            if (!error.response) showAlert("Server Connection Failed.");
            else if (error.response.status === 400) {
                const data = error.response.data;
                if (data.username || data.email) showAlert("This email is already in our system. Try logging in.");
                else if (data.phone_number) showAlert("Phone number already exists.");
                else showAlert("Signup error. Please check your details.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc', fontSize: '1rem', transition: 'all 0.3s ease',
        boxShadow: 'none'
    };
useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
        // 1. Immediately kick them out if they are on this page
        navigate('/home', { replace: true });

        // 2. Lock the back button logic
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function () {
            navigate('/home', { replace: true });
        };
    }

    // Cleanup function to prevent memory leaks
    return () => {
        window.onpopstate = null;
    };
}, [navigate]);
    return (
        <Container fluid className="p-0" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <PremiumAlert {...alert} onClose={() => setAlert({ ...alert, show: false })} />
            <Row className="g-0" style={{ minHeight: '100vh' }}>
                <Col lg={5} className="d-none d-lg-flex align-items-center justify-content-center" 
                     style={{ background: 'linear-gradient(135deg, #1a3024 0%, #0a1510 100%)', color: '#fff' }}>
                    <div className="text-center p-5">
                        <div style={{ fontSize: '5rem', fontWeight: '900', letterSpacing: '-2px', color: '#c5a059' }}>tM</div>
                        <h1 style={{ fontFamily: 'serif', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '2rem' }}>Mahal Connect</h1>
                        <div style={{ width: '60px', height: '3px', background: '#c5a059', margin: '30px auto' }}></div>
                        <p style={{ opacity: 0.7, fontSize: '1.2rem', maxWidth: '350px' }}>Elevating community management through digital excellence.</p>
                    </div>
                </Col>
                <Col lg={7} className="d-flex align-items-center justify-content-center p-5">
                    <div style={{ width: '100%', maxWidth: '480px' }}>
                        <h2 style={{ fontWeight: '800', color: '#1a3024', fontSize: '2.5rem', marginBottom: '10px' }}>Create Account</h2>
                        <p className="text-muted mb-5">Please fill in your details to join our digital community.</p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Control className="mb-4" style={inputStyle} type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
                            <Row>
                                <Col><Form.Control className="mb-4" style={inputStyle} type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required /></Col>
                                <Col><Form.Control className="mb-4" style={inputStyle} type="email" name="email" placeholder="Email Address" onChange={handleChange} required /></Col>
                            </Row>
                            <Form.Control className="mb-4" style={inputStyle} as="textarea" rows={2} name="address" placeholder="Residential Address" onChange={handleChange} required />
                            <Form.Control className="mb-5" style={inputStyle} type="password" name="password" placeholder="Choose a Secure Password" onChange={handleChange} required />
                            <Button type="submit" disabled={loading} className="w-100 border-0 shadow-lg" 
                                    style={{ padding: '16px', borderRadius: '12px', background: '#1a3024', fontWeight: '700', fontSize: '1.1rem' }}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Join Community'}
                            </Button>
                        </Form>
                        <p className="text-center mt-4 text-muted">Already a member? <a href="/login" style={{ color: '#1a3024', fontWeight: '700', textDecoration: 'none' }}>Login</a></p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default Signup;