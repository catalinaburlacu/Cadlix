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

      <h1 className="demo-title">Choose Your Plan</h1>

      <div className="pricing-table">
        <div className="pricing-option genin">
          <h1>Genin</h1>
          <p className="subtitle">Plan GRATIS</p>
          <hr />
          <div className="price">
            <div className="front">
              <span className="price">
                FREE <b>$0</b>
              </span>
            </div>
            <div className="back">
              <button
                className="button"
                onClick={() => {
                  try {
                    updateUser({ plan: "Genin" });
                  } catch (error) {
                    console.error("Failed to update user plan:", error);
                  }
                  navigate("/profile");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="features">
            <h3 className="features-title">Ce include:</h3>
            <ul className="features-list">
              <li>Acces la o parte din catalog (filme/anime selectate)</li>
              <li>Calitate video 480p - 720p</li>
              <li>Reclame inainte si in timpul vizionarii</li>
              <li>1 dispozitiv conectat</li>
              <li>Subtitrari standard (RO/EN)</li>
              <li>Fara descarcare offline</li>
              <li>Fara episoade noi imediat la lansare</li>
              <li>Fara skip intro automat</li>
            </ul>
          </div>
        </div>

        <div className="pricing-option chunin">
          <h1>Chunin</h1>
          <p className="subtitle">Plan MEDIU</p>
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
            <h3 className="features-title">Ce include:</h3>
            <ul className="features-list">
              <li>Acces complet la catalog (filme, seriale, anime)</li>
              <li>Calitate Full HD (1080p)</li>
              <li>Reclame reduse sau eliminate</li>
              <li>2 dispozitive simultan</li>
              <li>Episoade noi disponibile rapid dupa lansare</li>
              <li>Skip intro</li>
              <li>Creare liste personalizate</li>
              <li>Istoric de vizionare salvat</li>
              <li>Fara 4K</li>
              <li>Fara continut exclusiv</li>
            </ul>
          </div>
        </div>

        <div className="pricing-option hokage">
          <h1>Hokage</h1>
          <p className="subtitle">Plan PREMIUM</p>
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
            <h3 className="features-title">Ce include:</h3>
            <ul className="features-list">
              <li>Tot ce e in Plus</li>
              <li>4K Ultra HD</li>
              <li>Fara reclame</li>
              <li>4 dispozitive simultan</li>
              <li>Descarcare offline</li>
              <li>Acces anticipat la episoade (early access)</li>
              <li>Continut exclusiv (filme/anime doar pentru premium)</li>
              <li>Profiluri multiple (ex: Familie, Kids, Anime)</li>
              <li>Avataruri personalizate (anime-style)</li>
              <li>Badges speciale pe profil</li>
              <li>Suport prioritar</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
