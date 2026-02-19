import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { BookOpen, User, Layers, CheckCircle, XCircle, Loader2 } from "lucide-react";
import axios from "axios";
import "./UserLibraryPage.css";
import Floatingnav from "../../Common/User/FloatingNav";

const UserLibraryPage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live books from backend
  const fetchLibrary = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get("http://127.0.0.1:8000/api/books/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Library Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return (
    <div className="user-library-page animate-fade-in">
      {/* Header */}
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
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-card shadow-sm">
                <div className="book-icon">
                  <BookOpen size={22} />
                </div>

                <h3 className="text-truncate">{book.title}</h3>

                <div className="book-meta">
                  <span>
                    <User size={14} /> {book.author}
                  </span>
                  <span>
                    <Layers size={14} /> {book.category}
                  </span>
                </div>

                <div className="book-stock">
                  {/* Logic based on real database field 'in_stock' */}
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

                <button
                  className="borrow-btn"
                  disabled={!book.in_stock || book.quantity === 0}
                  onClick={() => navigate(`/book-request/${book.id}`)}
                >
                  {book.in_stock && book.quantity > 0 ? "Request to Borrow" : "Currently Unavailable"}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-5 w-100">
              <p className="text-muted">No books available in the catalog yet.</p>
            </div>
          )}
        </div>
      )}

      <Floatingnav />
    </div>
  );
};

export default UserLibraryPage;