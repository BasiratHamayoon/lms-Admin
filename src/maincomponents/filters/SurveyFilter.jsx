import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const SurveyFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {},
  className = ''
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'active', 'inactive'],
      category: [],
      type: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
      options.category = ['all', ...uniqueCategories];
      
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'inactive'] 
    },
    { 
      key: 'category', 
      label: 'survey.form.category', 
      options: filterOptions.category || [] 
    },
    { 
      key: 'type', 
      label: 'survey.form.type', 
      options: filterOptions.type || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('survey.status.active'),
        'inactive': t('survey.status.inactive')
      },
      'category': {
        'teaching': t('survey.categories.teaching'),
        'facilities': t('survey.categories.facilities'),
        'curriculum': t('survey.categories.curriculum'),
        'administration': t('survey.categories.administration'),
        'resources': t('survey.categories.resources'),
        'environment': t('survey.categories.environment'),
        'support': t('survey.categories.support'),
        'overall': t('survey.categories.overall')
      },
      'type': {
        'rating': t('survey.types.rating'),
        'text': t('survey.types.text'),
        'multiple_choice': t('survey.types.multiple_choice'),
        'checkbox': t('survey.types.checkbox')
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
      className={className}
    />
  );
};

export default SurveyFilter;