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
  SelectValue
} from '../../components/ui/select';
import {
  BookOpen,
  Hash,
  Clock,
  Languages,
  CheckCircle,
  AlertCircle,
  Loader2,
  Layers,
  Users,
  X,
  ChevronDown
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../components/ui/command';

const CoursesModalFields = ({
  formData,
  handleChange,
  isRTL = false,
  teachers = [],
  teachersLoading = false,
  categories = [],
  enableMultiLanguage = true,
  mode = 'add'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const isInitialized = useRef(false);

  
  const currentLanguage = i18n.language;

  const defaultCategories = [
    { value: 'primary', labelEn: 'Primary', labelAr: 'ابتدائي' },
    { value: 'secondary', labelEn: 'Secondary', labelAr: 'ثانوي' },
    { value: 'higher-secondary', labelEn: 'Higher Secondary', labelAr: 'ثانوية عليا' }
  ];

  const categoryOptions = categories.length > 0 ? categories : defaultCategories;

  useEffect(() => {
    if (isInitialized.current) return;
    if (mode !== 'add') return;

    isInitialized.current = true;

    const updates = {};

    if (!formData.name || typeof formData.name === 'string') {
      updates.name = { en: '', ar: '' };
    }
    if (!formData.description || typeof formData.description === 'string') {
      updates.description = { en: '', ar: '' };
    }
    if (!formData.category) {
      updates.category = 'primary';
    }
    if (!formData.creditHours) {
      updates.creditHours = 1;
    }
    if (!formData.teacherIds) {
      updates.teacherIds = [];
    }

    if (Object.keys(updates).length > 0) {
      Object.entries(updates).forEach(([key, value]) => {
        handleChange(key, value);
      });
    }
  }, []);

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

  
  const getTeacherName = (teacher) => {
    if (!teacher) return '';
    
    
    if (typeof teacher.name === 'string') return teacher.name;

    
    if (teacher.name) {
      const langKey = currentLanguage === 'ar' ? 'ar' : 'en';
      
      
      const val = teacher.name[langKey];
      if (typeof val === 'string' && val.trim() !== '') return val;
      if (val && val.firstName) return `${val.firstName} ${val.lastName || ''}`.trim();

      
      const enVal = teacher.name.en;
      if (typeof enVal === 'string') return enVal;
      if (enVal && enVal.firstName) return `${enVal.firstName} ${enVal.lastName || ''}`.trim();
    }

    return teacher.id || ''; 
  };

  const handleTeacherSelect = (teacherId) => {
    const currentTeachers = formData.teacherIds || [];
    const isSelected = currentTeachers.includes(teacherId);

    if (isSelected) {
      handleChange('teacherIds', currentTeachers.filter(id => id !== teacherId));
    } else {
      handleChange('teacherIds', [...currentTeachers, teacherId]);
    }
  };

  const handleRemoveTeacher = (teacherId, e) => {
    e.stopPropagation();
    const currentTeachers = formData.teacherIds || [];
    handleChange('teacherIds', currentTeachers.filter(id => id !== teacherId));
  };

  const getSelectedTeachers = () => {
    const selectedIds = formData.teacherIds || [];
    return teachers.filter(t => selectedIds.includes(t._id));
  };

  const selectedTeachers = getSelectedTeachers();
  const selectedTeacherCount = selectedTeachers.length;

  const renderSingleLanguageField = (fieldName) => {
    if (fieldName === 'name') {
      return (
        <div className="space-y-2">
          <Label>{t('courses.form.name')}</Label>
          <div className="relative">
            <BookOpen className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              value={getMultiValue('name', currentLanguage)}
              onChange={(e) => handleMultiChange('name', currentLanguage, e.target.value)}
              placeholder={t('courses.form.namePlaceholder')}
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
          <Label>{t('courses.form.description')}</Label>
          <Textarea
            value={getMultiValue('description', currentLanguage)}
            onChange={(e) => handleMultiChange('description', currentLanguage, e.target.value)}
            placeholder={t('courses.form.descriptionPlaceholder')}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            rows={3}
          />
        </div>
      );
    }

    if (fieldName === 'code') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-gray-500" />
            {t('courses.form.code')}
          </Label>
          <Input
            value={formData.code || ''}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder={isRTL ? 'مثال: CS101' : 'e.g., CS101'}
            className="w-full font-mono"
            dir="ltr"
          />
        </div>
      );
    }

    if (fieldName === 'category') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-gray-500" />
            {t('courses.form.category')}
          </Label>
          <Select
            value={formData.category || 'primary'}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('courses.form.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{currentLanguage === 'ar' ? cat.labelAr : cat.labelEn}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'creditHours') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            {t('courses.form.creditHours')}
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.creditHours || 1}
            onChange={(e) => handleChange('creditHours', parseInt(e.target.value) || 1)}
            className="w-full"
            dir="ltr"
          />
        </div>
      );
    }

    if (fieldName === 'active' && mode === 'edit') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-gray-500" />
            {t('courses.form.status')}
          </Label>
          <Select
            value={formData.active !== undefined ? formData.active.toString() : 'true'}
            onValueChange={(value) => handleChange('active', value === 'true')}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('courses.status.active')}</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <span>{t('courses.status.inactive')}</span>
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
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
        {t('common.arabic')}
      </span>
    ) : (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('common.english')}
      </span>
    );

    const translatedLabel = getTranslation(`courses.form.${fieldName}`, language);

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
            <BookOpen className={`absolute top-3 w-4 h-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
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

    if (fieldName === 'code') {
       return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Input
            value={formData.code || ''}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            placeholder={isAr ? 'مثال: CS101' : 'e.g., CS101'}
            className="w-full font-mono"
            dir="ltr"
          />
        </div>
       );
    }

    if (fieldName === 'category') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Select
            value={formData.category || 'primary'}
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger className="w-full" dir={isAr ? 'rtl' : 'ltr'}>
              <SelectValue placeholder={getTranslation('courses.form.selectCategory', language)} />
            </SelectTrigger>
            <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (fieldName === 'creditHours') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {labelContent}
          </Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.creditHours || 1}
            onChange={(e) => handleChange('creditHours', parseInt(e.target.value) || 1)}
            className="w-full"
            dir="ltr"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle Section */}
      {enableMultiLanguage && (
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-pink-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg">
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
                className="data-[state=checked]:bg-pink-600"
              />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FIELDS SECTION */}
      {inputMode === 'single' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
              {t('courses.basicInfo')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                {renderSingleLanguageField('name')}
              </div>
              {renderSingleLanguageField('code')}
              {renderSingleLanguageField('category')}
              {renderSingleLanguageField('creditHours')}
              <div className="md:col-span-2">
                {renderSingleLanguageField('description')}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* English Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('courses.basicInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                {renderDualLanguageField('name', 'en')}
              </div>
              {renderDualLanguageField('code', 'en')}
              {renderDualLanguageField('category', 'en')}
              {renderDualLanguageField('creditHours', 'en')}
              <div className="md:col-span-2">
                {renderDualLanguageField('description', 'en')}
              </div>
            </div>
          </div>

          {/* Arabic Section */}
          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-600 dark:text-pink-400">
                <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full" />
                {t('common.arabic')} {t('courses.basicInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  {renderDualLanguageField('name', 'ar')}
                </div>
                {renderDualLanguageField('code', 'ar')}
                {renderDualLanguageField('category', 'ar')}
                {renderDualLanguageField('creditHours', 'ar')}
                <div className="md:col-span-2">
                  {renderDualLanguageField('description', 'ar')}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Teachers Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
          {t('courses.teachers')}
        </h3>

        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            {t('courses.form.assignTeachers')}
          </Label>

          <Popover open={teacherDropdownOpen} onOpenChange={setTeacherDropdownOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-700 transition-colors ${
                  isRTL ? 'flex-row-reverse text-right' : 'text-left'
                }`}
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedTeacherCount > 0
                    ? `${selectedTeacherCount} ${isRTL ? 'معلم محدد' : 'teachers selected'}`
                    : isRTL ? 'اختر المعلمين...' : 'Select teachers...'}
                </span>
                {teachersLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align={isRTL ? 'end' : 'start'}>
              <Command>
                <CommandInput
                  placeholder={isRTL ? 'ابحث عن معلم...' : 'Search teachers...'}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {isRTL ? 'لم يتم العثور على معلمين' : 'No teachers found'}
                  </CommandEmpty>
                  <CommandGroup>
                    {teachers.map((teacher) => {
                      const isSelected = (formData.teacherIds || []).includes(teacher._id);
                      const displayName = getTeacherName(teacher); 
                      return (
                        <CommandItem
                          key={teacher._id}
                          value={displayName} 
                          onSelect={() => handleTeacherSelect(teacher._id)}
                          className={`flex items-center gap-3 cursor-pointer ${
                            isRTL ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-pink-500 border-pink-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && (
                              <CheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                            {displayName.charAt(0) || 'T'}
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {displayName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {teacher.id}
                            </p>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedTeacherCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTeachers.map((teacher) => {
                const displayName = getTeacherName(teacher); 
                return (
                  <Badge
                    key={teacher._id}
                    variant="secondary"
                    className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white text-[10px] font-bold">
                      {displayName.charAt(0) || 'T'}
                    </div>
                    <span className="text-xs font-medium">{displayName}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTeacher(teacher._id, e)}
                      className="ml-1 p-0.5 rounded-full hover:bg-pink-200 dark:hover:bg-pink-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {!teachersLoading && teachers.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              {isRTL ? 'لا يوجد معلمون متاحون' : 'No teachers available'}
            </p>
          )}
        </div>
      </div>

      {/* Status Field (Edit Mode Only) */}
      {mode === 'edit' && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full"></div>
            {t('common.status')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {renderSingleLanguageField('active')}
          </div>
        </div>
      )}

      {/* Preview Section */}
      {(formData.name?.en || formData.name?.ar || formData.code) && (
        <div className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800 rounded-xl">
          <h4 className="text-md font-semibold mb-3 text-pink-800 dark:text-pink-200">
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

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {formData.code && (
              <Badge variant="outline" className="font-mono">
                {formData.code}
              </Badge>
            )}

            {formData.category && (
              <Badge className={`text-xs ${
                formData.category === 'primary'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                  : formData.category === 'secondary'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
              }`}>
                {categoryOptions.find(c => c.value === formData.category)?.[isRTL ? 'labelAr' : 'labelEn'] || formData.category}
              </Badge>
            )}

            {formData.creditHours && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formData.creditHours} {isRTL ? 'ساعات' : 'hrs'}
              </Badge>
            )}

            {selectedTeacherCount > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
                <Users className="w-3 h-3" />
                {selectedTeacherCount} {isRTL ? 'معلم' : 'teachers'}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesModalFields;