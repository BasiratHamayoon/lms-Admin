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
import { Checkbox } from '../../components/ui/checkbox';
import {
  Calendar,
  Clock,
  MapPin,
  Eye,
  Tag,
  Bell,
  Hash,
  Languages,
  Globe
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const EventsModalFields = ({ 
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
  
  // Get options from additionalData or use defaults
  const types = additionalData.types || ['academic', 'administrative', 'holiday', 'exam', 'other'];
  const visibilityOptions = additionalData.visibility || ['all', 'staff', 'students', 'department'];
  const statusOptions = additionalData.statuses || ['scheduled', 'cancelled', 'completed', 'postponed'];

  // Initialize multilingual fields
  useEffect(() => {
    if (isInitialized.current) return;
    if (mode !== 'add') return;

    isInitialized.current = true;

    const updates = {};
    const multilingualFields = ['title', 'description', 'location'];

    multilingualFields.forEach(field => {
      if (!formData[field] || typeof formData[field] === 'string') {
        updates[field] = { en: '', ar: '' };
      }
    });

    // Initialize defaults for shared fields if missing
    if (!formData.color) updates.color = '#0d9488'; // Teal default
    if (!formData.visibility) updates.visibility = 'all';
    if (!formData.type) updates.type = 'academic';
    if (!formData.status) updates.status = 'scheduled';

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
    if (['title', 'description', 'location'].includes(fieldName)) {
      let labelKey = `events.form.${fieldName}`;
      let placeholderKey = labelKey;
      let Icon = fieldName === 'title' ? Calendar : 
                 fieldName === 'location' ? MapPin : null;
      let isTextarea = fieldName === 'description';

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
                placeholder={t('events.form.description')}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="min-h-[100px]"
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
    if (['type', 'visibility', 'status'].includes(fieldName)) {
      let labelKey = fieldName === 'status' ? 'common.status' : `events.form.${fieldName}`;
      let options = fieldName === 'type' ? types : 
                    fieldName === 'visibility' ? visibilityOptions : statusOptions;
      let Icon = fieldName === 'type' ? Tag : 
                 fieldName === 'visibility' ? Eye : null;
      let translationPrefix = fieldName === 'type' ? 'events.types' : 
                              fieldName === 'visibility' ? 'events.visibility' : 'events.status';

      return (
        <div className="space-y-2">
          <Label>{t(labelKey)}</Label>
          <div className="relative">
            {Icon && (
              <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            )}
            <Select 
              value={formData[fieldName]} 
              onValueChange={(value) => handleChange(fieldName, value)}
            >
              <SelectTrigger className={`w-full ${Icon ? (currentLanguage === 'ar' ? 'pr-10' : 'pl-10') : ''}`}>
                <SelectValue placeholder={t('common.select')} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option} value={option}>
                    {t(`${translationPrefix}.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // 3. Date Time Fields (Shared)
    if (['startDate', 'endDate'].includes(fieldName)) {
      let labelKey = `events.form.${fieldName}`;
      let Icon = fieldName === 'startDate' ? Calendar : Clock;

      return (
        <div className="space-y-2">
          <Label>{t(labelKey)}</Label>
          <div className="relative">
             <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
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

    // 4. Color Field (Shared)
    if (fieldName === 'color') {
      return (
        <div className="space-y-2">
          <Label>{t('events.form.color')}</Label>
          <div className="relative">
            <Hash className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="color"
              value={formData.color || '#0d9488'}
              onChange={(e) => handleChange('color', e.target.value)}
              className={`h-10 ${currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}`}
            />
          </div>
        </div>
      );
    }

    // 5. Checkboxes (Shared)
    if (['allDay', 'reminder'].includes(fieldName)) {
      let labelKey = fieldName === 'allDay' ? 'events.allDay' : 'events.form.reminder';
      let Icon = fieldName === 'allDay' ? Clock : Bell;

      return (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox 
            id={fieldName}
            checked={formData[fieldName] || false}
            onCheckedChange={(checked) => handleChange(fieldName, checked)}
          />
          <Label htmlFor={fieldName} className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer">
             <Icon className="w-4 h-4 text-gray-500" />
            {t(labelKey)}
          </Label>
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

    // Swap logic: System English + Field Arabic OR System Arabic + Field English
    const shouldFlipLabel = (!isRTL && isAr) || (isRTL && !isAr);

    // 1. Multilingual Text Fields
    if (['title', 'description', 'location'].includes(fieldName)) {
      let labelKey = `events.form.${fieldName}`;
      let Icon = fieldName === 'title' ? Calendar : 
                 fieldName === 'location' ? MapPin : null;
      let isTextarea = fieldName === 'description';
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
                className="min-h-[100px]"
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

    // 2. Select Fields (Shared) - Rendered in both columns for context
    if (['type', 'visibility', 'status'].includes(fieldName)) {
      let labelKey = fieldName === 'status' ? 'common.status' : `events.form.${fieldName}`;
      let options = fieldName === 'type' ? types : 
                    fieldName === 'visibility' ? visibilityOptions : statusOptions;
      let Icon = fieldName === 'type' ? Tag : 
                 fieldName === 'visibility' ? Eye : null;
      let translationPrefix = fieldName === 'type' ? 'events.types' : 
                              fieldName === 'visibility' ? 'events.visibility' : 'events.status';

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
              value={formData[fieldName]} 
              onValueChange={(value) => handleChange(fieldName, value)}
            >
              <SelectTrigger className={`w-full ${Icon ? (isAr ? 'pr-10' : 'pl-10') : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                <SelectValue placeholder={getTranslation('common.select', language)} />
              </SelectTrigger>
              <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
                {options.map(option => (
                  <SelectItem key={option} value={option}>
                    {getTranslation(`${translationPrefix}.${option}`, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // 3. Date Time Fields (Shared)
    if (['startDate', 'endDate'].includes(fieldName)) {
      let labelKey = `events.form.${fieldName}`;
      let Icon = fieldName === 'startDate' ? Calendar : Clock;
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
             <Icon className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
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
    
    // 4. Color (Shared)
    if (fieldName === 'color') {
        const translatedLabel = getTranslation('events.form.color', language);
        const labelContent = shouldFlipLabel ? (
            <>{labelBadge}<span>{translatedLabel}</span></>
        ) : (
            <><span>{translatedLabel}</span>{labelBadge}</>
        );

        return (
            <div className="space-y-2">
            <Label className="flex items-center justify-between">
                {labelContent}
            </Label>
            <div className="relative">
                <Hash className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
                <Input
                type="color"
                value={formData.color || '#0d9488'}
                onChange={(e) => handleChange('color', e.target.value)}
                className={`h-10 ${isAr ? 'pr-10' : 'pl-10'}`}
                />
            </div>
            </div>
        );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle Section */}
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
                  <p className="max-w-xs">{t('common.eventsLanguageTooltip', 'Toggle between single or dual language input for event information')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {inputMode === 'single' ? t('common.singleLanguage') : t('common.dualLanguage')}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('common.single')}</span>
              <Switch
                checked={inputMode === 'dual'}
                onCheckedChange={toggleInputMode}
                className="data-[state=checked]:bg-teal-600 data-[state=unchecked]:bg-gray-300"
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
                {t('events.basicInfo')}
                </h3>
                <div className="space-y-4">
                {renderSingleLanguageField('title')}
                {renderSingleLanguageField('description')}
                {renderSingleLanguageField('location')}
                {renderSingleLanguageField('type')}
                </div>
            </div>

            {/* Date & Time Information */}
            <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('events.dateTimeInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('startDate')}
                {renderSingleLanguageField('endDate')}
                </div>
                <div className="mt-4 space-y-4">
                {renderSingleLanguageField('allDay')}
                {renderSingleLanguageField('reminder')}
                </div>
            </div>

            {/* Visibility Information */}
            <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white`}>
                <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full"></div>
                {t('events.visibilityInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('visibility')}
                {renderSingleLanguageField('color')}
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
                    {t('common.english')} {t('events.basicInfo')}
                </h3>
                
                <div className="space-y-4">
                    {renderDualLanguageField('title', 'en')}
                    {renderDualLanguageField('description', 'en')}
                    {renderDualLanguageField('location', 'en')}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                         {renderDualLanguageField('type', 'en')}
                         {renderDualLanguageField('visibility', 'en')}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-6">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {t('common.english')} {t('events.dateTimeInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderDualLanguageField('startDate', 'en')}
                    {renderDualLanguageField('endDate', 'en')}
                </div>
            </div>

            {/* Arabic Section */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
                    {t('common.arabic')} {t('events.basicInfo')}
                </h3>
                
                <div className="space-y-4">
                    {renderDualLanguageField('title', 'ar')}
                    {renderDualLanguageField('description', 'ar')}
                    {renderDualLanguageField('location', 'ar')}
                    
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                         {renderDualLanguageField('type', 'ar')}
                         {renderDualLanguageField('visibility', 'ar')}
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-teal-600 dark:text-teal-400 mt-6">
                    <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
                    {t('common.arabic')} {t('events.dateTimeInfo')}
                </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderDualLanguageField('startDate', 'ar')}
                    {renderDualLanguageField('endDate', 'ar')}
                </div>
            </div>

            {/* Shared Options (Always visible at bottom in dual mode) */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        {renderSingleLanguageField('color')}
                        {renderSingleLanguageField('status')}
                    </div>
                    <div className="space-y-4 pt-8">
                        {renderSingleLanguageField('allDay')}
                        {renderSingleLanguageField('reminder')}
                    </div>
                 </div>
            </div>
        </>
      )}
    </div>
  );
};

export default EventsModalFields;