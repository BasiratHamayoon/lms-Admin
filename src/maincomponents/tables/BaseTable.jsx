// src/maincomponents/tables/BaseTable.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TablePagination from '../Pagination';
import { TABLE_STYLES } from '@data/Constants';
import BaseFilter from '../filters/BaseFilter';
import TableSkeleton from '../Skeletons/TableSkeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@maincomponents/components/ui/table';

const BaseTable = ({
  data = [],
  columns = [],
  renderCell,
  type = 'default',
  title = 'common.data',
  description = '',
  showPagination = true,
  showViewMore = false,
  viewMoreLink = '/',
  onViewMore,
  isRTL = false,
  currentLanguage = 'en',
  searchTerm = '',
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  showSearch = true,
  showFilters = true,
  colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  emptyState = {
    icon: null,
    title: 'common.noData',
    description: 'common.noDataDescription'
  },
  className = '',
  filterConfig = [],
  getOptionLabel = () => {},
  filterColors = {},
  
  // Pagination props
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  
  serverSidePagination = true,
  
  isLoading = false,
}) => {
  const { t } = useTranslation();
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const { displayData, calculatedTotalPages, calculatedTotalRecords } = useMemo(() => {
    if (serverSidePagination) {
      return {
        displayData: data,
        calculatedTotalPages: totalPages || Math.ceil((totalItems || 0) / pageSize) || 1,
        calculatedTotalRecords: totalItems || data.length,
      };
    }
    
    let filteredData = [...data];
    
    if (localSearchTerm) {
      filteredData = filteredData.filter(item => 
        Object.keys(item).some(key => {
          const value = item[key];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(localSearchTerm.toLowerCase());
          }
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(v => 
              typeof v === 'string' && v.toLowerCase().includes(localSearchTerm.toLowerCase())
            );
          }
          return false;
        })
      );
    }

    if (Object.keys(localFilters).length > 0) {
      filteredData = filteredData.filter(item => {
        return Object.entries(localFilters).every(([filterKey, filterValue]) => {
          if (!filterValue || filterValue === 'all') return true;
          if (Array.isArray(filterValue) && (filterValue.length === 0 || filterValue.includes('all'))) return true;
          
          const itemValue = item[filterKey];
          if (Array.isArray(filterValue)) {
            return filterValue.includes(itemValue);
          }
          return itemValue === filterValue;
        });
      });
    }

    const total = filteredData.length;
    const pages = Math.ceil(total / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filteredData.slice(startIndex, endIndex);

    return {
      displayData: paginated,
      calculatedTotalPages: pages,
      calculatedTotalRecords: total,
    };
  }, [data, localSearchTerm, localFilters, currentPage, pageSize, serverSidePagination, totalItems, totalPages]);

  const handleSearchChange = (value) => {
    setLocalSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterKey, value) => {
    const updatedFilters = { ...localFilters };
    if (value === undefined || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      delete updatedFilters[filterKey];
    } else {
      updatedFilters[filterKey] = value;
    }
    setLocalFilters(updatedFilters);
    onFilterChange(filterKey, value);
  };

  const handlePageChange = (page) => {
    console.log('BaseTable: Page change requested:', page);
    onPageChange(page);
  };

  const handlePageSizeChange = (size) => {
    const newSize = parseInt(size, 10);
    console.log('BaseTable: Page size change requested:', newSize);
    onPageSizeChange(newSize);
  };

  if (!columns || columns.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          <p>Table configuration error: No columns defined</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={pageSize} showFilters={showFilters} />;
  }

  const EmptyStateIcon = emptyState.icon || null;

  return (
    <Card className={`${TABLE_STYLES.CARD.base} ${className}`}>
      <CardHeader className={TABLE_STYLES.CARD.header}>
        <div className="flex flex-col gap-4">
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CardTitle className={`${TABLE_STYLES.CARD.title} flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`w-3 h-8 ${colors.gradient} rounded-full shadow-lg`}></div>
              <div className="flex flex-col">
                <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent font-bold text-lg`}>
                  {t(title)}
                </span>
                {description && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                    {t(description)}
                  </span>
                )}
              </div>
              <Badge variant="secondary" className={`${colors.badge} text-white border-0 shadow-md`}>
                {calculatedTotalRecords}
              </Badge>
            </CardTitle>
          </div>

          {(showSearch || showFilters) && (
            <div className={`w-full ${isRTL ? 'text-left' : ''}`}>
              {showFilters && filterConfig.length > 0 ? (
                <BaseFilter
                  filters={localFilters}
                  onFilterChange={handleFilterChange}
                  onSearchChange={handleSearchChange}
                  searchTerm={localSearchTerm}
                  isRTL={isRTL}
                  showSearch={showSearch}
                  showFilters={showFilters}
                  filterConfig={filterConfig}
                  getOptionLabel={getOptionLabel}
                  filterColors={filterColors}
                  className="w-full"
                />
              ) : showSearch && (
                <BaseFilter
                  filters={localFilters}
                  onFilterChange={handleFilterChange}
                  onSearchChange={handleSearchChange}
                  searchTerm={localSearchTerm}
                  isRTL={isRTL}
                  showSearch={showSearch}
                  showFilters={false}
                  filterConfig={[]}
                  getOptionLabel={getOptionLabel}
                  filterColors={filterColors}
                  className="w-full"
                />
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader className={TABLE_STYLES.HEADER.base}>
              <TableRow className={TABLE_STYLES.HEADER.row}>
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={`${TABLE_STYLES.HEADER.cell} ${column.width || ''} ${
                      column.align === 'center' ? 'text-center' : isRTL ? 'text-left' : ''
                    }`}
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                    {t(column.label)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <motion.tr
                    key={item._id || item.id || index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.03 
                    }}
                    className={TABLE_STYLES.BODY.row}
                  >
                    {columns.map((column) => (
                      <TableCell 
                        key={column.key}
                        className={`py-4 ${
                          column.align === 'center' ? 'text-center' : isRTL ? 'text-left' : ''
                        }`}
                        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                      >
                        {renderCell(item, column, index)}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className={TABLE_STYLES.EMPTY_STATE.container}>
                      {EmptyStateIcon && (
                        <div className={TABLE_STYLES.EMPTY_STATE.icon}>
                          <EmptyStateIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <p className={TABLE_STYLES.EMPTY_STATE.title}>
                        {t(emptyState.title)}
                      </p>
                      <p className={TABLE_STYLES.EMPTY_STATE.description}>
                        {t(emptyState.description)}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>
        {showPagination && calculatedTotalRecords > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800">
            <TablePagination
              totalPages={calculatedTotalPages}
              limit={pageSize}
              totalRecords={calculatedTotalRecords}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onLimitChange={handlePageSizeChange}
              isRTL={isRTL}
            />
          </div>
        )}

        {showViewMore && displayData.length > 0 && onViewMore && (
          <div className="flex justify-center pt-4 pb-4 border-t border-gray-100 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={onViewMore}
              className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <span className="text-sm font-medium">
                {t('common.viewMore')}
              </span>
              <ArrowRight className={`h-4 w-4 transition-transform ${
                isRTL ? 'mr-1 rotate-180 group-hover:-translate-x-1' : 'ml-1 group-hover:translate-x-1'
              }`} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BaseTable;