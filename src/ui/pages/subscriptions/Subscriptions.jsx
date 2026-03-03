import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import { PLANS_DATA } from "../../../mocks/subscriptions.js";
import "./Subscriptions.css";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [expandedPlan, setExpandedPlan] = useState(null);

  const plans = PLANS_DATA.map((planData) => ({
    ...planData,
    onSelect:
      planData.id === "free"
        ? () => {
            try {
              updateUser({ plan: "Free" });
            } catch (error) {
              console.error("Failed to update user plan:", error);
            }
            navigate("/profile");
          }
        : () => navigate("/payment", { state: { plan: planData.name, price: planData.price } }),
  }));

  const toggleDetails = (planId) => {
    setExpandedPlan((current) => (current === planId ? null : planId));
  };

  return (
    <SidebarLayout navbarContent={
      <nav className="page-subnav" aria-label="Account navigation">
        <NavLink to="/profile" end className={({ isActive }) => `page-subnav-link${isActive ? ' active' : ''}`}>
          Profile
        </NavLink>
        <NavLink to="/subscriptions" className={({ isActive }) => `page-subnav-link${isActive ? ' active' : ''}`}>
          Subscriptions
        </NavLink>
      </nav>
    }>
      <div className="subscriptions-container">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <div className="subscriptions-header">
          <button
            className="back-btn"
            onClick={() => navigate('/profile')}
            title="Inapoi la profil"
          >
            <i className="material-icons">arrow_back</i>
            Inapoi
          </button>
        </div>

        <h1 className="demo-title">Choose Your Plan</h1>

        <div className="pricing-table">
          {plans.map((plan) => {
            const isExpanded = expandedPlan === plan.id;

            return (
              <div key={plan.id} className={`pricing-option ${plan.id}${isExpanded ? " expanded" : ""}`}>
                <h1>{plan.name}</h1>
                <p className="subtitle">{plan.subtitle}</p>
                <hr />

                <div className="price-wrapper">
                  <div className="front">
                    <span className="price">
                      {plan.priceLabel} <b>{plan.priceValue}</b>
                    </span>
                  </div>
                </div>

                <button className="button" onClick={plan.onSelect}>
                  {plan.cta}
                </button>

                <button
                  className={`details-toggle${isExpanded ? " open" : ""}`}
                  onClick={() => toggleDetails(plan.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`plan-details-${plan.id}`}
                >
                  <span>Detalii plan</span>
                  <i className="material-icons" aria-hidden="true">keyboard_arrow_down</i>
                </button>

                <div
                  id={`plan-details-${plan.id}`}
                  className={`features-wrapper${isExpanded ? " open" : ""}`}
                >
                  <div className="features">
                    <h3 className="features-title">Ce include:</h3>
                    <ul className="features-list">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SidebarLayout>
  );
}
