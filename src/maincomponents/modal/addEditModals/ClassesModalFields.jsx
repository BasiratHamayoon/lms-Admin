import React, { useState, useEffect } from 'react';
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
import { Badge } from '../../components/ui/badge';
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  Building,
  Users,
  Check,
  X,
  Languages,
  Globe,
  Mail,
  Phone,
  Lock,
  Briefcase
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const ClassesModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  modalMode = 'add',
  additionalData = {},
  enableMultiLanguage = true,
  currentLanguage = 'en'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  
  useEffect(() => {
    if (enableMultiLanguage) {
      const multilingualFields = ['name', 'section'];
      multilingualFields.forEach(field => {
        const currentFieldData = formData[field];
        if (currentFieldData && typeof currentFieldData === 'string') {
          handleChange(field, {
            en: currentLanguage === 'en' ? currentFieldData : '',
            ar: currentLanguage === 'ar' ? currentFieldData : '',
            current: currentLanguage
          });
        }
        else if (!currentFieldData || Object.keys(currentFieldData).length === 0) {
          handleChange(field, {
            en: '',
            ar: '',
            current: currentLanguage
          });
        }
      });
    }
  }, [enableMultiLanguage, currentLanguage]);

  const toggleInputMode = () => {
    setInputMode(inputMode === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const handleMultilingualFieldChange = (fieldName, value, language = null) => {
    if (enableMultiLanguage) {
      const currentData = formData[fieldName] || { en: '', ar: '' };
      const lang = language || currentLanguage;
      
      const updatedData = {
        ...currentData,
        [lang]: value,
        current: lang
      };
      
      handleChange(fieldName, updatedData);
    } else {
      handleChange(fieldName, value);
    }
  };

  const getMultilingualFieldValue = (fieldName, language = null) => {
    if (!enableMultiLanguage) {
      return formData[fieldName] || '';
    }
    
    const fieldData = formData[fieldName];
    if (!fieldData || typeof fieldData === 'string') {
      return fieldData || '';
    }
    
    if (language) {
      return fieldData[language] || '';
    }
    
    return fieldData[currentLanguage] || fieldData.en || fieldData.ar || '';
  };

  const getMultilingualNameValue = (lang, field) => {
    if (!enableMultiLanguage) {
      return formData[field] || '';
    }
    
    const fieldData = formData[field];
    if (!fieldData || typeof fieldData === 'string') {
      return fieldData || '';
    }
    
    return fieldData[lang] || '';
  };

  const fields = {
    name: { 
      type: 'text', 
      required: true, 
      icon: BookOpen,
      translationKey: 'classes.form.name',
      multilingual: true
    },
    section: { 
      type: 'text', 
      required: true, 
      icon: Building,
      translationKey: 'classes.form.section',
      multilingual: true
    },
    courseId: { 
      type: 'select', 
      required: true, 
      icon: BookOpen,
      translationKey: 'classes.form.course'
    },
    teacherId: { 
      type: 'select', 
      required: true, 
      icon: User,
      translationKey: 'classes.form.teacher'
    },
    academicYear: { 
      type: 'text', 
      required: true, 
      icon: Calendar,
      translationKey: 'classes.form.academicYear'
    },
    semester: { 
      type: 'select', 
      required: true, 
      icon: Calendar,
      translationKey: 'classes.form.semester'
    },
    days: { 
      type: 'multiselect', 
      required: true, 
      icon: Calendar,
      translationKey: 'classes.form.days'
    },
    startTime: { 
      type: 'time', 
      required: true, 
      icon: Clock,
      translationKey: 'classes.form.startTime'
    },
    endTime: { 
      type: 'time', 
      required: true, 
      icon: Clock,
      translationKey: 'classes.form.endTime'
    },
    maxCapacity: { 
      type: 'number', 
      required: false, 
      icon: Users,
      translationKey: 'classes.form.maxCapacity'
    }
  };

  const daysOfWeek = [
    'Monday',
    'Tuesday', 
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const semesters = ['Spring', 'Fall', 'Summer'];

  const selectedDays = Array.isArray(formData.days) ? formData.days : 
                      (formData.days ? formData.days.split(',') : []);

  const handleDaysToggle = (day) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day];
    
    handleChange('days', newDays);
  };

  const renderSingleLanguageField = (fieldName) => {
    const field = fields[fieldName];
    if (!field) return null;

    if (field.multilingual) {
      return (
        <div className="space-y-2">
          <Label>{t(field.translationKey)}</Label>
          <div className="relative">
            <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              value={getMultilingualNameValue(currentLanguage, fieldName)}
              onChange={(e) => handleMultilingualFieldChange(fieldName, e.target.value, currentLanguage)}
              placeholder={t(field.translationKey)}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (field.type === 'multiselect') {
      return (
        <div className="space-y-3">
          <Label>{t(field.translationKey)}</Label>
          <div className={`flex flex-wrap gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
            {daysOfWeek.map(day => {
              const isSelected = selectedDays.includes(day);
              return (
                <Badge
                  key={day}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleDaysToggle(day)}
                >
                  {t(`timetable.days.${day.toLowerCase()}`)}
                  {isSelected && (
                    <Check className={`inline w-3 h-3 ${currentLanguage === 'ar' ? 'mr-1' : 'ml-1'}`} />
                  )}
                </Badge>
              );
            })}
          </div>
          <input
            type="hidden"
            value={selectedDays.join(',')}
            onChange={() => {}}
          />
          {selectedDays.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('classes.form.selectDays')}
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label>{t(field.translationKey)}</Label>
          <Textarea 
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={t(field.translationKey)}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            className="min-h-[100px]"
          />
        </div>
      );
    }

    if (field.type === 'select') {
      let options = [];
      let placeholderKey = 'classes.form.select';
      
      if (fieldName === 'courseId') {
        options = additionalData.courses || [];
        placeholderKey = 'classes.form.selectCourse';
      } else if (fieldName === 'teacherId') {
        options = additionalData.teachers || [];
        placeholderKey = 'classes.form.selectTeacher';
      } else if (fieldName === 'semester') {
        options = semesters;
        placeholderKey = 'classes.form.selectSemester';
      }

      return (
        <div className="space-y-2">
          <Label>{t(field.translationKey)}</Label>
          <div className="relative">
            <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Select 
              value={formData[fieldName] || ''} 
              onValueChange={(value) => handleChange(fieldName, value)}
            >
              <SelectTrigger className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={t(placeholderKey)} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => {
                  let displayValue = option;
                  if (fieldName === 'courseId' || fieldName === 'teacherId') {
                    displayValue = option.label || option.name || option.value;
                    option = option.value;
                  }
                  
                  return (
                    <SelectItem 
                      key={option} 
                      value={option}
                    >
                      {fieldName === 'semester' ? t(`classes.form.${option}`) || option : displayValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label>{t(field.translationKey)}</Label>
        <div className="relative">
          <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
          <Input
            type={field.type}
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={t(field.translationKey)}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
            min={field.type === 'number' ? 1 : undefined}
            max={field.type === 'number' ? 100 : undefined}
          />
        </div>
      </div>
    );
  };

  const renderDualLanguageField = (fieldName, language) => {
    const field = fields[fieldName];
    if (!field) return null;
    
    const isArabic = language === 'ar';
    const isRTLMode = isArabic;

    if (field.multilingual) {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTLMode ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.arabic')}
                </span>
                <span>{getTranslation(field.translationKey, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(field.translationKey, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} />
            <Input
              value={getMultilingualNameValue(language, fieldName)}
              onChange={(e) => handleMultilingualFieldChange(fieldName, e.target.value, language)}
              placeholder={`${getTranslation(field.translationKey, language)} (${isArabic ? t('common.arabic') : t('common.english')})`}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={isArabic ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (field.type === 'multiselect' && language === 'en') {
      return (
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            {isRTLMode ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation(field.translationKey, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(field.translationKey, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className={`flex flex-wrap gap-2 ${isRTLMode ? 'flex-row-reverse' : ''}`}>
            {daysOfWeek.map(day => {
              const isSelected = selectedDays.includes(day);
              return (
                <Badge
                  key={day}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleDaysToggle(day)}
                >
                  {getTranslation(`timetable.days.${day.toLowerCase()}`, language)}
                  {isSelected && (
                    <Check className={`inline w-3 h-3 ${isRTLMode ? 'mr-1' : 'ml-1'}`} />
                  )}
                </Badge>
              );
            })}
          </div>
          <input
            type="hidden"
            value={selectedDays.join(',')}
            onChange={() => {}}
          />
          {selectedDays.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {getTranslation('classes.form.selectDays', language)}
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'multiselect' && language === 'ar') {
      return (
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {t('common.arabic')}
            </span>
            <span>{getTranslation(field.translationKey, language)}</span>
          </Label>
          <div className="flex flex-wrap gap-2 flex-row-reverse">
            {daysOfWeek.map(day => {
              const isSelected = selectedDays.includes(day);
              return (
                <Badge
                  key={day}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all duration-200 flex-row-reverse ${
                    isSelected 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleDaysToggle(day)}
                >
                  {getTranslation(`timetable.days.${day.toLowerCase()}`, language)}
                  {isSelected && (
                    <Check className="inline w-3 h-3 mr-1" />
                  )}
                </Badge>
              );
            })}
          </div>
          <input
            type="hidden"
            value={selectedDays.join(',')}
            onChange={() => {}}
          />
          {selectedDays.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {getTranslation('classes.form.selectDays', language)}
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTLMode ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
                <span>{getTranslation(field.translationKey, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(field.translationKey, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
              </>
            )}
          </Label>
          <Textarea 
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={getTranslation(field.translationKey, language)}
            dir={isArabic ? 'rtl' : 'ltr'}
            className="min-h-[100px]"
          />
        </div>
      );
    }

    if (field.type === 'select') {
      let options = [];
      let placeholderKey = 'classes.form.select';
      
      if (fieldName === 'courseId') {
        options = additionalData.courses || [];
        placeholderKey = 'classes.form.selectCourse';
      } else if (fieldName === 'teacherId') {
        options = additionalData.teachers || [];
        placeholderKey = 'classes.form.selectTeacher';
      } else if (fieldName === 'semester') {
        options = semesters;
        placeholderKey = 'classes.form.selectSemester';
      }

      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTLMode ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
                <span>{getTranslation(field.translationKey, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(field.translationKey, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${isArabic ? 'right-3' : 'left-3'}`} />
            <Select 
              value={formData[fieldName] || ''} 
              onValueChange={(value) => handleChange(fieldName, value)}
            >
              <SelectTrigger className={isArabic ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={getTranslation(placeholderKey, language)} />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => {
                  let displayValue = option;
                  if (fieldName === 'courseId' || fieldName === 'teacherId') {
                    displayValue = option.label || option.name || option.value;
                    option = option.value;
                  }
                  
                  return (
                    <SelectItem 
                      key={option} 
                      value={option}
                    >
                      {fieldName === 'semester' ? getTranslation(`classes.form.${option}`, language) || option : displayValue}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (fieldName === 'startTime' || fieldName === 'endTime' || fieldName === 'academicYear' || fieldName === 'maxCapacity') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTLMode ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
                <span>{getTranslation(field.translationKey, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(field.translationKey, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                  {isArabic ? t('common.arabic') : t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <field.icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isArabic ? 'right-3' : 'left-3'}`} />
            <Input
              type={field.type}
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={getTranslation(field.translationKey, language)}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={isArabic ? 'pr-10' : 'pl-10'}
              min={field.type === 'number' ? 1 : undefined}
              max={field.type === 'number' ? 100 : undefined}
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
        <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('common.single')}</span>
              <Switch
                checked={inputMode === 'dual'}
                onCheckedChange={toggleInputMode}
                className="data-[state=checked]:bg-green-600"
              />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {inputMode === 'single' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('classes.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('name')}
              {renderSingleLanguageField('section')}
              {renderSingleLanguageField('courseId')}
              {renderSingleLanguageField('teacherId')}
              {renderSingleLanguageField('academicYear')}
              {renderSingleLanguageField('semester')}
              {renderSingleLanguageField('maxCapacity')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('classes.scheduleInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('days')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {renderSingleLanguageField('startTime')}
              {renderSingleLanguageField('endTime')}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('classes.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('name', 'en')}
              {renderDualLanguageField('section', 'en')}
              {renderDualLanguageField('courseId', 'en')}
              {renderDualLanguageField('teacherId', 'en')}
              {renderDualLanguageField('academicYear', 'en')}
              {renderDualLanguageField('semester', 'en')}
              {renderDualLanguageField('maxCapacity', 'en')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('classes.scheduleInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('days', 'en')}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {renderDualLanguageField('startTime', 'en')}
              {renderDualLanguageField('endTime', 'en')}
            </div>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('classes.basicInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('name', 'ar')}
                {renderDualLanguageField('section', 'ar')}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('classes.scheduleInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('days', 'ar')}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassesModalFields;