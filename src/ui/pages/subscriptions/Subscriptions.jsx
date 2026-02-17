import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import "./Subscriptions.css";

export default function Subscriptions() {
  const navigate = useNavigate();
  const { updateUser } = useUser();

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

      <h1 className="demo-title">Alege-ti Nivelul Tau</h1>

      <div className="pricing-table">
        {/* Genin - Free */}
        <div className="pricing-option genin">
          <h1>Genin</h1>
          <p className="subtitle">Nivel de incepator</p>
          <hr />
          <p>
            Acces la functiile de baza pentru a-ti incepe calatoria. Perfect
            pentru cei care exploreaza.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                Gratis <b>$0</b>
              </span>
            </div>
            <div className="back">
              <button
                className="button"
                onClick={() => {
                  try {
                    updateUser({ plan: "Genin" });
                  } catch (e) {}
                  navigate("/profile");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>Acces limitat</li>
              <li>Suport comunitar</li>
              <li>Fara statistici avansate</li>
            </ul>
          </div>
        </div>

        {/* Chunin - Medium */}
        <div className="pricing-option chunin">
          <h1>Chunin</h1>
          <p className="subtitle">Nivel mediu</p>
          <hr />
          <p>
            Acces la functiile avansate si mai multa flexibilitate. Ideal pentru
            profesionisti in dezvoltare.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                399 <b>$</b>
              </span>
            </div>
            <div className="back">
              <button
                className="button"
                onClick={() => navigate('/payment', { state: { plan: 'Chunin', price: 399 } })}
              >
                Upgrade Now
              </button>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>Acces complet</li>
              <li>Suport prioritar</li>
              <li>Statistici avansate</li>
            </ul>
          </div>
        </div>

        {/* Hokage - Premium */}
        <div className="pricing-option hokage">
          <h1>Hokage</h1>
          <p className="subtitle">Nivel suprem</p>
          <hr />
          <p>
            Putere maxima cu toate functiile si prioritatea suprema. Pentru cei
            care vor rezultate explozive.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                999 <b>$</b>
              </span>
            </div>
            <div className="back">
              <button
                className="button"
                onClick={() => navigate('/payment', { state: { plan: 'Hokage', price: 999 } })}
              >
                Become Hokage
              </button>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>Acces nelimitat</li>
              <li>Suport VIP 24/7</li>
              <li>Caracteristici exclusive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
