// src/maincomponents/modal/addEditModals/PaymentModalFields.jsx
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
  Calendar,
  CreditCard,
  DollarSign,
  Upload,
  FileText,
  X,
  User,
  Languages,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';

const PaymentModalFields = ({ 
  formData, 
  handleChange, // Top-level form field changes (notes, amount etc)
  isRTL = false,
  studentData = null, // Student Fee summary for display
  componentOptions = [], // Components from the selected student's fee structure
  enableMultiLanguage = true,
  mode = 'add'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');
  const currentLanguage = i18n.language;
  
  // No changes needed in useEffect or isInitialized as Fees.jsx handles initial setup.

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

  const paymentMethods = [
    { value: 'cash', label: 'fee.paymentMethods.cash' },
    { value: 'bank-transfer', label: 'fee.paymentMethods.bank-transfer' },
    { value: 'cheque', label: 'fee.paymentMethods.cheque' },
    { value: 'online', label: 'fee.paymentMethods.online' },
    { value: 'credit-card', label: 'fee.paymentMethods.credit-card' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleChange('receiptFile', file);
  };

  const removeFile = () => {
    handleChange('receiptFile', null);
  };

  // Helper to render labels with swapped badges
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

  const renderSharedFields = (lang = currentLanguage) => {
      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      const isAr = lang === 'ar';
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir={dir}>
          <div className="space-y-2">
            <Label>{getTranslation('fee.paymentAmount', lang)} *</Label>
            <div className="relative">
              <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
              <Input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={isAr ? 'pr-10' : 'pl-10'}
                placeholder="0"
                required
              />
            </div>
          </div>

          {componentOptions.length > 0 && (
            <div className="space-y-2">
              <Label>{getTranslation('fee.paymentForComponent', lang)}</Label>
              <Select
                value={formData.componentId || ''}
                onValueChange={(value) => handleChange('componentId', value)}
              >
                <SelectTrigger dir={dir}>
                  <SelectValue placeholder={getTranslation('fee.selectComponent', lang)} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="">{getTranslation('fee.allComponents', lang)}</SelectItem>
                  {componentOptions.map((component) => (
                    <SelectItem key={component._id} value={component._id}> {/* Use component._id */}
                      {getFieldValue(component.name, lang)} - ₪{component.amount} ({getTranslation(`fee.status.${component.status}`, lang)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{getTranslation('fee.paymentDate', lang)} *</Label>
            <div className="relative">
              <Calendar className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
              <Input
                type="date"
                value={formData.paymentDate || ''}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                className={isAr ? 'pr-10' : 'pl-10'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{getTranslation('fee.paymentMethod', lang)} *</Label>
            <Select
              value={formData.paymentMethod || ''}
              onValueChange={(value) => handleChange('paymentMethod', value)}
            >
              <SelectTrigger dir={dir}>
                <SelectValue placeholder={getTranslation('fee.selectPaymentMethod', lang)} />
              </SelectTrigger>
              <SelectContent dir={dir}>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {getTranslation(method.label, lang)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {studentData && (
        <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/40">
              <User className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-semibold text-gray-900 dark:text-white">{getFieldValue(studentData.name)}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {studentData.studentId} • {studentData.class} • {t('fee.pendingAmount')}: ₪{studentData.pendingAmount?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {inputMode === 'dual' ? (
            <>
                {/* English Section */}
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                    {t('common.english')} {t('fee.paymentInfo')}
                </h3>
                
                {renderSharedFields('en')}

                <div className="space-y-2 mt-4">
                    <DualLabel label={getTranslation('fee.paymentNotes', 'en')} language="en" />
                    <Textarea
                        value={getFieldValue(formData.notes, 'en')}
                        onChange={(e) => handleChange('notes', e.target.value, 'en')}
                        placeholder={`${t('fee.paymentNotes')} (English)`}
                        dir="ltr"
                        rows={3}
                    />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                {/* Arabic Section */}
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-teal-600 dark:text-teal-400">
                    <div className="w-1 h-5 bg-gradient-to-b from-teal-500 to-teal-600 rounded-full" />
                    {t('common.arabic')} {t('fee.paymentInfo')}
                </h3>
                
                <div className="space-y-2">
                    <DualLabel label={getTranslation('fee.paymentNotes', 'ar')} language="ar" />
                    <Textarea
                        value={getFieldValue(formData.notes, 'ar')}
                        onChange={(e) => handleChange('notes', e.target.value, 'ar')}
                        placeholder={`${t('fee.paymentNotes')} (العربية)`}
                        dir="rtl"
                        rows={3}
                        className="text-right"
                    />
                </div>
            </>
        ) : (
            <>
                <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('fee.paymentInfo')}</h3>
                {renderSharedFields()}
                <div className="space-y-2">
                    <Label htmlFor="notes">{t('fee.paymentNotes')}</Label>
                    <Textarea
                        id="notes"
                        value={getFieldValue(formData.notes)}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        placeholder={isRTL ? 'ملاحظات الدفع...' : 'Payment notes...'}
                        rows={3}
                        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    />
                </div>
            </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>{t('fee.paymentProof')}</h3>
        <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 dark:border-gray-600">
          <input type="file" id="receipt-upload" className="hidden" onChange={handleFileUpload} accept=".jpg,.jpeg,.png,.pdf" />
          {formData.receiptFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-green-500" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-medium text-gray-900 dark:text-white">{formData.receiptFile.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{(formData.receiptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ) : (
            <label htmlFor="receipt-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-1">{t('fee.form.uploadFiles')}</p>
              <Button type="button" variant="outline" className="mt-4">
                <Upload className="h-4 w-4 mr-2" /> {t('fee.form.browseFiles')}
              </Button>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModalFields;