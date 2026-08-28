import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  DollarSign, Calendar, BookOpen,
  Eye, Edit, Trash2, MoreVertical, CreditCard,
  CheckCircle, AlertCircle, Clock4, AlertTriangle, Gift, Plus
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@maincomponents/components/ui/dropdown-menu';

const FeeTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onRecordPayment,
  onAddDiscount,
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
  type = 'student',
  totalItems = 0,
  totalPages = 0,
  loading = false, 
  serverSidePagination = true
}) => {
  const { t } = useTranslation();

  const getText = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (Array.isArray(value)) return '';
    
    if (typeof value === 'object') {
      const isArabic = currentLanguage?.toLowerCase()?.startsWith('ar');
      if (isArabic && value.ar) return value.ar;
      if (!isArabic && value.en) return value.en;
      return value.en || value.ar || '';
    }
    return '';
  };

  const normalizedClassOptions = useMemo(() => {
    const options = dynamicFilters.classOptions || [];
    return options.map(opt => {
      if (typeof opt === 'object' && opt.value !== undefined) {
        return { value: String(opt.value), label: String(opt.label || '') };
      }
      if (typeof opt === 'object' && opt._id) {
        const label = typeof opt.name === 'object'
          ? (currentLanguage === 'ar' ? opt.name.ar : opt.name.en) || opt.name.en || ''
          : String(opt.name || '');
        return { value: String(opt._id), label };
      }
      return { value: String(opt), label: String(opt) };
    });
  }, [dynamicFilters.classOptions, currentLanguage]);

  const normalizedFeeStructures = useMemo(() => {
    const structures = dynamicFilters.feeStructures || [];
    return structures.map(fs => {
      if (typeof fs === 'object' && fs.value !== undefined) {
        return { value: String(fs.value), label: String(fs.label || '') };
      }
      if (typeof fs === 'object' && (fs.id || fs._id)) {
        const name = getText(fs.name) || fs.nameLabel || '';
        return { value: String(fs.id || fs._id), label: name };
      }
      return { value: String(fs), label: String(fs) };
    });
  }, [dynamicFilters.feeStructures, currentLanguage]);

  const classLookup = useMemo(() => {
    const lookup = {};
    normalizedClassOptions.forEach(opt => {
      lookup[opt.value] = opt.label;
    });
    return lookup;
  }, [normalizedClassOptions]);

  const feeStructureLookup = useMemo(() => {
    const lookup = {};
    normalizedFeeStructures.forEach(fs => {
      lookup[fs.value] = fs.label;
    });
    return lookup;
  }, [normalizedFeeStructures]);

  const columns = useMemo(() => {
    if (type === 'student') {
      const baseColumns = [
        { key: 'index', label: '#', width: 'w-12', align: 'center' },
        { key: 'student', label: 'fee.form.student', width: 'min-w-[200px]', align: 'left' },
        { key: 'class', label: 'common.className', width: 'min-w-[120px]', align: 'center' },
        { key: 'amount', label: 'fee.totalAmount', width: 'min-w-[140px]', align: 'center' },
        { key: 'payment', label: 'fee.paymentStatus', width: 'min-w-[130px]', align: 'center' },
        { key: 'dueDate', label: 'fee.lastPaymentDate', width: 'min-w-[140px]', align: 'center' },
        { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
      ];
      return isRTL ? baseColumns: baseColumns;
    } else {
      const baseColumns = [
        { key: 'index', label: '#', width: 'w-12', align: 'center' },
        { key: 'name', label: 'fee.form.name', width: 'min-w-[200px]', align: 'left' },
        { key: 'class', label: 'common.className', width: 'min-w-[120px]', align: 'center' },
        { key: 'academicYear', label: 'fee.form.academicYear', width: 'min-w-[100px]', align: 'center' },
        { key: 'amount', label: 'fee.totalAmount', width: 'min-w-[120px]', align: 'center' },
        { key: 'components', label: 'fee.components', width: 'min-w-[100px]', align: 'center' },
        { key: 'status', label: 'common.status', width: 'min-w-[100px]', align: 'center' },
        { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
      ];
      return isRTL ? baseColumns.reverse() : baseColumns;
    }
  }, [type, isRTL]);

  const colors = {
    primary: 'from-teal-500 to-teal-600',
    gradient: 'bg-gradient-to-r from-teal-500 to-teal-600',
    badge: 'bg-gradient-to-r from-teal-500 to-teal-600'
  };

  const emptyState = {
    icon: DollarSign,
    title: type === 'student' ? 'fee.noStudentFeesFound' : 'fee.noFeeStructuresFound',
    description: type === 'student' ? 'fee.noStudentFeesDesc' : 'fee.noFeeStructuresDesc'
  };

  const filterConfig = useMemo(() => {
    const studentStatusOptions = [
      { value: 'all', label: t('common.all') },
      { value: 'pending', label: t('fee.status.pending') },
      { value: 'paid', label: t('fee.status.paid') },
      { value: 'partial', label: t('fee.status.partial') },
      { value: 'overdue', label: t('fee.status.overdue') },
      { value: 'waived', label: t('fee.status.waived') },
    ];

    const structureStatusOptions = [
      { value: 'all', label: t('common.all') },
      { value: 'active', label: t('fee.status.active') },
      { value: 'draft', label: t('fee.status.draft') },
      { value: 'archived', label: t('fee.status.archived') },
    ];

    const academicYearOptions = [
      { value: 'all', label: t('common.all') },
      { value: '2024-2025', label: '2024-2025' },
      { value: '2023-2024', label: '2023-2024' },
    ];

    const classFilterOptions = [
      { value: 'all', label: t('common.all') },
      ...normalizedClassOptions
    ];

    const feeStructureOptions = [
      { value: 'all', label: t('common.all') },
      ...normalizedFeeStructures
    ];

    if (type === 'student') {
      return [
        { key: 'status', label: 'common.status', options: studentStatusOptions },
        { key: 'academicYear', label: 'fee.form.academicYear', options: academicYearOptions },
        { key: 'classId', label: 'common.className', options: classFilterOptions },
        { key: 'feeStructureId', label: 'fee.feeStructure', options: feeStructureOptions }
      ];
    } else {
      return [
        { key: 'status', label: 'common.status', options: structureStatusOptions },
        { key: 'academicYear', label: 'fee.form.academicYear', options: academicYearOptions },
        { key: 'classId', label: 'common.className', options: classFilterOptions }
      ];
    }
  }, [type, t, normalizedClassOptions, normalizedFeeStructures]);

  const getOptionLabel = (filterKey, option) => {
    if (typeof option === 'object' && option !== null) {
      return option.label || option.value || '';
    }
    
    if (option === 'all') return t('common.all');
    
    if (filterKey === 'classId') {
      return classLookup[option] || option;
    }
    
    if (filterKey === 'feeStructureId') {
      return feeStructureLookup[option] || option;
    }
    
    if (filterKey === 'status') {
      return t(`fee.status.${option}`);
    }
    
    return String(option);
  };

  const filterColors = {
    activeBg: 'bg-teal-50 dark:bg-teal-900/20',
    activeText: 'text-teal-700 dark:text-teal-300',
    activeBorder: 'border-teal-200 dark:border-teal-700',
    badge: 'bg-teal-500'
  };

  const getStatusColor = (status) => {
    const statusColors = {
      paid: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      partial: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      overdue: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
      waived: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
      archived: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      paid: CheckCircle,
      pending: Clock4,
      partial: AlertCircle,
      overdue: AlertTriangle,
      waived: Gift,
      active: CheckCircle,
      draft: Clock4,
      archived: AlertTriangle
    };
    return iconMap[status] || Clock4;
  };

  const getUserInitials = (name) => {
    const displayName = getText(name);
    if (!displayName) return 'S';
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage?.startsWith('ar') ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(currentLanguage?.startsWith('ar') ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'usd',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStudentPaymentStatus = (item) => {
    if (item.totalAmount === 0 && item.paidAmount === 0) return 'paid';
    if (item.paidAmount >= item.totalAmount) return 'paid';
    if (item.pendingAmount > 0 && item.paidAmount > 0) return 'partial';
    if (item.pendingAmount > 0 && item.paidAmount === 0) return 'pending';
    return 'pending';
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
        const studentName = getText(item.student?.name);
        return (
          <div className={`flex items-center gap-3 ${flexDirection} `}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm">
                {getUserInitials(item.student?.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`${textDirection} ${alignmentClass}`}>
              <p className={`font-semibold text-gray-900 dark:text-white text-sm ${isRTL ? 'text-left' : ''}`}>
                {studentName}
              </p>
              <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-left' : ''}`}>
                {item.student?.studentId || item.student?.id}
              </p>
              <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-left' : ''}`}>
                {item.student?.email}
              </p>
            </div>
          </div>
        );

      case 'name':
        const feeName = getText(item.name);
        return (
          <div className={`${textDirection} ${alignmentClass}`}>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {feeName}
            </p>
            {item.isDefault && (
              <Badge className="mt-1 text-xs bg-teal-100 text-teal-800 border-teal-200">
                {t('fee.default')}
              </Badge>
            )}
          </div>
        );

      case 'class':
        const className = typeof item.class?.name === 'string' 
          ? item.class.name 
          : getText(item.class?.name);
        return (
          <div className={`text-center ${alignmentClass}`}>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {className || t('fee.allClasses')}
            </span>
          </div>
        );

      case 'amount':
        return (
          <div className={`text-center ${alignmentClass}`}>
            <span className="text-sm text-gray-900 dark:text-white font-bold">
              {formatCurrency(item.totalAmount)}
            </span>
            {type === 'student' && (
              <div className={`flex items-center justify-center gap-2 mt-1 ${flexDirection}`}>
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
        const paymentStatus = getStudentPaymentStatus(item);
        const PaymentIcon = getStatusIcon(paymentStatus);
        return (
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(paymentStatus)} shadow-sm flex items-center gap-1 ${flexDirection}`}
          >
            <PaymentIcon className="w-3 h-3" />
            {t(`fee.status.${paymentStatus}`)}
          </Badge>
        );

      case 'dueDate':
        return (
          <div className={`text-center ${alignmentClass}`}>
            <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.lastPaymentDate ? formatDate(item.lastPaymentDate) : t('fee.noPayment')}
              </span>
            </div>
          </div>
        );

      case 'academicYear':
        return (
          <div className={`text-center ${alignmentClass}`}>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.academicYear}
            </span>
          </div>
        );

      case 'components':
        return (
          <div className={`text-center ${alignmentClass}`}>
            <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
              <BookOpen className="w-3 h-3 text-teal-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item.componentCount || item.components?.length || 0}
              </span>
            </div>
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
            {t(`fee.status.${item.status}`)}
          </Badge>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${flexDirection}`}>
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
                  onClick={() => onView && onView(item.id || item._id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(item)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                >
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </DropdownMenuItem>

                {type === 'student' && getStudentPaymentStatus(item) !== 'paid' && onRecordPayment && (
                  <DropdownMenuItem
                    onClick={() => onRecordPayment(item)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                  >
                    <CreditCard className="h-4 w-4" />
                    {t('fee.recordPayment')}
                  </DropdownMenuItem>
                )}

                {type === 'student' && onAddDiscount && (
                  <DropdownMenuItem
                    onClick={() => onAddDiscount(item)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors ${flexDirection} ${isRTL ? 'justify-end' : ''}`}
                  >
                    <Plus className="h-4 w-4" />
                    {t('fee.addDiscount')}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(item.id || item._id)}
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
        const value = item[column.key];
        const displayValue = getText(value);
        return (
          <span className={`text-sm text-gray-700 dark:text-gray-300 ${textDirection} ${alignmentClass}`}>
            {displayValue}
          </span>
        );
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type={type === 'student' ? 'fee' : 'fee-structure'}
      title={type === 'student' ? t('fee.studentFees') : t('fee.feeStructures')}
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
      isLoading={loading} 
      serverSidePagination={serverSidePagination}
    />
  );
};

export default FeeTable;