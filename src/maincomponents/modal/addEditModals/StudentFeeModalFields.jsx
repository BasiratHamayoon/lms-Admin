
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/ui/popover';
import {
  User,
  DollarSign,
  Calendar,
  Tag,
  Check,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

const StudentFeeModalFields = ({
  formData,
  handleChange,
  isRTL = false,
  feeStructures = [],
  studentOptions = [],
  studentOptionsLoading = false,
  onStudentSearch,
  mode = 'add'
}) => {
  const { t, i18n } = useTranslation();
  const [studentSearchOpen, setStudentSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const currentLanguage = i18n.language;

  const academicYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = -4; i <= 4; i++) {
      const startYear = currentYear + i;
      const endYear = startYear + 1;
      years.push({
        value: `${startYear}-${endYear}`,
        label: `${startYear}-${endYear}`
      });
    }
    
    return years;
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onStudentSearch) {
        onStudentSearch(searchValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onStudentSearch]);

  const getFieldValue = (fieldValue, language = null) => {
    if (typeof fieldValue === 'string') return fieldValue;
    if (fieldValue && typeof fieldValue === 'object') {
      const lang = language || currentLanguage;
      return fieldValue[lang] || fieldValue.en || fieldValue.ar || '';
    }
    return '';
  };

  const getFeeStructureTotal = (feeStructureId) => {
    const structure = feeStructures.find(fs => fs.id === feeStructureId);
    return structure?.totalAmount || 0;
  };

  const getFeeStructureComponentCount = (feeStructureId) => {
    const structure = feeStructures.find(fs => fs.id === feeStructureId);
    return structure?.componentCount || 0;
  };

  
  const getSelectedStudentLabel = () => {
    if (!formData.studentId) return '';
    const selected = studentOptions.find(s => s.value === formData.studentId);
    if (selected) {
      return `${selected.label} (${selected.studentId})`;
    }
    return formData.studentId;
  };

  
  const validFeeStructures = useMemo(() => {
    return feeStructures.filter(fs => fs && fs.id);
  }, [feeStructures]);

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Info */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <User className="h-5 w-5 text-teal-600" />
          {t('fee.studentInfo')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Selection with Search */}
          <div className="space-y-2">
            <Label htmlFor="studentId">{t('fee.form.student')} *</Label>
            <Popover open={studentSearchOpen} onOpenChange={setStudentSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={studentSearchOpen}
                  className={cn(
                    "w-full justify-between h-10",
                    !formData.studentId && "text-muted-foreground"
                  )}
                  disabled={mode === 'edit'}
                >
                  <div className="flex items-center gap-2 truncate">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {formData.studentId ? getSelectedStudentLabel() : t('fee.form.selectStudent')}
                    </span>
                  </div>
                  {studentOptionsLoading ? (
                    <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={t('fee.form.searchStudent')}
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    {studentOptionsLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
                      </div>
                    ) : studentOptions.length === 0 ? (
                      <CommandEmpty>
                        {searchValue 
                          ? t('fee.form.noStudentsFound') 
                          : t('fee.form.typeToSearch')
                        }
                      </CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {studentOptions.map((student) => (
                          <CommandItem
                            key={student.value}
                            value={student.value}
                            onSelect={() => {
                              handleChange('studentId', student.value);
                              setStudentSearchOpen(false);
                              setSearchValue('');
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.studentId === student.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{student.label}</span>
                              <span className="text-xs text-gray-500">
                                {student.studentId} {student.email && `• ${student.email}`}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Academic Year - Dynamic Options */}
          <div className="space-y-2">
            <Label htmlFor="academicYear">{t('fee.form.academicYear')} *</Label>
            <div className="relative">
              <Calendar className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
              <Select
                value={formData.academicYear || ''}
                onValueChange={(value) => handleChange('academicYear', value)}
              >
                <SelectTrigger className={`w-full ${isRTL ? 'pr-10' : 'pl-10'}`}>
                  <SelectValue placeholder={t('fee.form.selectAcademicYear')} />
                </SelectTrigger>
                <SelectContent>
                  {academicYearOptions.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Structure Selection */}
      <div className="space-y-2">
        <Label htmlFor="feeStructureId">{t('fee.selectFeeStructure')} *</Label>
        <div className="relative">
          <Tag className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 z-10 pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`} />
          <Select
            value={formData.feeStructureId || ''}
            onValueChange={(value) => handleChange('feeStructureId', value)}
          >
            <SelectTrigger className={`w-full ${isRTL ? 'pr-10' : 'pl-10'}`}>
              <SelectValue placeholder={t('fee.form.selectFeeStructure')} />
            </SelectTrigger>
            <SelectContent className={isRTL ? 'text-right' : 'text-left'}>
              {validFeeStructures.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
                  {t('fee.form.noFeeStructures')}
                </div>
              ) : (
                validFeeStructures.map((structure) => (
                  <SelectItem key={structure.id} value={structure.id}>
                    <div className="flex items-center justify-between w-full gap-2">
                      <span>{getFieldValue(structure.name)}</span>
                      <span className="text-teal-600 font-medium">
                        ₪{(structure.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {formData.feeStructureId && (
          <p className="text-sm text-gray-500 mt-1">
            {t('fee.form.selectedStructureInfo', {
              components: getFeeStructureComponentCount(formData.feeStructureId)
            })}
          </p>
        )}
      </div>

      {/* Fee Summary */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 p-4 rounded-lg mt-6">
        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <DollarSign className="h-5 w-5 text-teal-600" />
          {t('fee.feeSummary')}
        </h3>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
          {formData.feeStructureId ? (
            <>
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span>{t('fee.baseAmount')}</span>
                <span className="font-semibold">
                  ₪{getFeeStructureTotal(formData.feeStructureId).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-lg font-bold">{t('fee.finalAmount')}</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ₪{getFeeStructureTotal(formData.feeStructureId).toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-4">
              {t('fee.selectFeeStructureToSeeSummary')}
            </p>
          )}
        </div>
      </div>

      {/* Required Fields Note */}
      <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
        * {t('common.requiredFields')}
      </p>
    </div>
  );
};

export default StudentFeeModalFields;