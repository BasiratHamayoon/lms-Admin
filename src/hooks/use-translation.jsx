import { useTranslation } from 'react-i18next';

export const useAppTranslation = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Update document direction
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';

  return {
    t,
    changeLanguage,
    currentLanguage,
    isRTL,
    i18n
  };
};