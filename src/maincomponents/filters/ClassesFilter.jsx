// src/maincomponents/filters/ClassesFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const ClassesFilter = ({
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
      academicYear: [],
      semester: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique academic years
      const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
      options.academicYear = ['all', ...uniqueYears];
      
      // Get unique semesters
      const uniqueSemesters = [...new Set(data.map(item => item.semester).filter(Boolean))];
      options.semester = ['all', ...uniqueSemesters];
    }

    return options;
  }, [data, dynamicFilters]);

  // Classes filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'inactive'] 
    },
    { 
      key: 'academicYear', 
      label: 'classes.academicYear', 
      options: filterOptions.academicYear || [] 
    },
    { 
      key: 'semester', 
      label: 'classes.semester', 
      options: filterOptions.semester || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('classes.status.active'),
        'inactive': t('classes.status.inactive')
      },
      'semester': {
        'Spring': t('classes.form.Spring'),
        'Fall': t('classes.form.Fall'),
        'Summer': t('classes.form.Summer'),
        'Winter': t('classes.form.Winter')
      },
      'academicYear': option // Use raw value for academic year
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Classes-specific colors
  const filterColors = {
    activeBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    activeText: 'text-cyan-700 dark:text-cyan-300',
    activeBorder: 'border-cyan-200 dark:border-cyan-700',
    badge: 'bg-cyan-500'
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

export default ClassesFilter;