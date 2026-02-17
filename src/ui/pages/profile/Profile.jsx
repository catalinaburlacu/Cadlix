import React, { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/useUser.js";
import { useToast } from "../../../hooks/useToast.js";
import Button from "../../../components/common/Button.jsx";
import Input from "../../../components/common/Input.jsx";
import { SkeletonAvatar, SkeletonStats } from "../../../components/common/Skeleton.jsx";
import PropTypes from 'prop-types';
import "./Profile.css";

// Tab configuration - defined outside component to prevent recreation
const TABS = [
  { id: "watching", label: "Watching" },
  { id: "planned", label: "Planned" },
  { id: "completed", label: "Completed" },
  { id: "dropped", label: "Dropped" },
  { id: "favorites", label: "Favorites" }
];

// Memoized StatCard to prevent unnecessary re-renders
const StatCard = memo(function StatCard({ value, label, icon, highlight }) {
  return (
    <div className={`stat-card ${highlight ? "highlight" : ""}`}>
      <i className={`bx ${icon} stat-icon`} aria-hidden="true"></i>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
});

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  highlight: PropTypes.bool,
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("watching");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Memoized stats data to prevent recreation on every render
  const statsData = useMemo(() => {
    if (!user) return [];
    return [
      { value: user.stats?.rating || '0', label: 'Rating', icon: 'bx-star', highlight: true },
      { value: user.stats?.animeWatched || 0, label: 'Anime Watched', icon: 'bx-tv' },
      { value: user.stats?.comments || 0, label: 'Comments', icon: 'bx-comment' },
      { value: user.stats?.likesGiven || 0, label: 'Likes Given', icon: 'bx-heart' },
      { value: user.stats?.likesReceived || 0, label: 'Likes Received', icon: 'bx-like' },
      { value: user.stats?.hoursWatched || 0, label: 'Hours Watched', icon: 'bx-time' },
      { value: user.stats?.addedToList || 0, label: 'In List', icon: 'bx-list-plus' },
      { value: user.stats?.daysOnSite || 0, label: 'Days Active', icon: 'bx-calendar' },
    ];
  }, [user]);

  // Memoized tab change handler
  const handleTabChange = React.useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Handle logout
  const handleLogout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
      setIsLoading(false);
    }
  }, [logout, navigate, toast]);

  // Show loading state while user data loads
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header skeleton-profile-header">
            <div className="profile-header-left">
              <SkeletonAvatar size="large" />
              <div className="profile-header-info">
                <div className="skeleton-text skeleton-text--title" />
                <div className="skeleton-text skeleton-text--subtitle" />
              </div>
            </div>
          </div>
          <SkeletonStats count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Navigation Bar */}
        <nav className="profile-nav" aria-label="Profile navigation">
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => navigate('/home')}
            className="back-btn"
          >
            <i className="bx bx-arrow-back" aria-hidden="true"></i>
            Back to Home
          </Button>
          
          <div className="profile-nav-actions">
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => toast.info('Settings coming soon!')}
            >
              <i className="bx bx-cog" aria-hidden="true"></i>
              Settings
            </Button>
            <Button 
              variant="ghost" 
              size="small"
              onClick={handleLogout}
              isLoading={isLoading}
            >
              <i className="bx bx-log-out" aria-hidden="true"></i>
              Logout
            </Button>
          </div>
        </nav>

        {/* Profile Header */}
        <header className="profile-header">
          <div className="profile-header-left">
            <div className="avatar-container">
              <img
                className="avatar"
                src={user.avatar || 'https://via.placeholder.com/120?text=Avatar'}
                alt={`${user.username}'s avatar`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/120?text=Avatar';
                }}
              />
              <span 
                className={`status-badge status-${user.status?.toLowerCase() || 'online'}`}
                aria-label={`Status: ${user.status || 'Online'}`}
              />
            </div>

            <div className="profile-header-info">
              <div className="username-row">
                <h1 className="username">{user.username}</h1>
                <span className="group-badge">{user.group || 'Member'}</span>
              </div>
              <p className="user-email">{user.email}</p>
            </div>
          </div>

          <div className="profile-header-right">
            <Button variant="primary" size="small">
              <i className="bx bx-edit" aria-hidden="true"></i>
              Edit Profile
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">User Statistics</h2>
          <div className="stats-grid">
            {statsData.map((stat) => (
              <StatCard 
                key={stat.label}
                value={stat.value} 
                label={stat.label}
                icon={stat.icon}
                highlight={stat.highlight}
              />
            ))}
          </div>
        </section>

        {/* Tabs */}
        <nav className="tabs-container" aria-label="Content tabs">
          <div className="tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Search and Filters */}
        <div className="filters-bar">
          <div className="search-container">
            <i className="bx bx-search search-icon" aria-hidden="true"></i>
            <Input
              type="search"
              placeholder="Search your list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search anime list"
            />
          </div>
          
          <div className="filter-selects">
            <select className="filter-select" aria-label="Filter by type">
              <option value="">All Types</option>
              <option value="tv">TV Series</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
            </select>
            
            <select className="filter-select" aria-label="Filter by genre">
              <option value="">All Genres</option>
              <option value="action">Action</option>
              <option value="adventure">Adventure</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>
            </select>
            
            <select className="filter-select" aria-label="Sort by">
              <option value="">Sort By</option>
              <option value="title">Title</option>
              <option value="score">Score</option>
              <option value="date">Date Added</option>
            </select>
          </div>
        </div>

        {/* Content Panel */}
        <div 
          className="content-panel"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <div className="anime-list">
            <div className="empty-state">
              <i className="bx bx-inbox empty-icon" aria-hidden="true"></i>
              <p className="empty-message">
                No entries found in {TABS.find(t => t.id === activeTab)?.label.toLowerCase()}
              </p>
              <Button variant="secondary" size="small">
                <i className="bx bx-plus" aria-hidden="true"></i>
                Add Anime
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
