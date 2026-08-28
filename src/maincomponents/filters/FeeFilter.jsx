import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const FeeFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {},
  isHistory = false
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'pending', 'paid', 'partial', 'overdue', 'waived'],
      academicYear: [],
      classId: [],
      paymentMethod: ['all', 'cash', 'bank-transfer', 'cheque', 'online', 'credit-card']
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      if (isHistory) {
        const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
        options.academicYear = ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
      } else {
        const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
        options.academicYear = ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
        
        const uniqueClasses = [...new Set(data.map(item => item.class?.id).filter(Boolean))];
        options.classId = ['all', ...uniqueClasses];
      }
    }

    return options;
  }, [data, dynamicFilters, isHistory]);

  const filterConfig = isHistory 
    ? [
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'pending', 'paid', 'partial', 'overdue', 'waived'] 
        },
        { 
          key: 'paymentMethod', 
          label: 'fee.paymentMethod', 
          options: filterOptions.paymentMethod || ['all', 'cash', 'bank-transfer', 'cheque', 'online', 'credit-card'] 
        },
        { 
          key: 'academicYear', 
          label: 'fee.academicYear', 
          options: filterOptions.academicYear || [] 
        }
      ]
    : [
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'pending', 'paid', 'partial', 'overdue', 'waived'] 
        },
        { 
          key: 'academicYear', 
          label: 'fee.academicYear', 
          options: filterOptions.academicYear || [] 
        },
        { 
          key: 'classId', 
          label: 'common.className', 
          options: filterOptions.classId || [] 
        }
      ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'pending': t('fee.status.pending'),
        'paid': t('fee.status.paid'),
        'partial': t('fee.status.partial'),
        'overdue': t('fee.status.overdue'),
        'waived': t('fee.status.waived')
      },
      'paymentMethod': {
        'cash': t('fee.paymentMethods.cash'),
        'bank-transfer': t('fee.paymentMethods.bank-transfer'),
        'cheque': t('fee.paymentMethods.cheque'),
        'online': t('fee.paymentMethods.online'),
        'credit-card': t('fee.paymentMethods.credit-card')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

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

export default FeeFilter;