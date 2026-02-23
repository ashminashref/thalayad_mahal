import React, { useState, useEffect } from "react";
import "../../src/Components/Payment.css";
import {
  Smartphone, Wallet, ArrowLeft,
  CheckCircle2, ChevronRight, Info, IndianRupee, Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Topbar from "../Common/User/Topbar";
import Floatingnav from "../Common/User/FloatingNav";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [paymentType, setPaymentType] = useState("Monthly Contribution");
  const [paymentMethod, setPaymentMethod] = useState("Digital Payment");
  const [amount, setAmount] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [numStudents, setNumStudents] = useState(1);
  const [dynamicPrices, setDynamicPrices] = useState({ monthly: 500, madrassa: 1200 });

  useEffect(() => {
    const fetchLiveFees = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://127.0.0.1:8000/api/admin/fee-config/", {
            headers: { Authorization: `Bearer ${token}` }
        }); 
        const { monthly, madrassa } = res.data;
        setDynamicPrices({ 
            monthly: parseFloat(monthly), 
            madrassa: parseFloat(madrassa) 
        });
        setAmount(parseFloat(monthly));
      } catch (err) {
        console.error("Failed to fetch live fees:", err);
      }
    };
    fetchLiveFees();
  }, []);

  useEffect(() => {
    if (paymentType === "Madrassa Fee") {
      setAmount(dynamicPrices.madrassa * numStudents);
    }
  }, [numStudents, paymentType, dynamicPrices.madrassa]);

  const paymentTypes = [
    { id: "monthly", title: "Monthly Contribution", sub: "Regular dues", price: dynamicPrices.monthly },
    { id: "madrassa", title: "Madrassa Fee", sub: "Education", price: dynamicPrices.madrassa },
    { id: "zakat", title: "Zakat", sub: "Obligatory", price: 0 },
    { id: "sadaqah", title: "Sadaqah", sub: "Charity", price: 0 },
  ];

  const methods = [
    { id: "online", title: "Digital Payment", icon: <Smartphone size={20} />, detail: "GPay, PhonePe, Cards" },
    { id: "cash", title: "Cash", icon: <Wallet size={20} />, detail: "Pay at Mahal Office" },
  ];

  const handleRazorpayPayment = async () => {
    const token = localStorage.getItem("access_token");
    setLoading(true);
    try {
      const orderRes = await axios.post("http://127.0.0.1:8000/api/payments/create-order/", 
        { amount, payment_type: paymentType.toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const { order_id, key_id, user_details } = orderRes.data;
      const options = {
        key: key_id,
        amount: amount * 100,
        currency: "INR",
        name: "Mahal Connect",
        description: `${paymentType} Payment`,
        order_id: order_id,
        handler: async (response) => {
          try {
            await axios.post("http://127.0.0.1:8000/api/payments/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` }});
            Swal.fire("Success", "Payment Successful!", "success");
            navigate("/paymentHistory");
          } catch {
            Swal.fire("Error", "Payment verification failed.", "error");
          }
        },
        prefill: { name: user_details.name, email: user_details.email },
        theme: { color: "#064e3b" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      Swal.fire("Error", "Could not initiate payment.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCashSubmission = async () => {
    setLoading(true);
    const token = localStorage.getItem("access_token");
    try {
      await axios.post("http://127.0.0.1:8000/api/payments/", {
        payment_type: paymentType.toUpperCase(),
        amount: amount,
        method: "CASH",
        num_students: paymentType === "Madrassa Fee" ? numStudents : null
      }, { headers: { Authorization: `Bearer ${token}` }});
      Swal.fire("Request Logged", "Please visit the office with the cash.", "success");
      navigate("/paymentHistory");
    } catch {
      Swal.fire("Error", "Could not process request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-wrapper">
      <Topbar />
      <div className="payment-container mb-5 pb-5 animate-fade-in">
        <div className="amount-hero-section">
          <div className="hero-header-nav">
            <button className="premium-back-btn" onClick={() => navigate("/")}>
              <ArrowLeft size={22} />
            </button>
            <span className="hero-title-text">Payment Portal</span>
          </div>
          <div className="amount-display-box">
            <p className="amount-subtext">Total Amount to Pay</p>
            <h1 className="amount-main-value">
              <IndianRupee size={28} className="rupee-icon" />
              {amount || "0"}
            </h1>
          </div>
        </div>

        <div className="px-3 pt-3">
          <section className="mb-4">
            <h2 className="premium-label">Contribution Category</h2>
            <div className="type-pill-grid">
              {paymentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setPaymentType(type.title);
                    if (type.title !== "Madrassa Fee") {
                      setAmount(type.price > 0 ? type.price : "");
                    }
                  }}
                  className={`type-pill-item ${paymentType === type.title ? "active" : ""}`}
                >
                  <span className="pill-head">{type.title}</span>
                  <span className="pill-price-text">
                    {type.title === "Madrassa Fee" ? `₹${dynamicPrices.madrassa}/std` : (type.price > 0 ? `₹${type.price}` : "Custom")}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Redesigned Student Count Selector */}
          {paymentType === "Madrassa Fee" && (
            <section className="mb-4 slide-in-bottom">
              <h2 className="premium-label">Number of Students</h2>
              <div className="premium-input-container">
                <div className="input-icon-box">
                  <Users size={20} />
                </div>
                <select 
                  className="premium-styled-input"
                  value={numStudents}
                  onChange={(e) => setNumStudents(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Student{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <ChevronRight size={18} className="select-arrow" />
              </div>
              <div className="input-info-hint">
                <Info size={14} />
                <span>Auto-calculated: ₹{dynamicPrices.madrassa} × {numStudents}</span>
              </div>
            </section>
          )}

          {/* Redesigned Custom Amount Field */}
          {(paymentType === "Zakat" || paymentType === "Sadaqah") && (
            <section className="mb-4 slide-in-bottom">
              <h2 className="premium-label">Enter Custom Amount</h2>
              <div className="premium-input-container">
                <div className="input-icon-box amount-icon">
                  <IndianRupee size={20} />
                </div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="premium-styled-input"
                />
              </div>
              <p className="input-info-hint">Please enter a valid amount for {paymentType}</p>
            </section>
          )}

          <section className="mb-4">
            <h2 className="premium-label">Select Payment Method</h2>
            <div className="method-card-stack">
              {methods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.title)}
                  className={`method-selection-card ${paymentMethod === method.title ? "active" : ""}`}
                >
                  <div className="method-card-left">
                    <div className="method-icon-bg">{method.icon}</div>
                    <div className="method-info">
                      <p className="m-name">{method.title}</p>
                      <p className="m-detail">{method.detail}</p>
                    </div>
                  </div>
                  <div className="method-card-right">
                    {paymentMethod === method.title ? <CheckCircle2 size={20} className="check-active" /> : <ChevronRight size={18} className="chevron-muted" />}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="payment-footer-action">
            <button 
              className="confirm-pay-btn shadow-lg" 
              disabled={loading || !amount}
              onClick={paymentMethod === "Digital Payment" ? handleRazorpayPayment : handleCashSubmission}
            >
              {loading ? "Processing..." : paymentMethod === "Digital Payment" ? `Pay Online ₹${amount}` : `Confirm Cash Log`}
            </button>
          </div>
        </div>
      </div>
      <Floatingnav />
    </div>
  );
};

export default PaymentPage;