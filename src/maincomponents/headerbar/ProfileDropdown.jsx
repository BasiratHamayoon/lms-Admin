import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Settings, LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

import { useAppTranslation } from '../../hooks/use-translation';
import { ConfirmationModal } from '@maincomponents/modal/ConfirmationModal';
import { removeTokens } from '@utils/localstorageutil';
import { forceLogout } from '@redux/slice/authSlice';

const HR_ADMIN_DATA = {
  name: 'Admin User',
  email: 'admin@company.com',
  role: 'Admin',
  department: 'Human Resources',
  avatarUrl: '/avatars/01.png',
  joinDate: '2024-01-15'
};

export function ProfileDropdown() {
  const { t, isRTL, currentLanguage } = useAppTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const authState = useSelector(state => state.auth) || {};
  const adminData = authState.data || null;

  const langKey = currentLanguage === 'ar' ? 'ar' : 'en';
  const langBlock =
    adminData?.[langKey] || adminData?.en || adminData?.ar || {};
  const displayName = langBlock.firstName
    ? `${langBlock.firstName || ''} ${langBlock.lastName || ''}`.trim()
    : HR_ADMIN_DATA.name;

  const displayEmail = adminData?.email || HR_ADMIN_DATA.email;
  const displayRole =
    adminData?.role?.toUpperCase?.() || HR_ADMIN_DATA.role;

  const avatarUrl = HR_ADMIN_DATA.avatarUrl; 

  const initials = displayName
    ? displayName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
    : 'AD';

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);

    removeTokens();

    dispatch(forceLogout());
    sessionStorage.clear();

    toast.success(t('login.loggedOut'), {
      description: t('login.logoutSuccess')
    });

    setTimeout(() => {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      navigate('/signin', { replace: true });
    }, 500);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              isRTL ? 'ml-2' : 'mr-2'
            }`}
            aria-label={t('profile.adminUser')}
          >
            <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={`w-56 ${isRTL ? 'text-right' : 'text-left'} dark:bg-gray-800 dark:border-gray-700`}
          align={isRTL ? 'start' : 'end'}
          sideOffset={5}
        >
          {/* Profile Header */}
          <DropdownMenuLabel className="font-normal p-3 dark:bg-gray-800">
            <div
              className={`flex items-center gap-3 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${isRTL ? 'items-end' : ''}`}>
                <p className="text-sm font-semibold leading-none text-gray-900 dark:text-white">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400 mt-1">
                  {displayEmail}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {displayRole}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="dark:bg-gray-700" />

          {/* Menu Items */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleSettingsClick}
              className="cursor-pointer dark:hover:bg-gray-700"
            >
              <div
                className={`flex items-center w-full ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <Settings
                  className={`h-4 w-4 ${
                    isRTL ? 'ml-2' : 'mr-2'
                  } text-gray-500 dark:text-gray-400`}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {t('settings')}
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="dark:bg-gray-700" />

          {/* Logout Option */}
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-red-600 dark:text-red-400 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
          >
            <div
              className={`flex items-center ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              {isLoggingOut ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <LogOut
                  className={`h-4 w-4 ${
                    isRTL ? 'ml-2' : 'mr-2'
                  }`}
                />
              )}
              <span className={isRTL ? 'mr-2' : 'ml-2'}>
                {isLoggingOut ? t('common.loading') : t('common.logout')}
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        titleKey="login.confirmLogout"
        descriptionKey="login.logoutConfirmation"
        confirmTextKey="common.logout"
        cancelTextKey="common.cancel"
        isProcessing={isLoggingOut}
      />
    </>
  );
}