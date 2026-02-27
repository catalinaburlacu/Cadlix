import { useNavigate, NavLink } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import SidebarLayout from "../../../components/layout/SidebarLayout.jsx";
import "./Subscriptions.css";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    subtitle: "Plan GRATIS",
    price: "FREE",
    priceValue: "$0",
    buttonLabel: "Get Started",
    onClick: (navigate, updateUser) => {
      try { updateUser({ plan: "Basic" }); } catch { }
      navigate("/profile");
    },
    features: [
      "Acces la o parte din catalog (titluri selectate)",
      "Calitate video 480p - 720p",
      "Reclame inainte si in timpul vizionarii",
      "1 dispozitiv conectat",
      "Subtitrari standard (RO/EN)",
      "Fara descarcare offline",
      "Fara titluri noi imediat la lansare",
      "Fara skip intro automat",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    subtitle: "Plan MEDIU",
    price: "399",
    priceValue: "$",
    buttonLabel: "Upgrade Now",
    onClick: (navigate) => navigate("/payment", { state: { plan: "Standard", price: 399 } }),
    features: [
      "Acces complet la catalog (filme, seriale, documentare)",
      "Calitate Full HD (1080p)",
      "Reclame reduse sau eliminate",
      "2 dispozitive simultan",
      "Titluri noi disponibile rapid dupa lansare",
      "Skip intro",
      "Creare liste personalizate",
      "Istoric de vizionare salvat",
      "Fara 4K",
      "Fara continut exclusiv",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Plan PREMIUM",
    price: "999",
    priceValue: "$",
    buttonLabel: "Go Premium",
    onClick: (navigate) => navigate("/payment", { state: { plan: "Premium", price: 999 } }),
    features: [
      "Tot ce e in Standard",
      "4K Ultra HD",
      "Fara reclame",
      "4 dispozitive simultan",
      "Descarcare offline",
      "Acces anticipat la titluri noi (early access)",
      "Continut exclusiv doar pentru Premium",
      "Profiluri multiple (ex: Familie, Kids)",
      "Avataruri personalizate",
      "Badges speciale pe profil",
      "Suport prioritar",
    ],
  },
];

export default function Subscriptions() {
  const navigate = useNavigate();
  const { updateUser } = useUser();

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

  return (
    <SidebarLayout navbarContent={profileNav}>
      <div className="page-content subscriptions-content">
        <div className="pricing-table">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`pricing-option ${plan.id}`}>
              <h2 className="plan-name">{plan.name}</h2>
              <p className="subtitle">{plan.subtitle}</p>
              <hr />
              <div className="price">
                <div className="front">
                  <span className="price-display">
                    {plan.price} <b>{plan.priceValue}</b>
                  </span>
                </div>
                <div className="back">
                  <button
                    className="plan-btn"
                    onClick={() => plan.onClick(navigate, updateUser)}
                  >
                    {plan.buttonLabel}
                  </button>
                </div>
              </div>
              <div className="features">
                <h3 className="features-title">Ce include:</h3>
                <ul className="features-list">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  );
}
