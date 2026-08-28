import React, { useState } from 'react';
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
  User,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Clock,
  Languages,
  Loader2
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';

const SalaryModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  additionalData = {},
  enableMultiLanguage = true,
  currentLanguage = 'en'
}) => {
  const { t, i18n } = useTranslation();
  const [inputMode, setInputMode] = useState('single');

  const staffList = additionalData.staffList || [];
  const isLoadingStaff = additionalData.isLoadingStaff || false;

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: t(`salary.months.${i + 1}`)
  }));

  const paymentStatuses = [
    { value: 'paid', label: t('salary.status.paid') },
    { value: 'unpaid', label: t('salary.status.unpaid') },
    { value: 'partial', label: t('salary.status.partial') },
    { value: 'processing', label: t('salary.status.processing') },
    { value: 'overdue', label: t('salary.status.overdue') }
  ];

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const handleMultilingualChange = (field, lang, value) => {
    const updated = {
      ...formData[field],
      [lang]: value
    };
    handleChange(field, updated);
  };

  const getMultilingualValue = (field, lang) => {
    return formData[field]?.[lang] || '';
  };

  const getStaffName = (staffId, lang = null) => {
    const staff = staffList.find(s => s._id === staffId);
    if (!staff) return '';
    
    if (staff.fullName && typeof staff.fullName === 'object') {
       const language = lang || currentLanguage;
       return staff.fullName[language] || staff.fullName.en || staff.fullName.ar || '';
    }

    if (staff.name && typeof staff.name === 'object') {
       const language = lang || currentLanguage;
       return staff.name[language]?.firstName 
        ? `${staff.name[language].firstName} ${staff.name[language].lastName}` 
        : (staff.name.en?.firstName || '');
    }
    
    return staff.name || 'Unknown';
  };

  const handleStaffSelection = (staffId) => {
    handleChange('teacherId', staffId);
    
    const selectedStaff = staffList.find(s => s._id === staffId);
    if (selectedStaff && selectedStaff.salaryDetails) {
        // Auto-fill baseAmount from staff profile if available
        if (!formData.baseAmount || formData.baseAmount == 0) {
            handleChange('baseAmount', selectedStaff.salaryDetails.baseAmount || 0);
        }
    }
  };

  const renderSingleLanguageField = (fieldName) => {
    const fieldValue = formData[fieldName];

    switch (fieldName) {
      case 'teacherId':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.staff')}</Label>
            <div className="relative">
              <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Select value={fieldValue || ''} onValueChange={(v) => handleStaffSelection(v)} disabled={isLoadingStaff}>
                <SelectTrigger className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}>
                  {isLoadingStaff ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('common.loading')}...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={t('salary.form.selectStaff')} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(staff => (
                    <SelectItem key={staff._id} value={staff._id}>
                      {getStaffName(staff._id, currentLanguage)} 
                      <span className="text-xs text-gray-400 mx-2">({staff.staffId})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'month':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.month')}</Label>
            <div className="relative">
              <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Select value={fieldValue?.toString() || ''} onValueChange={(v) => handleChange('month', v)}>
                <SelectTrigger className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}>
                  <SelectValue placeholder={t('salary.form.selectMonth')} />
                </SelectTrigger>
                <SelectContent>
                  {months.map(m => (
                    <SelectItem key={m.value} value={m.value.toString()}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'year':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.year')}</Label>
            <div className="relative">
              <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Input
                type="number"
                value={fieldValue || ''}
                onChange={(e) => handleChange('year', e.target.value)}
                placeholder={t('salary.form.year')}
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>
        );

      case 'baseAmount':
      // case 'bonus':
      // case 'deductions':
        const icons = { baseAmount: DollarSign, bonus: TrendingUp, deductions: TrendingDown };
        const Icon = icons[fieldName];
        return (
          <div className="space-y-2">
            <Label>{t(`salary.form.${fieldName}`)}</Label>
            <div className="relative">
              <Icon className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Input
                type="number"
                value={fieldValue || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder="0"
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>
        );

      case 'paymentStatus':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.paymentStatus')}</Label>
            <div className="relative">
              <FileText className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Select value={fieldValue || ''} onValueChange={(v) => handleChange('paymentStatus', v)}>
                <SelectTrigger className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}>
                  <SelectValue placeholder={t('salary.form.selectPaymentStatus')} />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'dueDate':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.dueDate')}</Label>
            <div className="relative">
              <Clock className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Input
                type="date"
                value={fieldValue || ''}
                onChange={(e) => handleChange('dueDate', e.target.value)}
                className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>
        );

      case 'remarks':
        return (
          <div className="space-y-2">
            <Label>{t('salary.form.remarks')}</Label>
            <div className="relative">
              <FileText className={`absolute top-3 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
              <Textarea
                value={getMultilingualValue('remarks', currentLanguage)}
                onChange={(e) => handleMultilingualChange('remarks', currentLanguage, e.target.value)}
                placeholder={t('salary.form.remarks')}
                className={`min-h-[100px] ${currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}`}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderDualLanguageField = (fieldName, language) => {
    const fieldValue = formData[fieldName];

    if (language === 'ar' && fieldName !== 'remarks') return null;

    switch (fieldName) {
      case 'teacherId':
        return (
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              {isRTL ? (
                <>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                  <span>{getTranslation('salary.form.staff', language)}</span>
                </>
              ) : (
                <>
                  <span>{getTranslation('salary.form.staff', language)}</span>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {t('common.english')}
                  </span>
                </>
              )}
            </Label>
            <div className="relative">
              <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
              <Select value={fieldValue || ''} onValueChange={(v) => handleStaffSelection(v)} disabled={isLoadingStaff}>
                <SelectTrigger className={language === 'ar' ? 'pr-10' : 'pl-10'}>
                  {isLoadingStaff ? (
                     <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t('common.loading')}...</span>
                     </div>
                  ) : (
                    <SelectValue placeholder={getTranslation('salary.form.selectStaff', language)} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {staffList.map(staff => (
                    <SelectItem key={staff._id} value={staff._id}>
                      {getStaffName(staff._id, language)}
                       <span className="text-xs text-gray-400 mx-2">({staff.staffId})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'month':
      case 'year':
      case 'baseAmount':
      case 'bonus':
      case 'deductions':
      case 'paymentStatus':
      case 'dueDate':
          return renderSingleLanguageField(fieldName); 

      case 'remarks':
        return (
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
                {language === 'en' ? (
                    <>
                        <span>{getTranslation('salary.form.remarks', 'en')}</span>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">{t('common.english')}</span>
                    </>
                ) : (
                    <>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">{t('common.arabic')}</span>
                        <span>{getTranslation('salary.form.remarks', 'ar')}</span>
                    </>
                )}
            </Label>
            <div className="relative">
              <FileText className={`absolute top-3 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
              <Textarea
                value={getMultilingualValue('remarks', language)}
                onChange={(e) => handleMultilingualChange('remarks', language, e.target.value)}
                placeholder={`${getTranslation('salary.form.remarks', language)}`}
                className={`min-h-[100px] ${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const totalAmount = (parseFloat(formData.baseAmount || 0) + parseFloat(formData.bonus || 0) - parseFloat(formData.deductions || 0));

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
                <h4 className="font-semibold text-gray-900 dark:text-white">{t('common.inputLanguage')}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {inputMode === 'dual' ? t('common.bothLanguagesDesc') : currentLanguage === 'ar' ? t('common.arabicOnlyDesc') : t('common.englishOnlyDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('common.single')}</span>
              <Switch checked={inputMode === 'dual'} onCheckedChange={toggleInputMode} className="data-[state=checked]:bg-green-600" />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      {inputMode === 'single' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('salary.basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('teacherId')}
              {renderSingleLanguageField('month')}
              {renderSingleLanguageField('year')}
              {renderSingleLanguageField('baseAmount')}
              {renderSingleLanguageField('bonus')}
              {renderSingleLanguageField('deductions')}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('salary.paymentInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('paymentStatus')}
              {renderSingleLanguageField('dueDate')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('salary.form.remarks')}
            </h3>
            {renderSingleLanguageField('remarks')}
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('salary.basicInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('teacherId', 'en')}
              {renderDualLanguageField('month', 'en')}
              {renderDualLanguageField('year', 'en')}
              {renderDualLanguageField('baseAmount', 'en')}
              {renderDualLanguageField('bonus', 'en')}
              {renderDualLanguageField('deductions', 'en')}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('salary.paymentInfo')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('paymentStatus', 'en')}
              {renderDualLanguageField('dueDate', 'en')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('salary.form.remarks')}
            </h3>
            {renderDualLanguageField('remarks', 'en')}
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('salary.form.remarks')}
              </h3>
              {renderDualLanguageField('remarks', 'ar')}
            </div>
          </div>
        </>
      )}

      {/* Stats Summary Box */}
      {/* <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          {t('salary.stats.totalAmount')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-1">{t('salary.form.baseAmount')}</p>
            <p className="text-lg font-bold">₪{formData.baseAmount || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-1">{t('salary.form.bonus')}</p>
            <p className="text-lg font-bold text-green-600">+₪{formData.bonus || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-1">{t('salary.form.deductions')}</p>
            <p className="text-lg font-bold text-red-600">-₪{formData.deductions || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg text-center text-white">
            <p className="text-sm opacity-90 mb-1">{t('salary.form.amount')}</p>
            <p className="text-xl font-bold">₪{totalAmount}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SalaryModalFields;