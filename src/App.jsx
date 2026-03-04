import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

const Login = lazy(() => import('@pages/login/Login'))
const Home = lazy(() => import('@pages/home/Home'))
const Explore = lazy(() => import('@pages/explore/Explore'))
const Profile = lazy(() => import('@pages/profile/Profile'))
const Subscriptions = lazy(() => import('@pages/subscriptions/Subscriptions'))
const Payment = lazy(() => import('@pages/payment/Payment'))
const History = lazy(() => import('@pages/history/History'))
const Trending = lazy(() => import('@pages/trending/Trending'))
const Settings = lazy(() => import('@pages/settings/Settings'))
const Admin = lazy(() => import('@pages/admin/Admin'))
const MovieDetails = lazy(() => import('@pages/movie/MovieDetails'))
const VideoPlayer = lazy(() => import('@pages/video/VideoPlayer'))

import ProtectedRoute from '@components/common/ProtectedRoute'
import AdminRoute from '@components/common/AdminRoute'
import PageLoader from '@components/common/PageLoader'

// Route configuration for better maintainability
const routes = {
  public: [
    { path: '/home', element: Home },
    { path: '/login', element: Login },
    { path: '/explore', element: Explore },
    { path: '/history', element: History },
    { path: '/trending', element: Trending },
    { path: '/movie/:id', element: MovieDetails },
    { path: '/watch/:id', element: VideoPlayer },
  ],
  protected: [
    { path: '/profile', element: Profile },
    { path: '/subscriptions', element: Subscriptions },
    { path: '/payment', element: Payment },
    { path: '/settings', element: Settings },
  ],
}

function App() {
  return (
    <ThemeProvider>
      <div className='app'>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {routes.public.map(({ path, element: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}

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

            <Route
              path='/admin'
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route path='/' element={<Navigate to='/home' replace />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  )
}

export default App
