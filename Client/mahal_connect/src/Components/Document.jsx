import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { ArrowLeft, FileText, Trash2, Eye, Award, Baby, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Components/Document.css';

function DocumentManager() {
  const navigate = useNavigate();

  // Mock data for uploaded documents
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Marriage Certificate",
      type: "Marriage",
      uploadDate: "12 Jan 2026",
      icon: <Heart size={24} className="text-danger" />,
      status: "Verified"
    },
    {
      id: 2,
      name: "Degree Certificate",
      type: "Educational",
      uploadDate: "15 Jan 2026",
      icon: <Award size={24} className="text-primary" />,
      status: "Pending"
    },
    {
      id: 3,
      name: "Birth Certificate",
      type: "Birth",
      uploadDate: "20 Jan 2026",
      icon: <Baby size={24} className="text-success" />,
      status: "Verified"
    }
  ]);

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this document?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <Container className="document-manager-container py-4">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Button variant="light" className="me-3 shadow-sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h4 className="mb-0 fw-bold">My Documents</h4>
      </div>

      <Row className="g-3">
        {documents.map((doc) => (
          <Col xs={12} md={6} key={doc.id}>
            <Card className="document-card border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="doc-icon-wrapper me-3">
                  {doc.icon}
                </div>
                
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-bold">{doc.name}</h6>
                  <div className="d-flex align-items-center gap-2">
                    <small className="text-muted">{doc.uploadDate}</small>
                    <Badge bg={doc.status === 'Verified' ? 'success' : 'warning'} size="sm">
                      {doc.status}
                    </Badge>
                  </div>
                </div>

                <div className="doc-actions d-flex flex-column gap-2">
                  <Button variant="outline-primary" size="sm" className="action-btn">
                    <Eye size={16} />
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="action-btn"
                    onClick={() => handleRemove(doc.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {documents.length === 0 && (
          <Col className="text-center py-5">
            <FileText size={48} className="text-muted mb-3" />
            <p className="text-muted">No documents found. Please upload your certificates.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
}

export default DocumentManager;