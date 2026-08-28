import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import {
  Building, Users, GraduationCap, CheckCircle, XCircle,
  Eye, Edit, Trash2, MoreVertical, User, BookOpen, Briefcase
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

const DepartmentTable = ({
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
  loading = false,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'name', label: 'departments.form.name', width: 'min-w-[200px]', align: 'left' },
    { key: 'type', label: 'departments.form.type', width: 'w-32', align: 'center' },
    { key: 'head', label: 'departments.form.head', width: 'min-w-[180px]', align: 'left' },
    { key: 'members', label: 'departments.members', width: 'min-w-[150px]', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-purple-500 to-purple-600',
    gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
    badge: 'bg-gradient-to-r from-purple-500 to-purple-600'
  };

  const emptyState = {
    icon: Building,
    title: 'departments.noDepartmentsFound',
    description: 'departments.noDepartmentsDesc'
  };

  const filterOptions = useMemo(() => {
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }
    return {
      status: ['all', 'active', 'inactive'],
      type: ['all', 'academic', 'administrative'],
    };
  }, [dynamicFilters]);

  const filterConfig = [
    { key: 'status', label: 'common.status', options: filterOptions.status },
    { key: 'type', label: 'departments.form.type', options: filterOptions.type }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    const translationMap = {
      'status': {
        'active': t('departments.status.active'),
        'inactive': t('departments.status.inactive')
      },
      'type': {
        'academic': t('departments.types.academic'),
        'administrative': t('departments.types.administrative')
      }
    };
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-purple-50 dark:bg-purple-900/20',
    activeText: 'text-purple-700 dark:text-purple-300',
    activeBorder: 'border-purple-200 dark:border-purple-700',
    badge: 'bg-purple-500'
  };

  const getStatusColor = (active) => {
    return active
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300';
  };

  const getTypeColor = (type) => {
    return type === 'academic'
      ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
      : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300';
  };

  const getDisplayName = (name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    if (typeof name === 'object') {
      return name[currentLanguage] || name.en || name.ar || '';
    }
    return '';
  };

  const getDepartmentInitials = (name) => {
    const displayName = getDisplayName(name);
    if (!displayName) return 'DP';
    
    const words = displayName.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  const getDepartmentColor = (index) => {
    const colorList = [
      'from-purple-500 to-purple-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-amber-500 to-amber-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600'
    ];
    return colorList[index % colorList.length];
  };

  const getHeadDisplayName = (head) => {
    if (!head) return null;
    if (typeof head.name === 'string') return head.name;
    if (typeof head.name === 'object') {
      const firstName = head.name[currentLanguage]?.firstName || 
                       head.name.en?.firstName || 
                       head.name.ar?.firstName || '';
      const lastName = head.name[currentLanguage]?.lastName || 
                      head.name.en?.lastName || 
                      head.name.ar?.lastName || '';
      return `${firstName} ${lastName}`.trim() || head.displayName || '';
    }
    return head.displayName || '';
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'name':
        const displayName = getDisplayName(item.name);
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600">
              <AvatarFallback className={`bg-gradient-to-r ${getDepartmentColor(index)} text-white text-sm font-bold`}>
                {getDepartmentInitials(item.name)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {displayName || (isRTL ? 'بدون اسم' : 'Unnamed')}
              </p>
            </div>
          </div>
        );

      case 'type':
        const TypeIcon = item.type === 'academic' ? BookOpen : Briefcase;
        const typeLabel = item.type === 'academic' 
          ? (isRTL ? 'أكاديمي' : 'Academic')
          : (isRTL ? 'إداري' : 'Administrative');
        return (
          <Badge className={`${getTypeColor(item.type)} text-xs flex items-center gap-1 border`}>
            <TypeIcon className="w-3 h-3" />
            {typeLabel}
          </Badge>
        );

      case 'head':
        const headName = getHeadDisplayName(item.head);
        return (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {item.head && headName ? (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                    {headName.charAt(0) || 'H'}
                  </AvatarFallback>
                </Avatar>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {headName}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-sm text-gray-400 italic flex items-center gap-1">
                <User className="w-4 h-4" />
                {isRTL ? 'لم يتم التعيين' : 'Not assigned'}
              </span>
            )}
          </div>
        );

      case 'members':
        return (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Building className="w-3 h-3 text-purple-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {item.memberCount || 0} {isRTL ? 'إجمالي' : 'Total'}
              </span>
            </div>
          </div>
        );

      case 'status':
        const isActive = item.active !== false;
        const StatusIcon = isActive ? CheckCircle : XCircle;
        const statusLabel = isActive 
          ? (isRTL ? 'نشط' : 'Active')
          : (isRTL ? 'غير نشط' : 'Inactive');
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(isActive)} flex items-center gap-1`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusLabel}
          </Badge>
        );

      case 'actions':
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "start" : "end"}
                className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView?.(item)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  <Eye className="h-4 w-4" />
                  {isRTL ? 'عرض' : 'View'}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => onEdit?.(item)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30"
                >
                  <Edit className="h-4 w-4" />
                  {isRTL ? 'تعديل' : 'Edit'}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onDelete?.(item)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
                  disabled={item.memberCount > 0}
                >
                  <Trash2 className="h-4 w-4" />
                  {isRTL ? 'حذف' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {item[column.key] || '-'}
          </span>
        );
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="department"
      title={isRTL ? 'قائمة الأقسام' : 'Department List'}
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
      isLoading={loading}
      serverSidePagination={true}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
    />
  );
};

export default DepartmentTable;