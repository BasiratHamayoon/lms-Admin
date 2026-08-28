import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Send,
  Mail,
  Calendar,
  User,
  Languages,
  FileText
} from 'lucide-react';
import { Switch } from '../components/ui/switch';

const ReplyModal = ({ isOpen, onClose, query, onReply }) => {
  const { t, i18n } = useTranslation();
  const [replyMessage, setReplyMessage] = useState({ en: '', ar: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentReplies, setSentReplies] = useState({});
  const [inputMode, setInputMode] = useState('single'); 

  if (!query) return null;

  const handleSubmit = async () => {
    
    if (inputMode === 'single') {
      const currentLang = i18n.language;
      if (!replyMessage[currentLang]?.trim()) {
        
        alert(t('common.messageRequired'));
        return;
      }
    } else {
      
      if (!replyMessage.en?.trim() && !replyMessage.ar?.trim()) {
        alert(t('common.messageRequired'));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      
      await onReply(query.id, replyMessage);
      
      
      const newReply = {
        id: Date.now(),
        message: replyMessage,
        timestamp: new Date().toISOString(),
        admin: 'Admin User'
      };
      
      setSentReplies(prev => ({
        ...prev,
        [query.id]: [...(prev[query.id] || []), newReply]
      }));
      
      
      setReplyMessage({ en: '', ar: '' });
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const currentQueryReplies = sentReplies[query.id] || [];

  const isRTL = i18n.language === 'ar';

  
  const getDisplayMessage = (message) => {
    if (typeof message === 'string') {
      return message; 
    }
    
    
    if (inputMode === 'single') {
      return message?.[i18n.language] || message?.en || '';
    }
    
    
    const enMsg = message?.en?.trim();
    const arMsg = message?.ar?.trim();
    
    if (enMsg && arMsg) {
      return `${enMsg}\n\n--- ${t('common.arabic')} ---\n${arMsg}`;
    } else if (enMsg) {
      return enMsg;
    } else if (arMsg) {
      return arMsg;
    }
    
    return '';
  };

  
  const renderLanguageToggle = () => (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('common.inputLanguage')}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {inputMode === 'dual' ? t('common.bothLanguagesDesc') : t('common.singleLanguageDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{t('common.single')}</span>
          <Switch 
            checked={inputMode === 'dual'} 
            onCheckedChange={(v) => setInputMode(v ? 'dual' : 'single')}
            className="data-[state=checked]:bg-blue-500"
          />
          <span className="text-xs text-gray-500">{t('common.dual')}</span>
        </div>
      </div>
    </div>
  );

  
  const renderSingleTextarea = () => {
    const currentLang = i18n.language;
    const value = replyMessage[currentLang] || '';
    const isArabic = currentLang === 'ar';
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="replyMessage" className={`text-sm font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right' : ''}`}>
            {t('queries.yourResponse')}
          </Label>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${isArabic ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
            {isArabic ? 'Arabic' : 'English'}
          </span>
        </div>
        <div className="relative">
          <Textarea
            id="replyMessage"
            placeholder={t('queries.responsePlaceholder')}
            value={value}
            onChange={(e) => setReplyMessage(prev => ({ ...prev, [currentLang]: e.target.value }))}
            className={`min-h-[120px] resize-none ${isArabic ? 'pr-10 text-right placeholder:text-right' : 'pl-10 text-left'}`}
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          <FileText className={`absolute top-4 ${isArabic ? 'right-3' : 'left-3'} w-4 h-4 text-gray-400`} />
        </div>
      </div>
    );
  };

  
  const renderDualTextareas = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="replyMessageEn" className="text-sm font-medium text-gray-900 dark:text-white">
            {t('queries.yourResponse')} (English)
          </Label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800">
            English
          </span>
        </div>
        <div className="relative">
          <Textarea
            id="replyMessageEn"
            placeholder={t('queries.responsePlaceholder') + ' in English'}
            value={replyMessage.en || ''}
            onChange={(e) => setReplyMessage(prev => ({ ...prev, en: e.target.value }))}
            className="min-h-[100px] resize-none pl-10"
            dir="ltr"
          />
          <FileText className="absolute top-4 left-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="replyMessageAr" className="text-sm font-medium text-gray-900 dark:text-white text-right">
            {t('queries.yourResponse')} (العربية)
          </Label>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
            العربية
          </span>
        </div>
        <div className="relative">
          <Textarea
            id="replyMessageAr"
            placeholder={t('queries.responsePlaceholder') + ' بالعربية'}
            value={replyMessage.ar || ''}
            onChange={(e) => setReplyMessage(prev => ({ ...prev, ar: e.target.value }))}
            className="min-h-[100px] resize-none text-right pr-10"
            dir="rtl"
          />
          <FileText className="absolute top-4 right-3 w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className={`flex flex-row items-center justify-between pb-4 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full"></div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('queries.replyToQuery')}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400">
                      {t('queries.sendResponseToStudent')}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-600">
                      <AvatarImage src={query.avatar} alt={query.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {query.name?.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {query.name}
                        </h3>
                      </div>
                      
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 text-sm ${isRTL ? 'text-right' : ''}`}>
                        <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Mail className="w-4 h-4" />
                          <span>{query.email}</span>
                        </div>
                        <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(query.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className={`text-sm text-gray-500 dark:text-gray-400 mb-1  ${isRTL ? 'text-end' : ''} `}>
                          {t('queries.originalMessage')}:
                        </p>
                        <p className={`text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md p-3 text-sm border ${isRTL ? 'text-end' : ''} `}>
                          {t(query.message)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {currentQueryReplies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className={`text-sm font-medium text-gray-900 dark:text-white ${isRTL ? 'text-right text-end' : ''}`}>
                      {t('queries.sentReplies')}:
                    </h4>
                    {currentQueryReplies.map((reply) => (
                      <div key={reply.id} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-600">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs">
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-green-800 dark:text-green-300 text-sm">
                                {reply.admin}
                              </span>
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-green-700 dark:text-green-300 text-sm whitespace-pre-line">
                              {getDisplayMessage(reply.message)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  {renderLanguageToggle()}
                  
                  {inputMode === 'single' ? renderSingleTextarea() : renderDualTextareas()}
                  
                  <div className={`flex justify-end gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        inputMode === 'single' 
                          ? !replyMessage[i18n.language]?.trim() || isSubmitting
                          : (!replyMessage.en?.trim() && !replyMessage.ar?.trim()) || isSubmitting
                      }
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      {isSubmitting ? (
                        <>{t('common.loading')}</>
                      ) : (
                        <>
                          <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('queries.sendResponse')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ReplyModal;