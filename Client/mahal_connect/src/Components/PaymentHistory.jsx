import React from 'react';
import { Container, Card, Table, Button, Badge } from 'react-bootstrap';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../Components/PaymentHistory.css';

function PaymentHistory() {
  const navigate = useNavigate();

  // Mock payment history (replace with API later)
  const payments = [
    {
      id: 'TXN001',
      type: 'Monthly Contribution',
      amount: 500,
      mode: 'Online',
      date: '05 Jan 2026',
      status: 'paid'
    },
    {
      id: 'TXN002',
      type: 'Donation',
      amount: 1000,
      mode: 'Cash',
      date: '15 Jan 2026',
      status: 'paid'
    },
    {
      id: 'TXN003',
      type: 'Monthly Contribution',
      amount: 500,
      mode: 'Online',
      date: '05 Feb 2026',
      status: 'pending'
    }
  ];

  return (
    <Container className="payment-history-container">

      {/* Header */}
      <div className="payment-history-header">
        <Button
          variant="light"
          className="payment-back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
        </Button>
        <h5>
          <CreditCard size={18} className="me-2" />
          Payment History
        </h5>
      </div>

      {/* Table */}
      <Card className="payment-history-card">
        <Card.Body>
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, index) => (
                <tr key={pay.id}>
                  <td>{index + 1}</td>
                  <td>{pay.type}</td>
                  <td>₹{pay.amount}</td>
                  <td>{pay.mode}</td>
                  <td>{pay.date}</td>
                  <td>
                    <Badge
                      bg={pay.status === 'paid' ? 'success' : 'warning'}
                      className="text-capitalize"
                    >
                      {pay.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

    </Container>
  );
}

export default PaymentHistory;
