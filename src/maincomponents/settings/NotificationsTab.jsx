// NotificationsTab.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppTranslation } from '../../hooks/use-translation';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationsTab() {
  const { t, isRTL } = useAppTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get initial state from localStorage or default to true
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleToggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    // Save to localStorage for persistence
    localStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        newValue ? t('notifications.enabled') : t('notifications.disabled'),
        {
          description: newValue 
            ? t('notifications.enabledDesc') 
            : t('notifications.disabledDesc')
        }
      );
    }, 500);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t('notifications.saved'), {
        description: t('notifications.savedDesc')
      });
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG?.duration?.normal || 0.3 }}
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {t('settingsPage.notifications.tab')}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('notifications.controlPreferences')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800/50`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-lg ${notificationsEnabled 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5" />
                ) : (
                  <BellOff className="h-5 w-5" />
                )}
              </div>
              <div className={`flex-1 ${isRTL ? 'text-left' : ''}`}>
                <Label className="font-semibold text-gray-900 dark:text-white block mb-1">
                  {t('notifications.systemNotifications')}
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notificationsEnabled 
                    ? t('notifications.enabledStatus')
                    : t('notifications.disabledStatus')
                  }
                </p>
              </div>
            </div>
            
            {/* Custom RTL Switch Implementation */}
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRTL ? 'rtl-switch' : ''} ${
              notificationsEnabled 
                ? 'bg-purple-500' 
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
            onClick={handleToggleNotifications}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled 
                  ? isRTL ? 'translate-x-[-22px]' : 'translate-x-6'
                  : isRTL ? 'translate-x-[-2px]' : 'translate-x-1'
              }`} />
            </div>
          </div>

          {/* Info Message */}
          <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${isRTL ? 'text-left' : ''}`}>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {notificationsEnabled ? (
                t('notifications.enabledInfo')
              ) : (
                t('notifications.disabledInfo')
              )}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className={`pt-6 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'justify-start' : 'justify-end'}`}>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className={`${isRTL ? 'flex-row-reverse gap-2' : 'gap-2'} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all`}
          >
            {isLoading ? (
              <>
                <span className={`animate-spin text-blue-400 ${isRTL ? 'ml-2' : 'mr-2'}`}>⟳</span>
                {t('common.loading')}
              </>
            ) : (
              t('common.save')
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}