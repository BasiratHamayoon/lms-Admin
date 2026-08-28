// src/maincomponents/filters/BaseFilter.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ChevronDown, Check, Filter, X, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BaseFilter = ({
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  filterConfig = [],
  getOptionLabel = () => {},
  filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  },
  className = ''
}) => {
  const { t } = useTranslation();
  const [filterDropdownOpen, setFilterDropdownOpen] = useState({});
  const filterRefs = useRef({});

  const handleFilterClick = (filterKey, value) => {
    const currentValue = filters[filterKey];

    if (value === 'all') {
      onFilterChange(filterKey, undefined);
      return;
    }

    if (Array.isArray(currentValue)) {
      if (currentValue.includes(value)) {
        const newArray = currentValue.filter(v => v !== value);
        onFilterChange(filterKey, newArray.length > 0 ? newArray : undefined);
      } else {
        onFilterChange(filterKey, [...currentValue, value]);
      }
    } else {
      onFilterChange(filterKey, [value]);
    }
  };

  const clearFilter = (filterKey) => {
    onFilterChange(filterKey, undefined);
  };

  const renderMultiSelectFilter = (filter) => {
    const options = filter.options || [];
    const selectedValues = Array.isArray(filters[filter.key]) ? filters[filter.key] : [];
    const isOpen = filterDropdownOpen[filter.key] || false;

    return (
      <div key={filter.key} className="relative" ref={el => filterRefs.current[filter.key] = el}>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${selectedValues.length > 0 ? `${filterColors.activeBg} ${filterColors.activeText} ${filterColors.activeBorder}` : ''}`}
          onClick={() => setFilterDropdownOpen(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
        >
          <Filter className="w-3 h-3" />
          <span className="text-sm">{t(filter.label)}</span>
          {selectedValues.length > 0 && (
            <Badge className={`ml-1 ${filterColors.badge} text-white text-xs h-5 w-5 p-0 flex items-center justify-center`}>
              {selectedValues.length}
            </Badge>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>

        {isOpen && (
          <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} mt-1 z-50 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg`}>
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t('common.select')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => handleFilterClick(filter.key, 'all')}
                >
                  {t('common.all')}
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {options.map(option => {
                  const isSelected = selectedValues.includes(option);
                  const optionLabel = getOptionLabel(filter.key, option);
                  
                  return (
                    <div
                      key={option}
                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        isSelected ? `${filterColors.activeBg} ${filterColors.activeText}` : 'text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => handleFilterClick(filter.key, option)}
                    >
                      <div className={`w-4 h-4 flex items-center justify-center rounded border ${
                        isSelected ? `${filterColors.badge} border-current` : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{optionLabel}</span>
                    </div>
                  );
                })}
              </div>
              
              {selectedValues.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full h-8 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => clearFilter(filter.key)}
                  >
                    <X className="w-3 h-3 mr-1" />
                    {t('common.clear')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(filterDropdownOpen).forEach(key => {
        if (filterDropdownOpen[key] && filterRefs.current[key] && !filterRefs.current[key].contains(event.target)) {
          setFilterDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownOpen]);

  if (!showSearch && !showFilters) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      {showSearch && (
        <div className="relative flex-shrink-0">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`w-full sm:w-64 ${isRTL ? 'pr-10' : 'pl-10'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>
      )}

      {showFilters && filterConfig.length > 0 && (
        <div className={`flex flex-wrap items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {filterConfig.map(filter => renderMultiSelectFilter(filter))}
        </div>
      )}
    </div>
  );
};

export default BaseFilter;