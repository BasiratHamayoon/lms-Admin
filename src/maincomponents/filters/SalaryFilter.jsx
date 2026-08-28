import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const SalaryFilter = ({
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
      paymentStatus: ['all', 'pending', 'completed', 'processing', 'failed', 'cancelled'],
      paymentMethod: ['all', 'bank-transfer', 'cash', 'check', 'online'],
      paymentType: ['all', 'regular', 'advance', 'bonus', 'deduction'],
      month: [],
      year: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueMonths = [...new Set(data.map(item => item.month).filter(Boolean))];
      options.month = ['all', ...uniqueMonths.sort((a, b) => a - b)];
      
      const uniqueYears = [...new Set(data.map(item => item.year).filter(Boolean))];
      options.year = ['all', ...uniqueYears.sort((a, b) => b - a)];
      
      if (isHistory) {
        const uniqueStaff = [...new Set(data.map(item => item.staffId?.name).filter(Boolean))];
        options.staff = ['all', ...uniqueStaff];
      }
    }

    return options;
  }, [data, dynamicFilters, isHistory]);

  const filterConfig = isHistory 
    ? [
        { 
          key: 'paymentStatus', 
          label: 'salary.paymentStatus', 
          options: filterOptions.paymentStatus || ['all', 'pending', 'completed', 'processing', 'failed', 'cancelled'] 
        },
        { 
          key: 'paymentMethod', 
          label: 'salary.paymentMethod', 
          options: filterOptions.paymentMethod || ['all', 'bank-transfer', 'cash', 'check', 'online'] 
        },
        { 
          key: 'month', 
          label: 'salary.form.month', 
          options: filterOptions.month || [] 
        }
      ]
    : [
        { 
          key: 'paymentStatus', 
          label: 'salary.paymentStatus', 
          options: filterOptions.paymentStatus || ['all', 'pending', 'completed', 'processing', 'failed', 'cancelled'] 
        },
        { 
          key: 'paymentMethod', 
          label: 'salary.paymentMethod', 
          options: filterOptions.paymentMethod || ['all', 'bank-transfer', 'cash', 'check', 'online'] 
        },
        { 
          key: 'paymentType', 
          label: 'salary.paymentType', 
          options: filterOptions.paymentType || ['all', 'regular', 'advance', 'bonus', 'deduction'] 
        }
      ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'paymentStatus': {
        'pending': t('leave.status.pending'),
        'completed': t('leave.status.approved'),
        'processing': t('salary.paymentProcessing'),
        'failed': t('salary.paymentFailed'),
        'cancelled': t('leave.status.cancelled')
      },
      'paymentMethod': {
        'bank-transfer': t('salary.paymentMethods.bank-transfer'),
        'cash': t('salary.paymentMethods.cash'),
        'check': t('salary.paymentMethods.check'),
        'online': t('salary.paymentMethods.online')
      },
      'paymentType': {
        'regular': t('salary.paymentTypes.regular'),
        'advance': t('salary.paymentTypes.advance'),
        'bonus': t('salary.paymentTypes.bonus'),
        'deduction': t('salary.paymentTypes.deduction')
      },
      'month': {
        '1': t('salary.months.1'),
        '2': t('salary.months.2'),
        '3': t('salary.months.3'),
        '4': t('salary.months.4'),
        '5': t('salary.months.5'),
        '6': t('salary.months.6'),
        '7': t('salary.months.7'),
        '8': t('salary.months.8'),
        '9': t('salary.months.9'),
        '10': t('salary.months.10'),
        '11': t('salary.months.11'),
        '12': t('salary.months.12')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    activeText: 'text-indigo-700 dark:text-indigo-300',
    activeBorder: 'border-indigo-200 dark:border-indigo-700',
    badge: 'bg-indigo-500'
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

export default SalaryFilter;