import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const ContractFilter = ({
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
      status: ['all', 'active', 'expiring', 'expired', 'draft', 'pending'],
      type: [],
      department: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];
      options.department = ['all', ...uniqueDepartments];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'active', 'expiring', 'expired', 'draft', 'pending'] 
    },
    { 
      key: 'type', 
      label: 'contract.form.type', 
      options: filterOptions.type || [] 
    },
    { 
      key: 'department', 
      label: 'contract.form.department', 
      options: filterOptions.department || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'active': t('contract.status.active'),
        'expiring': t('contract.status.expiring'),
        'expired': t('contract.status.expired'),
        'draft': t('contract.status.draft'),
        'pending': t('contract.status.pending')
      },
      'type': {
        'Contract': t('contract.type.Contract'),
        'Agreement': t('contract.type.Agreement'),
        'NOC': t('contract.type.NOC'),
        'Warning': t('contract.type.Warning')
      },
      'department': {
        'Computer Science': 'Computer Science',
        'Mathematics': 'Mathematics',
        'Physics': 'Physics',
        'Chemistry': 'Chemistry',
        'Biology': 'Biology',
        'Business Administration': 'Business Administration',
        'Engineering': 'Engineering',
        'Arts': 'Arts'
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Contract-specific filter colors
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

export default ContractFilter;