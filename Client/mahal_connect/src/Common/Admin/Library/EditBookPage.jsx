import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Book as BookIcon } from "lucide-react"; 
import axios from "axios";
import Swal from "sweetalert2";

const EditBookPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    quantity: 1,
    in_stock: true
  });

  // Fetch current book data on load
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://127.0.0.1:8000/api/books/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        Swal.fire('Error', 'Book not found.', 'error');
        navigate('/admin/library');
      }
    };
    fetchBook();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`http://127.0.0.1:8000/api/books/${id}/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await Swal.fire('Updated', 'Library records updated.', 'success');
      navigate('/admin/library');
    } catch (err) {
      Swal.fire('Error', 'Update failed. Check your network.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="grow" /></div>;

  return (
    <Container className="py-4 animate-fade-in">
      <Button variant="link" onClick={() => navigate(-1)} className="text-dark mb-3 p-0 text-decoration-none d-flex align-items-center">
        <ArrowLeft size={20} className="me-2" /> Back
      </Button>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-lg rounded-4">
            <Card.Header className="bg-dark text-white p-4 rounded-top-4 border-0">
              <div className="d-flex align-items-center gap-3">
                <BookIcon size={24} />
                <h4 className="mb-0">Update Book Details</h4>
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Title</Form.Label>
                  <Form.Control name="title" value={formData.title} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Author</Form.Label>
                  <Form.Control name="author" value={formData.author} onChange={handleChange} required />
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Label className="small fw-bold">Category</Form.Label>
                    <Form.Select name="category" value={formData.category} onChange={handleChange}>
                      <option value="History">History</option>
                      <option value="Theology">Theology</option>
                      <option value="Hadith">Hadith</option>
                      <option value="Seerah">Seerah</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label className="small fw-bold">Quantity</Form.Label>
                    <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="0" />
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Check 
                    type="switch" 
                    id="stock-switch" 
                    label="Available in Library" 
                    name="in_stock" 
                    checked={formData.in_stock} 
                    onChange={handleChange} 
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="light" className="w-50 py-2 fw-semibold" onClick={() => navigate(-1)}>Cancel</Button>
                  <Button type="submit" variant="dark" className="w-50 py-2 fw-semibold" disabled={saving}>
                    {saving ? <Spinner size="sm" /> : <><Save size={18} className="me-2" /> Update</>}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditBookPage;