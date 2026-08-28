import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import { 
  CreditCard, 
  Calendar, 
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Banknote,
  Receipt,
  User,
  FileText
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@maincomponents/components/ui/dropdown-menu';

const FeeHistoryTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  showPagination = true,
  isRTL = false,
  currentLanguage = 'en',
  searchTerm = '',
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  pageSize = 10,
  currentPage = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  dynamicFilters = {},
  totalItems = 0,
  totalPages = 0,
  loading = false, // ✅ Changed from isLoading to loading
  serverSidePagination = true
}) => {
  const { t } = useTranslation();

  const getText = (value) => {
    if (!value) return '';
    if (typeof value === 'object') {
      return value[currentLanguage === 'ar' ? 'ar' : 'en'] || value.en || '';
    }
    return value;
  };

  const columns = useMemo(() => {
    const baseColumns = [
      { key: 'index', label: '#', width: 'w-12', align: 'center' },
      { key: 'student', label: 'fee.form.student', width: 'min-w-[180px]', align: 'left' },
      { key: 'paymentInfo', label: 'fee.paymentDetails', width: 'min-w-[200px]', align: 'center' },
      { key: 'method', label: 'fee.paymentMethod', width: 'min-w-[120px]', align: 'center' },
      { key: 'date', label: 'fee.paymentDate', width: 'min-w-[120px]', align: 'center' },
      { key: 'status', label: 'fee.paymentStatus', width: 'min-w-[100px]', align: 'center' },
      { key: 'receipt', label: 'fee.paymentProof', width: 'min-w-[100px]', align: 'center' },
      { key: 'actions', label: 'common.actions', width: 'w-28', align: 'center' }
    ];
    
    if (isRTL) {
      return baseColumns.reverse();
    }
    
    return baseColumns;
  }, [isRTL]);

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: CreditCard,
    title: 'fee.noPaymentsFound',
    description: 'fee.noPaymentsDesc'
  };

  const filterConfig = useMemo(() => {
    return [
      { 
        key: 'status', 
        label: 'common.status', 
        options: dynamicFilters.status || ['all', 'completed', 'pending', 'failed', 'refunded'] 
      },
      { 
        key: 'paymentMethod', 
        label: 'fee.paymentMethod', 
        options: dynamicFilters.paymentMethod || ['all', 'cash', 'bank-transfer', 'cheque', 'online', 'credit-card'] 
      },
      { 
        key: 'academicYear', 
        label: 'fee.form.academicYear', 
        options: dynamicFilters.academicYear || [] 
      }
    ];
  }, [dynamicFilters]);

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    return t(dynamicFilters.getOptionLabel ? dynamicFilters.getOptionLabel(filterKey, option) : option);
  };

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      refunded: AlertCircle
    };
    return iconMap[status] || Clock;
  };

  const getMethodIcon = (method) => {
    const iconMap = {
      'bank-transfer': Banknote,
      'cash': CreditCard,
      'cheque': FileText,
      'online': CreditCard,
      'credit-card': CreditCard
    };
    return iconMap[method] || CreditCard;
  };

  const getUserInitials = (name) => {
    const displayName = getText(name);
    if (!displayName) return 'S';
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
    return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMethodLabel = (method) => {
    const methodMap = {
      'cash': t('fee.paymentMethods.cash'),
      'bank-transfer': t('fee.paymentMethods.bank-transfer'),
      'cheque': t('fee.paymentMethods.cheque'),
      'online': t('fee.paymentMethods.online'),
      'credit-card': t('fee.paymentMethods.credit-card')
    };
    return methodMap[method] || method;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'completed': t('fee.paymentConfirmed'),
      'pending': t('leave.status.pending'),
      'failed': t('fee.paymentFailed'),
      'refunded': t('fee.paymentRefunded')
    };
    return statusMap[status] || status;
  };

  const renderCell = (item, column, index) => {
    const textDirection = isRTL ? 'text-right' : 'text-left';
    const flexDirection = isRTL ? 'flex-row-reverse' : '';
    const alignmentClass = isRTL ? 'rtl' : 'ltr';
    
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {(currentPage - 1) * pageSize + index + 1}
          </span>
        );

      case 'student':
        return (
          <div className={`flex items-center gap-3 ${flexDirection}`}>
            <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                {getUserInitials(item.studentId?.name || item.studentName)}
              </AvatarFallback>
            </Avatar>
            <div className={`${textDirection} ${alignmentClass}`}>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {item.studentId?.name || item.studentName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ID: {item.studentId?.id || item.studentId}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.academicYear}
              </p>
            </div>
          </div>
        );

      case 'paymentInfo':
        return (
          <div className={`text-center space-y-1 ${alignmentClass}`}>
            <div className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(item.amount)}
            </div>
            {item.transactionId && (
              <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                #{item.transactionId.slice(0, 8)}...
              </div>
            )}
            {item.componentId && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('fee.paymentForComponent')}: {item.componentId?.name?.en || item.componentId}
              </div>
            )}
            {item.notes && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] mx-auto">
                {getText(item.notes)}
              </div>
            )}
          </div>
        );

      case 'method':
        const MethodIcon = getMethodIcon(item.paymentMethod);
        return (
          <div className={`flex flex-col items-center gap-1 ${alignmentClass}`}>
            <MethodIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {getMethodLabel(item.paymentMethod)}
            </span>
          </div>
        );

      case 'date':
        return (
          <div className={`text-center ${alignmentClass}`}>
            <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(item.paymentDate)}
              </span>
            </div>
            {item.createdAt && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(item.createdAt)}
              </div>
            )}
          </div>
        );

      case 'status':
        const StatusIcon = getStatusIcon(item.status);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm flex items-center gap-1 ${flexDirection}`}
          >
            <StatusIcon className="w-3 h-3" />
            {getStatusLabel(item.status)}
          </Badge>
        );

      case 'receipt':
        const hasReceipt = item.receiptUrl || item.receiptNumber;
        return (
          <div className={`flex justify-center ${alignmentClass}`}>
            {hasReceipt ? (
              <Badge 
                variant="outline" 
                className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 flex items-center gap-1"
              >
                <Receipt className="w-3 h-3" />
                {isRTL ? 'متوفر' : t('common.available')}
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
              >
                {isRTL ? 'غير متوفر' : t('common.notAvailable')}
              </Badge>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center ${flexDirection}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-8 w-8 rounded-full data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700 transition-all duration-300 ${alignmentClass}`}
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "start" : "end"}
                className={`w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl ${alignmentClass}`}
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView && onView(item)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                
                <DropdownMenuItem 
                  onClick={() => onDelete && onDelete(item._id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return (
          <span className={`text-sm text-gray-700 dark:text-gray-300 ${textDirection} ${alignmentClass}`}>
            {item[column.key]}
          </span>
        );
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="fee-history"
      title={t('fee.paymentHistory')}
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
      // filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      totalItems={totalItems}
      totalPages={totalPages}
      isLoading={loading} // ✅ Pass loading as isLoading to BaseTable
      serverSidePagination={serverSidePagination}
    />
  );
};

export default FeeHistoryTable;