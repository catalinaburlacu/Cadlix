import React, { useState } from "react";
import "./Home.css";

export default function Home({ onNavigateToProfile }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="home-container">
      {/* SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? "open" : "close"}`}>
        <div className="logo-details">
          <span className="logo_name">CadlixApp</span>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#dashboard">
              <i className="bx bx-grid-alt"></i>
              <span className="link_name">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#explore">
              <i className="bx bx-compass"></i>
              <span className="link_name">Explore</span>
            </a>
          </li>
          <li>
            <a href="#favorites">
              <i className="bx bx-heart"></i>
              <span className="link_name">Favorites</span>
            </a>
          </li>
          <li>
            <a href="#history">
              <i className="bx bx-history"></i>
              <span className="link_name">History</span>
            </a>
          </li>
          <li>
            <a href="#settings">
              <i className="bx bx-cog"></i>
              <span className="link_name">Settings</span>
            </a>
          </li>
        </ul>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-content">
          <button className="menu-btn" onClick={toggleSidebar}>
            <i className="bx bx-menu"></i>
          </button>

          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#trending">Trending</a></li>
            <li><a href="#anime">Anime</a></li>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#series">Series</a></li>
          </ul>

          <button className="btn-profile" onClick={onNavigateToProfile}>
            <i className="bx bx-user-circle"></i>
            Profile
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="home-content">
        <h1 className="home-title">Bine ați venit la Cadlix!</h1>
        <p className="home-subtitle">Gestionați-vă colecția de anime și urmăriți progresul</p>
      </div>
    </div>
  );
}
