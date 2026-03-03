export default function UserProfileModal({ user: u, onClose }) {
  if (!u) return null
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Profile: ${u.username}`}>
        <button className="admin-modal-close" onClick={onClose} aria-label="Close">
          <i className="bx bx-x"></i>
        </button>

        <div className="admin-profile-header">
          <img
            className="admin-profile-avatar"
            src={u.avatar}
            alt={u.username}
          />
          <div className="admin-profile-info">
            <div className="admin-profile-name-row">
              <span className="admin-profile-name">{u.username}</span>
              <span className={`admin-role-badge admin-role-badge--${u.role}`}>{u.role}</span>
            </div>
            <span className="admin-profile-email">{u.email}</span>
            <div className="admin-profile-badges">
              <span className={`admin-status-dot admin-status-dot--${u.status.toLowerCase()}`}>{u.status}</span>
              <span className="admin-profile-plan">{u.plan}</span>
            </div>
          </div>
        </div>

        <div className="admin-profile-stats">
          <div className="admin-profile-stat">
            <span className="admin-profile-stat-value">{u.titlesWatched}</span>
            <span className="admin-profile-stat-label">Titles Watched</span>
          </div>
          <div className="admin-profile-stat">
            <span className="admin-profile-stat-value">{u.reviewCount}</span>
            <span className="admin-profile-stat-label">Reviews</span>
          </div>
          <div className="admin-profile-stat">
            <span className="admin-profile-stat-value">{u.joined}</span>
            <span className="admin-profile-stat-label">Joined</span>
          </div>
        </div>
      </div>
    </div>
  )
}
