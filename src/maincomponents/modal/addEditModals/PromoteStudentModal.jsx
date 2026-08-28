import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseCreateModal from './BaseCreateModal';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { GraduationCap, Hash, Calendar } from 'lucide-react';
import { fetchClasses } from '@redux/actions/class'; 

const PromoteStudentModal = ({ isOpen, onClose, student, onSubmit, isSubmitting, isRTL }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  
  const { classes } = useSelector((state) => state.classes || { classes: [] });

  const [formData, setFormData] = useState({
    newClassId: '',
    newSection: '',
    newRollNumber: '',
    newAcademicYear: ''
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchClasses({ page: 1, limit: 100 }));
      
    }
  }, [isOpen, dispatch]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  
  const getClassName = (cls) => {
     if (!cls) return '';
     return cls.name?.en || cls.name || ''; 
  };

  return (
    <BaseCreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={isRTL ? 'ترقية الطالب' : 'Promote Student'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isRTL={isRTL}
      submitText={isRTL ? 'ترقية' : 'Promote'}
    >
      <div className="space-y-4">
        {student && (
           <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mb-4 border border-blue-200">
              <span className="font-bold">{isRTL ? 'الطالب:' : 'Student:'}</span> {student.displayName} <br/>
              <span className="font-bold">{isRTL ? 'الصف الحالي:' : 'Current Class:'}</span> {student.currentClass}
           </div>
        )}

        {/* Target Class */}
        <div className="space-y-2">
          <Label>{isRTL ? 'إلى الصف' : 'Promote To Class'}</Label>
          <div className="relative">
            <GraduationCap className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <select
              required
              value={formData.newClassId}
              onChange={(e) => handleChange('newClassId', e.target.value)}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
            >
              <option value="">{t('common.select')}</option>
              {classes.map((cls) => (
                <option key={cls._id || cls.id} value={cls._id || cls.id}>
                  {getClassName(cls)} {cls.section ? `(${cls.section})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            {/* Target Section */}
            <div className="space-y-2">
            <Label>{t('students.form.section')}</Label>
            <Input
                required
                value={formData.newSection}
                onChange={(e) => handleChange('newSection', e.target.value)}
                placeholder="A"
            />
            </div>

            {/* Target Roll Number */}
            <div className="space-y-2">
            <Label>{t('students.form.rollNumber')}</Label>
            <div className="relative">
                <Hash className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                required
                value={formData.newRollNumber}
                onChange={(e) => handleChange('newRollNumber', e.target.value)}
                placeholder="102"
                className={isRTL ? 'pr-10' : 'pl-10'}
                />
            </div>
            </div>
        </div>

        {/* Next Academic Year */}
        <div className="space-y-2">
          <Label>{t('students.form.academicYear')}</Label>
          <div className="relative">
             <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
             <Input
                required
                value={formData.newAcademicYear}
                onChange={(e) => handleChange('newAcademicYear', e.target.value)}
                placeholder="2024-2025"
                className={isRTL ? 'pr-10' : 'pl-10'}
             />
          </div>
        </div>
      </div>
    </BaseCreateModal>
  );
};

export default PromoteStudentModal;