import { Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/modern-base.css'
import './App.css'

// Lazy load all page components for code splitting
const Login = lazy(() => import('@pages/login/Login'))
const Home = lazy(() => import('@pages/home/Home'))
const Explore = lazy(() => import('@pages/explore/Explore'))
const Profile = lazy(() => import('@pages/profile/Profile'))
const Subscriptions = lazy(() => import('@pages/subscriptions/Subscriptions'))
const Payment = lazy(() => import('@pages/payment/Payment'))
const History = lazy(() => import('@pages/history/History'))

// Eager load critical components
import ProtectedRoute from '@components/common/ProtectedRoute'
import PageLoader from '@components/common/PageLoader'

// Route configuration for better maintainability
const routes = {
  public: [
    { path: '/home', element: Home },
    { path: '/login', element: Login },
    { path: '/explore', element: Explore },
    { path: '/history', element: History }
  ],
  protected: [
    { path: '/profile', element: Profile },
    { path: '/subscriptions', element: Subscriptions },
    { path: '/payment', element: Payment }
  ]
}

function App() {
  const [isLogged, setLogged] = useState(false)
  return (
    <div className="app">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          {routes.public.map(({ path, element: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}

          {/* Protected routes */}
          {routes.protected.map(({ path, element: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              }
            />
          ))}

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
