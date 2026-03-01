import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import { useUser } from '../../../context/useUser.js'
import './Admin.css'

const STAT_CARDS = [
  { label: 'Total Users',       value: '12,480', icon: 'bx-group',        color: 'blue' },
  { label: 'Active Sessions',   value: '3,241',  icon: 'bx-pulse',        color: 'green' },
  { label: 'Content Titles',    value: '8,720',  icon: 'bx-film',         color: 'purple' },
  { label: 'Reports Pending',   value: '14',     icon: 'bx-flag',         color: 'red' },
]

const RECENT_USERS = [
  { id: 1, username: 'john_doe',    email: 'john@example.com',  role: 'user',  status: 'Active',   joined: '2026-02-21' },
  { id: 2, username: 'jane_smith',  email: 'jane@example.com',  role: 'user',  status: 'Active',   joined: '2026-02-19' },
  { id: 3, username: 'carlos_m',    email: 'carlos@example.com', role: 'user', status: 'Inactive', joined: '2026-02-15' },
  { id: 4, username: 'anya_k',      email: 'anya@example.com',  role: 'user',  status: 'Active',   joined: '2026-02-10' },
  { id: 5, username: 'dev_user',    email: 'dev@cadlix.com',    role: 'admin', status: 'Active',   joined: '2025-01-01' },
]

export default function Admin() {
  const { user } = useUser()

  return (
    <SidebarLayout>
      <div className="admin-page">

        <div className="admin-header">
          <div className="admin-title-block">
            <i className="bx bx-shield-quarter admin-page-icon" aria-hidden="true"></i>
            <div>
              <h1 className="admin-page-title">Admin Panel</h1>
              <p className="admin-page-subtitle">Logged in as <strong>{user?.username}</strong> · {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="admin-stats-grid">
          {STAT_CARDS.map(card => (
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

        {/* Recent Users table */}
        <div className="admin-section">
          <h2 className="admin-section-title">Recent Users</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_USERS.map(u => (
                  <tr key={u.id}>
                    <td className="admin-table-id">{u.id}</td>
                    <td className="admin-table-username">{u.username}</td>
                    <td className="admin-table-email">{u.email}</td>
                    <td>
                      <span className={`admin-role-badge admin-role-badge--${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-dot admin-status-dot--${u.status.toLowerCase()}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="admin-table-date">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </SidebarLayout>
  )
}
