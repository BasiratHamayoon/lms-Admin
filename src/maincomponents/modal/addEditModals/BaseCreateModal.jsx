import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { X, Save, User, Building, BookOpen, Calendar, Bell } from 'lucide-react';

const BaseCreateModal = ({ 
  isOpen, 
  onClose, 
  title,
  description,
  children,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  type = 'staff',
  icon = User,
  gradient = 'from-green-500 to-green-600',
  isRTL = false,
  enableMultiLanguage = true // Add this prop
}) => {
  const { t } = useTranslation();
  
  const modalIcons = {
    staff: User,
    student: User,
    department: Building,
    course: BookOpen,
    event: Calendar,
    notification: Bell,
    timetable: Calendar,
    leave: Calendar,
    class: BookOpen,
  };
  
  const ModalIcon = icon || modalIcons[type] || User;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0" 
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700 relative">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-2 h-8 bg-gradient-to-br ${gradient} rounded-full`} />
              <div className={`flex-1 ${isRTL ? 'text-left' : ''}`}>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className={`flex items-center gap-6 py-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-20 w-20 border-2 border-gray-200 dark:border-gray-600">
              <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white text-lg`}>
                <ModalIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isRTL 
                  ? 'صورة الملف الشخصي سيتم تعيينها تلقائياً'
                  : 'Profile picture will be automatically assigned'
                }
              </p>
              {enableMultiLanguage && (
                <p className="text-xs text-gray-500 mt-1">
                  {isRTL
                    ? 'يمكنك إدخال البيانات بلغة واحدة أو كليهما'
                    : 'You can enter data in one language or both'
                  }
                </p>
              )}
            </div>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
            <div className={`flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`bg-gradient-to-r ${gradient} hover:opacity-90`}
              >
                {isSubmitting ? (
                  <>{t('common.loading')}</>
                ) : (
                  <>
                    <Save className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {submitLabel || t('common.save')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
export default BaseCreateModal;