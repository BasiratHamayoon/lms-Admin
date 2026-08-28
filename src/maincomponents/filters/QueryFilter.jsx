// src/maincomponents/filters/QueryFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const QueryFilter = ({
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
      status: [],
      type: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique statuses
      const uniqueStatuses = [...new Set(data.map(item => item.status).filter(Boolean))];
      options.status = ['all', ...uniqueStatuses];
      
      // Get unique types
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
    }

    return options;
  }, [data, dynamicFilters]);

  // Query filter configuration
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || [] 
    },
    { 
      key: 'type', 
      label: 'Type', 
      options: filterOptions.type || [] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'pending': t('queries.status.pending'),
        'in-progress': t('queries.status.inProgress'),
        'resolved': t('queries.status.resolved')
      },
      'type': {
        'academic': 'Academic',
        'technical': 'Technical',
        'administrative': 'Administrative',
        'emergency': 'Emergency',
        'general': 'General'
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Query-specific colors
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

export default QueryFilter;