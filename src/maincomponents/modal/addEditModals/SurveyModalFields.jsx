import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../maincomponents/components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  HelpCircle, Type, ListChecks,
  Languages, Hash,
  Upload, FileSpreadsheet, FileText, Download, X
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';


const SurveyModalFields = ({
  formData,
  handleChange,
  isRTL = false,
  modalMode = 'add',
  enableMultiLanguage = true,
  currentLanguage = 'en',
  availableCategories, 
  creationMethod,
  setCreationMethod, 
  onExcelFileSelected, 
  excelFile, 
  isExcelUploading, 
  excelUploadError, 
  excelUploadSuccess, 
  clearExcelUpload 
}) => {
  const { t, i18n } = useTranslation();

  const [inputMode, setInputMode] = useState('single');

  const getCategoryLabel = (category) => {
    return t(`survey.categories.${category}`, { defaultValue: category });
  };

  const handleQuestionTextChange = (lang, value) => {
    const updatedQuestionText = {
      ...formData.question,
      [lang]: value
    };
    handleChange('question', updatedQuestionText);
  };

  const getQuestionTextValue = (lang) => {
    return formData.question?.[lang] || '';
  };

  const toggleInputMode = () => {
    setInputMode(inputMode === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      onExcelFileSelected(null, ''); 
      return;
    }

    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      event.target.value = null; 
      onExcelFileSelected(null, t('survey.excel.invalidFileType', { defaultValue: 'Invalid file type. Only .xlsx and .xls files are allowed.' }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { 
      event.target.value = null;
      onExcelFileSelected(null, t('survey.excel.fileTooLarge', { defaultValue: 'File is too large (max 10MB).' }));
      return;
    }
    onExcelFileSelected(file, '');
    event.target.value = null;
  };

  const downloadTemplate = () => {
    toast.success(t('survey.excel.templateDownloaded', { defaultValue: 'Excel template downloaded successfully.' }));

    const templateData = [
      ['question_en', 'question_ar', 'category', 'weight'],
      ['How satisfied are you with the teacher?', 'ما مدى رضاك عن المعلم؟', 'teaching', '1'],
      ['Does the teacher encourage student participation?', 'هل يشجع المعلم مشاركة الطلاب؟', 'behavior', '1.5'],
      ['Is the teacher punctual for classes?', 'هل المعلم دقيق في مواعيد الحصص؟', 'punctuality', '0.8'],
    ];

    const escapeCsv = (value) => {
        if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`; 
        }
        return value;
    };

    const csvContent = templateData.map(row => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher_survey_questions_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const renderSingleLanguageField = (fieldName) => {
    if (fieldName === 'question') {
      return (
        <div className="space-y-2">
          <Label>{t('survey.form.questionText')}</Label>
          <div className="relative">
            <Type className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <textarea
              value={getQuestionTextValue(currentLanguage)}
              onChange={(e) => handleQuestionTextChange(currentLanguage, e.target.value)}
              placeholder={t('survey.form.questionText')}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              rows={3}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                currentLanguage === 'ar' ? 'pr-10 text-left' : 'pl-10 '
              }`}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'category') {
      return (
        <div className="space-y-2">
          <Label>{t('survey.form.category')}</Label>
          <div className="relative">
            <ListChecks className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Select
              value={formData.category || ''}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <SelectValue placeholder={t('survey.form.selectCategory')} />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (fieldName === 'weight') {
      return (
        <div className="space-y-2">
          <Label>{t('survey.form.weight')}</Label>
          <div className="relative">
            <Hash className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
              className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDualLanguageField = (fieldName, language) => {
    if (fieldName === 'question') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {language === 'en' ? (
              isRTL ? (
                <>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                  <span>{getTranslation('survey.form.questionText', language)}</span>
                </>
              ) : (
                <>
                  <span>{getTranslation('survey.form.questionText', language)}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                </>
              )
            ) : (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.arabic')}
                </span>
                <span>{getTranslation('survey.form.questionText', language)}</span>
              </>
            )}
          </Label>
          <div className="relative">
            <Type className={`absolute top-3 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <textarea
              value={getQuestionTextValue(language)}
              onChange={(e) => handleQuestionTextChange(language, e.target.value)}
              placeholder={`${getTranslation('survey.form.questionText', language)} (${
                language === 'en' ? t('common.english') : t('common.arabic')
              })`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              rows={3}
              className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                language === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'
              }`}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'category') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {language === 'en' ? (
              isRTL ? (
                <>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                  <span>{getTranslation('survey.form.category', language)}</span>
                </>
              ) : (
                <>
                  <span>{getTranslation('survey.form.category', language)}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                </>
              )
            ) : (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.arabic')}
                </span>
                <span>{getTranslation('survey.form.category', language)}</span>
              </>
            )}
          </Label>
          <div className="relative">
            <ListChecks className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Select
              value={formData.category || ''}
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className={language === 'ar' ? 'pr-10' : 'pl-10'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <SelectValue placeholder={getTranslation('survey.form.selectCategory', language)} />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {getTranslation(`survey.categories.${category}`, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (fieldName === 'weight') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('survey.form.weight', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('survey.form.weight', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Hash className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderManualCreation = () => (
    <>
      {enableMultiLanguage && (
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
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
                className="data-[state=checked]:bg-blue-600"
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
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('survey.questionInfo')}
            </h3>

            <div className="space-y-4">
              {renderSingleLanguageField('question')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSingleLanguageField('category')}
                {renderSingleLanguageField('weight')}
              </div>

              <div className="space-y-2">
                <Label>{t('survey.form.isActive')}</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active || false}
                    onCheckedChange={(checked) => handleChange('active', checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.active ? t('survey.status.active') : t('survey.status.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('survey.questionInfo')}
            </h3>

            <div className="space-y-4">
              {renderDualLanguageField('question', 'en')}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('category', 'en')}
                {renderDualLanguageField('weight', 'en')}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center justify-between">
                  {isRTL ? (
                    <>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {t('common.english')}
                      </span>
                      <span>{getTranslation('survey.form.isActive', 'en')}</span>
                    </>
                  ) : (
                    <>
                      <span>{getTranslation('survey.form.isActive', 'en')}</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {t('common.english')}
                      </span>
                    </>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.active || false}
                    onCheckedChange={(checked) => handleChange('active', checked)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.active ? t('survey.status.active') : t('survey.status.inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('survey.questionInfo')}
              </h3>

              <div className="space-y-4">
                {renderDualLanguageField('question', 'ar')}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDualLanguageField('category', 'ar')}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderExcelCreation = () => (
    <Card className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="text-center">
            <FileSpreadsheet className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {t('survey.excel.uploadTitle', { defaultValue: 'Bulk Upload Survey Questions' })}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('survey.excel.uploadDescription', { defaultValue: 'Upload an Excel file (.xlsx, .xls) to add multiple survey questions at once.' })}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <Label htmlFor="excel-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                {isExcelUploading ? (
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                    {t('survey.excel.uploading', { defaultValue: 'Processing file...' })}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    {excelFile ? t('survey.excel.fileSelected', { defaultValue: 'File selected, click "Add" to upload' }) : t('survey.excel.clickToUpload', { defaultValue: 'Click to select Excel file' })}
                  </span>
                )}
                <span className="text-xs text-gray-500 mt-1">
                  {t('survey.excel.supportedFormats', { defaultValue: 'Supported formats: .xlsx, .xls' })}
                </span>
                <span className="text-xs text-gray-500">
                  {t('survey.excel.maxSize', { defaultValue: 'Max size: 10MB' })}
                </span>
              </div>
            </Label>
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload} 
              className="hidden"
              disabled={isExcelUploading} 
            />

            {excelFile && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-full border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isExcelUploading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mr-2" />
                    ) : (
                        <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-2" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{excelFile.name}</span>
                  </div>
                  
                  {!isExcelUploading && (
                    <Button
                      type="button"
                      onClick={clearExcelUpload}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {excelUploadError && (
              <Alert variant="destructive" className="mt-4 w-full">
                <AlertDescription>{excelUploadError}</AlertDescription>
              </Alert>
            )}

            {excelUploadSuccess && (
              <Alert className="mt-4 w-full bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <AlertDescription className="text-green-800 dark:text-green-300">
                  {t('survey.excel.uploadSuccessMsg', { defaultValue: 'Excel file processed successfully. Questions have been added.' })}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={downloadTemplate}
              variant="outline"
              className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-300 dark:border-blue-700"
              disabled={isExcelUploading}
            >
              <Download className="h-4 w-4" />
              {t('survey.excel.downloadTemplate', { defaultValue: 'Download Template' })}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {modalMode === 'add' && (
        <div className="mb-6">
          <Label className="block text-sm font-medium mb-3">
            {t('survey.creationMethod', { defaultValue: 'Question Creation Method' })}
          </Label>
          <Tabs
            value={creationMethod} 
            onValueChange={setCreationMethod}
            className="w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <TabsList className={`grid w-full grid-cols-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('survey.methods.manual', { defaultValue: 'Manual Entry' })}
              </TabsTrigger>
              <TabsTrigger value="excel" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                {t('survey.methods.excel', { defaultValue: 'Excel Upload' })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
              {renderManualCreation()}
            </TabsContent>

            <TabsContent value="excel" className="mt-6">
              {renderExcelCreation()}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {modalMode === 'edit' && renderManualCreation()}
    </div>
  );
};

export default SurveyModalFields;