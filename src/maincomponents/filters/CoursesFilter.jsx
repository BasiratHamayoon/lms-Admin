// src/maincomponents/filters/CoursesFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const CoursesFilter = ({
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
      status: ['all', 'active', 'upcoming', 'completed', 'inactive'],
      category: [],
      grade: [],
      instructor: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      options.category = ['all', ...uniqueCategories];
      
      // Get unique grades
      const uniqueGrades = [...new Set(data.map(item => item.grade).filter(Boolean))];
      options.grade = ['all', ...uniqueGrades];
      
      // Get unique instructors
      const uniqueInstructors = [...new Set(data.map(item => item.instructor).filter(Boolean))];
      options.instructor = ['all', ...uniqueInstructors];
    }

    return options;
  }, [data, dynamicFilters]);

  // Courses filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'upcoming', 'completed', 'inactive'] 
    },
    { 
      key: 'category', 
      label: 'courses.form.category', 
      options: filterOptions.category || [] 
    },
    { 
      key: 'grade', 
      label: 'courses.form.grade', 
      options: filterOptions.grade || [] 
    },
    { 
      key: 'instructor', 
      label: 'courses.form.instructor', 
      options: filterOptions.instructor || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('courses.status.active'),
        'upcoming': t('courses.status.upcoming'),
        'completed': t('courses.status.completed'),
        'inactive': t('courses.status.inactive')
      },
      'category': {},
      'grade': {
        '1st Grade': t('students.grade.1st Grade'),
        '2nd Grade': t('students.grade.2nd Grade'),
        '3rd Grade': t('students.grade.3rd Grade'),
        '4th Grade': t('students.grade.4th Grade'),
        '5th Grade': t('students.grade.5th Grade'),
        '6th Grade': t('students.grade.6th Grade')
      },
      'instructor': {}
    };
    
    // Return translated label if exists, otherwise return the option itself
    return translationMap[filterKey]?.[option] || option;
  };

  // Courses-specific colors
  const filterColors = {
    activeBg: 'bg-pink-50 dark:bg-pink-900/20',
    activeText: 'text-pink-700 dark:text-pink-300',
    activeBorder: 'border-pink-200 dark:border-pink-700',
    badge: 'bg-pink-500'
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

export default CoursesFilter;