import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/useUser.js';
import PropTypes from 'prop-types';

/**
 * ProtectedRoute - A wrapper component that redirects unauthenticated users to login
 * Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, fallback = null }) {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to login, saving the attempted URL for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return fallback || children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};
