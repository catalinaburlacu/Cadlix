import { useNavigate } from 'react-router-dom'
import './OfflineFallback.css'

/**
 * Fallback page shown when user is offline
 * and tries to access uncached content
 */
export default function OfflineFallback() {
  const navigate = useNavigate()

  const handleRetry = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/home')
  }

  return (
    <div className="offline-fallback">
      <div className="offline-fallback__container">
        {/* Offline icon */}
        <div className="offline-fallback__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M1 1L23 23" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M16.72 11.06C17.55 11.37 18.34 11.81 19.07 12.37" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M5 12.55C7.2 10.86 9.82 10 12.5 10C13.06 10 13.61 10.04 14.15 10.11" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M1.42 9C4.16 7.18 7.3 6.21 10.5 6.2C12.21 6.2 13.89 6.49 15.5 7.05" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M8.53 16.11C9.27 15.66 10.12 15.41 11 15.41C13.5 15.41 15.5 17.42 15.5 19.91V20.5H8.5V19.91C8.5 19.14 8.69 18.38 9.04 17.71" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="offline-fallback__title">You're Offline</h1>
        
        <p className="offline-fallback__description">
          It looks like you've lost your internet connection. 
          Some features may be unavailable while offline.
        </p>

        <div className="offline-fallback__actions">
          <button 
            className="btn btn--primary btn--medium"
            onClick={handleRetry}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Try Again
          </button>

          <button 
            className="btn btn--ghost btn--medium"
            onClick={handleGoHome}
          >
            Go to Home
          </button>
        </div>

        <div className="offline-fallback__tips">
          <h2 className="offline-fallback__tips-title">What you can do:</h2>
          <ul className="offline-fallback__tips-list">
            <li>Check your Wi-Fi or mobile data connection</li>
            <li>Try refreshing the page</li>
            <li>Access previously viewed content from your history</li>
            <li>Wait for your connection to restore</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
