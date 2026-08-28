// src/maincomponents/filters/NotificationFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const NotificationFilter = ({
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

  // Get dynamic filter options
  const filterOptions = useMemo(() => {
    const options = {
      type: [],
      priority: [],
      status: [],
      targetAudience: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique types
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      // Get unique priorities
      const uniquePriorities = [...new Set(data.map(item => item.priority).filter(Boolean))];
      options.priority = ['all', ...uniquePriorities];
      
      // Get unique statuses
      const uniqueStatuses = [...new Set(data.map(item => item.status).filter(Boolean))];
      options.status = ['all', ...uniqueStatuses];
      
      // Get unique target audiences
      const uniqueAudiences = [...new Set(data.map(item => item.targetAudience).filter(Boolean))];
      options.targetAudience = ['all', ...uniqueAudiences];
    }

    return options;
  }, [data, dynamicFilters]);

  // Notification filter configuration
  const filterConfig = [
    { 
      key: 'type', 
      label: 'notifications.form.type', 
      options: filterOptions.type || [] 
    },
    { 
      key: 'priority', 
      label: 'notifications.form.priority', 
      options: filterOptions.priority || [] 
    },
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || [] 
    },
    { 
      key: 'targetAudience', 
      label: 'notifications.form.targetAudience', 
      options: filterOptions.targetAudience || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'type': {
        'announcement': t('notifications.types.announcement'),
        'event': t('notifications.types.event'),
        'assignment': t('notifications.types.assignment'),
        'quiz': t('notifications.types.quiz'),
        'grade': t('notifications.types.grade'),
        'fee': t('notifications.types.fee'),
        'attendance': t('notifications.types.attendance'),
        'other': t('notifications.types.other')
      },
      'priority': {
        'low': t('notifications.priority.low'),
        'medium': t('notifications.priority.medium'),
        'high': t('notifications.priority.high'),
        'urgent': t('notifications.priority.urgent')
      },
      'status': {
        'draft': t('notifications.status.draft'),
        'published': t('notifications.status.published'),
        'archived': t('notifications.status.archived')
      },
      'targetAudience': {
        'all': t('notifications.targetAudience.all'),
        'students': t('notifications.targetAudience.students'),
        'teachers': t('notifications.targetAudience.teachers'),
        'staff': t('notifications.targetAudience.staff'),
        'parents': t('notifications.targetAudience.parents'),
        'admin': t('notifications.targetAudience.admin'),
        'specific': t('notifications.targetAudience.specific')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Notification-specific colors
  const filterColors = {
    activeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    activeText: 'text-emerald-700 dark:text-emerald-300',
    activeBorder: 'border-emerald-200 dark:border-emerald-700',
    badge: 'bg-emerald-500'
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

export default NotificationFilter;