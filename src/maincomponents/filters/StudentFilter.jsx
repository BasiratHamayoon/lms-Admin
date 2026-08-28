// src/maincomponents/filters/StudentFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const StudentFilter = ({
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

  // Get dynamic filter options from data or use provided dynamicFilters
  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'active', 'inactive', 'suspended', 'graduated'],
      grade: [],
      class: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique grades
      const uniqueGrades = [...new Set(data.map(item => item.grade).filter(Boolean))];
      options.grade = ['all', ...uniqueGrades.sort()];
      
      // Get unique classes
      const uniqueClasses = [...new Set(data.map(item => item.class).filter(Boolean))];
      options.class = ['all', ...uniqueClasses.sort()];
    }

    return options;
  }, [data, dynamicFilters]);

  // Student filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'inactive', 'suspended', 'graduated'] 
    },
    { 
      key: 'grade', 
      label: 'students.form.grade', 
      options: filterOptions.grade || [] 
    },
    { 
      key: 'class', 
      label: 'students.form.class', 
      options: filterOptions.class || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('students.status.active'),
        'inactive': t('students.status.inactive'),
        'suspended': t('students.status.suspended'),
        'graduated': t('students.status.graduated')
      },
      // For grade and class, we can add specific translations if needed
      'grade': {},
      'class': {}
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Student-specific colors
  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
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

export default StudentFilter;