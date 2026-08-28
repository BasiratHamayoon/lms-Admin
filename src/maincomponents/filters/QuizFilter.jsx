// src/components/filters/QuizFilter.js
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const QuizFilter = ({
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  metaData = {}
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    return {
      status: ['all', 'draft', 'published', 'closed'],
      classId: ['all', ...(metaData.classes?.map(c => c.id) || [])],
      courseId: ['all', ...(metaData.courses?.map(c => c.id) || [])]
    };
  }, [metaData]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status 
    },
    { 
      key: 'classId', 
      label: 'classes.class', 
      options: filterOptions.classId 
    },
    { 
      key: 'courseId', 
      label: 'courses.course', 
      options: filterOptions.courseId 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    if (filterKey === 'status') {
      const map = {
        'draft': t('status.draft'),
        'published': t('status.published'),
        'closed': t('status.closed')
      };
      return map[option] || option;
    }

    if (filterKey === 'classId') {
      const cls = metaData.classes?.find(c => c.id === option);
      return cls ? cls.name : option;
    }

    if (filterKey === 'courseId') {
      const crs = metaData.courses?.find(c => c.id === option);
      return crs ? crs.name : option;
    }
    
    return option;
  };

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
    />
  );
};

export default QuizFilter;