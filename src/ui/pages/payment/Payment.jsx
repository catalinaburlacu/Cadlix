import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import { useUser } from "../../../context/useUser.js";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan = "Genin", price = 0 } = location.state || {};

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const { updateUser } = useUser();

  const cleanPlan = (plan || "Genin")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();

  function handleCheckout() {
    if (!name || !cardNumber || !exp || !cvv) {
      alert("Complete all fields to proceed");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      try {
        updateUser({ plan: cleanPlan });
      } catch (error) {
        console.error("Failed to update user plan:", error);
      }
      setPaid(true);
    }, 1200);
  }

  if (paid) {
    return (
      <div className="payment-page">
        <div className="payment-header">
          <button className="payment-back-btn" onClick={() => navigate("/profile")}>
            <i className="bx bx-arrow-back payment-back-icon" aria-hidden="true"></i>
            <span className="payment-back-label">Back</span>
          </button>
        </div>

        <div className="paid-wrapper">
          <div className="container paid">
            <div className="left-side">
              <div className="card">
                <div className="card-line"></div>
                <div className="buttons"></div>
              </div>
              <div className="post">
                <div className="post-line"></div>
                <div className="screen">
                  <div className="dollar">{price ? `$${price}` : "$"}</div>
                </div>
                <div className="numbers"></div>
                <div className="numbers-line2"></div>
              </div>
            </div>
            <div className="right-side">
              <div className="new">{cleanPlan} - Paid</div>
              <svg viewBox="0 0 451.846 451.847" height="32" width="32" xmlns="http://www.w3.org/2000/svg" className="arrow"><path fill="#cfcfcf" d="M345.441 248.292L151.154 442.573c-12.359 12.365-32.397 12.365-44.75 0-12.354-12.354-12.354-32.391 0-44.744L278.318 225.92 106.409 54.017c-12.354-12.359-12.354-32.394 0-44.748 12.354-12.359 32.391-12.359 44.75 0l194.287 194.284c6.177 6.18 9.262 14.271 9.262 22.366 0 8.099-3.091 16.196-9.267 22.373z"></path></svg>
            </div>
          </div>

          <div className="paid-message">
            <h2>Plata reusita</h2>
            <p>Multumim! Ai achitat {price ? `$${price}` : "suma"} pentru planul {cleanPlan}.</p>
            <button className="primary-btn" onClick={() => navigate("/home")}>Mergi la Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <button className="payment-back-btn" onClick={() => navigate("/profile")}>
          <i className="bx bx-arrow-back payment-back-icon" aria-hidden="true"></i>
          <span className="payment-back-label">Back</span>
        </button>
      </div>

      <section className="add-card page">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="name" className="label">
            <span className="title">Card holder full name</span>
            <input
              className="input-field"
              type="text"
              name="input-name"
              title="Input title"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label htmlFor="serialCardNumber" className="label">
            <span className="title">Card Number</span>
            <input
              id="serialCardNumber"
              className="input-field"
              type="text"
              inputMode="numeric"
              name="input-name"
              title="Input title"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </label>

          <div className="split">
            <label htmlFor="ExDate" className="label">
              <span className="title">Expiry Date</span>
              <input
                id="ExDate"
                className="input-field"
                type="text"
                name="input-name"
                title="Expiry Date"
                placeholder="01/23"
                value={exp}
                onChange={(e) => setExp(e.target.value)}
              />
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title">CVV</span>
              <input
                id="cvv"
                className="input-field"
                type="password"
                name="cvv"
                title="CVV"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </label>
          </div>

          <input
            className="checkout-btn"
            type="button"
            value={processing ? "Processing..." : `Checkout ${price ? `$${price}` : ""}`}
            onClick={handleCheckout}
          />
        </form>
      </section>
    </div>
  );
}
