import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';
import { EXPENSE_CATEGORIES, EXPENSE_STATUS, PAYMENT_METHODS } from '@data/expenseData';

const ExpenseFilter = ({
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
      status: ['all', ...EXPENSE_STATUS],
      category: ['all', ...EXPENSE_CATEGORIES],
      paymentMethod: ['all', ...PAYMENT_METHODS]
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    return options;
  }, [dynamicFilters]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'pending', 'approved', 'rejected', 'recorded'] 
    },
    { 
      key: 'category', 
      label: 'expense.category', 
      options: filterOptions.category || [] 
    },
    { 
      key: 'paymentMethod', 
      label: 'expense.paymentMethod', 
      options: filterOptions.paymentMethod || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'pending': t('expense.status.pending'),
        'approved': t('expense.status.approved'),
        'rejected': t('expense.status.rejected'),
        'recorded': t('expense.status.recorded')
      },
      'category': {
        'stationery': t('expense.categories.stationery'),
        'utilities': t('expense.categories.utilities'),
        'equipment': t('expense.categories.equipment'),
        'maintenance': t('expense.categories.maintenance'),
        'transportation': t('expense.categories.transportation'),
        'events': t('expense.categories.events'),
        'salaries': t('expense.categories.salaries'),
        'food': t('expense.categories.food'),
        'other': t('expense.categories.other')
      },
      'paymentMethod': {
        'cash': t('expense.paymentMethods.cash'),
        'credit-card': t('expense.paymentMethods.credit-card'),
        'bank-transfer': t('expense.paymentMethods.bank-transfer'),
        'cheque': t('expense.paymentMethods.cheque'),
        'online': t('expense.paymentMethods.online'),
        'other': t('expense.paymentMethods.other')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-pink-50 dark:bg-pink-900/20',
    activeText: 'text-pink-700 dark:text-pink-300',
    activeBorder: 'border-pink-200 dark:border-pink-700',
    badge: 'bg-pink-500'
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

export default ExpenseFilter;