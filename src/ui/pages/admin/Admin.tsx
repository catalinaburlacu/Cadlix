import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SidebarLayout from '../../../components/layout/SidebarLayout'
import { useUser } from '../../../context/useUser'
import { useToast } from '../../../hooks/useToast'
import {
  INITIAL_CONTENT,
  INITIAL_REVIEWS,
  INITIAL_REPORTS,
  ADMIN_TABS as TABS,
} from '../../../mocks/admin'
import type { ContentItem, ReviewItem, ReportItem, AdminUser } from '@/types'
import AdminOverview from './tabs/AdminOverview'
import AdminUsers from './tabs/AdminUsers'
import AdminContent from './tabs/AdminContent'
import AdminReviews from './tabs/AdminReviews'
import AdminReports from './tabs/AdminReports'
import UserProfileModal from './components/UserProfileModal'
import ReportDetailModal from './components/ReportDetailModal'
import './Admin.css'

const VALID_TABS = ['overview', 'users', 'content', 'reviews', 'reports']

export default function Admin() {
  const { user } = useUser()
  const toast = useToast()

  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab as string) ? rawTab : 'overview'
  function setActiveTab(id: string): void {
    setSearchParams({ tab: id }, { replace: true })
  }

  // Shared state
  const [contentList, setContentList] = useState<ContentItem[]>(INITIAL_CONTENT)
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS)
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_REPORTS)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)

  // Report handlers kept here because the modal is rendered at this level
  function handleResolveReport(id: string): void {
    setReports(prev => prev.map(r => (r.id === id ? { ...r, status: 'Resolved' } : r)))
    toast.success('Report marked as resolved')
  }

  function handleDismissReport(id: string): void {
    setReports(prev => prev.map(r => (r.id === id ? { ...r, status: 'Dismissed' } : r)))
    toast.info('Report dismissed')
  }

  const tabComponents: Record<string, React.ReactNode> = {
    overview: (
      <AdminOverview
        contentList={contentList}
        reports={reports}
        onNavigateToTab={setActiveTab}
        onSelectUser={setSelectedUser}
      />
    ),
    users: <AdminUsers onSelectUser={setSelectedUser} />,
    content: <AdminContent contentList={contentList} setContentList={setContentList} />,
    reviews: <AdminReviews reviews={reviews} setReviews={setReviews} />,
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
      <div className='admin-page'>
        <div className='admin-header'>
          <div className='admin-title-block'>
            <i className='bx bx-shield-quarter admin-page-icon' aria-hidden='true'></i>
            <div>
              <h1 className='admin-page-title'>Admin Panel</h1>
              <p className='admin-page-subtitle'>
                Logged in as <strong>{user?.username}</strong> · {user?.email}
              </p>
            </div>
          </div>
        </div>

        <div className='admin-tabs' role='tablist'>
          {TABS.map(tab => (
            <button
              key={tab.id}
              role='tab'
              aria-selected={activeTab === tab.id}
              className={`admin-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bx ${tab.icon}`} aria-hidden='true'></i>
              {tab.label}
            </button>
          ))}
        </div>

        {tabComponents[activeTab as string]}
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
