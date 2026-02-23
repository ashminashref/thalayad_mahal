import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { BookOpen, User, Layers, CheckCircle, XCircle, Loader2, Clock, CheckCircle2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import "./UserLibraryPage.css";
import Floatingnav from "../../Common/User/FloatingNav";

const UserLibraryPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [userRequests, setUserRequests] = useState([]); // Track user's borrow history
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch both books and the user's specific requests
      const [booksRes, requestsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/books/", config),
        axios.get("http://127.0.0.1:8000/api/book-requests/", config)
      ]);
      
      setBooks(booksRes.data);
      setUserRequests(requestsRes.data);
    } catch (err) {
      console.error("Library Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBorrowRequest = async (book) => {
    const result = await Swal.fire({
      title: "Request Book?",
      text: `Would you like to request to borrow "${book.title}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1c3124",
      confirmButtonText: "Yes, Request",
    });

    if (result.isConfirmed) {
      setRequestingId(book.id);
      try {
        const token = localStorage.getItem('access_token');
        await axios.post(
          "http://127.0.0.1:8000/api/book-requests/", 
          { book: book.id }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          title: "Requested!",
          text: "Admin notified. Check back for approval.",
          icon: "success",
          confirmButtonColor: "#1c3124",
        });
        fetchData(); // Refresh data to update button states immediately
      } catch {
        Swal.fire("Error", "Could not process request.", "error");
      } finally {
        setRequestingId(null);
      }
    }
  };

  // Helper function to determine button state
  const getRequestStatus = (bookId) => {
    const request = userRequests.find(r => r.book === bookId && r.status !== 'RETURNED');
    return request ? request.status.toUpperCase() : null;
  };

  return (
    <div className="user-library-page animate-fade-in">
      <div className="library-header">
        <button onClick={() => navigate("/")} className="back-btn icon-only">
          <ArrowLeftIcon fontSize="small" />
        </button>
        <div>
          <h1 className="curly-txt">Mahal Library</h1>
          <p className="text-muted small">Explore knowledge and heritage</p>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
          <Loader2 className="animate-spin text-dark" size={32} />
          <p className="mt-2 text-muted">Opening Catalog...</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => {
            const status = getRequestStatus(book.id);
            
            return (
              <div key={book.id} className="book-card shadow-sm">
                <div className="book-icon">
                  <BookOpen size={22} />
                </div>
                <h3 className="text-truncate">{book.title}</h3>
                <div className="book-meta">
                  <span><User size={14} /> {book.author}</span>
                  <span><Layers size={14} /> {book.category}</span>
                </div>

                <div className="book-stock">
                  {book.in_stock && book.quantity > 0 ? (
                    <span className="stock available">
                      <CheckCircle size={14} /> Available ({book.quantity})
                    </span>
                  ) : (
                    <span className="stock unavailable">
                      <XCircle size={14} /> Out of Stock
                    </span>
                  )}
                </div>

                {/* DYNAMIC BUTTON LOGIC */}
                <button
                  className={`borrow-btn ${status ? status.toLowerCase() : ""}`}
                  disabled={!book.in_stock || requestingId === book.id || status === 'PENDING' || status === 'APPROVED' || status === 'IN_HAND'}
                  onClick={() => handleBorrowRequest(book)}
                >
                  {requestingId === book.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : status === 'PENDING' ? (
                    <><Clock size={16} className="me-2"/> Requested</>
                  ) : status === 'APPROVED' ? (
                    <><CheckCircle2 size={16} className="me-2"/> Approved</>
                  ) : status === 'IN_HAND' ? (
                    "Currently in your hand"
                  ) : book.in_stock ? (
                    "Request to Borrow"
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
      <Floatingnav />
    </div>
  );
};

export default UserLibraryPage;