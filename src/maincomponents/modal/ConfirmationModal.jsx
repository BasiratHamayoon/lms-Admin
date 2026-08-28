import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useAppTranslation } from '../../hooks/use-translation';

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titleKey = "login.confirmLogout", 
  descriptionKey = "login.logoutConfirmation",
  confirmTextKey = "common.logout",
  cancelTextKey = "common.cancel",
  isProcessing = false 
}) {
  const { t, isRTL } = useAppTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${isRTL ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 text-red-600 dark:text-red-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertTriangle className="h-5 w-5" />
            {t(titleKey)}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400 pt-4">
            {t(descriptionKey)}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className={`flex flex-col sm:flex-row gap-3 pt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {t(cancelTextKey)}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isProcessing}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {t('common.loading')}
              </>
            ) : (
              t(confirmTextKey)
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}