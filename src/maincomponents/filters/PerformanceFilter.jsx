import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const PerformanceFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {},
  filterType = 'performance'
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'draft', 'submitted', 'acknowledged', 'finalized'],
      role: [],
      department: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueRoles = [...new Set(data.map(item => item.role || (item.staff?.role)).filter(Boolean))];
      const uniqueDepartments = [...new Set(data.map(item => item.department || (item.staff?.department)).filter(Boolean))];
      options.role = ['all', ...uniqueRoles];
      options.department = ['all', ...uniqueDepartments];
    }

    return options;
  }, [data, dynamicFilters]);

  const getFilterConfig = () => {
    if (filterType === 'kpi') {
      return [
        { 
          key: 'role', 
          label: t('staff.form.role'),
          options: filterOptions.role || [] 
        },
        { 
          key: 'department', 
          label: t('staff.form.department'),
          options: filterOptions.department || [] 
        }
      ];
    }

    return [
      { 
        key: 'status', 
        label: t('common.status'),
        options: filterOptions.status || ['all', 'draft', 'submitted', 'acknowledged', 'finalized'] 
      },
      { 
        key: 'role', 
        label: t('staff.form.role'),
        options: filterOptions.role || [] 
      },
      { 
        key: 'department', 
        label: t('staff.form.department'),
        options: filterOptions.department || [] 
      }
    ];
  };

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'draft': t('performance.status.draft'),
        'submitted': t('performance.status.submitted'),
        'acknowledged': t('performance.status.acknowledged'),
        'finalized': t('performance.status.finalized')
      },
      'role': {
        'Admin': t('staff.roles.Admin'),
        'Teacher': t('staff.roles.Teacher'),
        'Staff': t('staff.roles.Staff'),
        'Principal': t('staff.roles.Principal'),
        'Vice Principal': t('staff.roles.Vice Principal'),
        'Counselor': t('staff.roles.Counselor'),
        'Librarian': t('staff.roles.Librarian'),
        'Nurse': t('staff.roles.Nurse')
      },
      'department': {
        'Administration': t('staff.departments.Administration'),
        'Academics': t('staff.departments.Academics'),
        'Student Affairs': t('staff.departments.Student Affairs'),
        'Finance': t('staff.departments.Finance'),
        'IT': t('staff.departments.IT'),
        'Maintenance': t('staff.departments.Maintenance'),
        'Security': t('staff.departments.Security')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const getFilterColors = () => {
    if (filterType === 'kpi') {
      return {
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
        activeText: 'text-indigo-700 dark:text-indigo-300',
        activeBorder: 'border-indigo-200 dark:border-indigo-700',
        badge: 'bg-indigo-500'
      };
    }

    return {
      activeBg: 'bg-purple-50 dark:bg-purple-900/20',
      activeText: 'text-purple-700 dark:text-purple-300',
      activeBorder: 'border-purple-200 dark:border-purple-700',
      badge: 'bg-purple-500'
    };
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
      filterConfig={getFilterConfig()}
      getOptionLabel={getOptionLabel}
      filterColors={getFilterColors()}
    />
  );
};

export default PerformanceFilter;