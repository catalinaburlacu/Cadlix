import { useState } from 'react'
import { ALL_USERS } from '../../../../mocks/admin.js'

export default function AdminUsers({ onSelectUser }) {
  const [userSearch, setUserSearch] = useState('')

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
                  onClick={() => onSelectUser(u)}
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
