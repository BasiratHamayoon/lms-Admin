import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const StaffFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {},
  className = ''
}) => {
  const { t } = useTranslation();

  // Get dynamic filter options from data or use provided dynamicFilters
  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'active', 'inactive', 'on-leave'],
      role: [],
      department: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique roles
      const uniqueRoles = [...new Set(data.map(item => item.role).filter(Boolean))];
      options.role = ['all', ...uniqueRoles];
      
      // Get unique departments
      const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];
      options.department = ['all', ...uniqueDepartments];
    }

    return options;
  }, [data, dynamicFilters]);

  // Staff filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'inactive', 'on-leave'] 
    },
    { 
      key: 'role', 
      label: 'staff.form.role', 
      options: filterOptions.role || [] 
    },
    { 
      key: 'department', 
      label: 'staff.form.department', 
      options: filterOptions.department || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('staff.status.active'),
        'inactive': t('staff.status.inactive'),
        'on-leave': t('staff.status.on-leave')
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
    
    // Return translated label if exists, otherwise return the option itself
    return translationMap[filterKey]?.[option] || option;
  };

  // Staff-specific colors
  const filterColors = {
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-200 dark:border-green-700',
    badge: 'bg-green-500'
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
      className={className}
    />
  );
};

export default StaffFilter;