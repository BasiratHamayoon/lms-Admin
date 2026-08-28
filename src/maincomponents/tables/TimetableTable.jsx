import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Calendar, Clock, Users, GraduationCap, BookOpen,
  Eye, Edit, Trash2, MoreVertical, FileSpreadsheet
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

const TimetableTable = ({
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
  totalPages = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'class', label: 'timetable.class', width: 'min-w-[150px]', align: 'left' },
    { key: 'academicYear', label: 'timetable.academicYear', width: 'min-w-[120px]', align: 'center' },
    { key: 'semester', label: 'timetable.semester', width: 'min-w-[100px]', align: 'center' },
    { key: 'level', label: 'timetable.level', width: 'min-w-[100px]', align: 'center' },
    { key: 'scheduleCount', label: 'timetable.scheduleCount', width: 'min-w-[120px]', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-indigo-500 to-indigo-600',
    gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    badge: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  };

  const emptyState = {
    icon: Calendar,
    title: 'timetable.noTimetablesFound',
    description: 'timetable.noTimetablesDesc'
  };

  const filterConfig = useMemo(() => {
    const getUnique = (key) => {
        return [...new Set(data.map(item => {
            if (typeof item[key] === 'string') return item[key];
            if (item[`${key}Obj`]?.en) return item[`${key}Obj`].en;
            return '';
        }).filter(Boolean))];
    };

    return [
      { 
        key: 'academicYear', 
        label: 'timetable.academicYear', 
        options: ['all', ...getUnique('academicYear')]
      },
      { 
        key: 'level', 
        label: 'timetable.level', 
        options: ['all', ...getUnique('level')]
      },
      { 
        key: 'semester', 
        label: 'timetable.semester', 
        options: ['all', ...getUnique('semester')]
      }
    ];
  }, [data]);

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    if (filterKey === 'status') {
      return option === 'active' ? t('common.active') : t('common.inactive');
    }
    return option;
  };

  const filterColors = {
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    activeText: 'text-indigo-700 dark:text-indigo-300',
    activeBorder: 'border-indigo-200 dark:border-indigo-700',
    badge: 'bg-indigo-500'
  };

  
  const getClassName = (item) => {
    
    if (item.classId && typeof item.classId === 'object' && item.classId.name) {
      const name = item.classId.name;
      
      if (typeof name === 'string') return name;
      
      return name[currentLanguage] || name.en || name.ar || '';
    }

    
    if (item.className) return item.className;

    return t('timetable.unknownClass');
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return <span className="text-sm font-medium text-gray-900 dark:text-white">{((currentPage - 1) * pageSize) + index + 1}</span>;

      case 'class':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {getClassName(item)}
              </p>
              {/* Prioritize formatted section string, fallback to object */}
              {(item.section || item.classId?.section) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('timetable.section')}: {item.section || (typeof item.classId?.section === 'object' ? (item.classId.section[currentLanguage] || item.classId.section.en) : item.classId?.section)}
                </p>
              )}
            </div>
          </div>
        );

      case 'academicYear':
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.academicYear}
              </span>
            </div>
          </div>
        );

      case 'semester':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
            <BookOpen className="w-3 h-3 mr-1" />
            {item.semester}
          </Badge>
        );

      case 'level':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1">
            <GraduationCap className="w-3 h-3 mr-1" />
            {item.level}
          </Badge>
        );

      case 'scheduleCount':
        return (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.scheduleCount || 0}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('timetable.entries')}
              </span>
            </div>
            {item.file && (
              <FileSpreadsheet className="w-4 h-4 text-green-500" title="Has File" />
            )}
          </div>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="w-40" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                <DropdownMenuItem onClick={() => onView && onView(item)} className="cursor-pointer">
                  <Eye className="h-4 w-4 mr-2" /> {t('common.view')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit && onEdit(item)} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> {t('common.edit')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onDelete && onDelete(item)} className="cursor-pointer text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return <span className="text-sm text-gray-700 dark:text-gray-300">-</span>;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="timetable"
      title="timetable.timetableList"
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
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
    />
  );
};

export default TimetableTable;