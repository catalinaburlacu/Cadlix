import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import "./Subscriptions.css";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [expandedPlan, setExpandedPlan] = useState(null);

  const plans = [
    {
      id: "genin",
      name: "Genin",
      subtitle: "Plan GRATIS",
      priceLabel: "FREE",
      priceValue: "$0",
      cta: "Get Started",
      onSelect: () => {
        try {
          updateUser({ plan: "Genin" });
        } catch (error) {
          console.error("Failed to update user plan:", error);
        }
        navigate("/profile");
      },
      features: [
        "Acces la o parte din catalog (filme/anime selectate)",
        "Calitate video 480p - 720p",
        "Reclame inainte si in timpul vizionarii",
        "1 dispozitiv conectat",
        "Subtitrari standard (RO/EN)",
        "Fara descarcare offline",
        "Fara episoade noi imediat la lansare",
        "Fara skip intro automat",
      ],
    },
    {
      id: "chunin",
      name: "Chunin",
      subtitle: "Plan MEDIU",
      priceLabel: "399",
      priceValue: "$",
      cta: "Upgrade Now",
      onSelect: () => navigate("/payment", { state: { plan: "Chunin", price: 399 } }),
      features: [
        "Acces complet la catalog (filme, seriale, anime)",
        "Calitate Full HD (1080p)",
        "Reclame reduse sau eliminate",
        "2 dispozitive simultan",
        "Episoade noi disponibile rapid dupa lansare",
        "Skip intro",
        "Creare liste personalizate",
        "Istoric de vizionare salvat",
        "Fara 4K",
        "Fara continut exclusiv",
      ],
    },
    {
      id: "hokage",
      name: "Hokage",
      subtitle: "Plan PREMIUM",
      priceLabel: "999",
      priceValue: "$",
      cta: "Become Hokage",
      onSelect: () => navigate("/payment", { state: { plan: "Hokage", price: 999 } }),
      features: [
        "Tot ce e in Plus",
        "4K Ultra HD",
        "Fara reclame",
        "4 dispozitive simultan",
        "Descarcare offline",
        "Acces anticipat la episoade (early access)",
        "Continut exclusiv (filme/anime doar pentru premium)",
        "Profiluri multiple (ex: Familie, Kids, Anime)",
        "Avataruri personalizate (anime-style)",
        "Badges speciale pe profil",
        "Suport prioritar",
      ],
    },
  ];

  const toggleDetails = (planId) => {
    setExpandedPlan((current) => (current === planId ? null : planId));
  };

  return (
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

              <div className="price">
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
  );
}
