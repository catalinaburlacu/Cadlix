import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import Button from '../../../components/common/Button.jsx'
import Input from '../../../components/common/Input.jsx'
import { useUser } from '../../../context/useUser.js'
import { useToast } from '../../../hooks/useToast.js'
import { CONTENT_GENRES as ALL_GENRES, CONTENT_TYPES as ALL_TYPES } from '../../../utils/constants.js'
import './Admin.css'

// ─── Static data ─────────────────────────────────────────────────────────────

const ALL_USERS = [
  { id: 1, username: 'john_doe',   email: 'john@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-21', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe',   titlesWatched: 42,  reviewCount: 3, plan: 'Pro' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-19', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith', titlesWatched: 18,  reviewCount: 2, plan: 'Free' },
  { id: 3, username: 'carlos_m',   email: 'carlos@example.com', role: 'user',  status: 'Inactive', joined: '2026-02-15', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos_m',   titlesWatched: 67,  reviewCount: 1, plan: 'Free' },
  { id: 4, username: 'anya_k',     email: 'anya@example.com',   role: 'user',  status: 'Active',   joined: '2026-02-10', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anya_k',     titlesWatched: 24,  reviewCount: 2, plan: 'Pro' },
  { id: 5, username: 'dev_user',   email: 'dev@cadlix.com',     role: 'admin', status: 'Active',   joined: '2025-01-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev_user',   titlesWatched: 250, reviewCount: 0, plan: 'Admin' },
]

const INITIAL_CONTENT = [
  { id: 'c-1',  title: 'The Last of Us',         type: 'tv',           genre: 'Drama',      year: 2023, score: 9.2, status: 'Published' },
  { id: 'c-2',  title: 'Oppenheimer',             type: 'movie',        genre: 'Drama',      year: 2023, score: 8.9, status: 'Published' },
  { id: 'c-3',  title: 'Severance',               type: 'tv',           genre: 'Thriller',   year: 2022, score: 8.7, status: 'Published' },
  { id: 'c-4',  title: 'Dune: Part Two',          type: 'movie',        genre: 'Sci-Fi',     year: 2024, score: 8.5, status: 'Published' },
  { id: 'c-5',  title: 'Planet Earth III',        type: 'documentary',  genre: 'Nature',     year: 2023, score: 9.0, status: 'Published' },
  { id: 'c-6',  title: 'The Bear',                type: 'tv',           genre: 'Drama',      year: 2022, score: 8.6, status: 'Published' },
  { id: 'c-7',  title: 'Poor Things',             type: 'movie',        genre: 'Fantasy',    year: 2023, score: 8.0, status: 'Draft' },
  { id: 'c-8',  title: 'Shogun',                  type: 'miniseries',   genre: 'Historical', year: 2024, score: 8.7, status: 'Published' },
]

const INITIAL_REVIEWS = [
  { id: 'r-1', user: 'john_doe',   title: 'The Last of Us',  rating: 10, text: 'Absolutely masterful storytelling, the best show of the decade.', date: '2026-02-20' },
  { id: 'r-2', user: 'jane_smith', title: 'Oppenheimer',     rating: 9,  text: 'A breathtaking cinematic experience. Nolan at his best.', date: '2026-02-18' },
  { id: 'r-3', user: 'carlos_m',   title: 'Severance',       rating: 8,  text: 'Creepy and brilliant. The world-building is incredible.', date: '2026-02-15' },
  { id: 'r-4', user: 'anya_k',     title: 'The Bear',        rating: 9,  text: 'Stressful but so good. Felt every second of it.', date: '2026-02-12' },
  { id: 'r-5', user: 'john_doe',   title: 'Dune: Part Two',  rating: 8,  text: 'Visually stunning epic. Timothée Chalamet carries it.', date: '2026-02-10' },
  { id: 'r-6', user: 'jane_smith', title: 'Poor Things',     rating: 7,  text: 'Weird and wonderful in equal measure.', date: '2026-02-08' },
]

const INITIAL_REPORTS = [
  { id: 'rep-1', reporter: 'john_doe',   target: 'carlos_m',                 targetType: 'user',    reason: 'Spam',          description: 'This user keeps posting spam links in comments.', date: '2026-02-21', status: 'Pending' },
  { id: 'rep-2', reporter: 'anya_k',     target: 'Poor Things — jane_smith', targetType: 'review',  reason: 'Inappropriate', description: 'The review contains offensive language and slurs.', date: '2026-02-19', status: 'Pending' },
  { id: 'rep-3', reporter: 'carlos_m',   target: 'john_doe',                 targetType: 'user',    reason: 'Harassment',    description: 'Sending threatening private messages repeatedly.', date: '2026-02-18', status: 'Resolved' },
  { id: 'rep-4', reporter: 'jane_smith', target: 'Shogun',                   targetType: 'content', reason: 'Wrong info',    description: 'The genre classification is incorrect, should be Drama not Historical.', date: '2026-02-17', status: 'Pending' },
  { id: 'rep-5', reporter: 'dev_user',   target: 'anya_k',                   targetType: 'user',    reason: 'Bot account',   description: 'Suspicious bot-like activity from this account.', date: '2026-02-16', status: 'Dismissed' },
  { id: 'rep-6', reporter: 'john_doe',   target: 'Planet Earth III',         targetType: 'content', reason: 'Duplicate',     description: 'This title already exists under a different name.', date: '2026-02-14', status: 'Pending' },
]

const CONTENT_TYPES = ALL_TYPES.filter(t => t.value !== '')
const CONTENT_GENRES = ALL_GENRES.filter(g => g.value !== '')

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'bx-grid-alt' },
  { id: 'users',    label: 'Users',    icon: 'bx-group' },
  { id: 'content',  label: 'Content',  icon: 'bx-film' },
  { id: 'reviews',  label: 'Reviews',  icon: 'bx-comment-detail' },
  { id: 'reports',  label: 'Reports',  icon: 'bx-flag' },
]

const EMPTY_FORM = { title: '', type: 'movie', genre: [], year: String(new Date().getFullYear()), score: '' }

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCards({ cards }) {
  return (
    <div className="admin-stats-grid">
      {cards.map(card => (
        <div key={card.label} className={`admin-stat-card admin-stat-card--${card.color}`}>
          <div className="admin-stat-icon">
            <i className={`bx ${card.icon}`} aria-hidden="true"></i>
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{card.value}</span>
            <span className="admin-stat-label">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ReportDetailModal({ report: rep, onClose, onResolve, onDismiss }) {
  if (!rep) return null
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--report" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Report #${rep.id}`}>
        <button className="admin-modal-close" onClick={onClose} aria-label="Close">
          <i className="bx bx-x"></i>
        </button>

        <div className="admin-report-modal-header">
          <div className="admin-report-modal-title-row">
            <i className="bx bx-flag admin-report-modal-icon" aria-hidden="true"></i>
            <h2 className="admin-report-modal-title">Report Details</h2>
          </div>
          <span className={`admin-report-status admin-report-status--${rep.status.toLowerCase()}`}>
            {rep.status}
          </span>
        </div>

        <div className="admin-report-modal-meta">
          <div className="admin-report-modal-row">
            <span className="admin-report-modal-label">Reporter</span>
            <span className="admin-report-modal-value">
              <i className="bx bx-user" aria-hidden="true"></i>
              {rep.reporter}
            </span>
          </div>
          <div className="admin-report-modal-row">
            <span className="admin-report-modal-label">Target</span>
            <span className="admin-report-modal-value">{rep.target}</span>
          </div>
          <div className="admin-report-modal-row">
            <span className="admin-report-modal-label">Target Type</span>
            <span className="admin-type-badge">{rep.targetType}</span>
          </div>
          <div className="admin-report-modal-row">
            <span className="admin-report-modal-label">Reason</span>
            <span className="admin-report-modal-value admin-report-modal-reason">{rep.reason}</span>
          </div>
          <div className="admin-report-modal-row">
            <span className="admin-report-modal-label">Date</span>
            <span className="admin-report-modal-value">{rep.date}</span>
          </div>
        </div>

        <div className="admin-report-modal-desc-block">
          <span className="admin-report-modal-label">Description</span>
          <p className="admin-report-modal-desc">{rep.description}</p>
        </div>

        {rep.status === 'Pending' && (
          <div className="admin-report-modal-actions">
            <button
              className="admin-report-modal-btn admin-report-modal-btn--resolve"
              onClick={() => { onResolve(rep.id); onClose() }}
            >
              <i className="bx bx-check" aria-hidden="true"></i>
              Mark as Resolved
            </button>
            <button
              className="admin-report-modal-btn admin-report-modal-btn--dismiss"
              onClick={() => { onDismiss(rep.id); onClose() }}
            >
              <i className="bx bx-x" aria-hidden="true"></i>
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function UserProfileModal({ user: u, onClose }) {
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user } = useUser()
  const toast = useToast()

  const [searchParams, setSearchParams] = useSearchParams()
  const VALID_TABS = ['overview', 'users', 'content', 'reviews', 'reports']
  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'overview'
  function setActiveTab(id) { setSearchParams({ tab: id }, { replace: true }) }

  // Users state
  const [userSearch, setUserSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  // Content state
  const [contentList, setContentList] = useState(INITIAL_CONTENT)
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  // Reviews state
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)

  // Reports state
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [selectedReport, setSelectedReport] = useState(null)

  // ── Content handlers ──

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleGenreToggle(value) {
    setForm(prev => ({
      ...prev,
      genre: prev.genre.includes(value)
        ? prev.genre.filter(g => g !== value)
        : [...prev.genre, value],
    }))
  }

  function handleAddContent(e) {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (form.genre.length === 0) { toast.error('Select at least one genre'); return }
    const score = parseFloat(form.score)
    if (form.score && (isNaN(score) || score < 0 || score > 10)) {
      toast.error('Score must be between 0 and 10'); return
    }
    const newItem = {
      id: `c-${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      genre: form.genre.map(v => CONTENT_GENRES.find(g => g.value === v)?.label ?? v).join(', '),
      year: parseInt(form.year) || new Date().getFullYear(),
      score: form.score ? score : null,
      status: 'Draft',
    }
    setContentList(prev => [newItem, ...prev])
    setForm(EMPTY_FORM)
    setShowAddForm(false)
    toast.success(`"${newItem.title}" added successfully`)
  }

  function handleDeleteContent(id, title) {
    setContentList(prev => prev.filter(c => c.id !== id))
    toast.info(`"${title}" removed`)
  }

  function handleToggleStatus(id, currentStatus) {
    const next = currentStatus === 'Published' ? 'Draft' : 'Published'
    setContentList(prev => prev.map(c => c.id === id ? { ...c, status: next } : c))
    toast.success(`Status changed to "${next}"`)
  }

  // ── Review handlers ──

  function handleDeleteReview(id) {
    setReviews(prev => prev.filter(r => r.id !== id))
    toast.info('Review deleted')
  }

  // ── Report handlers ──

  function handleResolveReport(id) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r))
    toast.success('Report marked as resolved')
  }

  function handleDismissReport(id) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Dismissed' } : r))
    toast.info('Report dismissed')
  }

  // ── Render tabs ──

  function renderOverview() {
    const activeUsers = ALL_USERS.filter(u => u.status === 'Active').length
    const pendingReports = reports.filter(r => r.status === 'Pending').length
    const statCards = [
      { label: 'Total Users',     value: ALL_USERS.length,   icon: 'bx-group',  color: 'blue' },
      { label: 'Active Users',    value: activeUsers,        icon: 'bx-pulse',  color: 'green' },
      { label: 'Content Titles',  value: contentList.length, icon: 'bx-film',   color: 'purple' },
      { label: 'Reports Pending', value: pendingReports,     icon: 'bx-flag',   color: 'red' },
    ]
    return (
      <>
        <StatCards cards={statCards} />
        <div className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent Users</h2>
            <button className="admin-section-link" onClick={() => setActiveTab('users')}>
              View all <i className="bx bx-chevron-right"></i>
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {ALL_USERS.map(u => (
                  <tr key={u.id} className="admin-table-row--clickable" onClick={() => setSelectedUser(u)}>
                    <td className="admin-table-id">{u.id}</td>
                    <td className="admin-table-username">{u.username}</td>
                    <td className="admin-table-email">{u.email}</td>
                    <td>
                      <span className={`admin-role-badge admin-role-badge--${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span className={`admin-status-dot admin-status-dot--${u.status.toLowerCase()}`}>{u.status}</span>
                    </td>
                    <td className="admin-table-date">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }

  function renderUsers() {
    const q = userSearch.trim().toLowerCase()
    const filtered = q
      ? ALL_USERS.filter(u =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        )
      : ALL_USERS

    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Users</h2>
          <span className="admin-section-count">{filtered.length} of {ALL_USERS.length}</span>
        </div>

        <div className="admin-search-bar">
          <i className="bx bx-search admin-search-icon" aria-hidden="true"></i>
          <input
            className="admin-search-input"
            type="search"
            placeholder="Search by username or email…"
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            aria-label="Search users"
          />
          {userSearch && (
            <button className="admin-search-clear" onClick={() => setUserSearch('')} aria-label="Clear search">
              <i className="bx bx-x"></i>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="bx bx-search-alt" aria-hidden="true"></i>
            <p>No users match "{userSearch}"</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th><th>Username</th><th>Email</th><th>Role</th><th>Plan</th><th>Status</th><th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr
                    key={u.id}
                    className="admin-table-row--clickable"
                    onClick={() => setSelectedUser(u)}
                    title="View profile"
                  >
                    <td className="admin-table-id">{u.id}</td>
                    <td>
                      <div className="admin-user-cell">
                        <img className="admin-user-avatar" src={u.avatar} alt={u.username} />
                        <span className="admin-table-username">{u.username}</span>
                      </div>
                    </td>
                    <td className="admin-table-email">{u.email}</td>
                    <td>
                      <span className={`admin-role-badge admin-role-badge--${u.role}`}>{u.role}</span>
                    </td>
                    <td className="admin-table-email">{u.plan}</td>
                    <td>
                      <span className={`admin-status-dot admin-status-dot--${u.status.toLowerCase()}`}>{u.status}</span>
                    </td>
                    <td className="admin-table-date">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  function renderContent() {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Content Library</h2>
          <Button variant="primary" size="small" onClick={() => setShowAddForm(v => !v)}>
            <i className={`bx ${showAddForm ? 'bx-x' : 'bx-plus'}`} aria-hidden="true"></i>
            {showAddForm ? 'Cancel' : 'Add Content'}
          </Button>
        </div>

        {/* Add form */}
        {showAddForm && (
          <form className="admin-add-form" onSubmit={handleAddContent}>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field--wide">
                <label className="admin-form-label">Title *</label>
                <Input
                  name="title"
                  placeholder="Enter title"
                  value={form.title}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Type</label>
                <select className="admin-form-select" name="type" value={form.type} onChange={handleFormChange}>
                  {CONTENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-field admin-form-field--wide">
                <label className="admin-form-label">
                  Genre <span className="admin-form-label-hint">(select one or more)</span>
                </label>
                <div className="admin-genre-grid">
                  {CONTENT_GENRES.map(g => (
                    <label
                      key={g.value}
                      className={`admin-genre-chip${form.genre.includes(g.value) ? ' selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={form.genre.includes(g.value)}
                        onChange={() => handleGenreToggle(g.value)}
                      />
                      {g.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Year</label>
                <Input
                  name="year"
                  type="number"
                  placeholder="2024"
                  value={form.year}
                  onChange={handleFormChange}
                />
              </div>

              <div className="admin-form-field">
                <label className="admin-form-label">Score (0–10)</label>
                <Input
                  name="score"
                  type="number"
                  placeholder="8.5"
                  step="0.1"
                  min="0"
                  max="10"
                  value={form.score}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="admin-form-actions">
              <Button variant="primary" type="submit">
                <i className="bx bx-check" aria-hidden="true"></i>
                Save Content
              </Button>
              <Button variant="ghost" type="button" onClick={() => { setShowAddForm(false); setForm(EMPTY_FORM) }}>
                Discard
              </Button>
            </div>
          </form>
        )}

        {/* Content table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th><th>Type</th><th>Genre</th><th>Year</th><th>Score</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentList.map(item => (
                <tr key={item.id}>
                  <td className="admin-table-username">{item.title}</td>
                  <td>
                    <span className="admin-type-badge">{item.type}</span>
                  </td>
                  <td className="admin-table-email">{item.genre}</td>
                  <td className="admin-table-date">{item.year}</td>
                  <td>
                    {item.score != null
                      ? <span className="admin-score-val"><i className="bx bxs-star"></i>{item.score}</span>
                      : <span className="admin-table-email">—</span>
                    }
                  </td>
                  <td>
                    <button
                      className={`admin-content-status admin-content-status--${item.status.toLowerCase()} admin-status-toggle`}
                      onClick={() => handleToggleStatus(item.id, item.status)}
                      title={item.status === 'Published' ? 'Click to set Draft' : 'Click to Publish'}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDeleteContent(item.id, item.title)}
                      aria-label={`Delete ${item.title}`}
                      title="Delete"
                    >
                      <i className="bx bx-trash" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {contentList.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-table-empty">No content entries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function renderReviews() {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">User Reviews</h2>
          <span className="admin-section-count">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
        </div>

        {reviews.length === 0 ? (
          <div className="admin-empty">
            <i className="bx bx-comment-x" aria-hidden="true"></i>
            <p>No reviews to show.</p>
          </div>
        ) : (
          <div className="admin-reviews-list">
            {reviews.map(r => (
              <div key={r.id} className="admin-review-card">
                <div className="admin-review-header">
                  <div className="admin-review-meta">
                    <span className="admin-review-user">
                      <i className="bx bx-user" aria-hidden="true"></i>
                      {r.user}
                    </span>
                    <span className="admin-review-title">on <em>{r.title}</em></span>
                    <span className="admin-review-date">{r.date}</span>
                  </div>
                  <div className="admin-review-right">
                    <span className="admin-review-rating">
                      <i className="bx bxs-star" aria-hidden="true"></i>
                      {r.rating}/10
                    </span>
                    <button
                      className="admin-delete-btn"
                      onClick={() => handleDeleteReview(r.id)}
                      aria-label="Delete review"
                      title="Delete review"
                    >
                      <i className="bx bx-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
                <p className="admin-review-text">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function renderReports() {
    const pending = reports.filter(r => r.status === 'Pending').length
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">User Reports</h2>
          <span className="admin-section-count">
            {pending} pending · {reports.length} total
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="admin-empty">
            <i className="bx bx-check-shield" aria-hidden="true"></i>
            <p>No reports to show.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reporter</th><th>Target</th><th>Type</th><th>Reason</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(rep => (
                  <tr key={rep.id} className="admin-table-row--clickable" onClick={() => setSelectedReport(rep)}>
                    <td className="admin-table-username">{rep.reporter}</td>
                    <td className="admin-table-email">{rep.target}</td>
                    <td>
                      <span className="admin-type-badge">{rep.targetType}</span>
                    </td>
                    <td className="admin-table-username" style={{ fontWeight: 500 }}>{rep.reason}</td>
                    <td className="admin-table-date">{rep.date}</td>
                    <td>
                      <span className={`admin-report-status admin-report-status--${rep.status.toLowerCase()}`}>
                        {rep.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-report-actions" onClick={e => e.stopPropagation()}>
                        {rep.status === 'Pending' && (
                          <>
                            <button
                              className="admin-action-btn admin-action-btn--resolve"
                              onClick={() => handleResolveReport(rep.id)}
                              title="Mark as resolved"
                              aria-label="Resolve report"
                            >
                              <i className="bx bx-check" aria-hidden="true"></i>
                            </button>
                            <button
                              className="admin-action-btn admin-action-btn--dismiss"
                              onClick={() => handleDismissReport(rep.id)}
                              title="Dismiss report"
                              aria-label="Dismiss report"
                            >
                              <i className="bx bx-x" aria-hidden="true"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderers = {
    overview: renderOverview,
    users:    renderUsers,
    content:  renderContent,
    reviews:  renderReviews,
    reports:  renderReports,
  }

  return (
    <SidebarLayout>
      <div className="admin-page">

        {/* Header */}
        <div className="admin-header">
          <div className="admin-title-block">
            <i className="bx bx-shield-quarter admin-page-icon" aria-hidden="true"></i>
            <div>
              <h1 className="admin-page-title">Admin Panel</h1>
              <p className="admin-page-subtitle">
                Logged in as <strong>{user?.username}</strong> · {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`admin-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bx ${tab.icon}`} aria-hidden="true"></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active tab content */}
        {renderers[activeTab]?.()}

      </div>

      {/* User profile modal */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onResolve={handleResolveReport}
          onDismiss={handleDismissReport}
        />
      )}

    </SidebarLayout>
  )
}
