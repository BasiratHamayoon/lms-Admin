import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Users, BookOpen, User, Calendar, Clock,
  Eye, Edit, Trash2, MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const ClassesTable = ({
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
  loading = false,  // ✅ Accept "loading" prop
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,  // ✅ Add totalItems
  totalPages = 1,  // ✅ Add totalPages
  onPageChange = () => {},
  onPageSizeChange = () => {},
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'name', label: 'classes.name', width: 'min-w-[180px]', align: 'left' },
    { key: 'course', label: 'classes.course', width: 'min-w-[150px]', align: 'left' },
    { key: 'teacher', label: 'classes.teacher', width: 'min-w-[150px]', align: 'left' },
    { key: 'studentsCount', label: 'classes.studentsCount', width: 'w-24', align: 'center' },
    { key: 'academicYear', label: 'classes.academicYear', width: 'w-28', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-cyan-500 to-cyan-600',
    gradient: 'bg-gradient-to-r from-cyan-500 to-cyan-600',
    badge: 'bg-gradient-to-r from-cyan-500 to-cyan-600'
  };

  const emptyState = {
    icon: Users,
    title: 'classes.noClassesFound',
    description: 'classes.noClassesDesc'
  };

  const filterOptions = useMemo(() => {
    const options = {
      academicYear: [],
      semester: []
    };
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueYears = [...new Set(data.map(item => item.academicYear).filter(Boolean))];
      options.academicYear = ['all', ...uniqueYears];
      
      const uniqueSemesters = [...new Set(data.map(item => item.semester).filter(Boolean))];
      options.semester = ['all', ...uniqueSemesters];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'academicYear', 
      label: 'classes.academicYear', 
      options: filterOptions.academicYear || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'semester': {
        'Spring': t('classes.form.Spring'),
        'Fall': t('classes.form.Fall'),
        'Summer': t('classes.form.Summer'),
        'Winter': t('classes.form.Winter')
      },
      'academicYear': option
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-cyan-50 dark:bg-cyan-900/20',
    activeText: 'text-cyan-700 dark:text-cyan-300',
    activeBorder: 'border-cyan-200 dark:border-cyan-700',
    badge: 'bg-cyan-500'
  };

  const getUserInitials = (name) => {
    if (!name) return 'C';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSemesterTranslation = (semester) => {
    const semesterMap = {
      'Spring': t('classes.form.Spring'),
      'Fall': t('classes.form.Fall'),
      'Summer': t('classes.form.Summer'),
      'Winter': t('classes.form.Winter')
    };
    return semesterMap[semester] || semester;
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
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600 group-hover:scale-110 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm">
                {getUserInitials(item.name)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {item.section} • {getSemesterTranslation(item.semester)}
              </p>
              {item.days && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {/* FIXED: Map and Translate Day Names */}
                  {Array.isArray(item.days) 
                    ? item.days.map(day => t(`timetable.days.${day.trim().toLowerCase()}`)).join(', ') 
                    : item.days.split(',').map(day => t(`timetable.days.${day.trim().toLowerCase()}`)).join(', ')
                  }
                </p>
              )}
            </div>
          </div>
        );

      case 'course':
        return (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {item.course}
            </span>
          </div>
        );

      case 'teacher':
        return (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {item.teacher}
            </span>
          </div>
        );

      case 'studentsCount':
        return (
          <div className="flex items-center justify-center">
            <Badge 
              variant="secondary" 
              className="bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800 text-xs px-3 py-1 font-semibold"
            >
              <Users className="w-3 h-3 mr-1" />
              {item.studentsCount}
            </Badge>
          </div>
        );

      case 'academicYear':
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {item.academicYear}
          </span>
        );
        
      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
          <span className="text-sm text-gray-700 dark:text-gray-300">
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
      type="classes"
      title="classes.classMembers"
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
      isLoading={loading}  // ✅ Pass loading as isLoading
      serverSidePagination={true}  // ✅ Add this
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}  // ✅ Add this
      totalPages={totalPages}  // ✅ Add this
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
    />
  );
};

export default ClassesTable;