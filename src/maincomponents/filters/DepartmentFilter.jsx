// src/maincomponents/filters/DepartmentFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const DepartmentFilter = ({
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
      status: ['all', 'active', 'inactive'],
      name: [],
      head: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique department names
      const uniqueNames = [...new Set(data.map(item => item.name).filter(Boolean))];
      options.name = ['all', ...uniqueNames];
      
      // Get unique department heads
      const uniqueHeads = [...new Set(data.map(item => item.head).filter(Boolean))];
      options.head = ['all', ...uniqueHeads];
    }

    return options;
  }, [data, dynamicFilters]);

  // Department filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'inactive'] 
    },
    { 
      key: 'name', 
      label: 'departments.form.name', 
      options: filterOptions.name || [] 
    },
    { 
      key: 'head', 
      label: 'departments.form.head', 
      options: filterOptions.head || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('departments.status.active'),
        'inactive': t('departments.status.inactive')
      },
      'name': {
        // Department names
        'Mathematics': t('departments.names.Mathematics'),
        'Science': t('departments.names.Science'),
        'Languages': t('departments.names.Languages'),
        'Social Studies': t('departments.names.Social Studies'),
        'Arts & Music': t('departments.names.Arts & Music'),
        'Physical Education': t('departments.names.Physical Education'),
        'Computer Studies': t('departments.names.Computer Studies'),
        'Special Education': t('departments.names.Special Education')
      },
      'head': {} // Head names don't need translation
    };
    
    // Return translated label if exists, otherwise return the option itself
    return translationMap[filterKey]?.[option] || option;
  };

  // Department-specific colors
  const filterColors = {
    activeBg: 'bg-purple-50 dark:bg-purple-900/20',
    activeText: 'text-purple-700 dark:text-purple-300',
    activeBorder: 'border-purple-200 dark:border-purple-700',
    badge: 'bg-purple-500'
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

export default DepartmentFilter;