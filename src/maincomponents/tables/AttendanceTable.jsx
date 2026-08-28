import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { CheckCircle, XCircle, Clock, UserCog, Calendar, AlertCircle, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const AttendanceTable = ({
  data = [],
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
  totalPages = 1,
  totalItems = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  dynamicFilters = {},
  loading = false
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'employee', label: 'attendance.form.employee', width: 'min-w-[200px]', align: 'left' },
    { key: 'department', label: 'staff.form.department', width: 'min-w-[150px]', align: 'left' },
    { key: 'date', label: 'attendance.form.date', width: 'w-28', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-32', align: 'center' },
    { key: 'time', label: 'timetable.time', width: 'w-40', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-amber-500 to-amber-600',
    gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
    badge: 'bg-gradient-to-r from-amber-500 to-amber-600'
  };

  const emptyState = {
    icon: Calendar,
    title: 'attendance.noAttendanceFound',
    description: 'attendance.noAttendanceDesc'
  };

  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'present', 'absent', 'late', 'excused', 'half-day', 'leave'],
      department: ['all']
    };
    if (Object.keys(dynamicFilters).length > 0) {
      return { ...options, ...dynamicFilters };
    }
    if (data.length > 0) {
      const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];
      options.department = ['all', ...uniqueDepartments];
    }
    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { key: 'status', label: 'common.status', options: filterOptions.status },
    { key: 'department', label: 'staff.form.department', options: filterOptions.department }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    const translationMap = {
      'status': {
        'present': t('attendance.status.present'),
        'absent': t('attendance.status.absent'),
        'late': t('attendance.status.late'),
        'excused': t('attendance.status.excused'),
        'half-day': t('attendance.status.halfDay'),
        'leave': t('attendance.status.leave')
      },
      'method': {
        'manual': t('attendance.method.manual'),
        'auto': t('attendance.method.auto')
      }
    };
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-amber-50 dark:bg-amber-900/20',
    activeText: 'text-amber-700 dark:text-amber-300',
    activeBorder: 'border-amber-200 dark:border-amber-700',
    badge: 'bg-amber-500'
  };

  const statusConfig = {
    present: { label: 'attendance.status.present', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300', icon: CheckCircle },
    absent: { label: 'attendance.status.absent', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300', icon: XCircle },
    late: { label: 'attendance.status.late', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300', icon: Clock },
    excused: { label: 'attendance.status.excused', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300', icon: UserCog },
    'half-day': { label: 'attendance.status.halfDay', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300', icon: AlertCircle },
    leave: { label: 'attendance.status.leave', color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300', icon: Calendar }
  };

  const getDisplayName = (name) => {
    if (!name) return 'Unknown';
    if (typeof name === 'string') return name;
    if (typeof name === 'object') {
      if (name.display && typeof name.display === 'string') return name.display;
      const langKey = currentLanguage === 'ar' ? 'ar' : 'en';
      const altLangKey = currentLanguage === 'ar' ? 'en' : 'ar';
      if (name[langKey]) {
        if (typeof name[langKey] === 'string') return name[langKey];
        if (typeof name[langKey] === 'object') {
          const first = name[langKey].firstName || '';
          const last = name[langKey].lastName || '';
          const fullName = `${first} ${last}`.trim();
          if (fullName) return fullName;
        }
      }
      if (name[altLangKey]) {
        if (typeof name[altLangKey] === 'string') return name[altLangKey];
        if (typeof name[altLangKey] === 'object') {
          const first = name[altLangKey].firstName || '';
          const last = name[altLangKey].lastName || '';
          const fullName = `${first} ${last}`.trim();
          if (fullName) return fullName;
        }
      }
      if (name.firstName || name.lastName) {
        return `${name.firstName || ''} ${name.lastName || ''}`.trim() || 'Unknown';
      }
    }
    return 'Unknown';
  };

  const getUserInitials = (name) => {
    const displayName = getDisplayName(name);
    if (!displayName || displayName === 'Unknown') return 'U';
    return displayName.split(' ').filter(part => part.length > 0).map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time;
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return <span className="text-sm font-medium text-gray-900 dark:text-white">{((currentPage - 1) * pageSize) + index + 1}</span>;
      case 'employee':
        const displayName = getDisplayName(item.name);
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm">{getUserInitials(item.name)}</AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{displayName}</p>
              {item.userId && <p className="text-xs text-gray-500 dark:text-gray-400">{typeof item.userId === 'string' ? item.userId.slice(-8) : item.userId}</p>}
              {item.role && <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{item.role}</p>}
            </div>
          </div>
        );
      case 'department':
        return <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{item.department || '-'}</span>;
      case 'date':
        return <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{formatDate(item.date)}</span>;
      case 'status':
        const status = item.status || 'absent';
        const statusInfo = statusConfig[status] || statusConfig.absent;
        const StatusIcon = statusInfo.icon;
        return (
          <Badge variant="secondary" className={`text-xs px-2 py-1 font-semibold border ${statusInfo.color} shadow-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <StatusIcon className="w-3 h-3" />
            {t(statusInfo.label)}
          </Badge>
        );
      case 'time':
        return (
          <div className={`text-center ${isRTL ? 'text-left' : ''}`}>
            {item.timeIn ? (
              <>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">{formatTime(item.timeIn)} - {formatTime(item.timeOut) || '--:--'}</div>
                {item.totalHours > 0 && <div className="text-xs text-gray-500 dark:text-gray-400">{Number(item.totalHours).toFixed(1)} {t('timetable.hours')}</div>}
              </>
            ) : (
              <span className="text-sm text-gray-400 dark:text-gray-500">--</span>
            )}
          </div>
        );
      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700 transition-all duration-300">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <DropdownMenuItem onClick={() => onEdit && onEdit(item)} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/30 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  <Edit className="h-4 w-4" />
                  {t('attendance.actions.editAttendance')}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuItem onClick={() => onDelete && onDelete(item._id || item.id)} className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      default:
        return <span className="text-sm text-gray-700 dark:text-gray-300">{item[column.key] || '-'}</span>;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="attendance"
      title="attendance.attendanceMembers"
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
      serverSidePagination={true}
      pageSize={pageSize}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
    />
  );
};

export default AttendanceTable;