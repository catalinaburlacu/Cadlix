import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import "../home/Home.css";
import "./Explore.css";

const SIDEBAR_STORAGE_KEY = 'cadlix_sidebar_state';

const exploreCategories = [
  {
    id: "anime",
    title: "Anime",
    icon: "bx-tv",
    items: ["Shonen", "Seinen", "Fantasy", "Romance", "Slice of Life", "Sci-Fi"],
  },
  {
    id: "filme",
    title: "Filme",
    icon: "bx-movie-play",
    items: ["Actiune", "Drama", "Comedie", "Thriller", "Animatie", "Documentar"],
  },
  {
    id: "seriale",
    title: "Seriale",
    icon: "bx-camera-movie",
    items: ["Crime", "Mystery", "Adventure", "Comedy", "Historical", "Family"],
  },
  {
    id: "tara",
    title: "Dupa tara",
    icon: "bx-world",
    items: ["Japonia", "SUA", "Coreea", "Franta", "Spania", "UK"],
  },
  {
    id: "studio",
    title: "Dupa studiouri producatoare",
    icon: "bx-buildings",
    items: ["MAPPA", "Ufotable", "Bones", "Madhouse", "A24", "Warner Bros."],
  },
];

const carouselRows = [
  {
    id: "anime-action",
    title: "Anime - Action",
    items: [
      { title: "Attack on Titan", meta: "Anime" },
      { title: "Jujutsu Kaisen", meta: "Anime" },
      { title: "Demon Slayer", meta: "Anime" },
      { title: "My Hero Academia", meta: "Anime" },
      { title: "Bleach", meta: "Anime" },
      { title: "One Punch Man", meta: "Anime" },
      { title: "Chainsaw Man", meta: "Anime" },
      { title: "Solo Leveling", meta: "Anime" },
      { title: "Fullmetal Alchemist", meta: "Anime" },
      { title: "Mob Psycho 100", meta: "Anime" },
    ],
  },
  {
    id: "anime-romance",
    title: "Anime - Romance",
    items: [
      { title: "Your Name", meta: "Anime" },
      { title: "Horimiya", meta: "Anime" },
      { title: "Kaguya-sama", meta: "Anime" },
      { title: "Toradora", meta: "Anime" },
      { title: "Clannad", meta: "Anime" },
      { title: "Fruits Basket", meta: "Anime" },
      { title: "A Silent Voice", meta: "Anime" },
      { title: "Weathering With You", meta: "Anime" },
      { title: "Kimi ni Todoke", meta: "Anime" },
      { title: "ReLIFE", meta: "Anime" },
    ],
  },
  {
    id: "filme-action",
    title: "Filme - Action",
    items: [
      { title: "Mad Max Fury Road", meta: "Film" },
      { title: "John Wick", meta: "Film" },
      { title: "Gladiator", meta: "Film" },
      { title: "Top Gun Maverick", meta: "Film" },
      { title: "The Batman", meta: "Film" },
      { title: "The Dark Knight", meta: "Film" },
      { title: "Dune Part Two", meta: "Film" },
      { title: "Mission Impossible", meta: "Film" },
      { title: "The Matrix", meta: "Film" },
      { title: "Inception", meta: "Film" },
    ],
  },
  {
    id: "filme-drama",
    title: "Filme - Drama",
    items: [
      { title: "Interstellar", meta: "Film" },
      { title: "The Godfather", meta: "Film" },
      { title: "Fight Club", meta: "Film" },
      { title: "Whiplash", meta: "Film" },
      { title: "The Social Network", meta: "Film" },
      { title: "Parasite", meta: "Film" },
      { title: "La La Land", meta: "Film" },
      { title: "Forrest Gump", meta: "Film" },
      { title: "Joker", meta: "Film" },
      { title: "Oppenheimer", meta: "Film" },
    ],
  },
  {
    id: "seriale-crime",
    title: "Seriale - Crime",
    items: [
      { title: "Breaking Bad", meta: "Serial" },
      { title: "Mindhunter", meta: "Serial" },
      { title: "True Detective", meta: "Serial" },
      { title: "Narcos", meta: "Serial" },
      { title: "Ozark", meta: "Serial" },
      { title: "Peaky Blinders", meta: "Serial" },
      { title: "Better Call Saul", meta: "Serial" },
      { title: "Money Heist", meta: "Serial" },
      { title: "The Sopranos", meta: "Serial" },
      { title: "Fargo", meta: "Serial" },
    ],
  },
  {
    id: "seriale-scifi",
    title: "Seriale - Sci-Fi",
    items: [
      { title: "Dark", meta: "Serial" },
      { title: "Stranger Things", meta: "Serial" },
      { title: "The Expanse", meta: "Serial" },
      { title: "Severance", meta: "Serial" },
      { title: "Silo", meta: "Serial" },
      { title: "Westworld", meta: "Serial" },
      { title: "Black Mirror", meta: "Serial" },
      { title: "Foundation", meta: "Serial" },
      { title: "Lost in Space", meta: "Serial" },
      { title: "Altered Carbon", meta: "Serial" },
    ],
  },
];

export default function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const toast = useToast();
  
  // Initialize sidebar state from localStorage, default to closed
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : false;
    } catch {
      return false;
    }
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(() =>
    Object.fromEntries(carouselRows.map((row) => [row.id, 0]))
  );

  // Persist sidebar state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(sidebarOpen));
    } catch (error) {
      console.error('Failed to save sidebar state:', error);
    }
  }, [sidebarOpen]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

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

  useEffect(() => {
    const intervalRefs = [];
    const timeoutRefs = [];

    carouselRows.forEach((row, rowIndex) => {
      const startDelayMs = rowIndex * 2000;
      const rotationMs = 8000 + rowIndex * 1200;
      const stepSize = rowIndex % 2 === 0 ? 1 : 2;
      const timeoutId = setTimeout(() => {
        const intervalId = setInterval(() => {
          setCarouselIndex((prev) => ({
            ...prev,
            [row.id]: ((prev[row.id] ?? 0) + stepSize) % row.items.length,
          }));
        }, rotationMs);
        intervalRefs.push(intervalId);
      }, startDelayMs);

      timeoutRefs.push(timeoutId);
    });

    return () => {
      timeoutRefs.forEach((id) => clearTimeout(id));
      intervalRefs.forEach((id) => clearInterval(id));
    };
  }, []);

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

  const getVisibleItems = (items, start, count) => {
    return Array.from({ length: count }, (_, offset) => {
      const index = (start + offset) % items.length;
      return items[index];
    });
  };

  return (
    <div className="home-page explore-page">
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`} aria-label="Main navigation" aria-expanded={sidebarOpen}>
        <div className="sidebar-brand">
          <button 
            className="sidebar-brand-link"
            onClick={() => navigate('/home')}
            aria-label="Go to home page"
            title="Go to home"
          >
            <div className="brand-icon">
              <i className="bx bxs-videos"></i>
            </div>
            <span className="brand-text">Cadlix</span>
          </button>
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
              <h1 className="explore-heading">Explore by Categories</h1>
            </div>
          </div>
        </header>

        <div className="page-content explore-content">
          <section className="explore-intro">
            <h2>Cauta rapid continutul preferat</h2>
            <p>Toate titlurile sunt impartite pe categorii pentru filtrare rapida si organizare clara.</p>
          </section>

          <section className="explore-categories-grid">
            {exploreCategories.map((category) => (
              <article key={category.id} className="explore-category-card" id={category.id}>
                <div className="explore-card-head">
                  <div className="explore-card-icon">
                    <i className={`bx ${category.icon}`}></i>
                  </div>
                  <h3>{category.title}</h3>
                </div>

                <div className="explore-chip-list">
                  {category.items.map((item) => (
                    <button key={item} type="button" className="explore-chip">
                      {item}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </section>

          <section className="explore-carousel-section">
            <div className="explore-carousel-list">
              {carouselRows.map((row) => {
                const start = carouselIndex[row.id] ?? 0;
                const visibleItems = getVisibleItems(row.items, start, 4);

                return (
                  <article key={row.id} className="media-row">
                    <header className="media-row-header">
                      <h3>{row.title}</h3>
                    </header>

                    <div className="media-row-track">
                      {visibleItems.map((item, idx) => (
                        <div key={`${row.id}-${item.title}-${start}-${idx}`} className="media-card">
                          <div className="media-card-image"></div>
                          <div className="media-card-info">
                            <h4>{item.title}</h4>
                            <p>{item.meta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
