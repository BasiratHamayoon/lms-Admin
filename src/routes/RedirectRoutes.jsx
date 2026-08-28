import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RedirectRoute = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isAuthChecked, data } = useSelector(state => state.auth);

  // Still checking auth - show nothing (AuthLoader handles this)
  if (!isAuthChecked) {
    return null;
  }

  const isAdmin =
    isLoggedIn &&
    data?.role &&
    data.role.toLowerCase() === 'admin';

  if (isAdmin) {
    // Redirect to where they came from or dashboard
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};

export default RedirectRoute;