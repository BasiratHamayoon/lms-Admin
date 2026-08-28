// src/maincomponents/filters/EventsFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const EventsFilter = ({
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
      status: ['all', 'scheduled', 'completed', 'cancelled', 'postponed'],
      type: [],
      visibility: [],
      location: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique types
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      // Get unique visibility
      const uniqueVisibility = [...new Set(data.map(item => item.visibility).filter(Boolean))];
      options.visibility = ['all', ...uniqueVisibility];
      
      // Get unique locations
      const uniqueLocations = [...new Set(data.map(item => item.location).filter(Boolean))];
      options.location = ['all', ...uniqueLocations];
    }

    return options;
  }, [data, dynamicFilters]);

  // Events filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'scheduled', 'completed', 'cancelled'] 
    },
    { 
      key: 'type', 
      label: 'events.form.type', 
      options: filterOptions.type || [] 
    },
    { 
      key: 'visibility', 
      label: 'events.form.visibility', 
      options: filterOptions.visibility || [] 
    },
    { 
      key: 'location', 
      label: 'events.form.location', 
      options: filterOptions.location || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'scheduled': t('events.status.scheduled'),
        'completed': t('events.status.completed'),
        'cancelled': t('events.status.cancelled'),
        'postponed': t('events.status.postponed')
      },
      'type': {
        'academic': t('events.types.academic'),
        'administrative': t('events.types.administrative'),
        'holiday': t('events.types.holiday'),
        'exam': t('events.types.exam'),
        'other': t('events.types.other')
      },
      'visibility': {
        'all': t('events.visibility.all'),
        'teachers': t('events.visibility.staff'),
        'students': t('events.visibility.students'),
        'admins': t('events.visibility.department')
      },
      'location': {}
    };
    
    // Return translated label if exists, otherwise return the option itself
    return translationMap[filterKey]?.[option] || option;
  };

  // Events-specific colors
  const filterColors = {
    activeBg: 'bg-teal-50 dark:bg-teal-900/20',
    activeText: 'text-teal-700 dark:text-teal-300',
    activeBorder: 'border-teal-200 dark:border-teal-700',
    badge: 'bg-teal-500'
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

export default EventsFilter;