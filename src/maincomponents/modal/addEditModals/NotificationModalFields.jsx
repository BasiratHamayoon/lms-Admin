import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  MessageCircle,
  Award,
  DollarSign,
  CheckSquare,
  Languages,
  Globe
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const NotificationModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  additionalData = {},
  enableMultiLanguage = true,
  mode = 'add'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single'); 
  const isInitialized = useRef(false);

  // Use the current system language for Single mode
  const currentLanguage = i18n.language;

  // Configuration Arrays
  const notificationTypes = ['announcement', 'event', 'assignment', 'quiz', 'grade', 'fee', 'attendance', 'other'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const targetAudiences = ['all', 'students', 'teachers', 'staff', 'parents', 'admin', 'specific'];
  const statuses = ['draft', 'published', 'archived'];

  const typeIcons = {
    announcement: Bell,
    event: Calendar,
    assignment: MessageCircle,
    quiz: Award,
    grade: Award,
    fee: DollarSign,
    attendance: CheckSquare,
    other: MessageCircle
  };

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-orange-500',
    urgent: 'text-red-500'
  };

  // Initialize multilingual fields
  useEffect(() => {
    if (isInitialized.current) return;
    if (mode !== 'add') return;

    isInitialized.current = true;

    const multilingualFields = ['title', 'message'];
    
    // Default initial values
    const updates = {};

    multilingualFields.forEach(field => {
        const currentVal = formData[field];
        // If string (legacy) or missing, init as object
        if (!currentVal || typeof currentVal === 'string') {
             updates[field] = { en: '', ar: '' };
        } else {
             // If object exists but keys missing
             if (currentVal.en === undefined) updates[field] = { ...currentVal, en: '' };
             if (currentVal.ar === undefined) updates[field] = { ...currentVal, ar: '' };
        }
    });

    // Set other defaults if missing
    if (!formData.type) updates.type = 'announcement';
    if (!formData.priority) updates.priority = 'medium';
    if (!formData.targetAudience) updates.targetAudience = 'all';
    if (!formData.status) updates.status = 'draft';

    if (Object.keys(updates).length > 0) {
      Object.entries(updates).forEach(([key, value]) => {
        handleChange(key, value);
      });
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'add') {
      isInitialized.current = false;
    }
  }, [mode]);

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const handleMultiChange = (field, lang, value) => {
    const currentObj = formData[field] || { en: '', ar: '' };
    const safeObj = typeof currentObj === 'string' ? { en: currentObj, ar: '' } : currentObj;
    
    handleChange(field, {
      ...safeObj,
      [lang]: value
    });
  };

  const getMultiValue = (field, lang) => {
    if (!enableMultiLanguage) return formData[field] || '';
    const val = formData[field];
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || '';
  };

  // --- RENDERERS ---

  const renderSingleLanguageField = (fieldName) => {
    // 1. Multilingual Text Fields
    if (['title', 'message'].includes(fieldName)) {
        let labelKey = `notifications.form.${fieldName}`;
        let placeholderKey = labelKey;
        let Icon = fieldName === 'title' ? Bell : MessageCircle;
        let isTextarea = fieldName === 'message';

        return (
            <div className="space-y-2">
            <Label>{t(labelKey)}</Label>
            <div className="relative">
                {Icon && (
                <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                )}
                {isTextarea ? (
                <Textarea 
                    value={getMultiValue(fieldName, currentLanguage)}
                    onChange={(e) => handleMultiChange(fieldName, currentLanguage, e.target.value)}
                    placeholder={t(placeholderKey)}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className={`min-h-[100px] ${Icon ? (currentLanguage === 'ar' ? 'pr-10' : 'pl-10') : ''}`}
                />
                ) : (
                <Input
                    value={getMultiValue(fieldName, currentLanguage)}
                    onChange={(e) => handleMultiChange(fieldName, currentLanguage, e.target.value)}
                    placeholder={t(placeholderKey)}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className={Icon ? (currentLanguage === 'ar' ? 'pr-10' : 'pl-10') : ''}
                />
                )}
            </div>
            </div>
        );
    }

    // 2. Select Fields (Shared)
    if (['type', 'priority', 'targetAudience', 'status'].includes(fieldName)) {
        let labelKey = fieldName === 'status' ? 'common.status' : `notifications.form.${fieldName}`;
        let placeholderKey = fieldName === 'status' ? 'notifications.form.selectStatus' : `notifications.form.select${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
        if(fieldName === 'targetAudience') placeholderKey = 'notifications.form.selectTarget';

        let options = fieldName === 'type' ? notificationTypes : 
                      fieldName === 'priority' ? priorities : 
                      fieldName === 'targetAudience' ? targetAudiences : statuses;
        
        let Icon = fieldName === 'type' ? Bell : 
                   fieldName === 'priority' ? AlertTriangle : 
                   fieldName === 'targetAudience' ? Users : CheckCircle;
        
        let translationPrefix = fieldName === 'type' ? 'notifications.types' : 
                                fieldName === 'priority' ? 'notifications.priority' : 
                                fieldName === 'targetAudience' ? 'notifications.targetAudience' : 'notifications.status';

        return (
            <div className="space-y-2">
            <Label>{t(labelKey)}</Label>
            <div className="relative">
                {Icon && (
                <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                )}
                <Select 
                    value={formData[fieldName] || ''} 
                    onValueChange={(value) => handleChange(fieldName, value)}
                >
                <SelectTrigger className={`w-full ${Icon ? (currentLanguage === 'ar' ? 'pr-10' : 'pl-10') : ''}`}>
                    <SelectValue placeholder={t(placeholderKey)} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => {
                        const TypeIcon = fieldName === 'type' ? typeIcons[option] : null;
                        return (
                            <SelectItem 
                                key={option} 
                                value={option}
                                className={fieldName === 'priority' ? priorityColors[option] : ''}
                            >
                                <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                                {TypeIcon && <TypeIcon className="w-4 h-4" />}
                                {t(`${translationPrefix}.${option}`)}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
                </Select>
            </div>
            </div>
        );
    }

    // 3. Date Time Fields (Shared)
    if (['validFrom', 'validUntil'].includes(fieldName)) {
        let labelKey = `notifications.form.${fieldName}`;
        
        return (
            <div className="space-y-2">
            <Label>{t(labelKey)}</Label>
            <div className="relative">
                <Calendar className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                type="datetime-local"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
                style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}
                />
            </div>
            </div>
        );
    }

    return null;
  };

  const renderDualLanguageField = (fieldName, language) => {
    const isAr = language === 'ar';
    const labelBadge = isAr ? (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
        {t('common.arabic')}
      </span>
    ) : (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('common.english')}
      </span>
    );

    // Swap logic
    const shouldFlipLabel = (!isRTL && isAr) || (isRTL && !isAr);

    // 1. Multilingual Text Fields
    if (['title', 'message'].includes(fieldName)) {
        let labelKey = `notifications.form.${fieldName}`;
        let Icon = fieldName === 'title' ? Bell : MessageCircle;
        let isTextarea = fieldName === 'message';
        const translatedLabel = getTranslation(labelKey, language);

        const labelContent = shouldFlipLabel ? (
            <>
              {labelBadge}
              <span>{translatedLabel}</span>
            </>
          ) : (
            <>
              <span>{translatedLabel}</span>
              {labelBadge}
            </>
        );

        return (
            <div className="space-y-2">
            <Label className="flex items-center justify-between">
                {labelContent}
            </Label>
            <div className="relative">
                {Icon && (
                <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
                )}
                {isTextarea ? (
                <Textarea 
                    value={getMultiValue(fieldName, language)}
                    onChange={(e) => handleMultiChange(fieldName, language, e.target.value)}
                    placeholder={`${translatedLabel} (${isAr ? t('common.arabic') : t('common.english')})`}
                    dir={isAr ? 'rtl' : 'ltr'}
                    className={`min-h-[100px] ${Icon ? (isAr ? 'pr-10' : 'pl-10') : ''}`}
                />
                ) : (
                <Input
                    value={getMultiValue(fieldName, language)}
                    onChange={(e) => handleMultiChange(fieldName, language, e.target.value)}
                    placeholder={`${translatedLabel} (${isAr ? t('common.arabic') : t('common.english')})`}
                    dir={isAr ? 'rtl' : 'ltr'}
                    className={Icon ? (isAr ? 'pr-10' : 'pl-10') : ''}
                />
                )}
            </div>
            </div>
        );
    }

    // 2. Select Fields (Shared)
    if (['type', 'priority', 'targetAudience', 'status'].includes(fieldName)) {
        let labelKey = fieldName === 'status' ? 'common.status' : `notifications.form.${fieldName}`;
        let placeholderKey = fieldName === 'status' ? 'notifications.form.selectStatus' : `notifications.form.select${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`;
        if(fieldName === 'targetAudience') placeholderKey = 'notifications.form.selectTarget';

        let options = fieldName === 'type' ? notificationTypes : 
                      fieldName === 'priority' ? priorities : 
                      fieldName === 'targetAudience' ? targetAudiences : statuses;
        
        let Icon = fieldName === 'type' ? Bell : 
                   fieldName === 'priority' ? AlertTriangle : 
                   fieldName === 'targetAudience' ? Users : CheckCircle;
        
        let translationPrefix = fieldName === 'type' ? 'notifications.types' : 
                                fieldName === 'priority' ? 'notifications.priority' : 
                                fieldName === 'targetAudience' ? 'notifications.targetAudience' : 'notifications.status';

        const translatedLabel = getTranslation(labelKey, language);
        const labelContent = shouldFlipLabel ? (
            <>
              {labelBadge}
              <span>{translatedLabel}</span>
            </>
          ) : (
            <>
              <span>{translatedLabel}</span>
              {labelBadge}
            </>
        );

        return (
            <div className="space-y-2">
            <Label className="flex items-center justify-between">
                {labelContent}
            </Label>
            <div className="relative">
                {Icon && (
                <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
                )}
                <Select 
                    value={formData[fieldName] || ''} 
                    onValueChange={(value) => handleChange(fieldName, value)}
                >
                <SelectTrigger className={`w-full ${Icon ? (isAr ? 'pr-10' : 'pl-10') : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                    <SelectValue placeholder={getTranslation(placeholderKey, language)} />
                </SelectTrigger>
                <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
                    {options.map(option => {
                        const TypeIcon = fieldName === 'type' ? typeIcons[option] : null;
                        return (
                            <SelectItem 
                                key={option} 
                                value={option}
                                className={fieldName === 'priority' ? priorityColors[option] : ''}
                            >
                                <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                                {TypeIcon && <TypeIcon className="w-4 h-4" />}
                                {getTranslation(`${translationPrefix}.${option}`, language)}
                                </div>
                            </SelectItem>
                        );
                    })}
                </SelectContent>
                </Select>
            </div>
            </div>
        );
    }

    // 3. Date Time Fields (Shared)
    if (['validFrom', 'validUntil'].includes(fieldName)) {
        let labelKey = `notifications.form.${fieldName}`;
        const translatedLabel = getTranslation(labelKey, language);

        const labelContent = shouldFlipLabel ? (
            <>
              {labelBadge}
              <span>{translatedLabel}</span>
            </>
          ) : (
            <>
              <span>{translatedLabel}</span>
              {labelBadge}
            </>
        );
        
        return (
            <div className="space-y-2">
            <Label className="flex items-center justify-between">
                {labelContent}
            </Label>
            <div className="relative">
                <Calendar className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <Input
                type="datetime-local"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                className={isAr ? 'pr-10' : 'pl-10'}
                style={{ textAlign: isAr ? 'right' : 'left' }}
                dir="ltr"
                />
            </div>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {enableMultiLanguage && (
        <div className="p-5 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-teal-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {t('common.inputLanguage')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {inputMode === 'dual' 
                    ? t('common.bothLanguagesDesc')
                    : currentLanguage === 'ar'
                    ? t('common.arabicOnlyDesc')
                    : t('common.englishOnlyDesc')
                  }
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Globe className="w-5 h-5 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{t('common.notificationLanguageTooltip', 'Toggle between single or dual language input')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {inputMode === 'single' ? t('common.singleLanguage') : t('common.dualLanguage')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('common.single')}</span>
              <Switch
                checked={inputMode === 'dual'}
                onCheckedChange={toggleInputMode}
                className="data-[state=checked]:bg-teal-600"
              />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FIELDS */}
      {inputMode === 'single' ? (
        <>
            {/* Basic Information */}
            <div>
                 <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('notifications.basicInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('title')}
                {renderSingleLanguageField('type')}
                {renderSingleLanguageField('priority')}
                {renderSingleLanguageField('targetAudience')}
                </div>
            </div>

            {/* Message */}
            <div>
                 <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('notifications.notificationInfo')}
                </h3>
                {renderSingleLanguageField('message')}
            </div>

            {/* Date Time */}
            <div>
                 <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('notifications.dateTimeInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('validFrom')}
                {renderSingleLanguageField('validUntil')}
                {renderSingleLanguageField('status')}
                </div>
            </div>
        </>
      ) : (
        <>
            {/* English Section */}
            <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {t('common.english')} {t('notifications.basicInfo')}
                </h3>

                <div className="space-y-4">
                    {renderDualLanguageField('title', 'en')}
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDualLanguageField('type', 'en')}
                        {renderDualLanguageField('priority', 'en')}
                     </div>
                     {renderDualLanguageField('targetAudience', 'en')}
                </div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-6">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {t('common.english')} {t('notifications.notificationInfo')}
                </h3>
                 {renderDualLanguageField('message', 'en')}
            </div>

            {/* Arabic Section */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
                    {t('common.arabic')} {t('notifications.basicInfo')}
                </h3>

                 <div className="space-y-4">
                    {renderDualLanguageField('title', 'ar')}
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderDualLanguageField('type', 'ar')}
                        {renderDualLanguageField('priority', 'ar')}
                     </div>
                     {renderDualLanguageField('targetAudience', 'ar')}
                </div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-600 dark:text-teal-400 mt-6">
                    <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
                    {t('common.arabic')} {t('notifications.notificationInfo')}
                </h3>
                 {renderDualLanguageField('message', 'ar')}
            </div>

            {/* Shared Fields - Always visible at bottom */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                 <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('notifications.dateTimeInfo')} ({t('common.shared', 'Shared')})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderSingleLanguageField('validFrom')}
                    {renderSingleLanguageField('validUntil')}
                    {renderSingleLanguageField('status')}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default NotificationModalFields;