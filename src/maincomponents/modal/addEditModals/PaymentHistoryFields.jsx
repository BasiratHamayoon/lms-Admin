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
  Calendar,
  DollarSign,
  Upload,
  FileText,
  X,
  Languages,
  Globe
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

const PaymentHistoryFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  salaryData = null,
  enableMultiLanguage = true,
  currentLanguage = 'en'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');

  const toggleInputMode = () => {
    setInputMode(inputMode === 'single' ? 'dual' : 'single');
  };

  const handleDescriptionChange = (lang, value) => {
    const updated = {
      ...formData.description,
      [lang]: value
    };
    handleChange('description', updated);
  };

  const getDescriptionValue = (lang) => {
    return formData.description?.[lang] || '';
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleChange('receiptFile', file);
  };

  const removeFile = () => handleChange('receiptFile', null);

  const paymentMethods = [
    { value: 'bank-transfer', label: t('salary.paymentMethods.bank-transfer') },
    { value: 'cash', label: t('salary.paymentMethods.cash') },
    { value: 'check', label: t('salary.paymentMethods.check') },
    { value: 'online', label: t('salary.paymentMethods.online') }
  ];

  const paymentTypes = [
    { value: 'regular', label: t('salary.paymentTypes.regular') },
    { value: 'advance', label: t('salary.paymentTypes.advance') },
    { value: 'bonus', label: t('salary.paymentTypes.bonus') },
    { value: 'deduction', label: t('salary.paymentTypes.deduction') }
  ];

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

      {salaryData && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 rounded-lg">
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {salaryData.teacher?.name || salaryData.staffName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('salary.months.' + salaryData.month)} {salaryData.year} • {t('salary.form.amount')}: ₪{salaryData.amount?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
          {t('salary.paymentInfo')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('salary.paymentAmount')} *</Label>
            <div className="relative">
              <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0"
                className={isRTL ? 'pr-10' : 'pl-10'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('salary.paymentDate')} *</Label>
            <div className="relative">
              <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                type="date"
                value={formData.paymentDate || ''}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                className={isRTL ? 'pr-10' : 'pl-10'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('salary.paymentMethod')} *</Label>
            <div className="relative">
              <Select value={formData.paymentMethod || ''} onValueChange={(v) => handleChange('paymentMethod', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('salary.selectPaymentMethod')} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('salary.paymentType')} *</Label>
            <div className="relative">
              <Select value={formData.paymentType || ''} onValueChange={(v) => handleChange('paymentType', v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('salary.selectPaymentType')} />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>{t('salary.transactionId')} *</Label>
            <Input
              value={formData.transactionId || ''}
              onChange={(e) => handleChange('transactionId', e.target.value)}
              placeholder={isRTL ? 'أدخل رقم المعاملة' : 'Enter transaction ID'}
              required
            />
          </div>
        </div>

        {inputMode === 'single' ? (
          <div className="mt-6">
            <Label>{t('salary.paymentDescription')}</Label>
            <div className="relative mt-2">
              <FileText className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Textarea
                value={getDescriptionValue(currentLanguage)}
                onChange={(e) => handleDescriptionChange(currentLanguage, e.target.value)}
                rows={4}
                className={`min-h-[100px] ${currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}`}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                placeholder={t('salary.paymentDescription')}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                {t('common.english')} {t('salary.paymentDescription')}
              </h3>
              
              <div className="relative mt-2">
                <FileText className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
                <Textarea
                  value={getDescriptionValue('en')}
                  onChange={(e) => handleDescriptionChange('en', e.target.value)}
                  rows={4}
                  className="min-h-[100px] pl-10"
                  dir="ltr"
                  placeholder={`${t('salary.paymentDescription')} (${t('common.english')})`}
                />
              </div>
            </div>

            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('salary.paymentDescription')}
              </h3>

              <div className="relative mt-2">
                <FileText className="absolute top-3 right-3 w-4 h-4 text-gray-400" />
                <Textarea
                  value={getDescriptionValue('ar')}
                  onChange={(e) => handleDescriptionChange('ar', e.target.value)}
                  rows={4}
                  className="min-h-[100px] pr-10"
                  dir="rtl"
                  placeholder={`${t('salary.paymentDescription')} (${t('common.arabic')})`}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
          {t('salary.paymentProof')}
        </h3>

        <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300 dark:border-gray-600">
          <input
            type="file"
            id="receipt-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".jpg,.jpeg,.png,.pdf"
          />

          {formData.receiptFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-green-500" />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-gray-900 dark:text-white">{formData.receiptFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(formData.receiptFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label htmlFor="receipt-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {isRTL ? 'اسحب وأفلت الملفات هنا أو انقر للتصفح' : 'Drag & drop files here or click to browse'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {isRTL ? 'PDF، JPG، PNG حتى 5 ميجابايت لكل ملف' : 'PDF, JPG, PNG up to 5MB each'}
              </p>
              <Button variant="outline" className="mt-4 border-green-300 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400">
                <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {isRTL ? 'تصفح الملفات' : 'Browse Files'}
              </Button>
            </label>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <input
            type="checkbox"
            checked={formData.sendProofToStaff || false}
            onChange={(e) => handleChange('sendProofToStaff', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <Label className="text-sm">
            {t('salary.sendProofToStaff') || (isRTL ? 'إرسال إثبات الدفع للموظف' : 'Send payment proof to staff')}
          </Label>
        </div>

        <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <input
            type="checkbox"
            checked={formData.generateInvoice || false}
            onChange={(e) => handleChange('generateInvoice', e.target.checked)}
            className="h-4 w-4 text-green-600 rounded"
          />
          <Label className="text-sm">
            {t('salary.generateInvoice') || (isRTL ? 'إنشاء فاتورة' : 'Generate invoice')}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryFields;