import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@maincomponents/components/ui/button';
import { Card, CardContent } from '@maincomponents/components/ui/card';
import { X, Mail, User } from 'lucide-react';
import { useAppTranslation } from '@hooks/use-translation';

const ForgotPasswordPopup = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const { t, isRTL } = useAppTranslation();
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, userId });
    setEmailSent(true);
    setTimeout(() => {
      setEmailSent(false);
      setEmail('');
      setUserId('');
      onClose();
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md mx-4"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-2xl">
          <CardContent className="p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={t('common.close')}
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Mail size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {t('forgotPassword.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t('forgotPassword.description')}
              </p>
            </div>

            {emailSent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {t('forgotPassword.emailSent')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {t('forgotPassword.checkInbox')}
                </p>
                <Button
                  onClick={onClose}
                  className="w-full"
                >
                  {t('common.close')}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User ID Field - FIRST */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('forgotPassword.userId')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder={t('forgotPassword.userIdPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {t('forgotPassword.userIdHint')}
                  </p>
                </div>

                {/* Email Field - SECOND */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('login.email')}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('login.emailPlaceholder')}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {t('forgotPassword.instructions')}
                </p>

                <Button
                  type="submit"
                  disabled={loading || !email || !userId}
                  className="w-full"
                >
                  {loading ? t('common.loading') : t('forgotPassword.sendResetLink')}
                </Button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    {t('forgotPassword.backToLogin')}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPopup;