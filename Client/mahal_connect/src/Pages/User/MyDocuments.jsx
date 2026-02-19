import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, Eye, Download, Search } from 'lucide-react';
import { Card, Badge, Button, Spinner, InputGroup, Form } from 'react-bootstrap';
import axios from 'axios';
import Floatingnav from '../../Common/User/FloatingNav';

const MyDocuments = () => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        const fetchMyDocs = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await axios.get("http://127.0.0.1:8000/api/certificate-requests/", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDocs(res.data);
            } catch (err) {
                console.error("Error fetching documents", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyDocs();
    }, []);

    const filteredDocs = useMemo(() => {
        return docs.filter(doc => {
            const matchesSearch = doc.certificate_type.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || doc.status.toUpperCase() === filterStatus.toUpperCase();
            return matchesSearch && matchesFilter;
        });
    }, [docs, searchTerm, filterStatus]);

    const getStatusStyles = (status) => {
        switch (status.toUpperCase()) {
            case 'APPROVED': return { bg: 'success', icon: <CheckCircle size={14} /> };
            case 'REJECTED': return { bg: 'danger', icon: <XCircle size={14} /> };
            default: return { bg: 'warning', icon: <Clock size={14} /> };
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="success" />
        </div>
    );

    return (
        <div className="pb-5 mb-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            
            
            <div className="container mt-4 px-3">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Button variant="white" className="rounded-circle shadow-sm border p-2" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </Button>
                    <h4 className="fw-bold mb-0">My Documents</h4>
                </div>

                <div className="d-flex gap-2 mb-4">
                    <InputGroup className="shadow-sm rounded-3 overflow-hidden bg-white border">
                        <InputGroup.Text className="bg-white border-0"><Search size={18} className="text-muted"/></InputGroup.Text>
                        <Form.Control 
                            className="border-0 shadow-none py-2" 
                            placeholder="Search certificates..." 
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Form.Select 
                        className="w-auto border shadow-sm rounded-3 fw-bold"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                    </Form.Select>
                </div>

                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => {
                        const style = getStatusStyles(doc.status);
                        return (
                            <Card key={doc.id} className="border-0 shadow-sm rounded-4 mb-3 p-2">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">{doc.certificate_type} Certificate</h6>
                                            <Badge pill bg={style.bg} className="d-flex align-items-center gap-1 px-2 py-1">
                                                {style.icon} {doc.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button variant="light" className="rounded-circle border" onClick={() => window.open(doc.document, "_blank")}>
                                        <Eye size={18} />
                                    </Button>
                                </Card.Body>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-5 opacity-50">
                        <FileText size={48} className="mb-2" />
                        <p>No documents found</p>
                    </div>
                )}
            </div>
            <Floatingnav />
        </div>
    );
};

export default MyDocuments;