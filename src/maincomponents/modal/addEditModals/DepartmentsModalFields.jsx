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
import {
  Building,
  User,
  CheckCircle,
  AlertCircle,
  Languages,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';

const DepartmentsModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  teachers = [], 
  enableMultiLanguage = true,
  mode = 'add' 
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  
  const currentLanguage = i18n.language;

  const departmentTypes = [
    { value: 'academic', label: 'departments.types.academic', icon: BookOpen },
    { value: 'administrative', label: 'departments.types.administrative', icon: Briefcase }
  ];

  
  const getTeacherDisplayName = (teacher) => {
    if (!teacher) return '';
    
    
    if (currentLanguage === 'ar' && teacher.nameAr && teacher.nameAr.trim()) {
      return teacher.nameAr;
    }
    if (currentLanguage === 'en' && teacher.nameEn && teacher.nameEn.trim()) {
      return teacher.nameEn;
    }
    
    
    if (teacher.nameAr && teacher.nameAr.trim()) return teacher.nameAr;
    if (teacher.nameEn && teacher.nameEn.trim()) return teacher.nameEn;
    if (teacher.name && teacher.name.trim()) return teacher.name;
    
    return teacher.id || 'Unknown';
  };

  useEffect(() => {
    if (enableMultiLanguage && mode === 'add') {
      if (!formData.name || typeof formData.name === 'string') {
        handleChange('name', { en: '', ar: '' });
      }
      if (!formData.description || typeof formData.description === 'string') {
        handleChange('description', { en: '', ar: '' });
      }
      if (!formData.type) {
        handleChange('type', 'academic');
      }
    }
  }, [mode]);

  const toggleInputMode = () => {
    setInputMode(inputMode === 'single' ? 'dual' : 'single');
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
    const val = formData[field];
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || '';
  };

  const renderSingleLanguageField = (fieldName) => {
    if (fieldName === 'name') {
      return (
        <div className="space-y-2">
          <Label>{t('departments.form.name')}</Label>
          <div className="relative">
            <Building className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              value={getMultiValue('name', currentLanguage)}
              onChange={(e) => handleMultiChange('name', currentLanguage, e.target.value)}
              placeholder={t('departments.form.namePlaceholder')}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'description') {
      return (
        <div className="space-y-2">
          <Label>{t('departments.form.description')}</Label>
          <Textarea
            value={getMultiValue('description', currentLanguage)}
            onChange={(e) => handleMultiChange('description', currentLanguage, e.target.value)}
            placeholder={t('departments.form.descriptionPlaceholder')}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            rows={3}
          />
        </div>
      );
    }

    if (fieldName === 'type') {
      return (
        <div className="space-y-2">
          <Label>{t('departments.form.type')}</Label>
          <Select 
            value={formData.type || 'academic'} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('departments.form.selectType')} />
            </SelectTrigger>
            <SelectContent>
              {departmentTypes.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{t(label)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'headId') {
      return (
        <div className="space-y-2">
          <Label>{t('departments.form.head')}</Label>
          <Select 
            value={formData.headId || ''} 
            onValueChange={(value) => handleChange('headId', value === 'none' ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('departments.form.selectHead')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-gray-500">{t('departments.form.noHead')}</span>
              </SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher._id} value={teacher._id}>
                  <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4" />
                    {/* ✅ Use language-aware name */}
                    <span>{getTeacherDisplayName(teacher)}</span>
                    <span className="text-xs text-gray-500">({teacher.id})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'active' && mode === 'edit') {
      return (
        <div className="space-y-2">
          <Label>{t('departments.form.status')}</Label>
          <Select 
            value={formData.active?.toString() || 'true'} 
            onValueChange={(value) => handleChange('active', value === 'true')}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('departments.status.active')}</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span>{t('departments.status.inactive')}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    return null;
  };

  const renderDualLanguageField = (fieldName, language) => {
    const isAr = language === 'ar';
    const labelBadge = isAr ? (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
        {t('common.arabic')}
      </span>
    ) : (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('common.english')}
      </span>
    );

    const translatedLabel = getTranslation(`departments.form.${fieldName === 'headId' ? 'head' : fieldName}`, language);

    const shouldFlipLabel = (!isRTL && isAr) || (isRTL && !isAr);

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

    if (fieldName === 'name') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <div className="relative">
            <Building className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
            <Input
              value={getMultiValue('name', language)}
              onChange={(e) => handleMultiChange('name', language, e.target.value)}
              placeholder={`${translatedLabel} (${isAr ? t('common.arabic') : t('common.english')})`}
              dir={isAr ? 'rtl' : 'ltr'}
              className={isAr ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'description') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Textarea
            value={getMultiValue('description', language)}
            onChange={(e) => handleMultiChange('description', language, e.target.value)}
            placeholder={`${translatedLabel} (${isAr ? t('common.arabic') : t('common.english')})`}
            dir={isAr ? 'rtl' : 'ltr'}
            rows={3}
          />
        </div>
      );
    }

    if (fieldName === 'type') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Select 
            value={formData.type || 'academic'} 
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger className="w-full" dir={isAr ? 'rtl' : 'ltr'}>
              <SelectValue placeholder={getTranslation('departments.form.selectType', language)} />
            </SelectTrigger>
            <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
              {departmentTypes.map(({ value, label, icon: Icon }) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{getTranslation(label, language)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'headId') {
      
      const getTeacherNameForLanguage = (teacher, lang) => {
        if (!teacher) return '';
        if (lang === 'ar' && teacher.nameAr && teacher.nameAr.trim()) {
          return teacher.nameAr;
        }
        if (lang === 'en' && teacher.nameEn && teacher.nameEn.trim()) {
          return teacher.nameEn;
        }
        return teacher.name || teacher.id || 'Unknown';
      };

      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Select 
            value={formData.headId || ''} 
            onValueChange={(value) => handleChange('headId', value === 'none' ? null : value)}
          >
            <SelectTrigger className="w-full" dir={isAr ? 'rtl' : 'ltr'}>
              <SelectValue placeholder={getTranslation('departments.form.selectHead', language)} />
            </SelectTrigger>
            <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
              <SelectItem value="none">
                <span className="text-gray-500">{getTranslation('departments.form.noHead', language)}</span>
              </SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher._id} value={teacher._id}>
                  <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4" />
                    {/* ✅ Use field-specific language */}
                    <span>{getTeacherNameForLanguage(teacher, language)}</span>
                    <span className="text-xs text-gray-500">({teacher.id})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle Section */}
      {enableMultiLanguage && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
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
                className="data-[state=checked]:bg-purple-600"
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
              <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              {t('departments.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {renderSingleLanguageField('name')}
              {renderSingleLanguageField('description')}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('type')}
                {renderSingleLanguageField('headId')}
              </div>
              {renderSingleLanguageField('active')}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* English Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('departments.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {renderDualLanguageField('name', 'en')}
              {renderDualLanguageField('description', 'en')}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('type', 'en')}
                {renderDualLanguageField('headId', 'en')}
              </div>
            </div>
          </div>

          {/* Arabic Section */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                {t('common.arabic')} {t('departments.basicInfo')}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {renderDualLanguageField('name', 'ar')}
                {renderDualLanguageField('description', 'ar')}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDualLanguageField('type', 'ar')}
                  {renderDualLanguageField('headId', 'ar')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Field - Shared (Single only) */}
          {mode === 'edit' && (
             <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {renderSingleLanguageField('active')}
                </div>
             </div>
          )}
        </>
      )}
      
      {/* Preview Section */}
      {(formData.name?.en || formData.name?.ar) && (
        <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
          <h4 className="text-md font-semibold mb-3 text-purple-800 dark:text-purple-200">
            {isRTL ? 'معاينة' : 'Preview'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {formData.name?.en && (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <span className="text-gray-500 dark:text-gray-400">{t('common.english')}:</span>
                <p className="font-medium text-gray-900 dark:text-white">{formData.name.en}</p>
              </div>
            )}
            {formData.name?.ar && (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg" dir="rtl">
                <span className="text-gray-500 dark:text-gray-400">{t('common.arabic')}:</span>
                <p className="font-medium text-gray-900 dark:text-white">{formData.name.ar}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsModalFields;