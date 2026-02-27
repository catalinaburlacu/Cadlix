import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserProvider'
import { ToastProvider } from './components/common/Toast'
import ErrorBoundary from './components/common/ErrorBoundary'
import App from './App'

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
