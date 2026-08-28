import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail
} from './SidebarProvider';
import { NavSection } from './NavSection'; // Updated import
import { sidebarData } from '../../data/sidebar';
import { useSidebar } from './SidebarProvider';
import logo from '../../assets/sidebar/logo.png';
import { SIDEBAR_CONSTANTS } from '../../data/Constants';

function AppSidebar({ ...props }) {
  const { open, isRTL } = useSidebar();

  // Arabic text for the logo
  const logoText = {
    primary: isRTL ? "نظام إدارة التعلم" : SIDEBAR_CONSTANTS.LOGO.TEXT.EXPANDED.primary,
    secondary: isRTL ? "البوابة الإدارية" : SIDEBAR_CONSTANTS.LOGO.TEXT.EXPANDED.secondary
  };

  return (
    <Sidebar collapsible={SIDEBAR_CONSTANTS.COLLAPSIBLE.ICON} variant={SIDEBAR_CONSTANTS.VARIANTS.FLOATING} {...props}>
      <SidebarHeader>
        <div className={`flex items-center ${open ? 'justify-start gap-3' : 'justify-center'} p-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center justify-center overflow-hidden ${open ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <img 
              src={logo} 
              alt="LMS Logo" 
              className={`transition-all duration-300 ${open ? 'w-10 h-10' : 'w-10 h-10'} rounded-lg object-contain`}
            />
          </div>
          {open && (
            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {logoText.primary}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {logoText.secondary}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2"> {/* Added padding for better spacing */}
        {sidebarData.sections.map((section) => (
          <NavSection 
            key={section.id}
            section={section}
          />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;