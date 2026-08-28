import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCircle, AlertCircle, Info, X, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';

export function NotificationDropdown({ notificationsEnabled = true, isRTL = false }) {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  // Initialize notifications with proper time format based on current language
  useEffect(() => {
    const initialNotifications = [
      {
        id: 1,
        type: 'success',
        title: t('dashboard.activities.newStudentRegistered', 'New Student Registered'),
        message: t('dashboard.activities.newStudentRegistered', 'New student registered') + ': John Doe ' + t('login.signingIn', 'registered for the Spring 2024 semester.'),
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: t('dashboard.courseCreated', 'Course Enrollment Deadline'),
        message: t('dashboard.courseCreated', 'Course enrollment for Computer Science ends in 2 days.'),
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: t('events.eventInfo', 'System Maintenance'),
        message: t('events.eventInfo', 'Scheduled maintenance this weekend from 2 AM to 4 AM.'),
        read: true
      },
      {
        id: 4,
        type: 'success',
        title: t('dashboard.activities.staffMemberAdded', 'Payment Received'),
        message: t('dashboard.activities.staffMemberAdded', 'Tuition fee payment received from Sarah Wilson.'),
        read: true
      }
    ];

    // Add time based on current language
    const notificationsWithTime = initialNotifications.map((notification, index) => {
      let timeText = '';
      if (isRTL) {
        // Arabic time strings
        const arabicTimes = ['قبل 5 دقائق', 'قبل ساعة', 'قبل ساعتين', 'قبل 3 ساعات'];
        timeText = arabicTimes[index] || 'قبل فترة';
      } else {
        // English time strings
        const englishTimes = ['5 min ago', '1 hour ago', '2 hours ago', '3 hours ago'];
        timeText = englishTimes[index] || 'A while ago';
      }
      return { ...notification, time: timeText };
    });

    setNotifications(notificationsWithTime);
  }, [t, isRTL]); // Re-run when language changes

  // Update times when language changes
  useEffect(() => {
    if (notifications.length > 0) {
      const updatedNotifications = notifications.map((notification, index) => {
        let timeText = '';
        if (isRTL) {
          const arabicTimes = ['قبل 5 دقائق', 'قبل ساعة', 'قبل ساعتين', 'قبل 3 ساعات'];
          timeText = arabicTimes[index] || 'قبل فترة';
        } else {
          const englishTimes = ['5 min ago', '1 hour ago', '2 hours ago', '3 hours ago'];
          timeText = englishTimes[index] || 'A while ago';
        }
        return { ...notification, time: timeText };
      });
      setNotifications(updatedNotifications);
    }
  }, [isRTL]); // Re-run when isRTL changes

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return isRTL ? 'border-r-green-500' : 'border-l-green-500';
      case 'warning':
        return isRTL ? 'border-r-yellow-500' : 'border-l-yellow-500';
      case 'info':
        return isRTL ? 'border-r-blue-500' : 'border-l-blue-500';
      default:
        return isRTL ? 'border-r-gray-500' : 'border-l-gray-500';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (!notificationsEnabled) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isRTL ? "start" : "end"} 
        className="w-80"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <DropdownMenuLabel className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="font-semibold">{t('common.notifications', 'Notifications')}</span>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className={`h-auto p-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${isRTL ? 'ml-1' : 'mr-1'}`}
              >
                {t('common.markAllAsRead', 'Mark all read')}
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllNotifications}
                className={`h-auto p-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Trash2 className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                {t('notifications.clearAll', 'Clear all')}
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div className="space-y-1 p-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg ${getTypeColor(notification.type)} ${
                    isRTL ? 'border-r-4' : 'border-l-4'
                  } ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-800' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className={`text-xs text-gray-500 mt-2 ${isRTL ? 'text-left' : 'text-right'}`}>
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    <div className={`flex space-x-1 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-green-100 dark:hover:bg-green-900/20"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-100 dark:hover:bg-red-900/20"
                        onClick={() => clearNotification(notification.id)}
                      >
                        <X className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">{t('notifications.noNotifications', 'No notifications')}</p>
              <p className="text-sm mt-1">{t('notifications.allCaughtUp', "You're all caught up!")}</p>
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
          {t('common.viewAll', 'View all notifications')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}