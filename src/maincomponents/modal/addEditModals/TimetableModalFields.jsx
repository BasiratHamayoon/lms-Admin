import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  Building,
  Users,
  Languages,
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  Layers,
  Hash
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';

const TimetableModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  classes = [],
  classesLoading = false,
  courses = [],
  coursesLoading = false,
  teachers = [],
  teachersLoading = false,
  onFileChange,
  selectedFile = null,
  mode = 'add',
  enableMultiLanguage = true
}) => {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef(null);
  const [inputMode, setInputMode] = useState('single'); 
  const [dragOver, setDragOver] = useState(false);
  const isInitialized = useRef(false);

  // Use the current system language for Single mode
  const currentLanguage = i18n.language;

  useEffect(() => {
    if (isInitialized.current) return;
    if (mode !== 'add') return;

    isInitialized.current = true;
    
    // Initialize multilingual fields if they are strings or empty
    const updates = {};
    const multilingualFields = ['academicYear', 'level', 'semester', 'section'];

    multilingualFields.forEach(field => {
        if (!formData[field] || typeof formData[field] === 'string') {
            updates[field] = { en: '', ar: '' };
        }
    });

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

  // File Upload Handlers
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      onFileChange && onFileChange(file);
    } else {
      alert(isRTL ? 'يرجى اختيار ملف Excel أو CSV' : 'Please select an Excel or CSV file');
    }
  };

  const removeFile = () => {
    onFileChange && onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- RENDER FUNCTIONS ---

  const renderSingleLanguageField = (fieldName) => {
    // 1. Text Fields (Multilingual)
    if (['academicYear', 'level', 'semester', 'section'].includes(fieldName)) {
        let labelKey = `timetable.${fieldName}`;
        let placeholderKey = fieldName === 'academicYear' ? '2024-2025' : 
                             fieldName === 'level' ? 'MS, BS' : 
                             fieldName === 'semester' ? '1, 2' : 'A, B';
        let Icon = fieldName === 'academicYear' ? Calendar :
                   fieldName === 'level' ? Layers :
                   fieldName === 'semester' ? BookOpen : Building;

        return (
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {t(labelKey)}
                </Label>
                <Input
                    value={getMultiValue(fieldName, currentLanguage)}
                    onChange={(e) => handleMultiChange(fieldName, currentLanguage, e.target.value)}
                    placeholder={`${t('common.example', 'e.g.')}: ${placeholderKey}`}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
                />
            </div>
        );
    }

    // 2. Select Fields (Shared Value)
    if (['classId', 'courseId', 'teacherId'].includes(fieldName)) {
        let labelKey = fieldName === 'classId' ? 'timetable.class' :
                       fieldName === 'courseId' ? 'timetable.subject' : 'timetable.teacher';
        let Icon = fieldName === 'classId' ? Users :
                   fieldName === 'courseId' ? BookOpen : User;
        let list = fieldName === 'classId' ? classes :
                   fieldName === 'courseId' ? courses : teachers;
        let loading = fieldName === 'classId' ? classesLoading :
                      fieldName === 'courseId' ? coursesLoading : teachersLoading;

        return (
            <div className="space-y-2">
                <Label className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {t(labelKey)}
                    {fieldName === 'classId' && <span className="text-red-500">*</span>}
                </Label>
                <Select
                    value={formData[fieldName] || ''}
                    onValueChange={(value) => handleChange(fieldName, value)}
                    disabled={loading}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={loading ? t('common.loading') : t('timetable.select')} />
                    </SelectTrigger>
                    <SelectContent>
                        {list.length === 0 ? (
                            <SelectItem value="no-options" disabled>{t('timetable.noClassesFound')}</SelectItem>
                        ) : (
                            list.map((option) => (
                                <SelectItem key={option._id} value={option._id}>
                                    {option.name}
                                </SelectItem>
                            ))
                        )}
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
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
        {t('common.arabic')}
      </span>
    ) : (
      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {t('common.english')}
      </span>
    );

    // Swap logic
    const shouldFlipLabel = (!isRTL && isAr) || (isRTL && !isAr);

    // 1. Text Fields (Multilingual)
    if (['academicYear', 'level', 'semester', 'section'].includes(fieldName)) {
        let labelKey = `timetable.${fieldName}`;
        let placeholderKey = fieldName === 'academicYear' ? '2024-2025' : 
                             fieldName === 'level' ? 'MS, BS' : 
                             fieldName === 'semester' ? '1, 2' : 'A, B';
        let Icon = fieldName === 'academicYear' ? Calendar :
                   fieldName === 'level' ? Layers :
                   fieldName === 'semester' ? BookOpen : Building;
        
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
                        value={getMultiValue(fieldName, language)}
                        onChange={(e) => handleMultiChange(fieldName, language, e.target.value)}
                        placeholder={`${translatedLabel} (${isAr ? t('common.arabic') : t('common.english')})`}
                        dir={isAr ? 'rtl' : 'ltr'}
                        className={isAr ? 'pr-10' : 'pl-10'}
                    />
                </div>
            </div>
        );
    }

    // 2. Select Fields (Shared Value) - Rendered in both columns for grid consistency
    if (['classId', 'courseId', 'teacherId'].includes(fieldName)) {
        let labelKey = fieldName === 'classId' ? 'timetable.class' :
                       fieldName === 'courseId' ? 'timetable.subject' : 'timetable.teacher';
        let Icon = fieldName === 'classId' ? Users :
                   fieldName === 'courseId' ? BookOpen : User;
        let list = fieldName === 'classId' ? classes :
                   fieldName === 'courseId' ? courses : teachers;
        let loading = fieldName === 'classId' ? classesLoading :
                      fieldName === 'courseId' ? coursesLoading : teachersLoading;

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
                <Select
                    value={formData[fieldName] || ''}
                    onValueChange={(value) => handleChange(fieldName, value)}
                    disabled={loading}
                >
                    <SelectTrigger className="w-full" dir={isAr ? 'rtl' : 'ltr'}>
                        <SelectValue placeholder={loading ? getTranslation('common.loading', language) : getTranslation('timetable.select', language)} />
                    </SelectTrigger>
                    <SelectContent dir={isAr ? 'rtl' : 'ltr'}>
                        {list.length === 0 ? (
                            <SelectItem value="no-options" disabled>{getTranslation('timetable.noClassesFound', language)}</SelectItem>
                        ) : (
                            list.map((option) => (
                                <SelectItem key={option._id} value={option._id}>
                                    {option.name}
                                </SelectItem>
                            ))
                        )}
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
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-indigo-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
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
                className="data-[state=checked]:bg-indigo-600"
              />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {/* INPUT FIELDS */}
      {inputMode === 'single' ? (
        <>
            {/* Class & Academic Info */}
            <div>
                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                    {t('timetable.basicInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderSingleLanguageField('classId')}
                    {renderSingleLanguageField('academicYear')}
                    {renderSingleLanguageField('level')}
                    {renderSingleLanguageField('semester')}
                    {renderSingleLanguageField('section')}
                    {renderSingleLanguageField('courseId')}
                    {renderSingleLanguageField('teacherId')}
                </div>
            </div>
        </>
      ) : (
        <>
            {/* English Section */}
            <div>
                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {t('common.english')} {t('timetable.basicInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDualLanguageField('classId', 'en')}
                    {renderDualLanguageField('academicYear', 'en')}
                    {renderDualLanguageField('level', 'en')}
                    {renderDualLanguageField('semester', 'en')}
                    {renderDualLanguageField('section', 'en')}
                    {renderDualLanguageField('courseId', 'en')}
                    {renderDualLanguageField('teacherId', 'en')}
                </div>
            </div>

            {/* Arabic Section */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
                 <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                    {t('common.arabic')} {t('timetable.basicInfo')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderDualLanguageField('classId', 'ar')}
                    {renderDualLanguageField('academicYear', 'ar')}
                    {renderDualLanguageField('level', 'ar')}
                    {renderDualLanguageField('semester', 'ar')}
                    {renderDualLanguageField('section', 'ar')}
                    {renderDualLanguageField('courseId', 'ar')}
                    {renderDualLanguageField('teacherId', 'ar')}
                </div>
            </div>
        </>
      )}

      {/* File Upload Section - Always Visible / Not Duplicated */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          {t('timetable.schedule')}
        </h3>
        
        <div className="space-y-4">
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${dragOver 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                ${dragOver 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                  : 'bg-gray-100 dark:bg-gray-700'
                }
              `}>
                <Upload className={`w-8 h-8 ${dragOver ? 'text-indigo-600' : 'text-gray-400'}`} />
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isRTL ? 'اسحب وأفلت الملف هنا' : 'Drag and drop file here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isRTL ? 'أو انقر للاختيار' : 'or click to browse'}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">.xlsx</Badge>
                <Badge variant="outline" className="text-xs">.xls</Badge>
                <Badge variant="outline" className="text-xs">.csv</Badge>
              </div>
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              {isRTL ? 'صيغة الملف المطلوبة' : 'Required File Format'}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">day</Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">startTime</Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">endTime</Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">room</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Active Status & Preview */}
      <div>
         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
            <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-gray-900 dark:text-white">
                {isRTL ? 'الجدول الزمني نشط' : 'Timetable Active'}
                </p>
            </div>
            <Switch
                checked={formData.active !== false}
                onCheckedChange={(checked) => handleChange('active', checked)}
                className="data-[state=checked]:bg-green-600"
            />
        </div>

        {/* Summary Preview */}
        {(formData.classId || formData.academicYear?.en || formData.academicYear?.ar) && (
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <h4 className="text-md font-semibold mb-4 text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('timetable.classSummary')}
            </h4>
            
            <div className="space-y-3 text-sm">
                {formData.classId && (
                <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-600">{t('timetable.class')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                    {classes.find(c => c._id === formData.classId)?.name || formData.classId}
                    </span>
                </div>
                )}
                
                {(formData.academicYear?.en || formData.academicYear?.ar) && (
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600">{t('timetable.academicYear')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {formData.academicYear?.[currentLanguage] || formData.academicYear?.en || formData.academicYear?.ar}
                    </span>
                </div>
                )}

                 {(formData.level?.en || formData.level?.ar) && (
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">{t('timetable.level')}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {formData.level?.[currentLanguage] || formData.level?.en}
                    </span>
                </div>
                )}
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TimetableModalFields;