import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
  Mail, Phone, Calendar, Briefcase, Building, Lock, User, 
  Languages, Globe, Loader2
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';

import { STAFF_ROLES } from '../../../data/Constants';

import { fetchDepartmentOptions } from '@redux/actions/department';

const StaffModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false,
  modalMode = 'add',
  additionalData = {},
  enableMultiLanguage = true,
  currentLanguage = 'en'
}) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [inputMode, setInputMode] = useState('single');

  const { departmentsList, listLoading } = useSelector(state => state.departments || { departmentsList: [], listLoading: false });

  useEffect(() => {
    dispatch(fetchDepartmentOptions());
  }, [dispatch]);

  const roles = additionalData.roles || STAFF_ROLES;
  
  const departments = departmentsList || [];

  const getRoleLabel = (role) => {
    return t(`staff.roles.${role}`, { defaultValue: role });
  };

  const getDepartmentLabel = (dept, lang = null) => {
    const language = lang || currentLanguage;
    if (typeof dept === 'object' && dept !== null) {
      return dept.localizedName || 
             dept.name?.[language] || 
             dept.name?.en || 
             dept.name?.ar || 
             t('common.unknown');
    }
    return dept; 
  };

  const handleNameChange = (lang, field, value) => {
    const updatedName = {
      ...formData.name,
      [lang]: {
        ...formData.name?.[lang],
        [field]: value
      }
    };
    handleChange('name', updatedName);
  };

  const getNameValue = (lang, field) => {
    return formData.name?.[lang]?.[field] || '';
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

  const renderSingleLanguageField = (fieldName) => {
    if (fieldName === 'firstName' || fieldName === 'lastName') {
      return (
        <div className="space-y-2">
          <Label>{t(`staff.form.${fieldName}`)}</Label>
          <div className="relative">
            <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              value={getNameValue(currentLanguage, fieldName)}
              onChange={(e) => handleNameChange(currentLanguage, fieldName, e.target.value)}
              placeholder={t(`staff.form.${fieldName}`)}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'email') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.email')}</Label>
          <div className="relative">
            <Mail className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('staff.form.email')}
              className={isRTL ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'password' && modalMode === 'add') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.password')}</Label>
          <div className="relative">
            <Lock className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={t('staff.form.password')}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'phoneNumber') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.phone')}</Label>
          <div className="relative">
            <Phone className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder={t('staff.form.phone')}
              className={isRTL ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'joiningDate') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.joinDate')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="date"
              value={formData.joiningDate || ''}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'role') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.role')}</Label>
          <div className="relative">
            <Briefcase className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Select
              value={formData.role || ''}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={t('staff.form.selectRole')} />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {getRoleLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (fieldName === 'department') {
      return (
        <div className="space-y-2">
          <Label>{t('staff.form.department')}</Label>
          <div className="relative">
            <Building className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${isRTL ? 'right-3' : 'left-3'}`} />
            
            <Select
              value={formData.department || ''}
              onValueChange={(value) => handleChange('department', value)}
              disabled={listLoading}
            >
              <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
                {listLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.loading')}...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={t('staff.form.selectDepartment')} />
                )}
              </SelectTrigger>
              <SelectContent>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {getDepartmentLabel(dept)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-gray-500">
                    {t('common.noData')}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderDualLanguageField = (fieldName, language) => {
    if (language === 'ar') {
      if (fieldName === 'firstName' || fieldName === 'lastName') {
        return (
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {t('common.arabic')}
              </span>
              <span>{getTranslation(`staff.form.${fieldName}`, language)}</span>
            </Label>
            <div className="relative">
              <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
              <Input
                value={getNameValue(language, fieldName)}
                onChange={(e) => handleNameChange(language, fieldName, e.target.value)}
                placeholder={`${getTranslation(`staff.form.${fieldName}`, language)} (${t('common.arabic')})`}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                className={language === 'ar' ? 'pr-10' : 'pl-10'}
              />
            </div>
          </div>
        );
      }

      if (fieldName === 'department') {
        return (
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {t('common.arabic')}
              </span>
              <span>{getTranslation('staff.form.department', language)}</span>
            </Label>
            <div className="relative">
              <Building className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
              
              <Select
                value={formData.department || ''}
                onValueChange={(value) => handleChange('department', value)}
                disabled={listLoading}
              >
                <SelectTrigger className={language === 'ar' ? 'pr-10' : 'pl-10'}>
                  {listLoading ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{getTranslation('common.loading', language)}...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder={getTranslation('staff.form.selectDepartment', language)} />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {getDepartmentLabel(dept, language)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-gray-500">
                      {getTranslation('common.noData', language)}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      }

      return null;
    }

    if (fieldName === 'firstName' || fieldName === 'lastName') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation(`staff.form.${fieldName}`, language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation(`staff.form.${fieldName}`, language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              value={getNameValue(language, fieldName)}
              onChange={(e) => handleNameChange(language, fieldName, e.target.value)}
              placeholder={`${getTranslation(`staff.form.${fieldName}`, language)} (${t('common.english')})`}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'email') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.email', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.email', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Mail className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={getTranslation('staff.form.email', language)}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'password' && modalMode === 'add') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.password', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.password', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Lock className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="password"
              value={formData.password || ''}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder={getTranslation('staff.form.password', language)}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'phoneNumber') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.phone', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.phone', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Phone className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder={getTranslation('staff.form.phone', language)}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
              dir="ltr"
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'joiningDate') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.joinDate', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.joinDate', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Input
              type="date"
              value={formData.joiningDate || ''}
              onChange={(e) => handleChange('joiningDate', e.target.value)}
              className={language === 'ar' ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      );
    }

    if (fieldName === 'role') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.role', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.role', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Briefcase className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <Select
              value={formData.role || ''}
              onValueChange={(value) => handleChange('role', value)}
            >
              <SelectTrigger className={language === 'ar' ? 'pr-10' : 'pl-10'}>
                <SelectValue placeholder={getTranslation('staff.form.selectRole', language)} />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>
                    {getTranslation(`staff.roles.${role}`, language)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    if (fieldName === 'department') {
      return (
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
                <span>{getTranslation('staff.form.department', language)}</span>
              </>
            ) : (
              <>
                <span>{getTranslation('staff.form.department', language)}</span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <div className="relative">
            <Building className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            
            <Select
              value={formData.department || ''}
              onValueChange={(value) => handleChange('department', value)}
              disabled={listLoading}
            >
              <SelectTrigger className={language === 'ar' ? 'pr-10' : 'pl-10'}>
                {listLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{getTranslation('common.loading', language)}...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={getTranslation('staff.form.selectDepartment', language)} />
                )}
              </SelectTrigger>
              <SelectContent>
                {departments.length > 0 ? (
                  departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {getDepartmentLabel(dept, language)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-gray-500">
                    {getTranslation('common.noData', language)}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    return null;
  };

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

      {inputMode === 'single' ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('staff.personalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('staff.form.firstName')}</Label>
                <div className="relative">
                  <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                  <Input
                    value={getNameValue(currentLanguage, 'firstName')}
                    onChange={(e) => handleNameChange(currentLanguage, 'firstName', e.target.value)}
                    placeholder={t('staff.form.firstName')}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    className={currentLanguage === 'ar' ? 'pr-10' : 'pl-10'}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('staff.form.lastName')}</Label>
                <Input
                  value={getNameValue(currentLanguage, 'lastName')}
                  onChange={(e) => handleNameChange(currentLanguage, 'lastName', e.target.value)}
                  placeholder={t('staff.form.lastName')}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {renderSingleLanguageField('email')}
              {modalMode === 'add' && renderSingleLanguageField('password')}
              {renderSingleLanguageField('phoneNumber')}
              {renderSingleLanguageField('joiningDate')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              {t('staff.professionalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSingleLanguageField('role')}
              {renderSingleLanguageField('department')}
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('staff.personalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('firstName', 'en')}
              {renderDualLanguageField('lastName', 'en')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {renderDualLanguageField('email', 'en')}
              {modalMode === 'add' && renderDualLanguageField('password', 'en')}
              {renderDualLanguageField('phoneNumber', 'en')}
              {renderDualLanguageField('joiningDate', 'en')}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              {t('common.english')} {t('staff.professionalInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDualLanguageField('role', 'en')}
              {renderDualLanguageField('department', 'en')}
            </div>
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('staff.personalInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('firstName', 'ar')}
                {renderDualLanguageField('lastName', 'ar')}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                {t('common.arabic')} {t('staff.professionalInfo')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderDualLanguageField('department', 'ar')}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StaffModalFields;