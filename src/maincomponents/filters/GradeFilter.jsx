import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const GradeFilter = ({
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
      status: ['all', 'draft', 'published', 'archived'],
      term: ['all', 'first', 'second', 'third', 'fourth', 'final'],
      academicYear: [],
      course: [],
      class: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
      options.academicYear = ['all', ...uniqueYears.sort().reverse()];
      
      const uniqueCourses = [...new Set(data.map(item => item.course?.name).filter(Boolean))];
      options.course = ['all', ...uniqueCourses.sort()];
      
      const uniqueClasses = [...new Set(data.map(item => item.student?.class).filter(Boolean))];
      options.class = ['all', ...uniqueClasses.sort()];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'grade.form.status', 
      options: filterOptions.status || ['all', 'draft', 'published', 'archived'] 
    },
    { 
      key: 'term', 
      label: 'grade.form.term', 
      options: filterOptions.term || ['all', 'first', 'second', 'third', 'fourth', 'final'] 
    },
    { 
      key: 'academicYear', 
      label: 'grade.form.academicYear', 
      options: filterOptions.academicYear || [] 
    },
    { 
      key: 'course', 
      label: 'grade.form.course', 
      options: filterOptions.course || [] 
    },
    { 
      key: 'class', 
      label: 'grade.form.class', 
      options: filterOptions.class || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'draft': t('grade.status.draft'),
        'published': t('grade.status.published'),
        'archived': t('grade.status.archived')
      },
      'term': {
        'first': t('grade.terms.first'),
        'second': t('grade.terms.second'),
        'third': t('grade.terms.third'),
        'fourth': t('grade.terms.fourth'),
        'final': t('grade.terms.final')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

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

export default GradeFilter;