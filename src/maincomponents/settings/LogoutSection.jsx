import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppTranslation } from '../../hooks/use-translation';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { LogOut, AlertTriangle, Power } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmationModal } from '@maincomponents/modal/ConfirmationModal';

export default function LogoutTab() {
  const { t, isRTL } = useAppTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    toast.success(t('common.logoutSuccess'), {
      description: t('login.logoutSuccess'),
    });
    
    // Redirect to signin page
    setTimeout(() => {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
      window.location.href = '/signin';
    }, 1000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: ANIMATION_CONFIG?.duration?.normal || 0.3 }}
        className="space-y-6"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {t('settingsPage.security.title')}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('settingsPage.security.description')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Alert className="border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {t('login.logoutConfirmation')}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800/50 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <Power className="h-5 w-5" />
                  </div>
                  <div className={isRTL ? 'text-left' : ''}>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t('login.currentSession')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('login.systemAdministrator')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardContent className="pt-6 border-t border-gray-100 dark:border-gray-700">
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {isLoggingOut ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t('common.logout')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

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