import React, { useState, useEffect, useMemo } from "react";
import { Button, Card, Table, Badge, Form, InputGroup, Row, Col, Spinner, Tabs, Tab } from "react-bootstrap";
import { Plus, Search, BookOpen, Edit2, Trash2, Package, AlertCircle, Check, X, Undo2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import AddBookModal from "./AddBook";
import "./Library.css";
import { useNavigate } from 'react-router-dom';

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [booksRes, requestsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/books/", config),
        axios.get("http://127.0.0.1:8000/api/book-requests/", config)
      ]);
      setBooks(booksRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Could not sync data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 const handleRequestAction = async (requestId, action) => {
  try {
    const token = localStorage.getItem('access_token');
    // Ensure the payload is just { status: "VALUE" }
    await axios.patch(`http://127.0.0.1:8000/api/book-requests/${requestId}/`, 
      { status: action }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    Swal.fire('Updated!', `Status is now ${action}`, 'success');
    fetchData(); 
  } catch (err) {
    // Check what the backend is complaining about
    console.error("400 Error Details:", err.response?.data);
    Swal.fire('Error', 'Update failed. Check console for details.', 'error');
  }
};
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
        Swal.fire('Deleted!', 'Book removed.', 'success');
        fetchData();
      } catch {
        Swal.fire('Error', 'Deletion failed.', 'error');
      }
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All Categories" || book.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStock = stockFilter === "All" || (stockFilter === "In Stock" ? book.in_stock : !book.in_stock);
      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [searchTerm, categoryFilter, stockFilter, books]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>;

  return (
    <div className="animate-fade-in p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="library-icon-wrapper"><BookOpen size={22} /></div>
          <div>
            <h4 className="fw-bold mb-0">Library Management</h4>
            <small className="text-muted">{books.length} Titles | {requests.filter(r => r.status === 'PENDING').length} New Requests</small>
          </div>
        </div>
        <Button variant="dark" className="rounded-pill px-4" onClick={() => setShowAddModal(true)}>
          <Plus size={18} className="me-1" /> Add Book
        </Button>
      </div>

      <Tabs defaultActiveKey="inventory" className="mb-4 custom-tabs">
        <Tab eventKey="inventory" title="Inventory">
          <Row className="mb-4 g-3">
            <Col lg={7}>
              <InputGroup className="rounded-pill overflow-hidden shadow-sm">
                <InputGroup.Text className="bg-white border-end-0"><Search size={18} /></InputGroup.Text>
                <Form.Control placeholder="Search..." className="border-start-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Col>
            <Col xs={6} lg={3}>
              <Form.Select className="rounded-pill" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option>All Categories</option>
                <option>History</option><option>Theology</option><option>Biography</option><option>Hadith</option>
              </Form.Select>
            </Col>
            <Col xs={6} lg={2}>
              <Form.Select className="rounded-pill" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                <option>All</option><option>In Stock</option><option>Out of Stock</option>
              </Form.Select>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted small uppercase">
                <tr><th className="ps-4">Title</th><th>Category</th><th className="text-center">Qty</th><th>Status</th><th className="pe-4 text-end">Action</th></tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="ps-4">
                      <div className="fw-bold">{book.title}</div>
                      <div className="small text-muted">{book.author}</div>
                    </td>
                    <td><Badge bg="light" text="dark" className="border">{book.category}</Badge></td>
                    <td className="text-center">{book.quantity}</td>
                    <td>
                      <Badge bg={book.in_stock ? "success-subtle" : "danger-subtle"} className={book.in_stock ? "text-success" : "text-danger"}>
                        {book.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <Button variant="link" onClick={() => navigate(`edit/${book.id}`)}><Edit2 size={18} /></Button>
                      <Button variant="link" className="text-danger" onClick={() => handleDelete(book.id, book.title)}><Trash2 size={17} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>

        <Tab eventKey="requests" title={`Requests (${requests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'IN_HAND').length})`}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table hover className="align-middle mb-0">
              <thead className="bg-light text-muted small uppercase">
                <tr><th className="ps-4">User</th><th>Book</th><th>Status</th><th className="pe-4 text-end">Workflow</th></tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="ps-4 py-3 fw-bold">{req.username}</td>
                    <td>{req.book_title}</td>
                    <td>
                      <Badge pill bg={
                        req.status === 'APPROVED' ? 'success' : 
                        req.status === 'IN_HAND' ? 'primary' : 
                        req.status === 'RETURNED' ? 'dark' : 
                        req.status === 'REJECTED' ? 'danger' : 'warning'
                      }>
                        {req.status === 'IN_HAND' ? 'WITH USER' : req.status}
                      </Badge>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {req.status === 'PENDING' && (
                          <>
                            <Button variant="success" size="sm" className="rounded-pill" onClick={() => handleRequestAction(req.id, 'APPROVED')}><Check size={14}/></Button>
                            <Button variant="outline-danger" size="sm" className="rounded-pill" onClick={() => handleRequestAction(req.id, 'REJECTED')}><X size={14}/></Button>
                          </>
                        )}
                        {req.status === 'APPROVED' && (
                          <Button variant="primary" size="sm" className="rounded-pill" onClick={() => handleRequestAction(req.id, 'IN_HAND')}>
                            <Package size={14} className="me-1"/> Hand Over
                          </Button>
                        )}
                        {req.status === 'IN_HAND' && (
                          <Button variant="dark" size="sm" className="rounded-pill" onClick={() => handleRequestAction(req.id, 'RETURNED')}>
                            <Undo2 size={14} className="me-1"/> Mark Returned
                          </Button>
                        )}
                        {(req.status === 'RETURNED' || req.status === 'REJECTED') && <span className="text-muted small">Closed</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Tab>
      </Tabs>

      <AddBookModal show={showAddModal} handleClose={() => setShowAddModal(false)} refreshBooks={fetchData} />
    </div>
  );
};

export default LibraryPage;