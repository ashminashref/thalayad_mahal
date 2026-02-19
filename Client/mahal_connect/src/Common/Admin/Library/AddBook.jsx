import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Library/AddBook.css";

const AddBookModal = ({ show, handleClose, refreshBooks }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    quantity: 1,
    inStock: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;

    if (name === "quantity") {
      newValue = Math.max(1, Number(value));
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      
      // Map to Django field names (in_stock)
      const dataToSubmit = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        description: formData.description.trim(),
        quantity: formData.quantity,
        in_stock: formData.inStock, 
      };

      await axios.post("http://127.0.0.1:8000/api/books/", dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Book Added',
        text: `"${formData.title}" is now in the library.`,
        confirmButtonColor: '#1a1a1a'
      });

      if (refreshBooks) refreshBooks(); // Call this to update the list on the main page
      handleClose();
      
      // Reset form
      setFormData({ title: "", author: "", category: "", description: "", quantity: 1, inStock: true });

    } catch (err) {
      console.error("API Error:", err.response?.data);
      Swal.fire('Error', 'Failed to add book. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.author.trim() &&
    formData.category &&
    formData.quantity >= 1;

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="add-book-modal" contentClassName="border-0 rounded-4 shadow-lg">
      <Modal.Header className="border-0 pt-4 px-4 pb-2 position-relative">
        <Modal.Title className="fw-semibold h5">Add New Book</Modal.Title>
        <button onClick={handleClose} className="modal-close-btn"><X size={20} /></button>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium mb-1">Title</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium mb-1">Author</Form.Label>
            <Form.Control type="text" name="author" value={formData.author} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium mb-1">Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="history">History</option>
              <option value="theology">Theology</option>
              <option value="biography">Biography</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-medium mb-1">Description</Form.Label>
            <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} />
          </Form.Group>

          <Row className="align-items-end mb-4">
            <Col xs={6}>
              <Form.Label className="small fw-medium mb-1">Quantity</Form.Label>
              <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} min={1} />
            </Col>

            <Col xs={6} className="d-flex flex-column align-items-center">
              <Form.Label className="small fw-medium mb-1">In Stock</Form.Label>
              <Form.Check type="switch" id="in-stock-switch" name="inStock" checked={formData.inStock} onChange={handleChange} />
            </Col>
          </Row>

          <Button variant="dark" type="submit" className="w-100 py-2 rounded-pill submit-btn" disabled={!isFormValid || loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Add Book"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBookModal;