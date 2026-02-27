import PropTypes from 'prop-types'
import './PageLoader.css'

/**
 * Full-page loading component with skeleton UI
 * Used during route transitions and initial page loads
 */
export default function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-busy="true">
      <div className="page-loader__container">
        <div className="page-loader__logo">
          <span className="page-loader__logo-text">Cadlix</span>
        </div>

        <div className="page-loader__progress" aria-hidden="true">
          <div className="page-loader__progress-bar" />
        </div>

      </div>
    </div>
  )
}

PageLoader.propTypes = {
  message: PropTypes.string
}
