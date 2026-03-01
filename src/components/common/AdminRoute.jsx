import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/useUser.js';
import PropTypes from 'prop-types';

/**
 * AdminRoute - Wraps routes accessible only to users with role === 'admin'.
 * Unauthenticated users go to /login; authenticated non-admins go to /home.
 */
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useUser();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
