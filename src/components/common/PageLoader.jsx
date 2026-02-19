import PropTypes from 'prop-types'
import './PageLoader.css'

/**
 * Full-page loading component with skeleton UI
 * Used during route transitions and initial page loads
 */
export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="page-loader__container">
        {/* Animated logo */}
        <div className="page-loader__logo">
          <div className="page-loader__logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M12 2L2 7L12 12L22 7L12 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2 17L12 22L22 17" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="page-loader__logo-path"
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="page-loader__logo-path page-loader__logo-path--delayed"
              />
            </svg>
          </div>
          <span className="page-loader__logo-text">Cadlix</span>
        </div>

        {/* Progress bar */}
        <div className="page-loader__progress" aria-hidden="true">
          <div className="page-loader__progress-bar" />
        </div>

        {/* Loading message */}
        <p className="page-loader__message">{message}</p>
      </div>

      {/* Screen reader only text */}
      <span className="sr-only">Loading page content, please wait</span>
    </div>
  )
}

PageLoader.propTypes = {
  message: PropTypes.string
}
