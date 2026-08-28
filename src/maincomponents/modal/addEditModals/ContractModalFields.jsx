import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { Calendar, User, FileText, Upload } from 'lucide-react';

const ContractModalFields = ({ 
  formData, 
  handleChange, 
  isRTL = false, 
  additionalData = {}  
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const contractTypes = ['Contract', 'Agreement', 'NOC', 'Warning'];
  
  const teachersList = additionalData?.teachers || [];
  

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleChange('file', e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{t('contract.form.teacher')}</Label>
        <div className="relative">
          <User className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Select 
            value={formData.teacherId} 
            onValueChange={(value) => handleChange('teacherId', value)}
          >
            <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
              <SelectValue placeholder={t('contract.form.selectTeacher')} />
            </SelectTrigger>
            <SelectContent>
              {teachersList.length > 0 ? (
                teachersList.map((teacher) => (
                  <SelectItem key={teacher._id || teacher.id} value={teacher._id || teacher.id}>
                    {currentLanguage === 'ar' 
                      ? `${teacher.name?.ar?.firstName || ''} ${teacher.name?.ar?.lastName || ''}`.trim()
                      : `${teacher.name?.en?.firstName || ''} ${teacher.name?.en?.lastName || ''}`.trim()} 
                    {teacher.email && ` (${teacher.email})`}
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
      <div className="space-y-2">
        <Label>{t('contract.form.type')}</Label>
        <div className="relative">
          <FileText className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger className={isRTL ? 'pr-10' : 'pl-10'}>
              <SelectValue placeholder={t('contract.form.selectType')} />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {t(`contract.type.${type.toLowerCase()}`) || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
</div>
      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('contract.form.uploadDate')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="date"
              value={formData.uploadDate}
              onChange={(e) => handleChange('uploadDate', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>{t('contract.form.expiryDate')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <Label>{t('contract.form.document')}</Label>
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
          <Input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formData.file ? formData.file.name : t('common.uploadFile')}
          </p>
          <p className="text-xs text-gray-500 mt-1">{t('contract.form.fileTypes')}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractModalFields;