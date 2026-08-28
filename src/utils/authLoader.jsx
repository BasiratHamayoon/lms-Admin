import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthVerified, setAuthFailed } from '@redux/slice/authSlice';
import { getAdminProfile } from '@redux/slice/settingSlice';
import { hasStoredTokens } from '@utils/localstorageutil';

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthChecked } = useSelector(state => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!hasStoredTokens()) {
        dispatch(setAuthFailed());
        return;
      }

      try {
        const result = await dispatch(getAdminProfile()).unwrap();
        dispatch(setAuthVerified({ adminData: result.adminData || result }));
      } catch (error) {
        console.error('Auth verification failed:', error);
        dispatch(setAuthFailed());
      }
    };

    if (!isAuthChecked) {
      verifyAuth();
    }
  }, [dispatch, isAuthChecked]);

  // Show loading while checking auth
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthLoader;