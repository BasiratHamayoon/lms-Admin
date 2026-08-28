import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@maincomponents/components/ui/button';
import { Card, CardContent } from '@maincomponents/components/ui/card';
import { Lock, CheckCircle } from 'lucide-react';
import { useAppTranslation } from '../hooks/use-translation';

const ResetPassword = ({ onSubmit, token, loading = false }) => {
  const { t, isRTL } = useAppTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    onSubmit({ password, token });
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-8">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  {t('resetPassword.resetSuccess')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {t('resetPassword.resetSuccessDesc')}
                </p>
                <Button
                  onClick={() => window.location.href = '/login'}
                  className="w-full"
                >
                  {t('login.signIn')}
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Lock size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {t('resetPassword.title')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('resetPassword.description')}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('resetPassword.newPassword')}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('resetPassword.passwordPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('resetPassword.confirmPassword')}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('resetPassword.confirmPlaceholder')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                      disabled={loading}
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full"
                  >
                    {loading ? t('common.loading') : t('resetPassword.resetButton')}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <a
                    href="/login"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    {t('forgotPassword.backToLogin')}
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;