// components/tables/ReportsTable.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import { 
  FileBarChart, Calendar, Eye, Download, Printer, Share2, 
  MoreVertical, TrendingUp, TrendingDown 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@maincomponents/components/ui/dropdown-menu';

const ReportsTable = ({
  data = [],
  onView,
  onDownload,
  onPrint,
  onShare,
  showPagination,
  isRTL,
  currentLanguage,
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalItems = 0,
  totalPages = 0,
  loading = false,
  serverSidePagination = false
}) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'index', label: '#', width: 'w-12', align: 'center' },
      { key: 'title', label: 'reports.form.title', width: 'min-w-[200px]', align: isRTL ? 'right' : 'left' },
      { key: 'type', label: 'reports.form.type', width: 'min-w-[120px]', align: 'center' },
      { key: 'date', label: 'reports.generatedAt', width: 'min-w-[140px]', align: 'center' },
      { key: 'amount', label: 'reports.amount', width: 'min-w-[150px]', align: 'center' },
    ];
    return isRTL ? [...baseColumns].reverse() : baseColumns;
  }, [isRTL, t]);

  const colors = {
    primary: 'from-amber-500 to-amber-600',
    gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
    badge: 'bg-gradient-to-r from-amber-500 to-amber-600'
  };

  const emptyState = {
    icon: FileBarChart,
    title: 'reports.noReportsFound',
    description: 'reports.noReportsDesc'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
      currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
      {
        style: 'currency',
        currency: 'USD',
        notation: 'standard',
      }
    ).format(amount);
  };

  const renderCell = (item, column, index) => {
    const textDirection = isRTL ? 'text-right' : 'text-left';
    const flexDirection = isRTL ? 'flex-row-reverse' : '';
    const alignmentClass = isRTL ? 'rtl' : 'ltr';
    
    const displayIndex = (currentPage - 1) * pageSize + index + 1;

    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {displayIndex}
          </span>
        );

      case 'title':
        return (
          <div className={`${textDirection} ${alignmentClass}`}>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {item.title}
            </p>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            )}
          </div>
        );

      case 'type':
        return (
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
          >
            {item.reportType === 'financial' 
              ? t('reports.feeCollection') 
              : t('reports.expense')
            }
          </Badge>
        );

      case 'date':
        return (
          <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(item.generatedAt).toLocaleDateString(
                currentLanguage === 'ar' ? 'ar-SA' : 'en-GB'
              )}
            </span>
          </div>
        );

      case 'amount': {
        const amount = item.netBalance || 0;
        const isPositive = amount >= 0;
        return (
          <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-bold ${
                isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(Math.abs(amount))}
            </span>
          </div>
        );
      }

      case 'actions':
        return (
          <div className={`flex justify-center ${alignmentClass}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "start" : "end"}
                className="w-48"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView && onView(item)}
                  className={`flex items-center gap-2 ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onDownload && onDownload(item)}
                  className={`flex items-center gap-2 ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Download className="h-4 w-4" />
                  {t('reports.downloadReport')}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onPrint && onPrint(item)}
                  className={`flex items-center gap-2 ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Printer className="h-4 w-4" />
                  {t('reports.printReport')}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onShare && onShare(item)}
                  className={`flex items-center gap-2 ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Share2 className="h-4 w-4" />
                  {t('reports.shareReport')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return (
          <span className={`text-sm text-gray-700 dark:text-gray-300 ${textDirection}`}>
            {item[column.key]}
          </span>
        );
    }
  };

  const filterConfig = [
    // { 
    //   key: 'reportType', 
    //   label: 'reports.form.type', 
    //   options: [
    //     { value: 'all', label: t('common.all') },
    //     { value: 'financial', label: t('reports.feeCollection') },
    //     { value: 'analytical', label: t('reports.expense') }
    //   ]
    // }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (typeof option === 'object' && option !== null) {
      return option.label || option.value || '';
    }
    
    if (option === 'all') return t('common.all');
    
    if (filterKey === 'reportType') {
      const typeMap = {
        financial: t('reports.feeCollection'),
        analytical: t('reports.expense'),
      };
      return typeMap[option] || option;
    }
    
    return String(option);
  };

  const filterColors = {
    activeBg: 'bg-amber-50 dark:bg-amber-900/20',
    activeText: 'text-amber-700 dark:text-amber-300',
    activeBorder: 'border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-500'
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="reports"
      title="reports.financialReports"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filters={filters}
      onFilterChange={onFilterChange}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      totalItems={totalItems}
      totalPages={totalPages}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      serverSidePagination={serverSidePagination}
    />
  );
};

export default ReportsTable;