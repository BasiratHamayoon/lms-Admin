// src/maincomponents/filters/LeaveFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const LeaveFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {},
  isQuota = false // New prop to identify if we're in quota context
}) => {
  const { t } = useTranslation();

  // Get dynamic filter options from data or use provided dynamicFilters
  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'pending', 'approved', 'rejected', 'cancelled'],
      leaveType: ['all', 'sick', 'casual', 'annual', 'unpaid', 'other'],
      userRole: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique user roles
      const uniqueRoles = [...new Set(data.map(item => item.userRole).filter(Boolean))];
      options.userRole = ['all', ...uniqueRoles];
      
      // For quota manager, add academic year filter
      if (isQuota) {
        const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
        options.academicYear = ['all', ...uniqueYears];
      }
    }

    return options;
  }, [data, dynamicFilters, isQuota]);

  // Leave filter configuration - different for quota vs leaves
  const filterConfig = isQuota 
    ? [
        { 
          key: 'userRole', 
          label: 'leave.form.userRole', 
          options: filterOptions.userRole || [] 
        },
        { 
          key: 'academicYear', 
          label: 'leave.form.academicYear', 
          options: filterOptions.academicYear || [] 
        }
      ]
    : [
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'pending', 'approved', 'rejected', 'cancelled'] 
        },
        { 
          key: 'leaveType', 
          label: 'leave.form.leaveType', 
          options: filterOptions.leaveType || ['all', 'sick', 'casual', 'annual', 'unpaid', 'other'] 
        },
        { 
          key: 'userRole', 
          label: 'leave.form.userRole', 
          options: filterOptions.userRole || [] 
        }
      ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'pending': t('leave.status.pending'),
        'approved': t('leave.status.approved'),
        'rejected': t('leave.status.rejected'),
        'cancelled': t('leave.status.cancelled')
      },
      'leaveType': {
        'sick': t('leave.types.sick'),
        'casual': t('leave.types.casual'),
        'annual': t('leave.types.annual'),
        'unpaid': t('leave.types.unpaid'),
        'other': t('leave.types.other')
      },
      'userRole': {
        'student': t('leave.roles.student'),
        'teacher': t('leave.roles.teacher'),
        'staff': t('leave.roles.staff'),
        'admin': t('leave.roles.admin')
      },
      'academicYear': {
        // Academic years will just be displayed as-is (e.g., "2023-2024")
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  // Leave-specific colors
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

export default LeaveFilter;