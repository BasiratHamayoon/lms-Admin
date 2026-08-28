import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const AssignmentFilter = ({
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  metaData = {} // Pass classes and courses here
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    return {
      status: ['all', 'published', 'draft', 'archived'],
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
        'published': t('status.published'),
        'draft': t('status.draft'),
        'archived': t('status.archived')
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

export default AssignmentFilter;