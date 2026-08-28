
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@maincomponents/components/ui/input';
import { Label } from '@maincomponents/components/ui/label';
import { Textarea } from '@maincomponents/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import { Switch } from '@maincomponents/components/ui/switch';
import { Button } from '@maincomponents/components/ui/button';
import { Languages, BookOpen, Calendar, Users, UploadCloud, FileText, X, File, Loader2 } from 'lucide-react';

const AssignmentModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  metaData = {},
  currentLanguage = 'en',
  selectedFiles = [],
  onFileSelect,
  onRemoveFile,
  isLoadingOptions = false
}) => {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    console.log('MetaData Classes:', metaData.classes);
    console.log('MetaData Courses:', metaData.courses);
    console.log('Form Data:', formData);
  }, [metaData, formData]);

  const handleMultilingualChange = useCallback((field, lang, value) => {
    const currentFieldValue = formData[field] || {};
    const updatedValue = {
      ...currentFieldValue,
      [lang]: value
    };
    handleChange(field, updatedValue);
  }, [handleChange, formData]);

  const getMultilingualValue = useCallback((field, lang) => {
    return formData[field]?.[lang] || '';
  }, [formData]);

  const handleFileChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFileSelect]);

  
  const getOptionId = useCallback((option) => {
    if (!option) return '';
    
    return option._id || option.id || option.value || '';
  }, []);

  
  const getOptionDisplayName = useCallback((option) => {
    if (!option) return '';
    
    
    if (option.name && typeof option.name === 'object') {
      return option.name[currentLanguage] || option.name.en || option.name.ar || '';
    }
    
    
    if (typeof option.name === 'string') {
      return option.name;
    }

    
    if (option.label) {
      if (typeof option.label === 'object') {
        return option.label[currentLanguage] || option.label.en || option.label.ar || '';
      }
      return option.label;
    }

    
    if (option.title) {
      if (typeof option.title === 'object') {
        return option.title[currentLanguage] || option.title.en || option.title.ar || '';
      }
      return option.title;
    }
    
    return '';
  }, [currentLanguage]);

  
  const getFormValue = useCallback((value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value._id || value.id || '';
    }
    return String(value);
  }, []);

  const renderLanguageToggle = () => (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {t('common.inputLanguage')}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {inputMode === 'dual' ? t('common.bothLanguagesDesc') : t('common.singleLanguageDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{t('common.single')}</span>
          <Switch 
            checked={inputMode === 'dual'} 
            onCheckedChange={(v) => setInputMode(v ? 'dual' : 'single')} 
          />
          <span className="text-xs text-gray-500">{t('common.dual')}</span>
        </div>
      </div>
    </div>
  );

  const renderTextField = (field, label, multiline = false, lang = null) => {
    const isDual = inputMode === 'dual';
    const language = lang || currentLanguage;
    const value = getMultilingualValue(field, language);
    const direction = language === 'ar' ? 'rtl' : 'ltr';

    return (
      <div className="space-y-2" key={`${field}-${language}`}>
        <Label className="flex items-center justify-between">
          <span>{label}</span>
          {isDual && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              language === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {language === 'en' ? 'English' : 'Arabic'}
            </span>
          )}
        </Label>
        <div className="relative">
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => handleMultilingualChange(field, language, e.target.value)}
              className={`min-h-[100px] ${language === 'ar' ? 'text-left' : ''}`}
              dir={direction}
              placeholder={label}
            />
          ) : (
            <>
              <Input
                value={value}
                onChange={(e) => handleMultilingualChange(field, language, e.target.value)}
                className={language === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'}
                dir={direction}
                placeholder={label}
              />
              <FileText className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                language === 'ar' ? 'right-3' : 'left-3'
              }`} />
            </>
          )}
        </div>
      </div>
    );
  };

  const renderBasicInfoSection = () => {
    if (inputMode === 'single') {
      return (
        <>
          {renderTextField('title', t('common.title'), false)}
          {renderTextField('description', t('common.description'), true)}
        </>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTextField('title', t('common.title') + ' (EN)', false, 'en')}
          {renderTextField('title', t('common.title') + ' (AR)', false, 'ar')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderTextField('description', t('common.description') + ' (EN)', true, 'en')}
          {renderTextField('description', t('common.description') + ' (AR)', true, 'ar')}
        </div>
      </>
    );
  };

  const renderSettingsSection = () => {
    
    const classes = metaData.classes || [];
    const courses = metaData.courses || [];

    
    const currentClassId = getFormValue(formData.classId);
    const currentCourseId = getFormValue(formData.courseId);

    console.log('Rendering Settings - currentClassId:', currentClassId);
    console.log('Rendering Settings - classes:', classes);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class Selection */}
        <div className="space-y-2">
          <Label>{t('classes.class')} *</Label>
          <div className="relative">
            <Users className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none ${
              isRTL ? 'right-3' : 'left-3'
            }`} />
            <Select 
              value={currentClassId}
              onValueChange={(value) => {
                console.log('Class selected:', value);
                handleChange('classId', value);
              }}
              disabled={isLoadingOptions}
            >
              <SelectTrigger className={`${isRTL ? 'pr-10' : 'pl-10'}`}>
                {isLoadingOptions ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t('common.selectClass')}>
                    {currentClassId && classes.length > 0 
                      ? getOptionDisplayName(classes.find(c => getOptionId(c) === currentClassId))
                      : t('common.selectClass')
                    }
                  </SelectValue>
                )}
              </SelectTrigger>
              <SelectContent>
                {classes.length === 0 ? (
                  <div className="p-2 text-center text-gray-500 text-sm">
                    {t('common.noClassesAvailable')}
                  </div>
                ) : (
                  classes.map((c) => {
                    const optionId = getOptionId(c);
                    const displayName = getOptionDisplayName(c);
                    
                    if (!optionId) {
                      console.warn('Class option missing ID:', c);
                      return null;
                    }

                    return (
                      <SelectItem 
                        key={optionId} 
                        value={optionId}
                      >
                        {displayName || `Class ${optionId}`}
                      </SelectItem>
                    );
                  }).filter(Boolean)
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course Selection */}
        <div className="space-y-2">
          <Label>{t('courses.course')} *</Label>
          <div className="relative">
            <BookOpen className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none ${
              isRTL ? 'right-3' : 'left-3'
            }`} />
            <Select 
              value={currentCourseId}
              onValueChange={(value) => {
                console.log('Course selected:', value);
                handleChange('courseId', value);
              }}
              disabled={isLoadingOptions}
            >
              <SelectTrigger className={`${isRTL ? 'pr-10' : 'pl-10'}`}>
                {isLoadingOptions ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t('common.selectCourse')}>
                    {currentCourseId && courses.length > 0 
                      ? getOptionDisplayName(courses.find(c => getOptionId(c) === currentCourseId))
                      : t('common.selectCourse')
                    }
                  </SelectValue>
                )}
              </SelectTrigger>
              <SelectContent>
                {courses.length === 0 ? (
                  <div className="p-2 text-center text-gray-500 text-sm">
                    {t('common.noCoursesAvailable')}
                  </div>
                ) : (
                  courses.map((c) => {
                    const optionId = getOptionId(c);
                    const displayName = getOptionDisplayName(c);
                    
                    if (!optionId) {
                      console.warn('Course option missing ID:', c);
                      return null;
                    }

                    return (
                      <SelectItem 
                        key={optionId} 
                        value={optionId}
                      >
                        {displayName || `Course ${optionId}`}
                      </SelectItem>
                    );
                  }).filter(Boolean)
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>{t('common.dueDate')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none ${
              isRTL ? 'right-3' : 'left-3'
            }`} />
            <Input 
              type="datetime-local" 
              value={formData.dueDate || ''} 
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>

        {/* Marks */}
        <div className="space-y-2">
          <Label>{t('common.totalMarks')}</Label>
          <Input 
            type="number" 
            value={formData.totalMarks || 100} 
            onChange={(e) => handleChange('totalMarks', parseInt(e.target.value) || 100)}
            placeholder="100"
            min={0}
          />
        </div>
      </div>
    );
  };

  const renderFileUpload = () => (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
      />
      
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <UploadCloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
        <p className="text-sm font-medium">{t('common.uploadFiles')}</p>
        <p className="text-xs text-gray-500 mt-1">{t('common.dragDrop')}</p>
        <p className="text-xs text-gray-400 mt-2">
          PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, GIF
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label>{t('common.selectedFiles')} ({selectedFiles.length})</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile?.(index)}
                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderLanguageToggle()}

      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          {t('common.basicInfo')}
        </h3>
        <div className="grid gap-4">
          {renderBasicInfoSection()}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          {t('common.settings')}
        </h3>
        {renderSettingsSection()}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="space-y-0.5">
          <Label>{t('assignments.visibleToStudents')}</Label>
          <p className="text-xs text-gray-500">{t('assignments.visibleDesc')}</p>
        </div>
        <Switch 
          checked={formData.visibleToStudents ?? true} 
          onCheckedChange={(v) => handleChange('visibleToStudents', v)} 
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          {t('common.attachments')}
        </h3>
        {renderFileUpload()}
      </div>
    </div>
  );
};

export default React.memo(AssignmentModalFields);