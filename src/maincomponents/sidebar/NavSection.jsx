import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar
} from './SidebarProvider';
import { NavGroup } from './NavGroup';
import { useAppTranslation } from '../../hooks/use-translation';
import { ChevronDown } from 'lucide-react';

export function NavSection({ section }) {
  const { open, isRTL } = useSidebar();
  const { t } = useAppTranslation();
  const location = useLocation();

  // A section is a dropdown if it has a title.
  const isDropdown = !!section.title;

  // Check if any item in this section is the currently active page.
  const isSectionActive = section.items.some(item => location.pathname === item.url);

  // The dropdown is expanded if the section is active, or if the user has manually opened it.
  const [isExpanded, setIsExpanded] = useState(isSectionActive);

  // If the section is not a dropdown, render its items directly.
  if (!isDropdown) {
    return (
      <SidebarMenu>
        <NavGroup items={section.items} />
      </SidebarMenu>
    );
  }

  // If the main sidebar is collapsed, we still show the icons for sub-items.
  if (!open) {
     return (
        <SidebarMenu>
           <NavGroup items={section.items} />
        </SidebarMenu>
     )
  }

  const SectionIcon = section.icon;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isSectionActive && !isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-semibold"
        >
          {SectionIcon && <SectionIcon className="h-5 w-5 text-gray-500" />}
          <span className="flex-1">{t(`sidebar.${section.title}`)}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </SidebarMenuButton>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <SidebarMenuSub>
                <NavGroup items={section.items} />
              </SidebarMenuSub>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}