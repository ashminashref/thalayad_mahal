import React, { useState } from "react";
import "../../src/Components/Payment.css";
import {
  CreditCard,
  Smartphone,
  Landmark,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Topbar from "../Common/User/Topbar";
import Floatingnav from "../Common/User/FloatingNav";
import PayButton from "../UI/PayButton";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("Monthly Contribution");
  const [paymentMethod, setPaymentMethod] = useState("Card Payment");
  const [amount, setAmount] = useState(500);

  const paymentTypes = [
    {
      id: "monthly",
      title: "Monthly Contribution",
      sub: "Regular monthly dues",
      price: 500,
    },
    {
      id: "madrassa",
      title: "Madrassa Fee",
      sub: "Educational support",
      price: 1200,
    },
    { id: "zakat", title: "Zakat", sub: "Custom amount", price: 0 },
    { id: "sadaqah", title: "Sadaqah", sub: "Voluntary charity", price: 0 },
  ];

  const methods = [
    { id: "card", title: "Card Payment", icon: <CreditCard size={20} /> },
    { id: "upi", title: "UPI", icon: <Smartphone size={20} /> },
    { id: "bank", title: "Bank Transfer", icon: <Landmark size={20} /> },
  ];

  const isCustomAmount = paymentType === "Zakat" || paymentType === "Sadaqah";

  return (
    <div className="payment-wrapper">
      <div className="payment-container mb-5 pb-5">
        {/* Header */}

        <Topbar/>
        <header className="payment-header mt-5 ">
          <div className="payment-header-top">
            <button className="back-button" onClick={() => navigate("/")}>
              <ArrowLeft size={20}  />
            </button>

            <div className="header-text ">
              <h1>Make Payment</h1>
              <p>Contribute to the community</p>
            </div>
          </div>
        </header>

        {/* Payment Type */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="section-title">Payment Type</h2>
          <div className="type-grid">
            {paymentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setPaymentType(type.title);
                  setAmount(type.price > 0 ? type.price : "");
                }}
                className={`type-card ${paymentType === type.title ? "active" : ""}`}
              >
                <h3>{type.title}</h3>
                <p>{type.sub}</p>

                <div className="type-footer">
                  <span>{type.price > 0 ? `₹${type.price}` : "Custom"}</span>
                  {paymentType === type.title && <div className="pulse-dot" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Custom Amount */}
        {isCustomAmount && (
          <section style={{ marginBottom: "2rem" }}>
            <h2 className="section-title">Enter Amount</h2>
            <input
              type="number"
              min="1"
              placeholder="Enter donation amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="amount-input"
            />
          </section>
        )}

        {/* Payment Method */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2 className="section-title">Payment Method</h2>
          <div className="method-list">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.title)}
                className={`method-item ${paymentMethod === method.title ? "active" : ""}`}
              >
                <div className="method-left">
                  <div className="icon-box">{method.icon}</div>
                  <span>{method.title}</span>
                </div>

                {paymentMethod === method.title ? (
                  <CheckCircle2 size={20} color="#064e3b" />
                ) : (
                  <ChevronRight size={16} color="#cbd5e1" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <div className="summary-card">
          <div className="summary-row">
            <span>Payment Type</span>
            <span>{paymentType}</span>
          </div>
          <div className="summary-row">
            <span>Method</span>
            <span>{paymentMethod}</span>
          </div>
          <div className="total-row">
            <span>Total Amount</span>
            <span>₹{amount || 0}</span>
          </div>
        </div>

        {/* Pay Button */}
        {/* <button className="pay-btn" disabled={!amount || amount <= 0}>
          Pay ₹{amount || 0}
        </button> */}
        <PayButton/>
      </div>
      <Floatingnav/>
    </div>
  );
};

export default PaymentPage;
