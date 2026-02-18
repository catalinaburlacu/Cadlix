import React, { useCallback, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import "../home/Home.css";
import "./History.css";

function formatWatchDate(value) {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
}

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mainNavItems = [
    { id: "dashboard", label: "Dashboard", icon: "bx-grid-alt", path: "/home" },
    { id: "explore", label: "Explore", icon: "bx-compass", path: "/explore" },
    { id: "favorites", label: "Favorites", icon: "bx-heart", path: "#favorites" },
    { id: "history", label: "History", icon: "bx-history", path: "/history" },
  ];

  const settingsNavItems = [
    { id: "settings", label: "Settings", icon: "bx-cog", path: "#settings" },
    { id: "help", label: "Help & Support", icon: "bx-help-circle", path: "#help" },
  ];

  const historyEntries = user?.watchHistory || [];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const isActiveRoute = (path) => {
    if (path.startsWith("#")) return false;
    return location.pathname === path;
  };

  const renderNavItem = (item) => {
    const className = `nav-item ${isActiveRoute(item.path) ? "active" : ""}`;
    if (item.path.startsWith("#")) {
      return (
        <a href={item.path} role="menuitem" className={className} tabIndex={sidebarOpen ? 0 : -1}>
          <div className="nav-icon-wrapper">
            <i className={`bx ${item.icon}`}></i>
          </div>
          <span className="nav-label">{item.label}</span>
          {isActiveRoute(item.path) && <div className="active-indicator"></div>}
        </a>
      );
    }

    return (
      <NavLink to={item.path} role="menuitem" className={className} tabIndex={sidebarOpen ? 0 : -1}>
        <div className="nav-icon-wrapper">
          <i className={`bx ${item.icon}`}></i>
        </div>
        <span className="nav-label">{item.label}</span>
        {isActiveRoute(item.path) && <div className="active-indicator"></div>}
      </NavLink>
    );
  };

  return (
    <div className="home-page history-page">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`} aria-label="Main navigation" aria-expanded={sidebarOpen}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bx bxs-videos"></i>
          </div>
          <span className="brand-text">Cadlix</span>
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar">
            <i className="bx bx-chevron-left"></i>
          </button>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              <img
                src={user.avatar || "https://via.placeholder.com/40"}
                alt={user.username}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
              <span className={`user-status status-${user.status?.toLowerCase() || "online"}`}></span>
            </div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.group || "Member"}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Menu</span>
            <ul className="nav-list" role="menubar">
              {mainNavItems.map((item) => (
                <li key={item.id} role="none">
                  {renderNavItem(item)}
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-divider"></div>
          <div className="nav-section">
            <span className="nav-section-title">System</span>
            <ul className="nav-list" role="menubar">
              {settingsNavItems.map((item) => (
                <li key={item.id} role="none">
                  {renderNavItem(item)}
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="footer-action" onClick={() => navigate("/profile")} tabIndex={sidebarOpen ? 0 : -1}>
            <div className="nav-icon-wrapper">
              <i className="bx bx-user"></i>
            </div>
            <span className="nav-label">My Profile</span>
          </button>

          <button
            className="footer-action logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
            tabIndex={sidebarOpen ? 0 : -1}
          >
            <div className="nav-icon-wrapper">
              <i className={`bx ${isLoggingOut ? "bx-loader-alt bx-spin" : "bx-log-out"}`}></i>
            </div>
            <span className="nav-label">{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <header className="navbar">
          <div className="navbar-content">
            <div className="navbar-left">
              <button
                className="menu-btn"
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
                aria-expanded={sidebarOpen}
              >
                <i className="bx bx-menu"></i>
              </button>
              <h1 className="history-heading">Watch History</h1>
            </div>
          </div>
        </header>

        <div className="page-content history-content">
          <section className="history-intro">
            <h2>Viewed Movies, Anime and Series</h2>
            <p>Track what you watched, which series/episode, and the exact viewing moment.</p>
          </section>

          <section className="history-list" aria-label="Viewing history">
            {historyEntries.length === 0 ? (
              <div className="history-empty">
                <i className="bx bx-history"></i>
                <p>No watch history yet.</p>
              </div>
            ) : (
              historyEntries.map((entry) => (
                <article key={entry.id} className="history-card">
                  <div className="history-main">
                    <h3>{entry.title}</h3>
                    <span className={`history-type history-type--${entry.category.toLowerCase()}`}>
                      {entry.category}
                    </span>
                  </div>
                  <div className="history-meta">
                    <p><strong>Series:</strong> {entry.series || "-"}</p>
                    <p><strong>Episode:</strong> {entry.episode || "-"}</p>
                    <p><strong>Moment:</strong> {entry.progress || "-"}</p>
                    <p><strong>Watched At:</strong> {formatWatchDate(entry.watchedAt)}</p>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
