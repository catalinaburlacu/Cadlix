import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useUser } from '../../context/useUser.js'
import { useToast } from '../../hooks/useToast.js'
import '../../ui/pages/home/Home.css'
import Button from '../common/Button.jsx'

const SIDEBAR_STORAGE_KEY = 'cadlix_sidebar_state'

const MAIN_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bx-grid-alt', path: '/home' },
  { id: 'explore', label: 'Explore', icon: 'bx-compass', path: '/explore' },
  { id: 'favorites', label: 'Favorites', icon: 'bx-heart', path: '#favorites' },
  { id: 'history', label: 'History', icon: 'bx-history', path: '/history' },
]

const SETTINGS_NAV_ITEMS = [
  { id: 'settings', label: 'Settings', icon: 'bx-cog', path: '#settings' },
  { id: 'help', label: 'Help & Support', icon: 'bx-help-circle', path: '#help' },
]

function NavItem({ item }) {
  const location = useLocation()
  const isActive = !item.path.startsWith('#') && location.pathname === item.path
  const className = `nav-item ${isActive ? 'active' : ''}`

  if (item.path.startsWith('#')) {
    return (
      <a href={item.path} role='menuitem' className={className}>
        <div className='nav-icon-wrapper'>
          <i className={`bx ${item.icon}`}></i>
        </div>
        <span className='nav-label'>{item.label}</span>
      </a>
    )
  }

  return (
    <NavLink to={item.path} role='menuitem' className={className}>
      <div className='nav-icon-wrapper'>
        <i className={`bx ${item.icon}`}></i>
      </div>
      <span className='nav-label'>{item.label}</span>
      {isActive && <div className='active-indicator'></div>}
    </NavLink>
  )
}

/**
 * Shared layout component providing the sidebar + main content structure.
 * Handles sidebar state persistence, navigation, and logout.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Main page content
 * @param {string} [props.pageClass] - Additional CSS class for the page wrapper
 * @param {React.ReactNode} [props.navbarContent] - Content rendered in the top navbar
 */
export default function SidebarLayout({ children, pageClass = '', navbarContent }) {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  const toast = useToast()

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY)
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(sidebarOpen))
    } catch (error) {
      console.error('Failed to save sidebar state:', error)
    }
  }, [sidebarOpen])

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), [])

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Logout failed. Please try again.')
      setIsLoggingOut(false)
    }
  }, [logout, navigate, toast])

  return (
    <div className={`home-page ${pageClass}`}>
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}
        aria-label='Main navigation'
        aria-expanded={sidebarOpen}
      >
        <div className='sidebar-brand'>
          <button
            className='sidebar-brand-link'
            onClick={() => navigate('/home')}
            aria-label='Go to home page'
            title='Go to home'
          >
            <img src='/logo.svg' alt='Cadlix' className='brand-logo-icon' />
            <span className='brand-text'>Cadlix</span>
          </button>
        </div>

        <nav className='sidebar-nav'>
          <div className='nav-section'>
            <span className='nav-section-title'>Menu</span>
            <ul className='nav-list' role='menubar'>
              {MAIN_NAV_ITEMS.map(item => (
                <li key={item.id} role='none'>
                  <NavItem item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div className='nav-divider'></div>

          {sidebarOpen && (
            <div className='nav-section'>
              <span className='nav-section-title'>System</span>
              <ul className='nav-list' role='menubar'>
                {SETTINGS_NAV_ITEMS.map(item => (
                  <li key={item.id} role='none'>
                    <NavItem item={item} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        <div className='sidebar-footer'>
          <button className='footer-action logout' onClick={handleLogout} disabled={isLoggingOut}>
            <div className='nav-icon-wrapper'>
              <i className={`bx ${isLoggingOut ? 'bx-loader-alt bx-spin' : 'bx-log-out'}`}></i>
            </div>
            <span className='nav-label'>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <header className='navbar'>
          <div className='navbar-content'>
            <div className='navbar-left'>
              <button
                className='menu-btn'
                onClick={toggleSidebar}
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={sidebarOpen}
              >
                <i className='bx bx-menu'></i>
              </button>
              {navbarContent}
            </div>
            {user ? (
              <div className='navbar-right'>
                <button
                  className='navbar-user'
                  onClick={() => navigate('/profile')}
                  aria-label='Go to profile'
                >
                  <div className='user-avatar'>
                    <img
                      src={user.avatar || 'https://via.placeholder.com/40'}
                      alt={user.username}
                      onError={e => {
                        e.target.src = 'https://via.placeholder.com/40'
                      }}
                    />
                    <span
                      className={`user-status status-${user.status?.toLowerCase() || 'online'}`}
                    ></span>
                  </div>
                  <div className='user-info'>
                    <span className='user-name'>{user.username}</span>
                    <span className='user-plan'>{user.plan || 'Basic'}</span>
                  </div>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px'}}>
                <Button variant="primary" size="small" >Login</Button>
                <Button variant="primary" size="small" >Register</Button>
              </div>
            )}
          </div>
        </header>

        {children}
      </main>
    </div>
  )
}
