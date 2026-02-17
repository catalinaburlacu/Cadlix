import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import Button from "../../../components/common/Button.jsx";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const toast = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bx-grid-alt', path: '/home' },
    { id: 'explore', label: 'Explore', icon: 'bx-compass', path: '/explore' },
    { id: 'favorites', label: 'Favorites', icon: 'bx-heart', path: '#favorites' },
    { id: 'history', label: 'History', icon: 'bx-history', path: '#history' },
  ];

  const settingsNavItems = [
    { id: 'settings', label: 'Settings', icon: 'bx-cog', path: '#settings' },
    { id: 'help', label: 'Help & Support', icon: 'bx-help-circle', path: '#help' },
  ];

  const navItems = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'trending', label: 'Trending', href: '#trending' },
    { id: 'anime', label: 'Anime', href: '#anime' },
    { id: 'movies', label: 'Movies', href: '#movies' },
    { id: 'series', label: 'Series', href: '#series' },
  ];

  const isActiveRoute = (path) => {
    if (path.startsWith('#')) return false;
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    if (path.startsWith('#')) return;
    navigate(path);
  };

  return (
    <div className="home-page">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}
        aria-label="Main navigation"
        aria-expanded={sidebarOpen}
      >
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bx bxs-videos"></i>
          </div>
          <span className="brand-text">Cadlix</span>
          <button
            className="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
          >
            <i className="bx bx-chevron-left"></i>
          </button>
        </div>

        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              <img
                src={user.avatar || 'https://via.placeholder.com/40'}
                alt={user.username}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40';
                }}
              />
              <span className={`user-status status-${user.status?.toLowerCase() || 'online'}`}></span>
            </div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.group || 'Member'}</span>
            </div>
          </div>
        )}

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">Menu</span>
            <ul className="nav-list" role="menubar">
              {mainNavItems.map((item) => (
                <li key={item.id} role="none">
                  <a
                    href={item.path}
                    role="menuitem"
                    onClick={(e) => {
                      if (!item.path.startsWith('#')) {
                        e.preventDefault();
                        handleNavClick(item.path);
                      }
                    }}
                    className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                    tabIndex={sidebarOpen ? 0 : -1}
                  >
                    <div className="nav-icon-wrapper">
                      <i className={`bx ${item.icon}`}></i>
                    </div>
                    <span className="nav-label">{item.label}</span>
                    {isActiveRoute(item.path) && <div className="active-indicator"></div>}
                  </a>
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
                  <a
                    href={item.path}
                    role="menuitem"
                    className="nav-item"
                    tabIndex={sidebarOpen ? 0 : -1}
                  >
                    <div className="nav-icon-wrapper">
                      <i className={`bx ${item.icon}`}></i>
                    </div>
                    <span className="nav-label">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            className="footer-action"
            onClick={() => navigate('/profile')}
            tabIndex={sidebarOpen ? 0 : -1}
          >
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
              <i className={`bx ${isLoggingOut ? 'bx-loader-alt bx-spin' : 'bx-log-out'}`}></i>
            </div>
            <span className="nav-label">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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

              <nav className="nav-menu" aria-label="Category navigation">
                <ul className="nav-menu-list">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <a href={item.href} className="nav-menu-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="navbar-right">
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate('/profile')}
                className="profile-btn"
              >
                <i className="bx bx-user-circle" aria-hidden="true"></i>
                <span>Profile</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="page-content">
          <section className="hero-section">
            <h1 className="hero-title">Welcome to Cadlix!</h1>
            <p className="hero-subtitle">
              Manage your anime collection and track your progress
            </p>
            <div className="hero-actions">
              <Button variant="primary" size="large">
                Get Started
              </Button>
              <Button variant="ghost" size="large">
                Learn More
              </Button>
            </div>
          </section>

          <section className="content-section">
            <h2 className="section-title">Recently Added</h2>
            <div className="content-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="content-card">
                  <div className="content-card-image" />
                  <div className="content-card-info">
                    <h3 className="content-card-title">Anime Title {item}</h3>
                    <p className="content-card-meta">Action | Adventure</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
