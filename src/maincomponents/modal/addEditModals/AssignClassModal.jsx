import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseCreateModal from './BaseCreateModal';
// Ensure these paths are correct for your project structure
import { Label } from '@maincomponents/components/ui/label';
import { Input } from '@maincomponents/components/ui/input';
import { GraduationCap, Hash, Calendar } from 'lucide-react';
import { fetchClasses } from '@redux/actions/class';

const AssignClassModal = ({ isOpen, onClose, student, onSubmit, isSubmitting, isRTL }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classes || { classes: [] });

  const [formData, setFormData] = useState({
    classId: '',
    section: '',
    rollNumber: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Ensure classes are loaded
      dispatch(fetchClasses({ page: 1, limit: 100 }));
      // Reset form
      setFormData({
        classId: '',
        section: '',
        rollNumber: '',
        academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
      });
      setErrors({});
    }
  }, [isOpen, dispatch]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.classId) newErrors.classId = t('common.required');
    if (!formData.section) newErrors.section = t('common.required');
    if (!formData.rollNumber) newErrors.rollNumber = t('common.required');
    if (!formData.academicYear) newErrors.academicYear = t('common.required');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  // --- SAFE LABEL HELPER ---
  const getClassLabel = (cls) => {
    if (!cls) return '';
    const nameObj = cls.name;
    
    // If it's a string, return it
    if (typeof nameObj === 'string') return nameObj;
    
    // If object, try current lang, then en, then ar
    return nameObj?.[i18n.language] || nameObj?.en || nameObj?.ar || '';
  };

  return (
    <BaseCreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={isRTL ? 'تعيين فصل دراسي' : 'Assign Class'}
      description={isRTL 
        ? `تعيين ${student?.displayName || student?.name} لفصل دراسي` 
        : `Assign ${student?.displayName || 'student'} to a class`}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isRTL ? 'تعيين' : 'Assign'}
      type="student"
      isRTL={isRTL}
    >
      <div className="space-y-4 py-2">
        {/* Class Dropdown */}
        <div className="space-y-2">
          <Label>{t('students.form.class')}</Label>
          <div className="relative">
            <GraduationCap className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <select
              value={formData.classId}
              onChange={(e) => handleChange('classId', e.target.value)}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${isRTL ? 'pr-10' : 'pl-10'} ${errors.classId ? 'border-red-500' : ''}`}
            >
              <option value="">{t('common.select')}</option>
              {classes.map((cls) => (
                <option key={cls._id || cls.id} value={cls._id || cls.id}>
                  {/* FIX IS HERE: Use helper function instead of direct object access */}
                  {getClassLabel(cls)} {cls.section ? `(${cls.section})` : ''}
                </option>
              ))}
            </select>
          </div>
          {errors.classId && <p className="text-xs text-red-500">{errors.classId}</p>}
        </div>

        {/* Section & Roll Number Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('students.form.section')}</Label>
            <Input
              value={formData.section}
              onChange={(e) => handleChange('section', e.target.value)}
              placeholder="A"
              className={errors.section ? 'border-red-500' : ''}
            />
             {errors.section && <p className="text-xs text-red-500">{errors.section}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t('students.form.rollNumber')}</Label>
            <div className="relative">
              <Hash className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <Input
                value={formData.rollNumber}
                onChange={(e) => handleChange('rollNumber', e.target.value)}
                placeholder="101"
                className={`${isRTL ? 'pr-10' : 'pl-10'} ${errors.rollNumber ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.rollNumber && <p className="text-xs text-red-500">{errors.rollNumber}</p>}
          </div>
        </div>

        {/* Academic Year */}
        <div className="space-y-2">
          <Label>{t('students.form.academicYear')}</Label>
          <div className="relative">
            <Calendar className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              value={formData.academicYear}
              onChange={(e) => handleChange('academicYear', e.target.value)}
              placeholder="2023-2024"
              className={`${isRTL ? 'pr-10' : 'pl-10'} ${errors.academicYear ? 'border-red-500' : ''}`}
            />
          </div>
          {errors.academicYear && <p className="text-xs text-red-500">{errors.academicYear}</p>}
        </div>
      </div>
    </BaseCreateModal>
  );
};

export default AssignClassModal;