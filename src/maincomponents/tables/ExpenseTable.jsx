import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  Eye, Edit, Trash2, MoreVertical,
  FileText, CheckCircle, XCircle, Clock,
  Check, X
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@maincomponents/components/ui/dropdown-menu';

const ExpenseTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onProcess,
  showPagination = true,
  isRTL = false,
  currentLanguage = 'en',
  searchTerm = '',
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  pageSize = 10,
  currentPage = 1,
  totalItems,
  totalPages,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  isLoading = false
}) => {
  const { t } = useTranslation();

  const getLocalizedText = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (currentLanguage === 'ar') {
      return field.ar || field.en || '';
    }
    return field.en || field.ar || '';
  };

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'expenseId', label: 'expense.expenseId', width: 'min-w-[150px]', align: 'left' },
    { key: 'title', label: 'expense.title', width: 'min-w-[200px]', align: 'left' },
    { key: 'amount', label: 'expense.amount', width: 'w-24', align: 'center' },
    { key: 'category', label: 'expense.category', width: 'min-w-[150px]', align: 'left' },
    { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    { key: 'date', label: 'expense.date', width: 'w-28', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-pink-500 to-pink-600',
    gradient: 'bg-gradient-to-r from-pink-500 to-pink-600',
    badge: 'bg-gradient-to-r from-pink-500 to-pink-600'
  };

  const emptyState = {
    icon: FileText,
    title: 'expense.noExpenseFound',
    description: 'expense.noExpenseDesc'
  };

  const filterConfig = [
    {
      key: 'status',
      label: 'common.status',
      options: ['all', 'pending', 'approved', 'rejected', 'recorded']
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    return t(`expense.status.${option}`) || option;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      recorded: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      recorded: FileText
    };
    return iconMap[status] || FileText;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return `${amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {index + 1 + (currentPage - 1) * pageSize}
          </span>
        );

      case 'expenseId':
        return (
          <span className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
            {item.expenseId}
          </span>
        );

      case 'title':
        return (
          <div className={isRTL ? 'text-left' : ''}>
            {/* FIXED LOGIC HERE */}
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {getLocalizedText(item.title)}
            </p>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                 {getLocalizedText(item.description)}
              </p>
            )}
          </div>
        );

      case 'amount':
        return (
          <div className="text-center">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(item.amount)}
            </span>
          </div>
        );

      case 'category':
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium capitalize">
            {t(`expense.categories.${item.category}`)}
          </span>
        );

      case 'status':
        const statusText = t(`expense.status.${item.status}`);
        const StatusIcon = getStatusIcon(item.status);
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm flex items-center gap-1 justify-center`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusText}
          </Badge>
        );

      case 'date':
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {formatDate(item.date)}
          </span>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48">
                
                {item.status === 'pending' && onProcess && (
                  <>
                    <DropdownMenuLabel className="text-xs font-normal text-gray-500">{t('common.process')}</DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => onProcess(item, 'approved')}
                      className="text-green-600 dark:text-green-400 cursor-pointer focus:text-green-700 focus:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-2" /> {t('expense.status.approved')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onProcess(item, 'rejected')}
                      className="text-red-600 dark:text-red-400 cursor-pointer focus:text-red-700 focus:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" /> {t('expense.status.rejected')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuLabel className="text-xs font-normal text-gray-500">{t('common.manage')}</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onView && onView(item)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" /> {t('common.view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit && onEdit(item)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> {t('common.edit')}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => onDelete && onDelete(item)} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        const val = item[column.key];
        if (typeof val === 'object' && val !== null) return JSON.stringify(val); 
        return val;
    }
  };

  return (
    <BaseTable data={data} columns={columns} renderCell={renderCell} type="expense" title="expense.expenseMembers" colors={colors} emptyState={emptyState} isRTL={isRTL} currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={onSearchChange} filters={filters} onFilterChange={onFilterChange} showSearch={true} showFilters={true} showPagination={showPagination} pageSize={pageSize} currentPage={currentPage} totalItems={totalItems} totalPages={totalPages} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} filterConfig={filterConfig} getOptionLabel={getOptionLabel} isLoading={isLoading} />
  );
};

export default ExpenseTable;