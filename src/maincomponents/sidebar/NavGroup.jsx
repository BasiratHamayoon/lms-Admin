import { Link, useLocation } from 'react-router-dom';
import {
  SidebarMenuButton,
  SidebarMenuItem
} from './SidebarProvider';
import { useSidebar } from './SidebarProvider';
import { useAppTranslation } from '../../hooks/use-translation';
import { SIDEBAR_CONSTANTS } from '../../data/Constants';

export function NavGroup({ items }) {
  const { setOpenMobile, open, isRTL } = useSidebar();
  const location = useLocation();
  const { t } = useAppTranslation();
  const currentPath = location.pathname;

  return (
    <>
      {items.map((item) => {
        const isActive = currentPath === item.url;
        // When the main sidebar is open, sub-items have a different style.
        const useSubItemStyle = open && item.isSubItem; 

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={t(`sidebar.${item.title.toLowerCase()}`)}
            >
              <Link
                to={item.url}
                onClick={() => setOpenMobile(false)}
                className={`flex items-center gap-3 w-full ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {item.icon && (
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                )}
                {open && (
                  <span className={`flex-1 ${isActive ? 'font-medium' : ''}`}>
                    {t(`sidebar.${item.title.toLowerCase()}`)}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}