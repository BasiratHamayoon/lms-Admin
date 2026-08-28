import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const ReportsFilter = ({
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
    const options = isHistory 
      ? {
          action: ['all', 'generated', 'downloaded', 'printed', 'shared', 'viewed', 'exported'],
          status: ['all', 'completed', 'processing', 'failed', 'cancelled']
        }
      : {
          reportType: ['all', 'financial', 'performance', 'analytical', 'summary', 'comparative', 'trend'],
          period: ['all', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'],
          status: ['all', 'completed', 'processing', 'failed']
        };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      if (isHistory) {
        const uniqueActions = [...new Set(data.map(item => item.action).filter(Boolean))];
        options.action = ['all', ...uniqueActions];
      } else {
        const uniqueTypes = [...new Set(data.map(item => item.reportType).filter(Boolean))];
        options.reportType = ['all', ...uniqueTypes];
        
        const uniquePeriods = [...new Set(data.map(item => item.period).filter(Boolean))];
        options.period = ['all', ...uniquePeriods];
      }
    }

    return options;
  }, [data, dynamicFilters, isHistory]);

  const filterConfig = isHistory 
    ? [
        { 
          key: 'action', 
          label: 'reports.action', 
          options: filterOptions.action || ['all', 'generated', 'downloaded', 'printed', 'shared', 'viewed', 'exported'] 
        },
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'completed', 'processing', 'failed', 'cancelled'] 
        }
      ]
    : [
        { 
          key: 'reportType', 
          label: 'reports.form.type', 
          options: filterOptions.reportType || ['all', 'financial', 'performance', 'analytical', 'summary', 'comparative', 'trend'] 
        },
        { 
          key: 'period', 
          label: 'reports.form.period', 
          options: filterOptions.period || ['all', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'] 
        },
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'completed', 'processing', 'failed'] 
        }
      ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'reportType': {
        'financial': t('reports.reportTypes.financial'),
        'performance': t('reports.reportTypes.performance'),
        'analytical': t('reports.reportTypes.analytical'),
        'summary': t('reports.reportTypes.summary'),
        'comparative': t('reports.reportTypes.comparative'),
        'trend': t('reports.reportTypes.trend')
      },
      'period': {
        'daily': t('reports.periods.daily'),
        'weekly': t('reports.periods.weekly'),
        'monthly': t('reports.periods.monthly'),
        'quarterly': t('reports.periods.quarterly'),
        'yearly': t('reports.periods.yearly'),
        'custom': t('reports.periods.custom')
      },
      'status': {
        'completed': t('reports.status.completed'),
        'processing': t('reports.status.processing'),
        'failed': t('reports.status.failed'),
        'cancelled': t('reports.status.cancelled')
      },
      'action': {
        'generated': t('reports.actions.generated'),
        'downloaded': t('reports.actions.downloaded'),
        'printed': t('reports.actions.printed'),
        'shared': t('reports.actions.shared'),
        'viewed': t('reports.actions.viewed'),
        'exported': t('reports.actions.exported')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = isHistory 
    ? {
        activeBg: 'bg-blue-50 dark:bg-blue-900/20',
        activeText: 'text-blue-700 dark:text-blue-300',
        activeBorder: 'border-blue-200 dark:border-blue-700',
        badge: 'bg-blue-500'
      }
    : {
        activeBg: 'bg-amber-50 dark:bg-amber-900/20',
        activeText: 'text-amber-700 dark:text-amber-300',
        activeBorder: 'border-amber-200 dark:border-amber-700',
        badge: 'bg-amber-500'
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

export default ReportsFilter;