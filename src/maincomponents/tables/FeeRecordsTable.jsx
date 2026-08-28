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
  FileText,
  DollarSign
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@maincomponents/components/ui/dropdown-menu';

const FeeRecordsTable = ({
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
  type = 'payment',
  loading = false, 
  serverSidePagination = true
}) => {
  const { t } = useTranslation();

  const columns = useMemo(() => {
    if (type === 'payment') {
      return [
        { key: 'index', label: '#', width: 'w-12', align: 'center' },
        { key: 'student', label: 'fee.form.student', width: 'min-w-[180px]', align: isRTL ? 'right' : 'left' },
        { key: 'paymentInfo', label: 'fee.paymentDetails', width: 'min-w-[200px]', align: 'center' },
        { key: 'method', label: 'fee.paymentMethod', width: 'min-w-[120px]', align: 'center' },
        { key: 'date', label: 'fee.paymentDate', width: 'min-w-[120px]', align: 'center' },
        { key: 'status', label: 'fee.paymentStatus', width: 'min-w-[100px]', align: 'center' },
        { key: 'receipt', label: 'fee.paymentProof', width: 'min-w-[100px]', align: 'center' },
        { key: 'actions', label: 'common.actions', width: 'w-28', align: 'center' }
      ];
    } else if (type === 'fee') {
      return [
        { key: 'index', label: '#', width: 'w-12', align: 'center' },
        { key: 'student', label: 'fee.form.student', width: 'min-w-[200px]', align: isRTL ? 'right' : 'left' },
        { key: 'class', label: 'common.className', width: 'min-w-[120px]', align: 'center' },
        { key: 'amount', label: 'fee.totalAmount', width: 'min-w-[140px]', align: 'center' },
        { key: 'payment', label: 'fee.paymentStatus', width: 'min-w-[130px]', align: 'center' },
        { key: 'dueDate', label: 'fee.lastPaymentDate', width: 'min-w-[140px]', align: 'center' },
        { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
      ];
    } else {
      return [
        { key: 'index', label: '#', width: 'w-12', align: 'center' },
        { key: 'name', label: 'fee.form.name', width: 'min-w-[200px]', align: isRTL ? 'right' : 'left' },
        { key: 'class', label: 'common.className', width: 'min-w-[120px]', align: 'center' },
        { key: 'academicYear', label: 'fee.form.academicYear', width: 'min-w-[100px]', align: 'center' },
        { key: 'amount', label: 'fee.totalAmount', width: 'min-w-[120px]', align: 'center' },
        { key: 'components', label: 'fee.components', width: 'min-w-[100px]', align: 'center' },
        { key: 'status', label: 'common.status', width: 'min-w-[100px]', align: 'center' },
        { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
      ];
    }
  }, [type, isRTL]);

  const colors = {
    primary: type === 'payment' ? 'from-blue-500 to-blue-600' : 'from-teal-500 to-teal-600',
    gradient: type === 'payment' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-teal-500 to-teal-600',
    badge: type === 'payment' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-teal-500 to-teal-600'
  };

  const emptyState = {
    icon: type === 'payment' ? CreditCard : DollarSign,
    title: type === 'payment' ? 'fee.noPaymentsFound' : 
           type === 'fee' ? 'fee.noStudentFeesFound' : 'fee.noFeeStructuresFound',
    description: type === 'payment' ? 'fee.noPaymentsDesc' : 
                 type === 'fee' ? 'fee.noStudentFeesDesc' : 'fee.noFeeStructuresDesc'
  };

  const filterOptions = useMemo(() => {
    const options = {
      status: type === 'payment' ? ['all', 'completed', 'pending', 'failed', 'refunded'] : 
              ['all', 'pending', 'paid', 'partial', 'overdue', 'waived'],
      academicYear: [],
      paymentMethod: type === 'payment' ? ['all', 'cash', 'bank-transfer', 'cheque', 'online', 'credit-card'] : [],
      classId: type !== 'structure' ? [] : undefined
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
      options.academicYear = ['all', ...uniqueYears.sort((a, b) => b.localeCompare(a))];
      
      if (type !== 'structure') {
        const uniqueClasses = [...new Set(data.map(item => item.class?.id).filter(Boolean))];
        options.classId = ['all', ...uniqueClasses];
      }
    }

    return options;
  }, [data, dynamicFilters, type]);

  const filterConfig = useMemo(() => {
    if (type === 'payment') {
      return [
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'completed', 'pending', 'failed', 'refunded'] 
        },
        { 
          key: 'paymentMethod', 
          label: 'fee.paymentMethod', 
          options: filterOptions.paymentMethod || ['all', 'cash', 'bank-transfer', 'cheque', 'online', 'credit-card'] 
        },
        { 
          key: 'academicYear', 
          label: 'fee.form.academicYear', 
          options: filterOptions.academicYear || [] 
        }
      ];
    } else {
      return [
        { 
          key: 'status', 
          label: 'common.status', 
          options: filterOptions.status || ['all', 'pending', 'paid', 'partial', 'overdue', 'waived'] 
        },
        { 
          key: 'academicYear', 
          label: 'fee.form.academicYear', 
          options: filterOptions.academicYear || [] 
        },
        ...(type !== 'structure' ? [{
          key: 'classId', 
          label: 'common.className', 
          options: filterOptions.classId || [] 
        }] : [])
      ];
    }
  }, [type, filterOptions]);

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'completed': t('fee.paymentConfirmed'),
        'pending': type === 'payment' ? t('leave.status.pending') : t('fee.status.pending'),
        'failed': t('fee.paymentFailed'),
        'refunded': t('fee.paymentRefunded'),
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
    activeBg: type === 'payment' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-teal-50 dark:bg-teal-900/20',
    activeText: type === 'payment' ? 'text-blue-700 dark:text-blue-300' : 'text-teal-700 dark:text-teal-300',
    activeBorder: type === 'payment' ? 'border-blue-200 dark:border-blue-700' : 'border-teal-200 dark:border-teal-700',
    badge: type === 'payment' ? 'bg-blue-500' : 'bg-teal-500'
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      paid: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      partial: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      overdue: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
      waived: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      refunded: AlertCircle,
      paid: CheckCircle,
      partial: AlertCircle,
      overdue: AlertCircle,
      waived: AlertCircle
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
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
      'pending': type === 'payment' ? t('leave.status.pending') : t('fee.status.pending'),
      'failed': t('fee.paymentFailed'),
      'refunded': t('fee.paymentRefunded'),
      'paid': t('fee.status.paid'),
      'partial': t('fee.status.partial'),
      'overdue': t('fee.status.overdue'),
      'waived': t('fee.status.waived')
    };
    return statusMap[status] || status;
  };

  const getPaymentStatus = (fee) => {
    if (fee.paidAmount >= fee.totalAmount) return 'paid';
    if (fee.paidAmount > 0) return 'partial';
    if (fee.components?.some(c => c.status === 'overdue')) return 'overdue';
    return 'pending';
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {index + 1}
          </span>
        );

      case 'student':
        if (type === 'payment') {
          return (
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-600">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                  {getUserInitials(item.studentName)}
                </AvatarFallback>
              </Avatar>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.studentName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ID: {item.studentId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.academicYear}
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
                <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm">
                  {getUserInitials(item.student?.name)}
                </AvatarFallback>
              </Avatar>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {item.student?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.student?.studentId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.student?.email}
                </p>
              </div>
            </div>
          );
        }

      case 'name':
        const name = typeof item.name === 'object' ? (item.name[currentLanguage === 'ar' ? 'ar' : 'en'] || item.name.en) : item.name;
        return (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {name}
            </p>
            {item.isDefault && (
              <Badge className="mt-1 text-xs bg-teal-100 text-teal-800 border-teal-200">
                {t('fee.default')}
              </Badge>
            )}
          </div>
        );

      case 'paymentInfo':
        return (
          <div className="text-center space-y-1">
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
                {t('fee.paymentForComponent')}: {item.componentId}
              </div>
            )}
            {item.notes && (
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px] mx-auto">
                {typeof item.notes === 'object' ? (item.notes[currentLanguage === 'ar' ? 'ar' : 'en'] || item.notes.en || '') : item.notes}
              </div>
            )}
          </div>
        );

      case 'method':
        const MethodIcon = getMethodIcon(item.paymentMethod);
        return (
          <div className="flex flex-col items-center gap-1">
            <MethodIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {getMethodLabel(item.paymentMethod)}
            </span>
          </div>
        );

      case 'class':
        return (
          <div className="text-center">
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {item.class?.name || t('fee.allClasses')}
            </span>
          </div>
        );

      case 'amount':
        return (
          <div className="text-center">
            <span className="text-sm text-gray-900 dark:text-white font-bold">
              {formatCurrency(item.totalAmount)}
            </span>
            {type === 'fee' && (
              <div className={`flex items-center justify-center gap-2 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  <span className="text-green-600 dark:text-green-400">{formatCurrency(item.paidAmount || 0)}</span>
                </Badge>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  <span className="text-orange-600 dark:text-orange-400">{formatCurrency(item.pendingAmount || 0)}</span>
                </Badge>
              </div>
            )}
          </div>
        );

      case 'payment':
        const paymentStatus = getPaymentStatus(item);
        const PaymentIcon = getStatusIcon(paymentStatus);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(paymentStatus)} shadow-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <PaymentIcon className="w-3 h-3" />
            {t(`fee.status.${paymentStatus}`)}
          </Badge>
        );

      case 'date':
        return (
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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

      case 'dueDate':
        return (
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.lastPaymentDate ? formatDate(item.lastPaymentDate) : t('fee.noPayment')}
              </span>
            </div>
          </div>
        );

      case 'status':
        const StatusIcon = getStatusIcon(item.status);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <StatusIcon className="w-3 h-3" />
            {t(`fee.status.${item.status}`)}
          </Badge>
        );

      case 'academicYear':
        return (
          <div className="text-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.academicYear}
            </span>
          </div>
        );

      case 'components':
        return (
          <div className="text-center">
            <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <FileText className="w-3 h-3 text-teal-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.componentCount || item.components?.length || 0}
              </span>
            </div>
          </div>
        );

      case 'receipt':
        const hasReceipt = item.receiptUrl || item.receiptNumber;
        return (
          <div className="flex justify-center">
            {hasReceipt ? (
              <Badge 
                variant="outline" 
                className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 flex items-center gap-1"
              >
                <Receipt className="w-3 h-3" />
                {isRTL ? 'متوفر' : 'Available'}
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
              >
                {isRTL ? 'غير متوفر' : 'Not Available'}
              </Badge>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700 transition-all duration-300"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "start" : "end"}
                className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView && onView(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onEdit && onEdit(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                
                <DropdownMenuItem 
                  onClick={() => onDelete && onDelete(item.id)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
          <span className={`text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
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
      type={type === 'payment' ? 'fee-history' : type === 'fee' ? 'fee' : 'fee-structure'}
      title={type === 'payment' ? t('fee.paymentHistory') : 
             type === 'fee' ? t('fee.studentFees') : t('fee.feeStructures')}
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
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      serverSidePagination={serverSidePagination}
    />
  );
};

export default FeeRecordsTable;