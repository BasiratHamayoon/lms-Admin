// HeaderBar.jsx
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '../sidebar/SidebarProvider';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitch } from './ThemeSwitch';
import { useAppTranslation } from '../../hooks/use-translation';

// Map paths to translation keys
const getPageTitleKey = (pathname) => {
  const routes = {
    '/': 'header.dashboardOverview',
    '/staff': 'header.staffManagement',
    '/students': 'header.studentsManagement',
    '/departments': 'header.departmentsManagement',
    '/courses': 'header.coursesManagement',
    '/settings': 'header.systemSettings'
  };
  
  return routes[pathname] || 'header.lmsAdmin';
};

export function HeaderBar({ children }) {
  const location = useLocation();
  const { t, isRTL } = useAppTranslation();
  const currentPageTitleKey = getPageTitleKey(location.pathname);
  const currentPageTitle = t(currentPageTitleKey);
  
  // Get notification state from localStorage
  const notificationsEnabled = (() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  })();

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
      <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
        <SidebarTrigger className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200" />
        <div className="hidden sm:block">
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
            {currentPageTitle}
          </h1>
        </div>
      </div>

      {/* Right side - Icons and dropdowns */}
      <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}>
        <LanguageSwitcher />
        <ThemeSwitch />
        {/* Only show NotificationDropdown if notifications are enabled */}
        {/* <NotificationDropdown notificationsEnabled={notificationsEnabled} /> */}
        <ProfileDropdown />
      </div>
    </header>
  );
}