import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { User, Calendar, Clock, Hash, Building, MessageSquare, ChevronsUpDown, CheckSquare, Square, AlertCircle, CheckCircle, Users, Info, Languages } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { cn } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Switch } from '../../components/ui/switch';

const AttendanceModalFields = ({
  formData,
  handleChange,
  isRTL = false,
  staffList = [],
  departments = [],
  modalMode = 'add',
  currentLanguage = 'en',
  workHours = null,
  enableMultiLanguage = true
}) => {
  const { t, i18n } = useTranslation();
  const [openEmployeeDropdown, setOpenEmployeeDropdown] = useState(false);
  const [openDepartmentDropdown, setOpenDepartmentDropdown] = useState(false);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [inputMode, setInputMode] = useState('single');

  const statusOptions = [
    { value: 'present', label: 'attendance.status.present', color: 'bg-green-100 text-green-800' },
    { value: 'absent', label: 'attendance.status.absent', color: 'bg-red-100 text-red-800' },
    { value: 'late', label: 'attendance.status.late', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'half-day', label: 'attendance.status.halfDay', color: 'bg-orange-100 text-orange-800' },
    { value: 'leave', label: 'attendance.status.leave', color: 'bg-blue-100 text-blue-800' }
  ];

  const methodOptions = [
    { value: 'manual', label: 'attendance.method.manual' },
    { value: 'auto', label: 'attendance.method.auto' }
  ];

  const toggleInputMode = () => {
    setInputMode(inputMode === 'single' ? 'dual' : 'single');
  };

  const getTranslation = (key, lang = null) => {
    if (lang) {
      return i18n.getFixedT(lang)(key);
    }
    return t(key);
  };

  const handleRemarksChange = (lang, value) => {
    const updatedRemarks = {
      ...formData.remarks,
      [lang]: value
    };
    handleChange('remarks', updatedRemarks);
  };

  const getRemarksValue = (lang) => {
    if (typeof formData.remarks === 'string') {
      return lang === currentLanguage ? formData.remarks : '';
    }
    return formData.remarks?.[lang] || '';
  };

  const formatTimeValue = (timeValue, fallback = '09:00') => {
    if (!timeValue) return fallback;
    if (typeof timeValue === 'string') return timeValue;
    if (typeof timeValue === 'object' && timeValue !== null) {
      const hour = timeValue.hour ?? timeValue.hours ?? 0;
      const minute = timeValue.minute ?? timeValue.minutes ?? 0;
      return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    if (typeof timeValue === 'number') {
      if (timeValue < 24) return `${String(Math.floor(timeValue)).padStart(2, '0')}:00`;
      const date = new Date(timeValue);
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    return fallback;
  };

  const formatTimeDisplay = (timeValue) => {
    const formatted = formatTimeValue(timeValue);
    if (!formatted) return '--:--';
    return formatted;
  };

 const getEmployeeName = (staff) => {
  if (!staff || !staff.name) return 'Unknown';
  if (typeof staff.name === 'string') return staff.name || 'Unknown';
  
  if (typeof staff.name === 'object') {
    // 1. First, try current language
    const currentLangName = currentLanguage === 'ar' ? staff.name.ar : staff.name.en;
    
    if (currentLangName && currentLangName.trim()) {
      if (typeof currentLangName === 'string') return currentLangName;
      if (typeof currentLangName === 'object') {
        const fullName = `${currentLangName.firstName || ''} ${currentLangName.lastName || ''}`.trim();
        if (fullName) return fullName;
      }
    }
    
    // 2. Fallback to display name
    if (staff.name.display && staff.name.display.trim()) {
      return staff.name.display;
    }
    
    // 3. Fallback to other language
    const fallbackLangName = currentLanguage === 'ar' ? staff.name.en : staff.name.ar;
    
    if (fallbackLangName && fallbackLangName.trim()) {
      if (typeof fallbackLangName === 'string') return fallbackLangName;
      if (typeof fallbackLangName === 'object') {
        const fullName = `${fallbackLangName.firstName || ''} ${fallbackLangName.lastName || ''}`.trim();
        if (fullName) return fullName;
      }
    }
  }
  
  return 'Unknown';
};
  const getEmployeeId = (staff) => staff._id || staff.id;

  const getDepartmentName = (dept) => {
    if (!dept) return 'N/A';
    if (typeof dept === 'string') return dept;
    if (typeof dept === 'object') return dept.name || dept.en || dept.ar || 'N/A';
    return 'N/A';
  };

  const defaultStartTime = useMemo(() => formatTimeValue(workHours?.startTime, '09:00'), [workHours]);
  const defaultEndTime = useMemo(() => formatTimeValue(workHours?.endTime, '17:00'), [workHours]);

  const availableStaff = useMemo(() => {
    let filtered = [...staffList];
    const selectedDepartments = formData.departments || [];
    if (selectedDepartments.length > 0 && modalMode === 'add') {
      filtered = filtered.filter(staff => {
        const staffDept = getDepartmentName(staff.department);
        return selectedDepartments.includes(staffDept);
      });
    }
    if (employeeSearch) {
      const searchLower = employeeSearch.toLowerCase();
      filtered = filtered.filter(staff => {
        const name = getEmployeeName(staff).toLowerCase();
        const id = (staff.id || staff._id || '').toString().toLowerCase();
        const dept = getDepartmentName(staff.department).toLowerCase();
        return name.includes(searchLower) || id.includes(searchLower) || dept.includes(searchLower);
      });
    }
    return filtered;
  }, [staffList, formData.departments, employeeSearch, modalMode]);

  const markedEmployeesCount = useMemo(() => staffList.filter(staff => staff.attendance?.timeIn).length, [staffList]);
  const unmarkedEmployeesCount = useMemo(() => staffList.filter(staff => !staff.attendance?.timeIn).length, [staffList]);
  const normalizedDepartments = useMemo(() => departments.map(dept => getDepartmentName(dept)).filter(Boolean), [departments]);
  const showTimeFields = ['present', 'late', 'half-day'].includes(formData.status);

  const handleEmployeeToggle = (employeeId) => {
    const selectedEmployees = formData.employees || [];
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      handleChange('employees', selectedEmployees.filter(id => id !== employeeId));
    } else {
      handleChange('employees', [...selectedEmployees, employeeId]);
    }
  };

  const handleSelectAllEmployees = () => {
    const selectedEmployees = formData.employees || [];
    const availableIds = availableStaff.map(s => getEmployeeId(s));
    if (selectedEmployees.length === availableIds.length) {
      handleChange('employees', []);
    } else {
      handleChange('employees', availableIds);
    }
  };

  const handleSelectUnmarked = () => {
    const unmarkedIds = staffList.filter(staff => !staff.attendance?.timeIn).map(s => getEmployeeId(s));
    handleChange('employees', unmarkedIds);
  };

  const handleDepartmentToggle = (department) => {
    const selectedDepartments = formData.departments || [];
    const isSelected = selectedDepartments.includes(department);
    if (isSelected) {
      handleChange('departments', selectedDepartments.filter(d => d !== department));
    } else {
      handleChange('departments', [...selectedDepartments, department]);
    }
  };

  const handleSelectAllDepartments = () => {
    const selectedDepartments = formData.departments || [];
    if (selectedDepartments.length === normalizedDepartments.length) {
      handleChange('departments', []);
    } else {
      handleChange('departments', [...normalizedDepartments]);
    }
  };

  const renderEmployeeMultiSelect = () => {
    const selectedEmployees = formData.employees || [];
    return (
      <div className="space-y-3">
        <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Users className="w-4 h-4 text-amber-600" />
          {t('attendance.form.selectEmployees')}
          <Badge variant="secondary" className="ml-2">{selectedEmployees.length} / {availableStaff.length}</Badge>
        </Label>
        <Popover open={openEmployeeDropdown} onOpenChange={setOpenEmployeeDropdown}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openEmployeeDropdown} className={cn("w-full justify-between min-h-[42px]", isRTL ? "text-right flex-row-reverse" : "text-left", selectedEmployees.length > 0 && "border-amber-500 bg-amber-50 dark:bg-amber-900/20")}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">
                  {selectedEmployees.length === 0 ? t('attendance.form.selectEmployees') : selectedEmployees.length === 1 ? (() => { const staff = staffList.find(s => getEmployeeId(s) === selectedEmployees[0]); return staff ? getEmployeeName(staff) : t('attendance.form.selectedEmployee'); })() : `${selectedEmployees.length} ${t('attendance.form.employeesSelected') || 'employees selected'}`}
                </span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align={isRTL ? 'end' : 'start'}>
            <Command shouldFilter={false}>
              <CommandInput placeholder={t('attendance.form.searchEmployees') || 'Search employees...'} className="h-10" dir={isRTL ? 'rtl' : 'ltr'} value={employeeSearch} onValueChange={setEmployeeSearch} />
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 space-y-1">
                <div className="flex gap-2 flex-wrap">
                  <Button type="button" variant="outline" size="sm" className="flex-1 gap-2 text-xs" onClick={handleSelectAllEmployees}>
                    {selectedEmployees.length === availableStaff.length ? (<><Square className="h-3 w-3" />{t('common.deselectAll') || 'Deselect All'}</>) : (<><CheckSquare className="h-3 w-3" />{t('common.selectAll') || 'Select All'} ({availableStaff.length})</>)}
                  </Button>
                  {unmarkedEmployeesCount > 0 && (
                    <Button type="button" variant="outline" size="sm" className="flex-1 gap-2 text-xs text-amber-600 border-amber-300 hover:bg-amber-50" onClick={handleSelectUnmarked}>
                      <AlertCircle className="h-3 w-3" />
                      {isRTL ? 'غير المسجلين' : 'Unmarked'} ({unmarkedEmployeesCount})
                    </Button>
                  )}
                </div>
              </div>
              <CommandList>
                <CommandEmpty>{t('common.noResults') || 'No results found'}</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-64">
                    {availableStaff.map((staff) => {
                      const staffId = getEmployeeId(staff);
                      const isSelected = selectedEmployees.includes(staffId);
                      const isMarked = staff.attendance?.timeIn;
                      const staffDept = getDepartmentName(staff.department);
                      return (
                        <CommandItem key={staffId} value={staffId} onSelect={() => handleEmployeeToggle(staffId)} className={cn("cursor-pointer gap-3 py-3", isSelected && "bg-amber-50 dark:bg-amber-900/30", isRTL && "flex-row-reverse")}>
                          {isSelected ? <CheckSquare className="h-4 w-4 text-amber-600 shrink-0" /> : <Square className="h-4 w-4 text-gray-400 shrink-0" />}
                          <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900 dark:text-white truncate">{getEmployeeName(staff)}</span>
                              {isMarked && (<Badge variant="outline" className="text-xs text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />{isRTL ? 'مسجل' : 'Marked'}</Badge>)}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>{staff.id || String(staffId).slice(-8)}</span>
                              <span>•</span>
                              <span>{staffDept}</span>
                              {staff.role && (<><span>•</span><span className="capitalize">{staff.role}</span></>)}
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedEmployees.length > 0 && (
          <div className={`flex items-center gap-2 text-sm text-amber-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle className="w-4 h-4" />
            <span>{selectedEmployees.length} {t('attendance.form.employeesSelected') || 'employees selected'}</span>
          </div>
        )}
      </div>
    );
  };

  const renderDepartmentMultiSelect = () => {
    const selectedDepartments = formData.departments || [];
    if (normalizedDepartments.length === 0) return null;
    return (
      <div className="space-y-3">
        <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Building className="w-4 h-4 text-blue-600" />
          {t('attendance.form.filterByDepartment') || 'Filter by Department'}
          <span className="text-xs text-gray-500">({t('common.optional') || 'Optional'})</span>
        </Label>
        <Popover open={openDepartmentDropdown} onOpenChange={setOpenDepartmentDropdown}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openDepartmentDropdown} className={cn("w-full justify-between min-h-[42px]", isRTL ? "text-right flex-row-reverse" : "text-left", selectedDepartments.length > 0 && "border-blue-500 bg-blue-50 dark:bg-blue-900/20")}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Building className="h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">{selectedDepartments.length === 0 ? t('attendance.form.allDepartments') || 'All Departments' : selectedDepartments.length === 1 ? selectedDepartments[0] : `${selectedDepartments.length} ${t('attendance.form.departmentsSelected') || 'departments selected'}`}</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align={isRTL ? 'end' : 'start'}>
            <Command>
              <CommandInput placeholder={t('attendance.form.searchDepartments') || 'Search departments...'} className="h-10" dir={isRTL ? 'rtl' : 'ltr'} />
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <Button type="button" variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSelectAllDepartments}>
                  {selectedDepartments.length === normalizedDepartments.length ? (<><CheckSquare className="h-4 w-4 text-blue-600" />{t('common.deselectAll') || 'Deselect All'}</>) : (<><Square className="h-4 w-4 text-gray-400" />{t('common.selectAll') || 'Select All'} ({normalizedDepartments.length})</>)}
                </Button>
              </div>
              <CommandList>
                <CommandEmpty>{t('common.noResults') || 'No results found'}</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-48">
                    {normalizedDepartments.map((dept) => {
                      const isSelected = selectedDepartments.includes(dept);
                      const deptStaffCount = staffList.filter(s => getDepartmentName(s.department) === dept).length;
                      return (
                        <CommandItem key={dept} value={dept} onSelect={() => handleDepartmentToggle(dept)} className={cn("cursor-pointer gap-3 py-2", isSelected && "bg-blue-50 dark:bg-blue-900/30", isRTL && "flex-row-reverse")}>
                          {isSelected ? <CheckSquare className="h-4 w-4 text-blue-600 shrink-0" /> : <Square className="h-4 w-4 text-gray-400 shrink-0" />}
                          <span className="flex-1">{dept}</span>
                          <Badge variant="secondary" className="text-xs">{deptStaffCount}</Badge>
                        </CommandItem>
                      );
                    })}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const renderEmployeeSelect = () => {
    const selectedEmployee = staffList.find(s => getEmployeeId(s) === formData.employee);
    return (
      <div className="space-y-2">
        <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><User className="w-4 h-4 text-amber-600" />{t('attendance.form.employee')}</Label>
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold">{getEmployeeName(selectedEmployee)?.charAt(0).toUpperCase() || 'U'}</div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="font-medium text-gray-900 dark:text-white">{selectedEmployee ? getEmployeeName(selectedEmployee) : formData.employee || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{getDepartmentName(selectedEmployee?.department) || formData.department || 'N/A'}{selectedEmployee?.role && ` • ${selectedEmployee.role}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDateField = () => (
    <div className="space-y-2">
      <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Calendar className="w-4 h-4 text-amber-600" />{t('attendance.form.date')} *</Label>
      <Input type="date" value={formData.date || ''} onChange={(e) => handleChange('date', e.target.value)} className={cn("w-full", isRTL && "text-right")} required />
    </div>
  );

  const renderStatusField = () => (
    <div className="space-y-2">
      <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Hash className="w-4 h-4 text-amber-600" />{t('attendance.form.status') || 'Status'} *</Label>
      <Select value={formData.status || 'present'} onValueChange={(value) => handleChange('status', value)}>
        <SelectTrigger className="w-full"><SelectValue placeholder={t('attendance.form.selectStatus') || 'Select status'} /></SelectTrigger>
        <SelectContent align={isRTL ? 'end' : 'start'}>
          {statusOptions.map(option => (<SelectItem key={option.value} value={option.value}><div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}><span className={cn("px-2 py-0.5 rounded text-xs", option.color)}>{t(option.label)}</span></div></SelectItem>))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderTimeFields = () => {
    if (!showTimeFields) return null;
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Clock className="w-4 h-4 text-green-600" />{t('attendance.form.timeIn') || 'Time In'}</Label>
          <Input type="time" value={formData.timeIn || defaultStartTime} onChange={(e) => handleChange('timeIn', e.target.value)} className="w-full" />
        </div>
        <div className="space-y-2">
          <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Clock className="w-4 h-4 text-red-600" />{t('attendance.form.timeOut') || 'Time Out'}</Label>
          <Input type="time" value={formData.timeOut || defaultEndTime} onChange={(e) => handleChange('timeOut', e.target.value)} className="w-full" />
        </div>
      </div>
    );
  };

  const renderMethodField = () => {
    if (modalMode === 'add') return null;
    return (
      <div className="space-y-2">
        <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}><Hash className="w-4 h-4 text-amber-600" />{t('attendance.form.method') || 'Method'}</Label>
        <Select value={formData.method || 'manual'} onValueChange={(value) => handleChange('method', value)}>
          <SelectTrigger className="w-full"><SelectValue placeholder={t('attendance.form.selectMethod') || 'Select method'} /></SelectTrigger>
          <SelectContent align={isRTL ? 'end' : 'start'}>{methodOptions.map(option => (<SelectItem key={option.value} value={option.value}>{t(option.label)}</SelectItem>))}</SelectContent>
        </Select>
      </div>
    );
  };

  const renderRemarksField = () => {
    if (inputMode === 'single') {
      return (
        <div className="space-y-2">
          <Label className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <MessageSquare className="w-4 h-4 text-amber-600" />
            {t('attendance.form.remarks') || 'Remarks'}
            <span className="text-xs text-gray-500">({t('common.optional') || 'Optional'})</span>
          </Label>
          <Textarea 
            value={getRemarksValue(currentLanguage)} 
            onChange={(e) => handleRemarksChange(currentLanguage, e.target.value)} 
            placeholder={isRTL ? 'أضف ملاحظات...' : 'Add remarks...'} 
            className={cn("min-h-[80px] resize-none", isRTL && "text-right")} 
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            style={{
              direction: currentLanguage === 'ar' ? 'rtl' : 'ltr'
            }}
          />
        </div>
      );
    }

    // Dual mode - English and Arabic
    return (
      <>
        {/* English Remarks */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            {isRTL ? (
              <>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  {getTranslation('attendance.form.remarks', 'en')}
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  {getTranslation('attendance.form.remarks', 'en')}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t('common.english')}
                </span>
              </>
            )}
          </Label>
          <Textarea 
            value={getRemarksValue('en')} 
            onChange={(e) => handleRemarksChange('en', e.target.value)} 
            placeholder={`${getTranslation('attendance.form.remarks', 'en')} (${t('common.english')})`}
            className="min-h-[80px] resize-none" 
            dir="ltr"
            style={{
              direction: 'ltr'
            }}
          />
        </div>

        {/* Arabic Remarks */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {t('common.arabic')}
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              {getTranslation('attendance.form.remarks', 'ar')}
            </span>
          </Label>
          <Textarea 
            value={getRemarksValue('ar')} 
            onChange={(e) => handleRemarksChange('ar', e.target.value)} 
            placeholder={`${getTranslation('attendance.form.remarks', 'ar')} (${t('common.arabic')})`}
            className="min-h-[80px] resize-none text-right" 
            dir="rtl"
            style={{
              direction: 'rtl'
            }}
          />
        </div>
      </>
    );
  };

  const renderWorkHoursInfo = () => {
    if (!workHours) return null;
    const startTimeDisplay = formatTimeDisplay(workHours.startTime);
    const endTimeDisplay = formatTimeDisplay(workHours.endTime);
    const graceMinutes = workHours.graceMinutes || workHours.grace || 0;
    return (
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className={`text-sm text-blue-700 dark:text-blue-300 ${isRTL ? 'text-right' : ''}`}>
          <strong>{isRTL ? 'ساعات العمل:' : 'Work Hours:'}</strong> {startTimeDisplay} - {endTimeDisplay}
          {graceMinutes > 0 && (<span className="ml-2">({isRTL ? `فترة سماح: ${graceMinutes} دقيقة` : `Grace: ${graceMinutes} min`})</span>)}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {renderWorkHoursInfo()}

      {enableMultiLanguage && (
        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-amber-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
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
                className="data-[state=checked]:bg-amber-600"
              />
              <span className="text-sm text-gray-500">{t('common.dual')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
          {modalMode === 'add' ? (t('attendance.selectEmployees') || 'Select Employees') : (t('attendance.employeeInfo') || 'Employee Information')}
        </h3>
        {modalMode === 'add' ? (<div className="space-y-4">{renderDepartmentMultiSelect()}{renderEmployeeMultiSelect()}</div>) : renderEmployeeSelect()}
      </div>
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
          {t('attendance.attendanceDetails') || 'Attendance Details'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{renderDateField()}{renderStatusField()}</div>
      </div>
      {showTimeFields && (
        <div className="space-y-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
            {t('attendance.timeDetails') || 'Time Details'}
          </h3>
          {renderTimeFields()}
        </div>
      )}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          {t('attendance.additionalInfo') || 'Additional Information'}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {renderMethodField()}
          {renderRemarksField()}
        </div>
      </div>
      {modalMode === 'add' && (formData.employees?.length > 0) && (
        <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CheckCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className={`text-sm text-amber-700 dark:text-amber-300 ${isRTL ? 'text-right' : ''}`}>
            {isRTL ? `سيتم تسجيل حضور ${formData.employees.length} موظف بحالة "${t(`attendance.status.${formData.status}`)}"` : `Will mark attendance for ${formData.employees.length} employee(s) as "${t(`attendance.status.${formData.status}`)}"`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AttendanceModalFields;