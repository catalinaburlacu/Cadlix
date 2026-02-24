import './styles/modern-base.css'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserProvider'
import { ToastProvider } from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'
import { registerSW } from 'virtual:pwa-register'
import App from './App'

// Register PWA service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // Show update notification toast
    if (confirm('New content available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  }
})

// Preconnect to external domains for performance
const preconnectDomains = [
  'https://api.dicebear.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
]

preconnectDomains.forEach(domain => {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = domain
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
})

// Create root with concurrent features
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <ToastProvider>
            <Suspense fallback={null}>
              <App />
            </Suspense>
          </ToastProvider>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
