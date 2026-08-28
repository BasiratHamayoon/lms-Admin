import { HeaderBar } from '@maincomponents/headerbar/HeaderBar';
import AppSidebar from '@maincomponents/sidebar/Index';
import { SidebarProvider, useSidebar } from '@maincomponents/sidebar/SidebarProvider';
import { Outlet } from 'react-router-dom';
import { useAppTranslation } from '../hooks/use-translation';
import { SIDEBAR_CONSTANTS } from '../data/Constants';

function DashboardLayoutContent() {
  const { isRTL } = useAppTranslation();
  const { open } = useSidebar();

  return (
    <div className={`flex h-screen w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} overflow-hidden`}>
      <AppSidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        // Changed from md: to lg:
        open ? (isRTL ? 'lg:pr-64' : 'lg:pl-64') : (isRTL ? 'lg:pr-20' : 'lg:pl-20')
      }`}>
        <HeaderBar />
        <main className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-900/50">
          <div className="p-4 md:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardLayoutContent />
    </SidebarProvider>
  );
}