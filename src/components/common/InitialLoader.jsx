import './InitialLoader.css'

/**
 * Initial app loader shown before React hydrates
 * This is the first thing users see when loading the app
 */
export default function InitialLoader() {
  return (
    <div id="initial-loader" className="initial-loader">
      <div className="initial-loader__content">
        {/* Brand Logo */}
        <div className="initial-loader__brand">
          <div className="initial-loader__logo">
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
              />
              <path 
                d="M2 12L12 17L22 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="initial-loader__title">Cadlix</span>
        </div>

        {/* Loading spinner */}
        <div className="initial-loader__spinner" role="progressbar" aria-label="Loading application">
          <div className="initial-loader__spinner-ring"></div>
          <div className="initial-loader__spinner-ring initial-loader__spinner-ring--second"></div>
          <div className="initial-loader__spinner-ring initial-loader__spinner-ring--third"></div>
        </div>

        {/* Loading text */}
        <p className="initial-loader__text">Loading your experience...</p>
      </div>

      {/* Progress bar */}
      <div className="initial-loader__progress-container">
        <div className="initial-loader__progress-bar"></div>
      </div>
    </div>
  )
}
