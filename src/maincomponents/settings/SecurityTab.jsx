// src/maincomponents/settings/SecurityTab.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useAppTranslation } from '../../hooks/use-translation';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { changeAdminPassword } from '@redux/slice/settingSlice';

export default function SecurityTab() {
  const { t, isRTL } = useAppTranslation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const securityFields = {
    currentPassword: {
      label: 'settingsPage.security.fields.currentPassword',
      placeholder: 'settingsPage.security.fields.currentPasswordPlaceholder',
      icon: Lock,
      type: 'password'
    },
    newPassword: {
      label: 'settingsPage.security.fields.newPassword',
      placeholder: 'settingsPage.security.fields.newPasswordPlaceholder',
      icon: Lock,
      type: 'password'
    },
    confirmPassword: {
      label: 'settingsPage.security.fields.confirmPassword',
      placeholder: 'settingsPage.security.fields.confirmPasswordPlaceholder',
      icon: Lock,
      type: 'password'
    }
  };

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = password => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        changeAdminPassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      ).unwrap();

      toast.success('Password updated successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      toast.error(
        typeof err === 'string' ? err : 'Failed to update password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch =
    formData.newPassword === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG?.duration?.normal || 0.3 }}
      onSubmit={handleSubmit}
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
          {Object.entries(securityFields).map(([field, config]) => (
            <div key={field} className="space-y-2">
              <Label
                htmlFor={field}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t(config.label)}
              </Label>
              <div className="relative group">
                <Lock
                  className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-green-500 ${
                    isRTL ? 'right-3' : 'left-3'
                  }`}
                />
                <Input
                  id={field}
                  type={config.type}
                  value={formData[field]}
                  onChange={e => handleChange(field, e.target.value)}
                  placeholder={t(config.placeholder)}
                  className={`${isRTL ? 'pr-10' : 'pl-10'} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  autoComplete="off"
                />
              </div>

              {field === 'newPassword' && formData.newPassword && (
                <div className="space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Password Strength
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {passwordStrength}/5
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {field === 'confirmPassword' && formData.confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 dark:text-green-400">
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 dark:text-red-400">
                        Passwords don't match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>

        <CardFooter className="pt-6 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="submit"
            disabled={isLoading || !passwordsMatch || passwordStrength < 3}
            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                {t('common.loading')}
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                {t('settingsPage.security.changePassword')}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.form>
  );
}