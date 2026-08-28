import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import {
  BookOpen, Users, GraduationCap, CheckCircle, XCircle,
  Eye, Edit, Trash2, MoreVertical, Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';

const CoursesTable = ({
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
  onPageSizeChange = () => {}
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'name', label: 'courses.form.name', width: 'min-w-[200px]', align: 'left' },
    { key: 'code', label: 'courses.form.code', width: 'w-28', align: 'center' },
    { key: 'category', label: 'courses.form.category', width: 'min-w-[120px]', align: 'center' },
    { key: 'creditHours', label: 'courses.form.creditHours', width: 'w-24', align: 'center' },
    { key: 'teachers', label: 'courses.teachers', width: 'min-w-[100px]', align: 'center' },
    // { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-pink-500 to-pink-600',
    gradient: 'bg-gradient-to-r from-pink-500 to-pink-600',
    badge: 'bg-gradient-to-r from-pink-500 to-pink-600'
  };

  const emptyState = {
    icon: BookOpen,
    title: 'courses.noCoursesFound',
    description: 'courses.noCoursesDesc'
  };

  const filterConfig = [
    // {
    //   key: 'status',
    //   label: 'common.status',
    //   options: ['all', 'active', 'inactive']
    // },
    {
      key: 'category',
      label: 'courses.form.category',
      options: ['all', 'primary', 'secondary', 'higher-secondary']
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');

    const translationMap = {
      'status': {
        'active': t('courses.status.active'),
        'inactive': t('courses.status.inactive')
      },
      'category': {
        'primary': isRTL ? 'ابتدائي' : 'Primary',
        'secondary': isRTL ? 'ثانوي' : 'Secondary',
        'higher-secondary': isRTL ? 'ثانوية عليا' : 'Higher Secondary'
      }
    };

    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-pink-50 dark:bg-pink-900/20',
    activeText: 'text-pink-700 dark:text-pink-300',
    activeBorder: 'border-pink-200 dark:border-pink-700',
    badge: 'bg-pink-500'
  };

  const getStatusColor = (active) => {
    return active
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'primary': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      'secondary': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      'higher-secondary': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300'
    };
    return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDisplayName = (name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    if (typeof name === 'object') {
      return name[currentLanguage] || name.en || name.ar || '';
    }
    return '';
  };

  const getCourseInitials = (name) => {
    const displayName = getDisplayName(name);
    if (!displayName) return 'CO';
    const words = displayName.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  const getCourseColor = (index) => {
    const colorList = [
      'from-pink-500 to-pink-600',
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-amber-500 to-amber-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    return colorList[index % colorList.length];
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
        const displayName = typeof item.name === 'string' ? item.name : getDisplayName(item.nameObj || item.name);
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600">
              <AvatarFallback className={`bg-gradient-to-r ${getCourseColor(index)} text-white text-sm font-bold`}>
                {getCourseInitials(item.nameObj || item.name)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {displayName || (isRTL ? 'بدون اسم' : 'Unnamed')}
              </p>
            </div>
          </div>
        );

      case 'code':
        return (
          <Badge variant="outline" className="font-mono text-xs">
            {item.code}
          </Badge>
        );

      case 'category':
        const categoryLabel = {
          'primary': isRTL ? 'ابتدائي' : 'Primary',
          'secondary': isRTL ? 'ثانوي' : 'Secondary',
          'higher-secondary': isRTL ? 'ثانوية عليا' : 'Higher Sec.'
        };
        return (
          <Badge className={`${getCategoryColor(item.category)} text-xs border`}>
            {categoryLabel[item.category] || item.category}
          </Badge>
        );

      case 'creditHours':
        return (
          <div className="flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.creditHours}
            </span>
          </div>
        );

      case 'teachers':
        return (
          <div className="flex items-center justify-center gap-1">
            <GraduationCap className="w-3 h-3 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.teacherCount || 0}
            </span>
          </div>
        );

      // case 'status':
      //   const isActive = item.active !== false;
      //   const StatusIcon = isActive ? CheckCircle : XCircle;
      //   const statusLabel = isActive
      //     ? (isRTL ? 'نشط' : 'Active')
      //     : (isRTL ? 'غير نشط' : 'Inactive');
      //   return (
      //     <Badge
      //       variant="secondary"
      //       className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(isActive)} flex items-center gap-1`}
      //     >
      //       <StatusIcon className="w-3 h-3" />
      //       {statusLabel}
      //     </Badge>
      //   );

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
                  className="flex items-center gap-2 cursor-pointer hover:bg-pink-50 dark:hover:bg-pink-900/30"
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
      type="course"
      title={isRTL ? 'قائمة الكورسات' : 'Course List'}
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

export default CoursesTable;