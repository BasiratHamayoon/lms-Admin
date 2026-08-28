import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
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
    return children;
  }

  return (
    <Navigate
      to="/signin"
      state={{ from: location.pathname }}
      replace
    />
  );
};

export default PrivateRoutes;