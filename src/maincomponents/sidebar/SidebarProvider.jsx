import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Sheet, SheetContent } from '../components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Skeleton } from '../components/ui/skeleton';
import { PanelLeft, PanelRight } from 'lucide-react';
import useIsMobile from '../../hooks/useMobile';
import { useAppTranslation } from '../../hooks/use-translation';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SidebarContext = createContext(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within a SidebarProvider.');
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);
  const { isRTL } = useAppTranslation();
  
  const open = openProp || _open;

  const setOpen = useCallback(
    value => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) setOpenProp(openState);
      else _setOpen(openState);
    },
    [setOpenProp, open]
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile(open => !open) : setOpen(open => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      isRTL
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar, isRTL]
  );

  useEffect(() => {
    if (isMobile && openMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, openMobile]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          className={cn('flex min-h-svh w-full overflow-hidden', className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children, ...props }) {
  const { openMobile, setOpenMobile, isMobile, isRTL, open } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent 
          side={isRTL ? "right" : "left"} 
          className="w-64 p-0 bg-white dark:bg-gray-900 border-0"
        >
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 transition-all duration-300 ${
      open ? 'w-64' : 'w-20'
    } ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar, isRTL, open, isMobile } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        // This button is always visible, but the permanent sidebar it controls is not.
        // The `isMobile` check from the hook handles whether this button opens the Sheet or toggles the permanent bar.
        'flex items-center justify-center', 
        !isMobile && !open && 'mx-auto', 
        className
      )}
      {...props}
    >
      {isRTL ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarHeader({ children, className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div
      className={cn('flex flex-col gap-2 p-4', !open && 'items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarContent({ children, className, ...props }) {
  const { isRTL } = useSidebar();
  
  return (
    <div
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
        isRTL ? 'text-right' : 'text-left',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarFooter({ children, className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div
      className={cn('flex flex-col gap-2 p-4', !open && 'items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarRail() {
  return null;
}

function SidebarInset({ children, className, ...props }) {
  const { open, isRTL } = useSidebar();
  
  return (
    <main
      className={cn(
        'bg-background relative flex w-full flex-1 flex-col transition-all duration-300',
        open ? (isRTL ? 'lg:pr-64' : 'lg:pl-64') : (isRTL ? 'lg:pr-20' : 'lg:pl-20'),
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}

function SidebarInput({ className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div className={cn('px-4', !open && 'px-3')}>
      <Input
        className={cn('bg-background h-8 w-full shadow-none', !open && 'hidden', className)}
        {...props}
      />
    </div>
  );
}

function SidebarGroup({ children, className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div
      className={cn('relative flex w-full min-w-0 flex-col p-2', !open && 'items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarGroupLabel({ children, className, ...props }) {
  const { open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <div
      className={cn(
        'text-gray-500 dark:text-gray-400 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarGroupContent({ children, className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div
      className={cn('w-full text-sm', !open && 'flex flex-col items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarGroupAction({ children, className, ...props }) {
  const { open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <button
      className={cn(
        'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarMenu({ children, className, ...props }) {
  const { isRTL, open } = useSidebar();
  
  return (
    <ul
      className={cn('flex w-full min-w-0 flex-col gap-1', 
        !open && 'items-center',
        isRTL ? 'text-right' : 'text-left',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function SidebarMenuItem({ children, className, ...props }) {
  const { open } = useSidebar();
  
  return (
    <li
      className={cn('group/menu-item relative', !open && 'w-full flex justify-center', className)}
      {...props}
    >
      {children}
    </li>
  );
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  tooltip,
  className,
  children,
  ...props
}) {
  const { isMobile, state, isRTL, open } = useSidebar();

  const button = (
    <button
      data-active={isActive}
      className={cn(
        'flex items-center gap-3 rounded-lg p-3 text-sm outline-hidden hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 active:bg-gray-100 dark:active:bg-gray-800 disabled:pointer-events-none disabled:opacity-50',
        isActive 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 font-medium' 
          : 'text-gray-700 dark:text-gray-300',
        isRTL ? 'flex-row-reverse' : 'flex-row',
        !open ? 'justify-center w-12' : 'w-full',
        isRTL ? 'text-right' : 'text-left',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side={isRTL ? "left" : "right"} align="center" hidden={state !== 'collapsed' || isMobile}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarMenuAction({ children, className, ...props }) {
  const { open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <button
      className={cn(
        'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarMenuBadge({ children, className, ...props }) {
  const { open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <div
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  const { open } = useSidebar();
  
  return (
    <div
      className={cn('flex items-center gap-2 rounded-md px-2', 
        !open ? 'justify-center w-12 h-12' : 'h-8 w-full',
        className
      )}
      {...props}
    >
      {showIcon && <Skeleton className='size-4 rounded-md' />}
      {open && <Skeleton className='h-4 flex-1 rounded' />}
    </div>
  );
}

function SidebarMenuSub({ children, className, ...props }) {
  const { isRTL, open } = useSidebar();
  
  if (!open) return null;
  
  return (
    <ul
      className={cn(
        'border-gray-200 dark:border-gray-700 mx-3.5 flex min-w-0 flex-col gap-1 border-l px-2.5 py-0.5',
        isRTL ? 'border-r border-l-0 text-right' : 'border-l border-r-0 text-left',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

function SidebarMenuSubItem({ children, className, ...props }) {
  return (
    <li
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    >
      {children}
    </li>
  );
}

function SidebarMenuSubButton({
  isActive = false,
  className,
  children,
  ...props
}) {
  const { isRTL } = useSidebar();

  return (
    <button
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-sm outline-hidden transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
        isActive 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
          : 'text-gray-700 dark:text-gray-300',
        isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar
};