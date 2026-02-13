import React, { useState } from "react";
import "./Profile.css";

export default function Profile({ onBackHome }) {
  const [activeTab, setActiveTab] = useState("watching");

  const tabs = [
    { id: "watching", label: "Am vizionat" },
    { id: "planned", label: "În planuri" },
    { id: "completed", label: "Terminat" },
    { id: "dropped", label: "Abandonat" },
    { id: "favorites", label: "Favorite" }
  ];

  return (
    <div className="profile-page">
      <button className="btn-back" onClick={onBackHome}>← Înapoi acasă</button>
      
      <div className="profile-header">
        <div className="left-header">
          <img
            className="avatar"
            src="https://via.placeholder.com/120x120?text=Avatar"
            alt="avatar"
          />

          <div>
            <div className="username-row">
              <h1>Username</h1>
              <span className="online-badge">Offline</span>
            </div>

            <div className="group">
              Grup: <span className="group-badge">–</span>
            </div>
          </div>
        </div>

        <div className="right-header">
          <button className="btn gradient-pink">Meniu</button>
          <button className="btn gradient-blue">Setări</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard value="–" label="Rating" highlight />
        <StatCard value="–" label="Anime urmărit" />
        <StatCard value="–" label="Comentarii" />
        <StatCard value="–" label="Like-uri date" />
        <StatCard value="–" label="Like-uri primite" />
        <StatCard value="–" label="Ore urmărite" />
        <StatCard value="–" label="Adaugat in lista" />
        <StatCard value="–" label="Zile pe site" />
      </div>

      {/* TABS */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div className="filters">
        <input
          className="search"
          placeholder="Căutare..."
        />
        <select>
          <option>Tip</option>
        </select>
        <select>
          <option>Genuri</option>
        </select>
        <select>
          <option>Sortare</option>
        </select>
      </div>

      {/* ANIME LIST */}
      <div className="anime-list">
        <p className="empty-message">Nicio intrare</p>
      </div>
    </div>
  );
}

function StatCard({ value, label, highlight }) {
  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}
