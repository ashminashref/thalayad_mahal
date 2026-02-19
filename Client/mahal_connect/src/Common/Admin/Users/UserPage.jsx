import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Badge, Form, InputGroup, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Plus, Trash2, Search, Mail, Phone, User as UserIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Users.css';

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove ${name} from the community.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://127.0.0.1:8000/api/users/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Deleted!', 'User has been removed.', 'success');
        fetchUsers(); // Refresh list
      } catch  {
        Swal.fire('Error', 'Failed to delete user.', 'error');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (first, last) => `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="animate-fade-in px-3">
      {/* Premium Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <div className="user-icon-wrapper shadow-sm">
              <UserIcon size={22} className="text-white" />
            </div>
            <h3 className="fw-bold mb-0" style={{ letterSpacing: '-0.5px' }}>Community</h3>
          </div>
          <p className="text-muted small mb-0 ms-5 ps-2">Managing {users.length} verified mahal members</p>
        </div>

        <Button 
          variant="dark" 
          className="d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm hover-lift"
          onClick={() => navigate("/admin/users/add")}
        >
          <Plus size={18} /> <span className="fw-semibold">Add New Member</span>
        </Button>
      </div>

      {/* Modern Search Bar */}
      <InputGroup className="mb-4 search-input-group shadow-sm">
        <InputGroup.Text className="bg-white border-0 ps-3">
          <Search size={18} className="text-muted" />
        </InputGroup.Text>
        <Form.Control 
          placeholder="Search members by name, email or phone..." 
          className="border-0 py-3 shadow-none text-dark"
          style={{ fontSize: '0.95rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Premium Table Card */}
      <Card className="border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
          ) : (
            <Table hover className="align-middle mb-0 premium-table">
              <thead className="bg-faint text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                <tr>
                  <th className="ps-4 py-3">Member Details</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th className="text-center">Account Status</th>
                  <th>Registration</th>
                  <th className="pe-4 text-end">Management</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="user-row">
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="user-avatar-circle shadow-sm">
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">{user.first_name} {user.last_name}</div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>Member ID: #{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="small mb-1 d-flex align-items-center gap-2">
                          <Mail size={13} className="text-primary" /> {user.email}
                        </div>
                        <div className="small text-muted d-flex align-items-center gap-2">
                          <Phone size={13} /> {user.phone_number || "No Phone"}
                        </div>
                      </td>

                      <td>
                        <span className={`premium-badge ${user.is_staff ? 'admin' : 'member'}`}>
                          {user.is_staff ? 'Admin' : 'Member'}
                        </span>
                      </td>

                      <td className="text-center">
                        <span className={`status-dot ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td>
                        <div className="fw-semibold small">{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</div>
                        <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                          <Clock size={12} /> {user.date_joined ? new Date(user.date_joined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                        </div>
                      </td>

                      <td className="pe-4 text-end">
                        <OverlayTrigger overlay={<Tooltip>Delete Member</Tooltip>}>
                          <Button 
                            variant="link" 
                            className="p-2 text-danger action-btn-hover"
                            onClick={() => deleteUser(user.id, `${user.first_name} ${user.last_name}`)}
                          >
                            <Trash2 size={19} />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                       No results found for your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UsersPage;