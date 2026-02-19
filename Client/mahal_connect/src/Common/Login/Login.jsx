import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/* --- Premium Custom Alert Component --- */
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
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)', transition: 'all 0.4s ease'
        }}>
            <h6 style={{ margin: 0, fontWeight: '800', color: isError ? '#c53030' : '#1a3024', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px' }}>
                {isError ? 'Action Required' : 'Success'}
            </h6>
            <p style={{ margin: '8px 0 0', color: '#4a5568', fontSize: '0.95rem', fontWeight: '500' }}>{message}</p>
            <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#a0aec0' }}>&times;</button>
        </div>
    );
};

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            navigate('/home');
        }
    }, [navigate]);

    const showAlert = (message, type = 'error') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
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
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            username: formData.email,
            password: formData.password
        });

        const token = response.data.access;
        localStorage.setItem('access_token', token);

        // Fetch profile to verify Admin status
        const userRes = await axios.get('http://127.0.0.1:8000/api/user-profile/', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const isAdmin = userRes.data.is_mahal_admin;
        localStorage.setItem('is_admin', isAdmin); // MUST set this for AdminRoute

        if (isAdmin) {
            showAlert("Welcome Admin!")
            setTimeout(() => navigate('/admin', {replace: true}, 1000))
        } else {
            showAlert("Login Succesfull!")
            setTimeout(() => navigate('/home', {replace: true}, 1000))

        }
    } catch  {
        showAlert("Login failed. Check your credentials.");
    } finally {
        setLoading(false);
    }
};
    return (
        <Container fluid className="p-0" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <PremiumAlert {...alert} onClose={() => setAlert({ ...alert, show: false })} />
            
            <Row className="g-0 justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                {/* Visual Side (Hidden on Mobile) */}
                <Col lg={5} className="d-none d-lg-flex align-items-center justify-content-center" 
                     style={{ background: 'linear-gradient(135deg, #1a3024 0%, #0a1510 100%)', minHeight: '100vh', color: '#fff' }}>
                    <div className="text-center p-5">
                        <div style={{ fontSize: '5.5rem', fontWeight: '900', color: '#c5a059' }}>tM</div>
                        <h2 style={{ fontFamily: 'serif', letterSpacing: '4px', textTransform: 'uppercase' }}>Mahal Connect</h2>
                        <p style={{ opacity: 0.7, maxWidth: '300px', margin: '20px auto' }}>Exclusive access for the Mahal community members.</p>
                    </div>
                </Col>

                {/* Login Form Side */}
                <Col lg={7} className="d-flex align-items-center justify-content-center p-5">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="text-center mb-5">
                            <h2 style={{ fontWeight: '800', color: '#1a3024', fontSize: '2.5rem' }}>Secure Login</h2>
                            <p className="text-muted">Enter your credentials to continue</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="text-uppercase small fw-bold text-muted">Email Address</Form.Label>
                                <Form.Control 
                                    style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }} 
                                    type="email" 
                                    placeholder="name@example.com" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <div className="d-flex justify-content-between">
                                    <Form.Label className="text-uppercase small fw-bold text-muted">Password</Form.Label>
                                    <a href="#" style={{ color: '#c5a059', fontSize: '0.85rem', textDecoration: 'none', fontWeight: '600' }}>Forgot?</a>
                                </div>
                                <Form.Control 
                                    style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }} 
                                    type="password" 
                                    placeholder="••••••••" 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                    required 
                                />
                            </Form.Group>

                            <Button type="submit" disabled={loading} className="w-100 border-0 shadow-lg" 
                                    style={{ padding: '16px', borderRadius: '12px', background: '#1a3024', fontWeight: '700', fontSize: '1.1rem' }}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Enter Dashboard'}
                            </Button>
                        </Form>

                        <div className="text-center mt-5">
                            <p className="text-muted">New here? <a href="/" style={{ color: '#1a3024', fontWeight: '700', textDecoration: 'none' }}>Register Mahal ID</a></p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;