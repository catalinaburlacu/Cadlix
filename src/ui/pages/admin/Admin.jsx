import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout.jsx'
import { useUser } from '../../../context/useUser.js'
import { useToast } from '../../../hooks/useToast.js'
import { INITIAL_CONTENT, INITIAL_REVIEWS, INITIAL_REPORTS, ADMIN_TABS as TABS } from '../../../mocks/admin.js'
import AdminOverview from './tabs/AdminOverview.jsx'
import AdminUsers from './tabs/AdminUsers.jsx'
import AdminContent from './tabs/AdminContent.jsx'
import AdminReviews from './tabs/AdminReviews.jsx'
import AdminReports from './tabs/AdminReports.jsx'
import UserProfileModal from './components/UserProfileModal.jsx'
import ReportDetailModal from './components/ReportDetailModal.jsx'
import './Admin.css'

const VALID_TABS = ['overview', 'users', 'content', 'reviews', 'reports']

export default function Admin() {
  const { user } = useUser()
  const toast = useToast()

  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'overview'
  function setActiveTab(id) { setSearchParams({ tab: id }, { replace: true }) }

  // Shared state
  const [contentList, setContentList] = useState(INITIAL_CONTENT)
  const [reviews, setReviews] = useState(INITIAL_REVIEWS)
  const [reports, setReports] = useState(INITIAL_REPORTS)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  // Report handlers kept here because the modal is rendered at this level
  function handleResolveReport(id) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r))
    toast.success('Report marked as resolved')
  }

  function handleDismissReport(id) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Dismissed' } : r))
    toast.info('Report dismissed')
  }

  const tabComponents = {
    overview: (
      <AdminOverview
        contentList={contentList}
        reports={reports}
        onNavigateToTab={setActiveTab}
        onSelectUser={setSelectedUser}
      />
    ),
    users: (
      <AdminUsers onSelectUser={setSelectedUser} />
    ),
    content: (
      <AdminContent contentList={contentList} setContentList={setContentList} />
    ),
    reviews: (
      <AdminReviews reviews={reviews} setReviews={setReviews} />
    ),
    reports: (
      <AdminReports
        reports={reports}
        onResolve={handleResolveReport}
        onDismiss={handleDismissReport}
        onSelectReport={setSelectedReport}
      />
    ),
  }

  return (
    <SidebarLayout>
      <div className="admin-page">

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

        {tabComponents[activeTab]}

      </div>

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
