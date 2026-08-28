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
  BookOpen,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Tag,
  Languages,
  School, // Added for class icon
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

const FeeModalFields = ({
  formData,
  handleChange, // Top-level form field changes
  handleComponentChange, // Specific for component array items
  handleAddComponent,
  handleRemoveComponent,
  isRTL = false,
  enableMultiLanguage = true,
  mode = 'add',
  classOptions = [], // <-- ACCEPT classOptions PROP
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  const currentLanguage = i18n.language;

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) return i18n.getFixedT(lang)(key);
    return t(key);
  };

  // Helper to retrieve value from multi-language object or string
  const getFieldValue = (fieldValue, language = null) => {
    if (!enableMultiLanguage) return fieldValue || ''; // Fallback for non-multilang or disabled
    if (typeof fieldValue === 'string') return fieldValue; // If it's a simple string, return it
    if (fieldValue && typeof fieldValue === 'object') {
      const lang = language || currentLanguage;
      return fieldValue[lang] || fieldValue.en || fieldValue.ar || '';
    }
    return '';
  };

  // Helper to render labels with language badges
  const DualLabel = ({ label, language }) => {
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

    const shouldFlip = (!isRTL && isAr) || (isRTL && !isAr);

    return (
      <Label className="flex items-center justify-between">
        {shouldFlip ? <>{labelBadge}<span>{label}</span></> : <><span>{label}</span>{labelBadge}</>}
      </Label>
    );
  };

  const frequencyOptions = [
    { value: 'one-time', label: 'fee.frequencies.oneTime' },
    { value: 'monthly', label: 'fee.frequencies.monthly' },
    { value: 'quarterly', label: 'fee.frequencies.quarterly' },
    { value: 'half-yearly', label: 'fee.frequencies.halfYearly' },
    { value: 'yearly', label: 'fee.frequencies.yearly' }
  ];

  // Helper to get the display name for a class from its ID/Value
  const getClassNameByValue = (classValue) => { // Changed name from ById to ByValue
    // Find by 'value' not '_id'
    const classObj = classOptions.find(option => option.value === classValue);
    // Return 'label' directly as it's already a string
    return classObj ? classObj.label : t('common.selectClass');
  };

  const renderSharedBasicInfo = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="academicYear">{t('fee.form.academicYear')}</Label>
        <div className="relative">
          <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Select value={formData.academicYear} onValueChange={(value) => handleChange('academicYear', value)}>
            <SelectTrigger className={`w-full ${isRTL ? 'pr-10' : 'pl-10'}`}>
              <SelectValue placeholder={getTranslation('fee.form.selectAcademicYear')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-2025">2024-2025</SelectItem>
              <SelectItem value="2023-2024">2023-2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Class Select Field */}
      <div className="space-y-2">
        <Label htmlFor="classId">{t('common.className')}</Label>
        <div className="relative">
          <School className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Select value={formData.classId} onValueChange={(value) => handleChange('classId', value)}>
            <SelectTrigger className={`w-full ${isRTL ? 'pr-10' : 'pl-10'}`}>
              <SelectValue placeholder={t('common.selectClass')}>
                {/* Display the label for the selected value */}
                {formData.classId === 'all-classes' ? t('fee.allClasses') : (formData.classId ? getClassNameByValue(formData.classId) : t('common.selectClass'))}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {/* Option for no specific class, using "all-classes" instead of empty string */}
              <SelectItem value="all-classes">{t('fee.allClasses')}</SelectItem>
              {classOptions.map(classItem => (
                // Use 'value' for key and value, and 'label' for display
                <SelectItem key={classItem.value} value={classItem.value}>
                  {classItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const renderComponentCard = (component, index) => {
    // This function remains largely the same, no need to duplicate here
    // It should correctly use `getFieldValue` for component names
    if (inputMode === 'dual') {
      return (
          <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h4 className="font-medium text-blue-600 dark:text-blue-400">{t('fee.component')} {index + 1}</h4>
                  {(formData.components || []).length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveComponent(index)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                  )}
              </div>

              {/* English Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                      <div className="space-y-2">
                          <DualLabel label={getTranslation('fee.form.componentName', 'en')} language="en" />
                          <Input
                              value={getFieldValue(component.name, 'en')}
                              onChange={(e) => handleComponentChange(index, 'name', e.target.value, 'en')}
                              placeholder={`${t('fee.form.componentNamePlaceholder')} (English)`}
                              dir="ltr"
                              className="mt-1"
                          />
                      </div>
                  </div>

                  {/* Shared Fields */}
                  <div>
                      <Label>{t('fee.form.amount')}</Label>
                      <div className="relative mt-1">
                          <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                          <Input
                              type="number"
                              value={component.amount || ''}
                              onChange={(e) => handleComponentChange(index, 'amount', e.target.value)}
                              placeholder="0"
                              className={isRTL ? 'pr-10' : 'pl-10'}
                          />
                      </div>
                  </div>
                  <div>
                      <Label>{t('fee.form.frequency')}</Label>
                      <Select value={component.frequency || 'yearly'} onValueChange={(value) => handleComponentChange(index, 'frequency', value)}>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t('fee.form.selectFrequency')} /></SelectTrigger>
                          <SelectContent>
                              {frequencyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{t(opt.label)}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label>{t('fee.form.dueDate')}</Label>
                      <Input type="date" value={component.dueDate || ''} onChange={(e) => handleComponentChange(index, 'dueDate', e.target.value)} className="mt-1" />
                  </div>
                  <div className="flex items-center gap-3 mt-8">
                      <input
                          type="checkbox"
                          id={`component-optional-${index}`}
                          checked={component.optional || false}
                          onChange={(e) => handleComponentChange(index, 'optional', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <Label htmlFor={`component-optional-${index}`} className="text-sm text-gray-600 dark:text-gray-400">{t('fee.form.optional')}</Label>
                  </div>
              </div>

              {/* Arabic Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="space-y-2">
                      <DualLabel label={getTranslation('fee.form.componentName', 'ar')} language="ar" />
                      <Input
                          value={getFieldValue(component.name, 'ar')}
                          onChange={(e) => handleComponentChange(index, 'name', e.target.value, 'ar')}
                          placeholder={`${t('fee.form.componentNamePlaceholder')} (العربية)`}
                          dir="rtl"
                          className="mt-1 text-right"
                      />
                  </div>
              </div>
          </div>
      );
    }

    // Single Mode
    return (
        <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className="font-medium text-gray-900 dark:text-white">{t('fee.component')} {index + 1}</h4>
                {(formData.components || []).length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveComponent(index)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Label>{t('fee.form.componentName')}</Label>
                    <Input
                        value={getFieldValue(component.name)}
                        onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                        placeholder={t('fee.form.componentNamePlaceholder')}
                        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                        className="mt-1"
                    />
                </div>
                <div>
                    <Label>{t('fee.form.amount')}</Label>
                    <div className="relative mt-1">
                        <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <Input type="number" value={component.amount || ''} onChange={(e) => handleComponentChange(index, 'amount', e.target.value)} className={isRTL ? 'pr-10' : 'pl-10'} />
                    </div>
                </div>
                <div>
                    <Label>{t('fee.form.frequency')}</Label>
                    <Select value={component.frequency || 'yearly'} onValueChange={(value) => handleComponentChange(index, 'frequency', value)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={t('fee.form.selectFrequency')} /></SelectTrigger>
                        <SelectContent>
                            {frequencyOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{t(opt.label)}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>{t('fee.form.dueDate')}</Label>
                    <Input type="date" value={component.dueDate || ''} onChange={(e) => handleComponentChange(index, 'dueDate', e.target.value)} className="mt-1" />
                </div>
                <div className="flex items-center gap-3 mt-8">
                    <input type="checkbox" checked={component.optional || false} onChange={(e) => handleComponentChange(index, 'optional', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-teal-600" />
                    <Label className="text-sm text-gray-600">{t('fee.form.optional')}</Label>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {enableMultiLanguage && (
        <div className="p-5 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-teal-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
                <Languages className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('common.inputLanguage')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {inputMode === 'dual' ? t('common.bothLanguagesDesc') : t('common.singleLanguageDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('common.single')}</span>
              <Switch checked={inputMode === 'dual'} onCheckedChange={toggleInputMode} className="data-[state=checked]:bg-teal-600" />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t('fee.basicInfo')}</h3>
        {inputMode === 'dual' ? (
            <div className="space-y-4">
                {/* English Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <DualLabel label={getTranslation('fee.form.name', 'en')} language="en" />
                        <div className="relative">
                            <Tag className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 left-3" />
                            <Input
                                value={getFieldValue(formData.name, 'en')}
                                onChange={(e) => handleChange('name', e.target.value, 'en')}
                                placeholder={`${t('fee.form.name')} (English)`}
                                dir="ltr"
                                className="pl-10"
                            />
                        </div>
                    </div>
                    {renderSharedBasicInfo()} {/* Academic Year AND Class Select */}
                </div>

                {/* Arabic Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <DualLabel label={getTranslation('fee.form.name', 'ar')} language="ar" />
                            <div className="relative">
                                <Tag className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 right-3" />
                                <Input
                                    value={getFieldValue(formData.name, 'ar')}
                                    onChange={(e) => handleChange('name', e.target.value, 'ar')}
                                    placeholder={`${t('fee.form.name')} (العربية)`}
                                    dir="rtl"
                                    className="pr-10 text-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('fee.form.name')}</Label>
                    <div className="relative">
                        <Tag className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <Input
                            id="name"
                            value={getFieldValue(formData.name)}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder={t('fee.form.name')}
                            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                            className={isRTL ? 'pr-10' : 'pl-10'}
                        />
                    </div>
                </div>
                {renderSharedBasicInfo()} {/* Academic Year AND Class Select */}
            </div>
        )}
      </div>

      {/* Components */}
      <div>
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('fee.components')}</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAddComponent} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('fee.addComponent')}
          </Button>
        </div>
        <div className="space-y-4">
          {(formData.components || []).map((component, index) => renderComponentCard(component, index))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-4 rounded-lg">
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <DollarSign className="h-5 w-5 text-teal-600" />
          {t('fee.totalAmount')}
        </h3>
        <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-400">{t('fee.totalComponents')}</span>
            <span className="font-semibold">{(formData.components || []).length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">{t('fee.calculatedAmount')}</span>
            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
              ₪{(formData.components || []).reduce((sum, comp) => sum + (parseFloat(comp.amount) || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeModalFields;