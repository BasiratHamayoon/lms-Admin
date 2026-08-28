import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import {
  FileText, DollarSign, Calendar, CreditCard, Building,
  Languages, Upload, X, CheckCircle
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { fetchDepartmentOptions } from '../../../redux/actions/department';
import { Button } from '../../components/ui/button';

const ExpenseModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  enableMultiLanguage = true,
  mode = 'add'
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  
  const {
    departmentsList: departmentOptions,
    listLoading: departmentLoading
  } = useSelector((state) => state.departments);

  const [inputMode, setInputMode] = useState('single');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // IMPORTANT: normalize language to match your data keys: 'en' | 'ar'
  const isArabic = i18n.language?.startsWith('ar');
  const currentLanguage = isArabic ? 'ar' : 'en';

  const categories = [
    'stationery', 'utilities', 'equipment', 'maintenance',
    'transportation', 'events', 'salaries', 'food', 'other'
  ];
  const paymentMethods = [
    'cash', 'credit-card', 'bank-transfer', 'cheque', 'online', 'other'
  ];
  const statuses = ['pending', 'approved', 'rejected', 'recorded'];
  
  useEffect(() => {
    dispatch(fetchDepartmentOptions());
  }, [dispatch]);

  useEffect(() => {
    if (mode === 'edit' && formData.receipt?.file?.path) {
      setFilePreview(formData.receipt.file.path);
    } else if (mode === 'add') {
      setFilePreview(null);
      setSelectedFile(null);
    }
  }, [mode, formData.receipt]);

  const toggleInputMode = () => setInputMode(prev => prev === 'single' ? 'dual' : 'single');

  const handleMultiChange = (field, lang, value) => {
    const currentObj = formData[field] || { en: '', ar: '' };
    const safeObj = typeof currentObj === 'string' ? { en: currentObj, ar: '' } : currentObj;
    handleChange(field, { ...safeObj, [lang]: value });
  };

  const getMultiValue = (field, lang) => {
    if (!enableMultiLanguage) return formData[field] || '';
    const val = formData[field];
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || '';
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('expense.invalidFileType'));
      return;
    }

    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    handleChange('receiptFile', file);
    handleChange('receipt', {
      hasReceipt: true,
      file: { name: file.name, mimetype: file.type, size: file.size }
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    handleChange('receipt', { hasReceipt: false });
    handleChange('receiptFile', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const renderSingleLanguageField = (fieldName) => {
    // title / subcategory / description (single-language mode uses currentLanguage)
    if (['title', 'subcategory', 'description'].includes(fieldName)) {
      const labelKey = `expense.form.${fieldName}`;
      const isTextarea = fieldName === 'description';
      return (
        <div className="space-y-2">
          <Label>{t(labelKey)}</Label>
          <div className="relative">
            <FileText
              className={`absolute top-3 w-4 h-4 text-gray-400 ${
                currentLanguage === 'ar' ? 'right-3' : 'left-3'
              }`}
            />
            {isTextarea ? (
              <Textarea
                value={getMultiValue(fieldName, currentLanguage)}
                onChange={(e) =>
                  handleMultiChange(fieldName, currentLanguage, e.target.value)
                }
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              />
            ) : (
              <Input
                value={getMultiValue(fieldName, currentLanguage)}
                onChange={(e) =>
                  handleMultiChange(fieldName, currentLanguage, e.target.value)
                }
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              />
            )}
          </div>
        </div>
      );
    }

    // amount
    if (fieldName === 'amount') {
      return (
        <div className="space-y-2">
          <Label>{t('expense.form.amount')}</Label>
          <div className="relative">
            <DollarSign
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <Input
              type="number"
              value={formData.amount || ''}
              onChange={(e) => handleChange('amount', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    // date
    if (fieldName === 'date') {
      return (
        <div className="space-y-2">
          <Label>{t('expense.form.date')}</Label>
          <div className="relative">
            <Calendar
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <Input
              type="date"
              value={formData.date || ''}
              onChange={(e) => handleChange('date', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    // select fields: category / paymentMethod / department / status
    if (['category', 'paymentMethod', 'department', 'status'].includes(fieldName)) {
      let options = [];
      let IconComponent = Building;

      if (fieldName === 'category') {
        options = categories;
        IconComponent = FileText;
      }
      if (fieldName === 'paymentMethod') {
        options = paymentMethods;
        IconComponent = CreditCard;
      }
      if (fieldName === 'status') {
        options = statuses;
        IconComponent = FileText;
      }
      if (fieldName === 'department') {
        options = departmentOptions || [];
        IconComponent = Building;
      }

      return (
        <div className="space-y-2">
          <Label>{t(`expense.form.${fieldName}`)}</Label>
          <div className="relative">
            <IconComponent
              className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <Select
              value={formData[fieldName] || ''}
              onValueChange={(value) => handleChange(fieldName, value)}
            >
              <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={t(`expense.form.select${fieldName}`)} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt._id || opt} value={opt._id || opt}>
                    {fieldName === 'department'
                      ? // DEPARTMENT LABEL: localizedName -> name[currentLanguage] -> name.en -> name
                        (
                          opt.localizedName ||
                          opt.name?.[currentLanguage] ||
                          opt.name?.en ||
                          (typeof opt.name === 'string' ? opt.name : String(opt._id))
                        )
                      : // category/status labels via i18n
                        t(
                          `expense.${
                            fieldName === 'status' ? 'status' : 'categories'
                          }.${opt}`
                        ) || opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDualLanguageField = (fieldName, lang) => {
    const isTextarea = fieldName === 'description';
    const labelBadgeClass =
      lang === 'ar'
        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';

    return (
      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          {isRTL && lang === 'en' ? (
            <>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${labelBadgeClass}`}
              >
                {t('common.english')}
              </span>
              <span>{getTranslation(`expense.form.${fieldName}`, lang)}</span>
            </>
          ) : isRTL && lang === 'ar' ? (
            <>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${labelBadgeClass}`}
              >
                {t('common.arabic')}
              </span>
              <span>{getTranslation(`expense.form.${fieldName}`, lang)}</span>
            </>
          ) : lang === 'ar' ? (
            <>
              <span>{getTranslation(`expense.form.${fieldName}`, lang)}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${labelBadgeClass}`}
              >
                {t('common.arabic')}
              </span>
            </>
          ) : (
            <>
              <span>{getTranslation(`expense.form.${fieldName}`, lang)}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${labelBadgeClass}`}
              >
                {t('common.english')}
              </span>
            </>
          )}
        </Label>
        <div className="relative">
          <FileText
            className={`absolute top-3 w-4 h-4 text-gray-400 ${
              lang === 'ar' ? 'right-3' : 'left-3'
            }`}
          />
          {isTextarea ? (
            <Textarea
              value={getMultiValue(fieldName, lang)}
              onChange={(e) => handleMultiChange(fieldName, lang, e.target.value)}
              placeholder={`${getTranslation(`expense.form.${fieldName}`, lang)} (${
                lang === 'ar' ? t('common.arabic') : t('common.english')
              })`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className={lang === 'ar' ? 'pr-10' : 'pl-10'}
            />
          ) : (
            <Input
              value={getMultiValue(fieldName, lang)}
              onChange={(e) => handleMultiChange(fieldName, lang, e.target.value)}
              placeholder={`${getTranslation(`expense.form.${fieldName}`, lang)} (${
                lang === 'ar' ? t('common.arabic') : t('common.english')
              })`}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className={lang === 'ar' ? 'pr-10' : 'pl-10'}
            />
          )}
        </div>
      </div>
    );
  };

  const renderReceiptUpload = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          {t('expense.form.receipt')}
        </Label>
        <span className="text-xs text-gray-500">{t('expense.optional')}</span>
      </div>

      {!selectedFile && !filePreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-pink-500 transition-colors"
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-sm font-medium">{t('expense.uploadReceipt')}</p>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {filePreview && (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="max-h-48 rounded border mb-3"
                />
              )}
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">
                    {selectedFile?.name ||
                      formData.receipt?.file?.name ||
                      'File attached'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedFile?.size ? formatFileSize(selectedFile.size) : ''}
                  </p>
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {enableMultiLanguage && (
        <div className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-pink-100 dark:border-gray-700 shadow-sm">
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
                    : t('common.englishOnlyDesc')}
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

      {inputMode === 'single' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full" />
              {t('expense.basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('title')}
              {renderSingleLanguageField('amount')}
              {renderSingleLanguageField('date')}
              {renderSingleLanguageField('category')}
              {renderSingleLanguageField('paymentMethod')}
              {renderSingleLanguageField('department')}
              {renderSingleLanguageField('status')}
              <div className="md:col-span-2">
                {renderSingleLanguageField('description')}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('expense.basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('title', 'en')}
              {renderDualLanguageField('subcategory', 'en')}
              <div className="md:col-span-2">
                {renderDualLanguageField('description', 'en')}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('common.arabic')} {t('expense.basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('title', 'ar')}
              {renderDualLanguageField('subcategory', 'ar')}
              <div className="md:col-span-2">
                {renderDualLanguageField('description', 'ar')}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-pink-500 to-pink-600 rounded-full" />
              {t('expense.additionalInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('amount')}
              {renderSingleLanguageField('date')}
              {renderSingleLanguageField('category')}
              {renderSingleLanguageField('paymentMethod')}
              {renderSingleLanguageField('department')}
              {renderSingleLanguageField('status')}
            </div>
          </div>
        </>
      )}

      <div className="pt-4 border-t">
        {renderReceiptUpload()}
      </div>
    </div>
  );
};

export default ExpenseModalFields;