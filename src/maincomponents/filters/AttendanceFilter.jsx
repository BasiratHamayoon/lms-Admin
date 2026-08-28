import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const AttendanceFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();
  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'present', 'absent', 'late', 'excused', 'half-day', 'leave'],
      method: ['all', 'manual', 'auto'],
      department: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];
      options.department = ['all', ...uniqueDepartments];
    }

    return options;
  }, [data, dynamicFilters]);
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'present', 'absent', 'late', 'excused', 'half-day', 'leave'] 
    },
    { 
      key: 'method', 
      label: 'attendance.form.method', 
      options: filterOptions.method || ['all', 'manual', 'auto'] 
    },
    { 
      key: 'department', 
      label: 'staff.form.department', 
      options: filterOptions.department || [] 
    }
  ];
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'present': t('attendance.status.present'),
        'absent': t('attendance.status.absent'),
        'late': t('attendance.status.late'),
        'excused': t('attendance.status.excused'),
        'half-day': t('attendance.status.halfDay'),
        'leave': t('attendance.status.leave')
      },
      'method': {
        'manual': t('attendance.method.manual'),
        'auto': t('attendance.method.auto')
      },
      'department': {
        'Computer Science': t('staff.departments.Computer Science'),
        'Mathematics': t('staff.departments.Mathematics'),
        'Physics': t('staff.departments.Physics'),
        'Chemistry': t('staff.departments.Chemistry'),
        'Biology': t('staff.departments.Biology'),
        'Administration': t('staff.departments.Administration'),
        'Engineering': t('staff.departments.Engineering')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };
  const filterColors = {
    activeBg: 'bg-amber-50 dark:bg-amber-900/20',
    activeText: 'text-amber-700 dark:text-amber-300',
    activeBorder: 'border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-500'
  };

  return (
    <BaseFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onSearchChange={onSearchChange}
      searchTerm={searchTerm}
      isRTL={isRTL}
      showSearch={showSearch}
      showFilters={showFilters}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
    />
  );
};

export default AttendanceFilter;