import React, { memo, useMemo, useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useUser } from "../../../../context/useUser.js";
import { useToast } from "../../../../hooks/useToast.js";
import { cadlixApi } from "../../../../api/cadlixApi.js";
import { mapLikeStatusDTO } from "../../../../api/mappers.js";
import Button from "../../../../components/common/Button.jsx";
import { SkeletonAvatar, SkeletonStats } from "../../../../components/common/Skeleton.jsx";

const TABS = [
  { id: "watching", label: "Watching" },
  { id: "planned", label: "Planned" },
  { id: "completed", label: "Completed" },
  { id: "dropped", label: "Dropped" },
  { id: "favorites", label: "Favorites" },
];

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

export default function ProfilePageFrame({ children, isEditPage, avatarOverride }) {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const toast = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);
  const [likeStatus, setLikeStatus] = useState(null);
  const [likeLoading, setLikeLoading] = useState(false);

  const profileAbout = user?.profileSettings?.about || "";
  const DEFAULT_AVATAR = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'default'}`;
  const visibleAvatar =
    avatarOverride || user?.avatar || DEFAULT_AVATAR;

  const statsData = useMemo(() => {
    if (!user) return [];
    return [
      { value: user.stats?.score || "0", label: "Score", icon: "bx-star", highlight: true },
      { value: user.stats?.titlesWatched || 0, label: "Titles Watched", icon: "bx-tv" },
      { value: user.stats?.comments || 0, label: "Comments", icon: "bx-comment" },
      { value: user.stats?.likesGiven || 0, label: "Likes Given", icon: "bx-heart" },
      { value: user.stats?.likesReceived || 0, label: "Likes Received", icon: "bx-like" },
      { value: user.stats?.hoursWatched || 0, label: "Hours Watched", icon: "bx-time" },
      { value: user.stats?.addedToList || 0, label: "In List", icon: "bx-list-plus" },
      { value: user.stats?.daysOnSite || 0, label: "Days Active", icon: "bx-calendar" },
    ];
  }, [user]);

  const handleLogout = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
      setIsLoading(false);
    }
  }, [logout, navigate, toast]);

  const handleDeleteProfile = React.useCallback(async () => {
    if (isDeleteLoading) return;

    const firstConfirm = window.confirm(
      "Esti sigur ca vrei sa iti stergi profilul? Aceasta actiune este permanenta."
    );
    if (!firstConfirm) return;

    const typedConfirmation = window.prompt(
      "Confirmare 2/2: scrie exact STERGE pentru a continua."
    );
    if ((typedConfirmation || "").trim().toUpperCase() !== "STERGE") {
      toast.error("Stergerea a fost anulata. Confirmarea nu a fost corecta.");
      return;
    }

    setIsDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      logout();
      toast.success("Profilul a fost sters definitiv.");
      navigate("/login");
    } catch {
      toast.error("Stergerea profilului a esuat.");
      setIsDeleteLoading(false);
    }
  }, [isDeleteLoading, logout, navigate, toast]);

  const profileUserId = Number(user?.id);
  const isOwnProfile = true;

  useEffect(() => {
    if (!profileUserId) return;
    let cancelled = false;
    setLikeLoading(true);
    cadlixApi.getLikeStatus(profileUserId)
      .then(mapLikeStatusDTO)
      .then(data => { if (!cancelled) setLikeStatus(data); })
      .catch(() => { if (!cancelled) setLikeStatus({ likeCount: 0, isLikedByCurrentUser: false }); })
      .finally(() => { if (!cancelled) setLikeLoading(false); });
    return () => { cancelled = true; };
  }, [profileUserId]);

  const handleToggleLike = useCallback(async () => {
    if (!profileUserId || isOwnProfile) return;
    setLikeLoading(true);
    try {
      const data = mapLikeStatusDTO(await cadlixApi.toggleLike(profileUserId));
      setLikeStatus(data);
    } catch { /* ignore */ }
    setLikeLoading(false);
  }, [profileUserId, isOwnProfile]);

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
        <nav className="profile-nav" aria-label="Profile navigation">
          <button className="back-btn" onClick={() => navigate("/home")}>
            <i className="bx bx-arrow-back" aria-hidden="true"></i>
            Back to Home
          </button>

          <div className="profile-nav-actions">
            <Button variant="secondary" size="small" onClick={() => navigate("/settings")}>
              <i className="bx bx-cog" aria-hidden="true"></i>
              Settings
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleLogout}
              isLoading={isLoading}
              disabled={isDeleteLoading}
            >
              <i className="bx bx-log-out" aria-hidden="true"></i>
              Logout
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={handleDeleteProfile}
              isLoading={isDeleteLoading}
              disabled={isLoading}
            >
              <i className="bx bx-trash" aria-hidden="true"></i>
              Delete Profile
            </Button>
          </div>
        </nav>

        <header className="profile-header">
          <div className="profile-header-left">
            <div className="avatar-container">
              <img
                className="avatar"
                src={visibleAvatar}
                alt={`${user.username}'s avatar`}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const seed = encodeURIComponent(user?.username || 'default');
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
                }}
              />
              <span
                className={`status-badge status-${user.status?.toLowerCase() || "online"}`}
                aria-label={`Status: ${user.status || "Online"}`}
              />
            </div>

            <div className="profile-header-info">
              <div className="username-row">
                <h1 className="username">{user.username}</h1>
                <button
                  className="plan-badge"
                  onClick={() => navigate("/subscriptions")}
                  title="Click to upgrade or manage your plan"
                >
                  {user.plan || "Basic"}
                </button>
                {likeStatus ? (
                  <button
                    className={`like-badge ${likeStatus.isLikedByCurrentUser ? "liked" : ""}`}
                    onClick={handleToggleLike}
                    disabled={isOwnProfile || likeLoading}
                    title={
                      isOwnProfile
                        ? `You have ${likeStatus.likeCount} likes`
                        : likeStatus.isLikedByCurrentUser
                          ? "Unlike this user"
                          : "Like this user"
                    }
                  >
                    <i className={`bx ${likeStatus.isLikedByCurrentUser ? "bxs-heart" : "bx-heart"}`} aria-hidden="true"></i>
                    <span>{likeStatus.likeCount}</span>
                  </button>
                ) : null}
              </div>
              <p className="user-email">{user.email}</p>
              {profileAbout ? (
                <p className="user-extra">
                  <strong>About:</strong> {profileAbout}
                </p>
              ) : null}
            </div>
          </div>

          <div className="profile-header-right">
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate(isEditPage ? "/profile/watching" : "/profile/edit")}
            >
              <i className="bx bx-edit" aria-hidden="true"></i>
              {isEditPage ? "Close Editor" : "Edit Profile"}
            </Button>
          </div>
        </header>

        {isEditPage ? children : null}

        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">
            User Statistics
          </h2>
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

        <nav className="tabs-container" aria-label="Content tabs">
          <div className="tabs" role="tablist">
            {TABS.map((tab) => (
              <NavLink
                key={tab.id}
                to={`/profile/${tab.id}`}
                role="tab"
                id={`tab-${tab.id}`}
                className={({ isActive }) => `tab${isActive ? " active" : ""}`}
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {!isEditPage ? children : null}
      </div>
    </div>
  );
}

ProfilePageFrame.propTypes = {
  children: PropTypes.node,
  isEditPage: PropTypes.bool,
  avatarOverride: PropTypes.string,
};

ProfilePageFrame.defaultProps = {
  children: null,
  isEditPage: false,
  avatarOverride: "",
};
