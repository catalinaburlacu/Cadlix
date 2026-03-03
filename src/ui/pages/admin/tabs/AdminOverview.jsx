import { ALL_USERS } from '../../../../mocks/admin.js'
import StatCards from '../components/StatCards.jsx'

export default function AdminOverview({ contentList, reports, onNavigateToTab, onSelectUser }) {
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
          <button className="admin-section-link" onClick={() => onNavigateToTab('users')}>
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
                <tr key={u.id} className="admin-table-row--clickable" onClick={() => onSelectUser(u)}>
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
