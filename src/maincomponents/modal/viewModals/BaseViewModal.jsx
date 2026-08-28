import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

const BaseViewModal = ({
  isOpen, onClose, data, title = 'View Details', description = 'View complete details', gradient = 'from-green-500 to-green-600',
  isRTL = false, children, onEdit, onEmail, onDelete, showEditButton = true, showEmailButton = true, showDeleteButton = false, customButtons = []
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }} className="bg-background rounded-xl shadow-2xl"
            >
              <DialogHeader className="p-6 pb-4">
                <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-2 h-8 bg-gradient-to-br ${gradient} rounded-full`}></div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <DialogTitle className="text-xl font-bold text-foreground">{title}</DialogTitle>
                      <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="px-6 pb-6 space-y-6">
                {children}
                {(showEditButton || showEmailButton || showDeleteButton || customButtons.length > 0) && data && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {showEditButton && onEdit && <Button onClick={() => onEdit(data)} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">{isRTL ? 'تعديل' : 'Edit'}</Button>}
                        {showEmailButton && onEmail && data.email && <Button onClick={() => onEmail(data)} variant="outline" className="flex-1 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">{isRTL ? 'إرسال بريد' : 'Send Email'}</Button>}
                        {showDeleteButton && onDelete && <Button onClick={() => onDelete(data.id)} variant="outline" className="flex-1 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30">{isRTL ? 'حذف' : 'Delete'}</Button>}
                        {customButtons.map((button, index) => <Button key={index} onClick={() => button.onClick(data)} variant={button.variant || 'outline'} className={`flex-1 ${button.className || ''}`}>{button.label}</Button>)}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
export default BaseViewModal;