
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, 
  Download, Eye, Edit, Trash2, MoreVertical, Mail, Briefcase, 
  GraduationCap, Paperclip, RotateCcw
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

const LeaveTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onCancel,
  onEmail,
  showPagination = true,
  isRTL = false,
  currentLanguage = 'en',
  
  searchTerm = '',
  onSearchChange = () => {},
  filters = {},
  onFilterChange = () => {},
  onResetFilters,
  pageSize = 10,
  currentPage = 1,
  totalRecords = 0,
  totalPages = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  loading = false,
  serverSide = false  
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'user', label: 'leave.form.user', width: 'min-w-[200px]', align: 'left' },
    { key: 'leaveType', label: 'leave.form.leaveType', width: 'w-28', align: 'center' },
    { key: 'dates', label: 'leave.form.dates', width: 'w-36', align: 'center' },
    { key: 'totalDays', label: 'leave.totalDays', width: 'w-20', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-28', align: 'center' },
    { key: 'reason', label: 'leave.form.reason', width: 'min-w-[180px]', align: 'left' },
    { key: 'attachments', label: 'leave.form.attachments', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-teal-500 to-teal-600',
    gradient: 'bg-gradient-to-r from-teal-500 to-teal-600',
    badge: 'bg-gradient-to-r from-teal-500 to-teal-600'
  };

  const emptyState = {
    icon: Calendar,
    title: 'leave.noLeavesFound',
    description: 'leave.noLeavesDesc'
  };

  
  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: ['all', 'pending', 'approved', 'rejected']
    },
    { 
      key: 'leaveType', 
      label: 'leave.form.leaveType', 
      options: ['all', 'sick', 'casual', 'annual', 'unpaid', 'other']
    },
    { 
      key: 'userRole', 
      label: 'leave.form.userRole', 
      options: ['all', 'student', 'teacher', 'hr', 'accountant', 'admin']
    }
  ];

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
        'admin': t('leave.roles.admin'),
        'hr': t('leave.roles.hr') || 'HR',
        'accountant': t('leave.roles.accountant') || 'Accountant'
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-teal-50 dark:bg-teal-900/20',
    activeText: 'text-teal-700 dark:text-teal-300',
    activeBorder: 'border-teal-200 dark:border-teal-700',
    badge: 'bg-teal-500'
  };

  
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      cancelled: AlertCircle
    };
    return iconMap[status] || Clock;
  };

  const getLeaveTypeColor = (leaveType) => {
    const type = typeof leaveType === 'string' ? leaveType : leaveType?.en || leaveType;
    const typeColors = {
      sick: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      casual: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      annual: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      unpaid: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
      other: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleColor = (role) => {
    const roleColors = {
      student: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      teacher: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
      hr: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      accountant: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300',
      admin: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300',
      staff: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300'
    };
    return roleColors[role] || roleColors.staff;
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatFullDate = (dateString) => {
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

  const getRoleIcon = (userRole) => {
    const iconMap = {
      student: GraduationCap,
      teacher: User,
      staff: Briefcase,
      admin: User,
      hr: User,
      accountant: Briefcase
    };
    return iconMap[userRole] || User;
  };

  const getBilingualValue = (obj, lang = currentLanguage) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || obj.ar || '';
  };

  const getLeaveTypeDisplay = (item) => {
    if (item.leaveTypeDisplay) return item.leaveTypeDisplay;
    if (typeof item.leaveType === 'string') return item.leaveType;
    return getBilingualValue(item.leaveType);
  };

  const getUserName = (item) => {
    if (item.user?.name) return item.user.name;
    if (item.userName) return item.userName;
    return 'Unknown User';
  };

  const getUserId = (item) => item.user?.id || item.userId || 'N/A';
  const getUserRole = (item) => item.user?.role || item.userRole || 'staff';
  const getUserEmail = (item) => item.user?.email || item.email || '';

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'user':
        const userName = getUserName(item);
        const userId = getUserId(item);
        const userRole = getUserRole(item);
        const userEmail = getUserEmail(item);
        const RoleIcon = getRoleIcon(userRole);
        
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 flex-shrink-0">
              <AvatarImage src={item.user?.avatar} alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold">
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className={`min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
              <div className={`flex items-center gap-2 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate max-w-[120px]">
                  {userName}
                </p>
                <Badge variant="outline" className={`text-xs px-1.5 py-0 h-5 ${getRoleColor(userRole)}`}>
                  {t(`leave.roles.${userRole}`) || userRole}
                </Badge>
              </div>
              <p className={`text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RoleIcon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{userEmail || userId}</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{userId}</p>
            </div>
          </div>
        );

      case 'leaveType':
        const leaveTypeDisplay = getLeaveTypeDisplay(item);
        const leaveTypeKey = typeof item.leaveType === 'string' ? item.leaveType : item.leaveType?.en;
        
        return (
          <Badge variant="secondary" className={`text-xs px-2 py-1 font-semibold border ${getLeaveTypeColor(leaveTypeKey)} shadow-sm`}>
            {t(`leave.types.${leaveTypeKey}`) || leaveTypeDisplay}
          </Badge>
        );

      case 'dates':
        const startDate = item.startDate;
        const endDate = item.endDate;
        const isSameDay = formatDate(startDate) === formatDate(endDate);
        
        return (
          <div className={`flex flex-col items-center gap-0.5`}>
            {isSameDay ? (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-teal-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatFullDate(startDate)}
                </span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{isRTL ? 'من' : 'From'}:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(startDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{isRTL ? 'إلى' : 'To'}:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(endDate)}</span>
                </div>
              </>
            )}
          </div>
        );

      case 'totalDays':
        const isPast = new Date(item.endDate) < new Date();
        const isCurrent = new Date(item.startDate) <= new Date() && new Date(item.endDate) >= new Date();
        
        return (
          <div className="flex flex-col items-center">
            <span className={`text-base font-bold ${
              isCurrent ? 'text-teal-600 dark:text-teal-400' :
              isPast ? 'text-gray-500 dark:text-gray-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {item.totalDays}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.totalDays === 1 ? (isRTL ? 'يوم' : 'day') : (isRTL ? 'أيام' : 'days')}
            </span>
            {isCurrent && item.status === 'approved' && (
              <Badge className="mt-1 text-[10px] px-1.5 py-0 bg-teal-500 text-white">
                {isRTL ? 'جارية' : 'Active'}
              </Badge>
            )}
          </div>
        );

      case 'status':
        const statusText = t(`leave.status.${item.status}`);
        const StatusIcon = getStatusIcon(item.status);
        
        return (
          <div className="flex flex-col items-center gap-1">
            <Badge variant="secondary" className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" />
              {statusText}
            </Badge>
            {item.approver && item.status === 'approved' && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                {isRTL ? 'بواسطة' : 'by'} {item.approver.name?.split(' ')[0] || 'Admin'}
              </span>
            )}
          </div>
        );

      case 'reason':
        const reasonDisplay = item.reasonDisplay || getBilingualValue(item.reason);
        const rejectReasonDisplay = item.rejectReasonDisplay || getBilingualValue(item.rejectReason);
        
        return (
          <div className="max-w-[180px]">
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={reasonDisplay}>
              {reasonDisplay || '-'}
            </p>
            {rejectReasonDisplay && item.status === 'rejected' && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 line-clamp-1" title={rejectReasonDisplay}>
                <span className="font-medium">{isRTL ? 'السبب:' : 'Reason:'}</span> {rejectReasonDisplay}
              </p>
            )}
          </div>
        );

      case 'attachments':
        const attachments = item.attachments || [];
        
        if (attachments.length === 0) {
          return <span className="text-xs text-gray-400 dark:text-gray-500">{isRTL ? 'لا يوجد' : 'None'}</span>;
        }
        
        return (
          <Badge 
            variant="outline" 
            className="text-xs px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30"
            onClick={() => onView && onView(item)}
          >
            <Paperclip className="w-3 h-3" />
            {attachments.length}
          </Badge>
        );

      case 'actions':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30">
                <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-56" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
              <DropdownMenuItem onClick={() => onView?.(item)} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Eye className="h-4 w-4" />
                {t('common.view')}
              </DropdownMenuItem>
              
              {item.status === 'pending' && onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </DropdownMenuItem>
              )}
              
              {onEmail && getUserEmail(item) && (
                <DropdownMenuItem onClick={() => onEmail(item)} className={`flex items-center gap-2 text-blue-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Mail className="h-4 w-4" />
                  {t('staff.actions.sendEmail') || 'Send Email'}
                </DropdownMenuItem>
              )}

              {item.attachments?.length > 0 && (
                <DropdownMenuItem 
                  onClick={() => item.attachments[0]?.path && window.open(item.attachments[0].path, '_blank')}
                  className={`flex items-center gap-2 text-teal-600 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Download className="h-4 w-4" />
                  {t('leave.actions.downloadAttachment') || 'Download'}
                </DropdownMenuItem>
              )}

              {item.status === 'pending' && (
                <>
                  <DropdownMenuSeparator />
                  {onApprove && (
                    <DropdownMenuItem onClick={() => onApprove(item)} className={`flex items-center gap-2 text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle className="h-4 w-4" />
                      {t('leave.actions.approveLeave') || 'Approve'}
                    </DropdownMenuItem>
                  )}
                  {onReject && (
                    <DropdownMenuItem onClick={() => onReject(item)} className={`flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <XCircle className="h-4 w-4" />
                      {t('leave.actions.rejectLeave') || 'Reject'}
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {(item.status === 'approved' || item.status === 'pending') && onCancel && (
                <DropdownMenuItem onClick={() => onCancel(item)} className={`flex items-center gap-2 text-orange-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle className="h-4 w-4" />
                  {t('leave.actions.cancelLeave') || 'Cancel'}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(item._id || item.id)} className={`flex items-center gap-2 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Trash2 className="h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      default:
        return <span className="text-sm text-gray-700 dark:text-gray-300">{item[column.key] || '-'}</span>;
    }
  };

  
  const hasActiveFilters = useMemo(() => {
    return searchTerm || 
           (filters.status && filters.status !== 'all') ||
           (filters.leaveType && filters.leaveType !== 'all') ||
           (filters.userRole && filters.userRole !== 'all');
  }, [searchTerm, filters]);

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="leaves"
      title="leave.leaveMembers"
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
      totalRecords={totalRecords}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      serverSide={serverSide}
      
      showResetFilters={hasActiveFilters}
      onResetFilters={onResetFilters}
    />
  );
};

export default LeaveTable;