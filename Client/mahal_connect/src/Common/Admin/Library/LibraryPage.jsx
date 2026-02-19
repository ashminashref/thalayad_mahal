import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Table, Badge, Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import { Plus, Search, BookOpen, Edit2, Trash2, Package, AlertCircle } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import AddBookModal from "./AddBook";
import "./Library.css";
import { useNavigate } from 'react-router-dom';


const LibraryPage = () => {
  const [books, setBooks] = useState([]); // Dynamic state instead of mock data
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
    const navigate = useNavigate();
  
  // 1. Fetch books from Django
  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/books/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 2. Handle Delete logic
  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Remove Book?',
      text: `Are you sure you want to delete "${title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://127.0.0.1:8000/api/books/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'Book removed from library.', 'success');
        fetchBooks(); // Refresh list
      } catch  {
        Swal.fire('Error', 'Could not delete the book.', 'error');
      }
    }
  };

  // 3. Live Search and Filtering logic
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All Categories" ||
        book.category.toLowerCase() === categoryFilter.toLowerCase();

      const matchesStock =
        stockFilter === "All" || 
        (stockFilter === "In Stock" ? book.in_stock : !book.in_stock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, categoryFilter, stockFilter, books]);

  const inStockCount = books.filter((b) => b.in_stock).length;

  return (
    <div className="animate-fade-in p-3">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="library-icon-wrapper">
            <BookOpen size={22} />
          </div>
          <div>
            <h4 className="fw-bold mb-0 page-title">Library</h4>
            <small className="subtitle-text text-muted">
              {loading ? "Syncing..." : `${inStockCount} unique titles available`}
            </small>
          </div>
        </div>

        <Button
          variant="dark"
          className="btn-custom py-2 px-4 d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={18} /> Add Book
        </Button>
      </div>

      {/* Search & Filters */}
      <Row className="mb-4 g-3">
        <Col lg={7}>
          <InputGroup className="search-input-group rounded-pill overflow-hidden shadow-sm">
            <InputGroup.Text className="search-icon-box bg-white border-end-0">
              <Search size={18} className="search-icon text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by title or author..."
              className="input-box shadow-none border-start-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col xs={6} lg={3}>
          <Form.Select
            className="rounded-pill py-2 select shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            <option>History</option>
            <option>Theology</option>
            <option>Biography</option>
            <option>Hadith</option>
          </Form.Select>
        </Col>

        <Col xs={6} lg={2}>
          <Form.Select
            className="rounded-pill py-2 select shadow-sm"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option>All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Table Section */}
      <Card className="library-card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" />
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0 custom-table">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3">Book Details</th>
                  <th>Category</th>
                  <th className="text-center">Qty</th>
                  <th>Availability</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.length > 0 ? (
                  filteredBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="ps-4 py-3">
                        <div className="title-text fw-bold">{book.title}</div>
                        <div className="subtitle-text small text-muted">{book.author}</div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">
                          {book.category}
                        </Badge>
                      </td>
                      <td className="text-center fw-semibold">{book.quantity}</td>
                      <td>
                        <Badge
                          className={`status-pill ${book.in_stock ? "instock" : "outofstock"}`}
                          style={{ 
                            backgroundColor: book.in_stock ? '#e6fffa' : '#fff5f5',
                            color: book.in_stock ? '#2c7a7b' : '#c53030'
                          }}
                        >
                          <span className="d-flex align-items-center gap-1">
                            {book.in_stock ? <Package size={14} /> : <AlertCircle size={14} />}
                            {book.in_stock ? "In Stock" : "Out of Stock"}
                          </span>
                        </Badge>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                         <Button variant="link" onClick={() => navigate(`edit/${book.id}`)}>
  <Edit2 size={18} />
</Button>
                          <Button 
                            variant="link" 
                            className="action-btn text-danger"
                            onClick={() => handleDelete(book.id, book.title)}
                          >
                            <Trash2 size={17} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <AddBookModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refreshBooks={fetchBooks} // Passes the fetch function to modal
      />
    </div>
  );
};

export default LibraryPage;