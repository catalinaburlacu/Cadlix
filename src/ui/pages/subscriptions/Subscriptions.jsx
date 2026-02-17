import React from "react";
import { useNavigate } from "react-router-dom";
import "./Subscriptions.css";

export default function Subscriptions() {
  const navigate = useNavigate();

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
          title="Înapoi la profil"
        >
          <i className="material-icons">arrow_back</i>
          Înapoi
        </button>
      </div>

      <h1 className="demo-title">Alege-ți Nivelul Tău</h1>

      <div className="pricing-table">
        {/* Genin - Free */}
        <div className="pricing-option genin">
          <h1>Genin 🥷</h1>
          <p className="subtitle">Nivel de începător</p>
          <hr />
          <p>
            Acces la funcțiile de bază pentru a-ți începe călătoria. Perfect
            pentru cei care explorează.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                Gratis <b>$0</b>
              </span>
            </div>
            <div className="back">
              <a href="#" className="button">
                Get Started
              </a>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>✓ Acces limitat</li>
              <li>✓ Suport comunitar</li>
              <li>✗ Statistici avansate</li>
            </ul>
          </div>
        </div>

        {/* Chunin - Medium */}
        <div className="pricing-option chunin">
          <h1>Chunin ⚔️</h1>
          <p className="subtitle">Nivel mediu</p>
          <hr />
          <p>
            Acces la funcțiile avansate și mai multă flexibilitate. Ideal pentru
            profesioniști în dezvoltare.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                399 <b>$</b>
              </span>
            </div>
            <div className="back">
              <a href="#" className="button">
                Upgrade Now
              </a>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>✓ Acces complet</li>
              <li>✓ Suport prioritar</li>
              <li>✓ Statistici avansate</li>
            </ul>
          </div>
        </div>

        {/* Hokage - Premium */}
        <div className="pricing-option hokage">
          <h1>Hokage 👑</h1>
          <p className="subtitle">Nivel suprem</p>
          <hr />
          <p>
            Putere maximă cu toate funcțiile și prioritatea supremă. Pentru cei
            care vor rezultate explosive.
          </p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                999 <b>$</b>
              </span>
            </div>
            <div className="back">
              <a href="#" className="button">
                Become Hokage
              </a>
            </div>
          </div>
          <div className="features">
            <ul className="features-list">
              <li>✓ Acces nelimitat</li>
              <li>✓ Suport VIP 24/7</li>
              <li>✓ Caracteristici exclusive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
