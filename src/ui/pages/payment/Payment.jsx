import React, { useMemo, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "./Payment.css";
import { useUser } from "../../../context/useUser.js";

const ACCEPTED_ISSUERS = [
  { name: "ING Bank", icon: "ING" },
  { name: "Raiffeisen Bank", icon: "RIF" },
  { name: "CEC Bank", icon: "CEC" },
  { name: "BRD", icon: "BRD" },
  { name: "Banca Transilvania", icon: "BT" },
  { name: "BCR", icon: "BCR" },
  { name: "Revolut", icon: "REV" },
];

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan = "Basic", price = 0 } = location.state || {};

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errors, setErrors] = useState({});
  const { updateUser } = useUser();

  const cleanPlan = (plan || "Basic")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .trim();

  const CARD_SCHEMES = useMemo(
    () => [
      { name: "American Express", pattern: /^3[47]\d{13}$/, lengths: [15], cvvLengths: [4], luhn: true },
      { name: "Mastercard", pattern: /^(?:5[1-5]\d{14}|2(?:2[2-9]|[3-6]\d|7[01])\d{12}|2720\d{12})$/, lengths: [16], cvvLengths: [3], luhn: true },
      { name: "Visa", pattern: /^4\d{12}(?:\d{3})?(?:\d{3})?$/, lengths: [13, 16, 19], cvvLengths: [3], luhn: true },
      { name: "Discover", pattern: /^6(?:011\d{12}|5\d{14}|4[4-9]\d{13}|22(?:1[2-9]|[2-8]\d|9[01]|92[0-5])\d{10})$/, lengths: [16], cvvLengths: [3], luhn: true },
      { name: "Diners Club", pattern: /^3(?:0[0-5]|[68]\d)\d{11}$/, lengths: [14], cvvLengths: [3], luhn: true },
      { name: "JCB", pattern: /^(?:2131|1800|35\d{3})\d{11}$/, lengths: [15, 16], cvvLengths: [3], luhn: true },
      { name: "MIR", pattern: /^220[0-4]\d{12}$/, lengths: [16], cvvLengths: [3], luhn: true },
      { name: "UnionPay", pattern: /^62\d{14,17}$/, lengths: [16, 17, 18, 19], cvvLengths: [3], luhn: false },
      { name: "Maestro", pattern: /^(?:50\d{10,17}|5[6-9]\d{10,17}|6\d{11,18})$/, lengths: [12, 13, 14, 15, 16, 17, 18, 19], cvvLengths: [3], luhn: true },
    ],
    []
  );

  const digitsOnlyCard = cardNumber.replace(/\D/g, "");

  const detectedScheme = useMemo(() => {
    if (!digitsOnlyCard) return null;
    return (
      CARD_SCHEMES.find(
        (scheme) =>
          scheme.lengths.includes(digitsOnlyCard.length) &&
          scheme.pattern.test(digitsOnlyCard)
      ) || null
    );
  }, [CARD_SCHEMES, digitsOnlyCard]);

  function passesLuhn(number) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i -= 1) {
      let digit = Number(number[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  function isSimpleSequence(number) {
    if (number.length < 8) return false;
    let asc = true;
    let desc = true;
    for (let i = 1; i < number.length; i += 1) {
      const prev = Number(number[i - 1]);
      const cur = Number(number[i]);
      if (cur !== (prev + 1) % 10) asc = false;
      if (cur !== (prev + 9) % 10) desc = false;
    }
    return asc || desc;
  }

  function validateForm() {
    const nextErrors = {};
    const trimmedName = name.trim().replace(/\s+/g, " ");
    const digitsOnlyCvv = cvv.replace(/\D/g, "");
    const nameParts = trimmedName.split(" ").filter(Boolean);
    const namePartPattern = /^[\p{L}][\p{L}'-]{1,}$/u;

    if (nameParts.length < 2) {
      nextErrors.name = "Please enter a real full name (first name and last name).";
    } else if (
      nameParts.some((part) => part.length < 2 || !namePartPattern.test(part))
    ) {
      nextErrors.name = "Name must contain valid letters only and at least 2 characters per part.";
    } else if (/^(test|demo|fake|asdf)$/i.test(trimmedName.replace(/\s+/g, ""))) {
      nextErrors.name = "Please enter a real cardholder name.";
    }

    if (digitsOnlyCard.length < 13 || digitsOnlyCard.length > 19) {
      nextErrors.cardNumber = "Card number must have 13 to 19 digits.";
    } else if (/^(\d)\1+$/.test(digitsOnlyCard) || isSimpleSequence(digitsOnlyCard)) {
      nextErrors.cardNumber = "Card number is not valid.";
    }

    const scheme =
      CARD_SCHEMES.find(
        (item) =>
          item.lengths.includes(digitsOnlyCard.length) &&
          item.pattern.test(digitsOnlyCard)
      ) || null;

    if (!nextErrors.cardNumber && !scheme) {
      nextErrors.cardNumber = "Unsupported or invalid card network.";
    } else if (!nextErrors.cardNumber && scheme?.luhn && !passesLuhn(digitsOnlyCard)) {
      nextErrors.cardNumber = "Card checksum is invalid.";
    }

    if (!/^\d{2}\/\d{2}$/.test(exp.trim())) {
      nextErrors.exp = "Expiry date must be in MM/YY format.";
    } else {
      const [mm, yy] = exp.split("/").map(Number);
      const validMonth = mm >= 1 && mm <= 12;
      if (!validMonth) {
        nextErrors.exp = "Month must be between 01 and 12.";
      } else {
        const now = new Date();
        const expiryDate = new Date(2000 + yy, mm, 0, 23, 59, 59, 999);
        if (expiryDate < now) {
          nextErrors.exp = "Card expiry date is in the past.";
        } else {
          const maxFutureDate = new Date(now.getFullYear() + 20, now.getMonth(), now.getDate());
          if (expiryDate > maxFutureDate) {
            nextErrors.exp = "Expiry date is not realistic.";
          }
        }
      }
    }

    if (!/^\d{3,4}$/.test(digitsOnlyCvv)) {
      nextErrors.cvv = "CVV must have 3 or 4 digits.";
    } else if (scheme && !scheme.cvvLengths.includes(digitsOnlyCvv.length)) {
      nextErrors.cvv = `CVV for ${scheme.name} must have ${scheme.cvvLengths.join(" or ")} digits.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleCheckout() {
    if (!validateForm()) {
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

  const profileNav = (
    <nav className="nav-menu" aria-label="Profile navigation">
      <ul className="nav-menu-list">
        <li>
          <NavLink to="/profile" className={({ isActive }) => `nav-menu-link${isActive ? " active" : ""}`}>
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/subscriptions" className={({ isActive }) => `nav-menu-link${isActive ? " active" : ""}`}>
            Subscriptions
          </NavLink>
        </li>
      </ul>
    </nav>
  );

  if (paid) {
    return (
      <SidebarLayout navbarContent={profileNav}>
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
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout navbarContent={profileNav}>
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
              className={`input-field ${errors.name ? "input-field--error" : ""}`}
              type="text"
              name="input-name"
              title="Input title"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^\p{L}' -]/gu, "");
                setName(cleaned);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />
            {errors.name ? <span className="field-error">{errors.name}</span> : null}
          </label>

          <label htmlFor="serialCardNumber" className="label">
            <span className="title">Card Number</span>
            <input
              id="serialCardNumber"
              className={`input-field ${errors.cardNumber ? "input-field--error" : ""}`}
              type="text"
              inputMode="numeric"
              name="input-name"
              title="Input title"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 19);
                const groupSize = digits.startsWith("34") || digits.startsWith("37") ? 15 : 16;
                const clamped = digits.slice(0, groupSize === 15 ? 15 : 19);
                const formatted = clamped.replace(/(.{4})/g, "$1 ").trim();
                setCardNumber(formatted);
                if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: undefined }));
              }}
            />
            {errors.cardNumber ? <span className="field-error">{errors.cardNumber}</span> : null}
          </label>

          <div className="split">
            <label htmlFor="ExDate" className="label">
              <span className="title">Expiry Date</span>
              <input
                id="ExDate"
                className={`input-field ${errors.exp ? "input-field--error" : ""}`}
                type="text"
                name="input-name"
                title="Expiry Date"
                placeholder="MM/YY"
                value={exp}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                  setExp(formatted);
                  if (errors.exp) setErrors((prev) => ({ ...prev, exp: undefined }));
                }}
              />
              {errors.exp ? <span className="field-error">{errors.exp}</span> : null}
            </label>
            <label htmlFor="cvv" className="label">
              <span className="title">CVV</span>
              <input
                id="cvv"
                className={`input-field ${errors.cvv ? "input-field--error" : ""}`}
                type="text"
                name="cvv"
                title="CVV"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => {
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                  if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: undefined }));
                }}
              />
              {errors.cvv ? <span className="field-error">{errors.cvv}</span> : null}
            </label>
          </div>

          <div className="accepted-payments" aria-label="Accepted payment providers">
            <p className="accepted-title">Banci acceptate</p>
            <div className="accepted-issuer-list">
              {ACCEPTED_ISSUERS.map((issuer) => (
                <span key={issuer.name} className="accepted-chip" title={issuer.name}>
                  <span className="accepted-chip-icon" aria-hidden="true">{issuer.icon}</span>
                  <span className="accepted-chip-text">{issuer.name}</span>
                </span>
              ))}
            </div>
          </div>

          <input
            className="checkout-btn"
            type="button"
            value={processing ? "Processing..." : `Checkout ${price ? `$${price}` : ""}`}
            onClick={handleCheckout}
            disabled={processing}
          />
        </form>
      </section>
    </div>
    </SidebarLayout>
  );
}
