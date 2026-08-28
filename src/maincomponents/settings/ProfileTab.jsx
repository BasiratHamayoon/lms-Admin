import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTranslation } from '../../hooks/use-translation';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Camera, Save, X, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
  getAdminProfile,
  updateAdminProfile
} from '@redux/slice/settingSlice';

export default function ProfileTab() {
  const { t, isRTL, currentLanguage } = useAppTranslation();
  const dispatch = useDispatch();
  // const fileInputRef = useRef(null);

  const { profile, loadingProfile, updatingProfile } = useSelector(
    state => state.setting
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [avatarUrl, setAvatarUrl] = useState('');

  const profileFields = {
    fullNameEn: {
      label: 'settingsPage.profile.fields.fullNameEn',      
      placeholder: 'settingsPage.profile.fields.fullNameEnPlaceholder',
      icon: User,
      type: 'text'
    },
    fullNameAr: {
      label: 'settingsPage.profile.fields.fullNameAr',    
      placeholder: 'settingsPage.profile.fields.fullNameArPlaceholder',
      icon: User,
      type: 'text'
    },
    email: {
      label: 'settingsPage.profile.fields.email',
      placeholder: 'settingsPage.profile.fields.emailPlaceholder',
      icon: Mail,
      type: 'email'
    }
  };

  const [profileData, setProfileData] = useState({
    fullNameEn: '',
    fullNameAr: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    dispatch(getAdminProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;

    const firstEn = profile.en?.firstName || '';
    const lastEn  = profile.en?.lastName || '';
    const firstAr = profile.ar?.firstName || '';
    const lastAr  = profile.ar?.lastName || '';

    setProfileData(prev => ({
      ...prev,
      fullNameEn: `${firstEn} ${lastEn}`.trim(),
      fullNameAr: `${firstAr} ${lastAr}`.trim(),
      email: profile.email || prev.email,
      role: profile.role || prev.role
    }));
  }, [profile]);

  // const handleFileChange = event => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   if (file.size > 2 * 1024 * 1024) {
  //     toast.error('File too large', {
  //       description: 'Maximum file size is 2MB'
  //     });
  //     return;
  //   }

  //   const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //   if (!validTypes.includes(file.type)) {
  //     toast.error('Invalid file type', {
  //       description: 'Please upload JPG, PNG or GIF'
  //     });
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setAvatarUrl(reader.result);
  //     toast.success('Photo updated');
  //   };
  //   reader.readAsDataURL(file);
  // };

  // const handleRemoveAvatar = () => {
  //   setAvatarUrl('');
  //   toast.success('Photo removed');
  // };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const fullEn = (profileData.fullNameEn || '').trim();
      const [firstNameEn, ...restEn] = fullEn.split(' ');
      const lastNameEn = restEn.join(' ') || '';

      const fullAr = (profileData.fullNameAr || '').trim();
      const [firstNameAr, ...restAr] = fullAr.split(' ');
      const lastNameAr = restAr.join(' ') || '';

      const body = {
        en: {
          firstName: firstNameEn || profile.en?.firstName || '',
          lastName:  lastNameEn  || profile.en?.lastName  || ''
        },
        ar: {
          firstName: firstNameAr || profile.ar?.firstName || '',
          lastName:  lastNameAr  || profile.ar?.lastName  || ''
        }
      };

      await dispatch(updateAdminProfile(body)).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error(
        typeof err === 'string' ? err : 'Failed to update profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (!profile) return;

    const firstEn = profile.en?.firstName || '';
    const lastEn  = profile.en?.lastName || '';
    const firstAr = profile.ar?.firstName || '';
    const lastAr  = profile.ar?.lastName || '';

    setProfileData(prev => ({
      ...prev,
      fullNameEn: `${firstEn} ${lastEn}`.trim(),
      fullNameAr: `${firstAr} ${lastAr}`.trim(),
      email: profile.email || prev.email,
      role: profile.role || prev.role
    }));
  };

  const effectiveLoading = isLoading || updatingProfile || loadingProfile;

  const headerName =
    currentLanguage === 'ar'
      ? profileData.fullNameAr || profileData.fullNameEn
      : profileData.fullNameEn || profileData.fullNameAr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_CONFIG?.duration?.normal || 0.3 }}
      className="space-y-6"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm">
        <CardHeader className={isRTL ? 'text-left' : ''}>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {t('settingsPage.profile.title')}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('settingsPage.profile.description')}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white dark:border-gray-800 shadow-xl transition-all duration-300 group-hover:scale-105">
                {/* <AvatarImage src={avatarUrl} alt={headerName} /> */}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold">
                  {headerName
                    ? headerName
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                    : 'AD'}
                </AvatarFallback>
              </Avatar>
              {/* <div
                className={`absolute -bottom-2 ${
                  isRTL ? '-left-2' : '-right-2'
                } flex gap-1`}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                {avatarUrl && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              /> */}
            </div>

            <div className={`flex-1 ${isRTL ? 'text-left' : ''}`}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {headerName || 'Admin User'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {profileData.email || 'admin@example.com'}
              </p>
              {profileData.role && (
                <p className="text-gray-600 dark:text-gray-400 capitalize">
                  {profileData.role}
                </p>
              )}
            </div>
          </div>

          {/* Editable fields: English + Arabic names; email read-only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(profileFields).map(([field, config]) => {
              const IconComponent = config.icon;
              const isEmail = field === 'email';
              const isArabicName = field === 'fullNameAr';
              
              return (
                <div key={field} className="space-y-2">
                  <Label
                    htmlFor={field}
                    className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${
                      isRTL ? 'text-left block' : ''
                    }`}
                  >
                    {t(config.label)}
                  </Label>
                  <div className="relative group">
                    {IconComponent && (
                      <IconComponent
                        className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors group-focus-within:text-blue-500 ${
                          isArabicName ? 'right-3' : isRTL ? 'right-3' : 'left-3'
                        }`}
                      />
                    )}
                    <Input
                      id={field}
                      type={config.type}
                      value={profileData[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      placeholder={t(config.placeholder)}
                      className={`${isArabicName ? 'pr-10' : isRTL ? 'pr-10' : 'pl-10'} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !isEditing || isEmail
                          ? 'opacity-75 cursor-not-allowed'
                          : ''
                      } ${isRTL ? 'text-left' : ''}`}
                      disabled={!isEditing || isEmail}
                      dir={field === 'fullNameAr' ? 'rtl' : isRTL ? 'rtl' : 'ltr'}
                      style={{
                        direction: field === 'fullNameAr' ? 'rtl' : isRTL ? 'rtl' : 'ltr'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter
          className={`flex gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 ${
            isRTL ? 'justify-start flex-row-reverse' : 'justify-end'
          }`}
        >
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={effectiveLoading}
              >
                <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={effectiveLoading}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {effectiveLoading ? (
                  <span
                    className={`animate-spin ${
                      isRTL ? 'ml-2' : 'mr-2'
                    }`}
                  >
                    ⟳
                  </span>
                ) : (
                  <Save
                    className={`h-4 w-4 ${
                      isRTL ? 'ml-2' : 'mr-2'
                    }`}
                  />
                )}
                {t('common.save')}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
              disabled={loadingProfile}
            >
              {t('common.edit')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}