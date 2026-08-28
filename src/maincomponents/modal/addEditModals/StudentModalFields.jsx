import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Mail, Phone, Calendar, User, Lock, Eye, EyeOff, AlertCircle, 
  Building, GraduationCap, Hash
} from 'lucide-react';
import { Switch } from '../../components/ui/switch';

const StudentModalFields = ({
  formData = {},
  handleChange,
  errors = {},
  isRTL = false,
  mode = 'add',
  enableMultiLanguage = true
}) => {
  const { t, i18n } = useTranslation();
  
  const [inputMode, setInputMode] = useState('single');
  const [showPassword, setShowPassword] = useState(false);
  const [assignClassNow, setAssignClassNow] = useState(!!formData.classId);

  const { departmentsList } = useSelector((state) => state.departments || { departmentsList: [] });
  const { classes } = useSelector((state) => state.classes || { classes: [] });

  const handleAssignToggle = (checked) => {
    setAssignClassNow(checked);
    if (!checked) {
      handleChange('classId', '');
      handleChange('section', '');
      handleChange('rollNumber', '');
      handleChange('academicYear', '');
    }
  };

  const getNameValue = (lang, field) => formData.name?.[lang]?.[field] || formData[`${field}_${lang}`] || '';
  
  const handleNameChange = (lang, field, value) => {
    if (formData.name) {
        const updatedName = { ...formData.name, [lang]: { ...formData.name?.[lang], [field]: value } };
        handleChange('name', updatedName);
    } else {
        handleChange(`${field}_${lang}`, value);
    }
  };

  const getOptionLabel = (item) => {
    if (!item) return '';
    const lang = i18n.language ? i18n.language.split('-')[0] : 'en';

    if (item.name && typeof item.name === 'object') {
        return item.name[lang] || item.name.en || item.name.ar || '';
    }

    if (item.localizedName) return item.localizedName;

    if (typeof item === 'object') {
        return item[lang] || item.en || item.ar || '';
    }

    return item;
  };

  const ErrorMessage = ({ error }) => error ? <div className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{error}</div> : null;

  const renderClassAssignmentSection = () => {
    if (mode !== 'add') return null;

    return (
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="assignClass" 
            checked={assignClassNow} 
            onCheckedChange={handleAssignToggle}
          />
          <Label htmlFor="assignClass" className="font-semibold text-gray-900 dark:text-white cursor-pointer">
            {t('students.assignClassNow') || "Assign Class Now"}
          </Label>
        </div>

        {assignClassNow && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <Label>{t('students.form.class')}</Label>
              <div className="relative">
                <GraduationCap className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <select
                  value={formData.classId || ''}
                  onChange={(e) => handleChange('classId', e.target.value)}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
                >
                  <option value="">{t('common.select')} {t('students.form.class')}</option>
                  {classes.map((cls) => {
                    const className = getOptionLabel(cls);
                    const sectionName = getOptionLabel(cls.section);
                    return (
                      <option key={cls._id || cls.id} value={cls._id || cls.id}>
                        {className}{sectionName ? ` (${sectionName})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
              <ErrorMessage error={errors.classId} />
            </div>

            <div className="space-y-2">
              <Label>{t('students.form.section')}</Label>
              <Input
                value={formData.section || ''}
                onChange={(e) => handleChange('section', e.target.value)}
                placeholder="A"
              />
              <ErrorMessage error={errors.section} />
            </div>

            <div className="space-y-2">
              <Label>{t('students.form.rollNumber')}</Label>
              <div className="relative">
                <Hash className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  value={formData.rollNumber || ''}
                  onChange={(e) => handleChange('rollNumber', e.target.value)}
                  placeholder="101"
                  className={isRTL ? 'pr-10' : 'pl-10'}
                />
              </div>
              <ErrorMessage error={errors.rollNumber} />
            </div>

            <div className="space-y-2">
              <Label>{t('students.form.academicYear')}</Label>
              <Input
                value={formData.academicYear || ''}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                placeholder="2023-2024"
              />
              <ErrorMessage error={errors.academicYear} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderField = (field, type = 'text', icon = null, lang = null) => {
    let val = formData[field] || '';
    let err = errors[field];
    
    if (field === 'firstName' || field === 'lastName') {
        const currentLang = i18n.language ? i18n.language.split('-')[0] : 'en';
        val = getNameValue(lang || currentLang, field);
    }

    return (
      <div className="space-y-2">
        <Label>
            {t(`students.form.${field === 'firstName' ? 'fullName' : field}`)} 
            {lang && <span className="ml-1 text-xs text-gray-500">({lang.toUpperCase()})</span>}
        </Label>
        <div className="relative">
           {icon && React.cloneElement(icon, { className: `absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}` })}
           <Input
             type={type}
             value={val}
             onChange={(e) => field === 'firstName' || field === 'lastName' 
                ? handleNameChange(lang || (i18n.language ? i18n.language.split('-')[0] : 'en'), field, e.target.value) 
                : handleChange(field, e.target.value)
             }
             className={icon ? (isRTL ? 'pr-10' : 'pl-10') : ''}
             dir={lang === 'ar' ? 'rtl' : 'ltr'}
           />
        </div>
        <ErrorMessage error={err} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {enableMultiLanguage && (
         <div className="flex justify-end items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
             <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('common.single')}</span>
             <Switch 
                checked={inputMode === 'dual'} 
                onCheckedChange={(checked) => setInputMode(checked ? 'dual' : 'single')} 
            />
             <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{t('common.dual')}</span>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {inputMode === 'single' ? (
            <>
              {renderField('firstName', 'text', <User/>)}
              {renderField('lastName', 'text', <User/>)}
            </>
         ) : (
            <>
              {renderField('firstName', 'text', <User/>, 'en')}
              {renderField('firstName', 'text', <User/>, 'ar')}
              {renderField('lastName', 'text', <User/>, 'en')}
              {renderField('lastName', 'text', <User/>, 'ar')}
            </>
         )}

         {renderField('email', 'email', <Mail/>)}
         {renderField('phone', 'tel', <Phone/>)}
         
         {mode === 'add' && (
             <div className="space-y-2 relative">
                <Label>{t('students.form.password')}</Label>
                <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}/>
                    <Input 
                        type={showPassword ? 'text' : 'password'} 
                        value={formData.password || ''} 
                        onChange={(e) => handleChange('password', e.target.value)}
                        className={isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'}`}>
                        {showPassword ? <EyeOff className="w-4 h-4 text-gray-400"/> : <Eye className="w-4 h-4 text-gray-400"/>}
                    </button>
                </div>
                <ErrorMessage error={errors.password} />
             </div>
         )}
         
         <div className="space-y-2">
             <Label>{t('students.form.department')}</Label>
             <div className="relative">
                 <Building className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`}/>
                 <select 
                    value={formData.department || ''} 
                    onChange={(e) => handleChange('department', e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
                 >
                    <option value="">{t('common.select')}</option>
                    {departmentsList.map(d => (
                        <option key={d._id} value={d._id}>
                            {getOptionLabel(d)}
                        </option>
                    ))}
                 </select>
             </div>
         </div>

         {renderField('joiningDate', 'date', <Calendar/>)}
      </div>

      {renderClassAssignmentSection()}
    </div>
  );
};

export default StudentModalFields;