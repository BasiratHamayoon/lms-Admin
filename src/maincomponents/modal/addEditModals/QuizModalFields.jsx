import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@maincomponents/components/ui/input';
import { Label } from '@maincomponents/components/ui/label';
import { Textarea } from '@maincomponents/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maincomponents/components/ui/select';
import { Switch } from '@maincomponents/components/ui/switch';
import { Button } from '@maincomponents/components/ui/button';
import { Languages, Calendar, Users, FileText, Plus, Trash2, FileSpreadsheet, Upload } from 'lucide-react';

const QuizModalFields = ({
  formData,
  handleChange,
  isRTL = false,
  metaData = {},
  currentLanguage = 'en',
  selectedFile,
  onFileSelect,
  onDownloadTemplate,
  optionsLoading = false
}) => {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  const [questions, setQuestions] = useState(formData.questions || []);
  const [activeTab, setActiveTab] = useState('basic');

  // Helper Functions
  const getOptionId = useCallback((option) => {
    if (!option) return '';
    return option._id || option.id || option.value || '';
  }, []);

  const getOptionDisplayName = useCallback((option) => {
    if (!option) return '';
    if (option.label) return option.label;
    if (option.name && typeof option.name === 'object') {
      return option.name[currentLanguage] || option.name.en || option.name.ar || '';
    }
    if (typeof option.name === 'string') return option.name;
    return '';
  }, [currentLanguage]);

  const getFormValue = useCallback((value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value._id || value.id || value.value || '';
    }
    return String(value);
  }, []);

  const handleMultilingualChange = useCallback((field, lang, value) => {
    const currentFieldValue = formData[field] || {};
    const updatedValue = { ...currentFieldValue, [lang]: value };
    handleChange(field, updatedValue);
  }, [handleChange, formData]);

  const getMultilingualValue = useCallback((field, lang) => {
    return formData[field]?.[lang] || '';
  }, [formData]);

  const handleQuestionChange = useCallback((index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const handleOptionChange = useCallback((qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const addQuestion = useCallback(() => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
      questionType: 'multiple-choice'
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const removeQuestion = useCallback((index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const addOption = useCallback((qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push('');
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const removeOption = useCallback((qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(updatedQuestions);
    handleChange('questions', updatedQuestions);
  }, [questions, handleChange]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  }, [onFileSelect]);

  // Render Language Toggle
  const renderLanguageToggle = () => (
    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-100 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{t('common.inputLanguage')}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {inputMode === 'dual' ? t('common.bothLanguagesDesc') : t('common.singleLanguageDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{t('common.single')}</span>
          <Switch checked={inputMode === 'dual'} onCheckedChange={(v) => setInputMode(v ? 'dual' : 'single')} />
          <span className="text-xs text-gray-500">{t('common.dual')}</span>
        </div>
      </div>
    </div>
  );

  // Render Text Field
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
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${language === 'en' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
              {language === 'en' ? 'English' : 'Arabic'}
            </span>
          )}
        </Label>
        {multiline ? (
          <Textarea
            value={value}
            onChange={(e) => handleMultilingualChange(field, language, e.target.value)}
            className={`min-h-[100px] ${language === 'ar' ? 'text-right' : 'text-left'}`}
            dir={direction}
            placeholder={label}
          />
        ) : (
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => handleMultilingualChange(field, language, e.target.value)}
              className={language === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'}
              dir={direction}
              placeholder={label}
            />
            <FileText className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          </div>
        )}
      </div>
    );
  };

  // Render Settings Section
  const renderSettingsSection = () => {
    const classes = metaData.classes || [];
    const currentClassId = getFormValue(formData.classId);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Class Selection */}
        <div className="space-y-2">
          <Label>{t('classes.class')} *</Label>
          <div className="relative">
            <Users className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Select
              value={currentClassId}
              onValueChange={(v) => handleChange('classId', v)}
              disabled={optionsLoading}
            >
              <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={t('common.selectClass')}>
                  {currentClassId && classes.length > 0
                    ? getOptionDisplayName(classes.find(c => getOptionId(c) === currentClassId))
                    : t('common.selectClass')
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => {
                  const optionId = getOptionId(c);
                  if (!optionId) return null;
                  return (
                    <SelectItem key={optionId} value={optionId}>
                      {getOptionDisplayName(c)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label>{t('common.dueDate')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="datetime-local"
              value={formData.dueDate || ''}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>

        {/* Total Marks */}
        <div className="space-y-2">
          <Label>{t('common.totalMarks')}</Label>
          <Input
            type="number"
            value={formData.totalMarks || 100}
            onChange={(e) => handleChange('totalMarks', parseInt(e.target.value) || 100)}
            placeholder="100"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>{t('common.status')}</Label>
          <Select
            value={formData.status || 'draft'}
            onValueChange={(v) => handleChange('status', v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t('status.draft')}</SelectItem>
              <SelectItem value="published">{t('status.published')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  // Render File Upload Section
  const renderFileUploadSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{t('quizzes.uploadExcel')}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDownloadTemplate}
          className="text-green-600 border-green-200"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {t('quizzes.downloadTemplate')}
        </Button>
      </div>

      <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors block">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
        {selectedFile ? (
          <p className="text-sm font-medium text-green-600">{selectedFile.name}</p>
        ) : (
          <>
            <p className="text-sm font-medium">{t('quizzes.dragDropExcel')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('quizzes.supportedFormats')}</p>
          </>
        )}
      </label>
    </div>
  );

  // Render Questions Section
  const renderQuestionsSection = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{t('quizzes.questions')} ({questions.length})</h4>
        <Button type="button" onClick={addQuestion} size="sm" className="gap-2 bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4" />
          {t('quizzes.addQuestion')}
        </Button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Label className="mb-2 block">{t('quizzes.question')} {qIndex + 1}</Label>
                <Input
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                  placeholder={t('quizzes.questionText')}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">{t('quizzes.questionType')}</Label>
                <Select
                  value={question.questionType}
                  onValueChange={(v) => handleQuestionChange(qIndex, 'questionType', v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-choice">{t('quizzes.multipleChoice')}</SelectItem>
                    <SelectItem value="true-false">{t('quizzes.trueFalse')}</SelectItem>
                    <SelectItem value="short-answer">{t('quizzes.shortAnswer')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">{t('common.marks')}</Label>
                <Input
                  type="number"
                  value={question.marks}
                  onChange={(e) => handleQuestionChange(qIndex, 'marks', parseInt(e.target.value) || 1)}
                  className="h-9"
                />
              </div>
            </div>

            {/* Options for multiple choice / true-false */}
            {(question.questionType === 'multiple-choice' || question.questionType === 'true-false') && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs">{t('quizzes.options')}</Label>
                  {question.questionType === 'multiple-choice' && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                      className="h-7 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {t('common.add')}
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`${t('quizzes.option')} ${oIndex + 1}`}
                        className="flex-1 h-9"
                      />
                      <Button
                        type="button"
                        variant={question.correctAnswer === option && option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleQuestionChange(qIndex, 'correctAnswer', option)}
                        className={`h-9 text-xs ${question.correctAnswer === option && option ? 'bg-green-500' : ''}`}
                        disabled={!option}
                      >
                        {t('quizzes.correct')}
                      </Button>
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="h-9 w-9 text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer for short answer */}
            {question.questionType === 'short-answer' && (
              <div>
                <Label className="text-xs">{t('quizzes.correctAnswer')}</Label>
                <Input
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                  placeholder={t('quizzes.enterAnswer')}
                />
              </div>
            )}
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{t('quizzes.noQuestionsYet')}</p>
            <p className="text-sm">{t('quizzes.addOrUpload')}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Render Tabs
  const renderTabs = () => (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex space-x-4">
        {['basic', 'questions'].map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t(`common.${tab === 'basic' ? 'basicInfo' : 'questions'}`)}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderLanguageToggle()}
      {renderTabs()}

      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Title & Description */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              {t('common.basicInfo')}
            </h3>
            <div className="grid gap-4">
              {inputMode === 'single' ? (
                <>
                  {renderTextField('title', t('common.title'))}
                  {renderTextField('description', t('common.description'), true)}
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {renderTextField('title', `${t('common.title')} (EN)`, false, 'en')}
                    {renderTextField('title', `${t('common.title')} (AR)`, false, 'ar')}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {renderTextField('description', `${t('common.description')} (EN)`, true, 'en')}
                    {renderTextField('description', `${t('common.description')} (AR)`, true, 'ar')}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              {t('common.settings')}
            </h3>
            {renderSettingsSection()}
          </div>

          {/* File Upload */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              {t('quizzes.uploadQuestions')}
            </h3>
            {renderFileUploadSection()}
          </div>
        </div>
      )}

      {activeTab === 'questions' && renderQuestionsSection()}
    </div>
  );
};

export default React.memo(QuizModalFields);