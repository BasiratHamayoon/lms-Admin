import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Clock, BookOpen, MapPin, Users, Eye,
  CheckCircle, AlertCircle,
  MoreVertical
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../components/ui/dropdown-menu';

const TeacherTimetableTable = ({
  data = [],
  onView,
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
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'day', label: 'teacherTimetable.day', width: 'min-w-[120px]', align: 'left' },
    { key: 'time', label: 'teacherTimetable.time', width: 'min-w-[120px]', align: 'center' },
    { key: 'subject', label: 'teacherTimetable.subject', width: 'min-w-[180px]', align: 'left' },
    { key: 'grade', label: 'teacherTimetable.grade', width: 'min-w-[120px]', align: 'center' },
    { key: 'room', label: 'teacherTimetable.room', width: 'min-w-[100px]', align: 'center' },
    { key: 'type', label: 'teacherTimetable.type', width: 'min-w-[100px]', align: 'center' },
    { key: 'status', label: 'teacherTimetable.status', width: 'min-w-[100px]', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-indigo-500 to-indigo-600',
    gradient: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    badge: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
  };

  const emptyState = {
    icon: BookOpen,
    title: 'teacherTimetable.noClassesFound',
    description: 'teacherTimetable.noClassesDesc'
  };

  const filterConfig = useMemo(() => {
    const uniqueDays = [...new Set(data.map(item => item.day).filter(Boolean))];
    const uniqueSubjects = [...new Set(data.map(item => item.subject).filter(Boolean))];
    const uniqueGrades = [...new Set(data.map(item => item.grade).filter(Boolean))];
    const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
    const uniqueStatuses = [...new Set(data.map(item => item.status).filter(Boolean))];

    return [
      { 
        key: 'day', 
        label: 'teacherTimetable.day', 
        options: ['all', ...uniqueDays]
      },
      { 
        key: 'subject', 
        label: 'teacherTimetable.subject', 
        options: ['all', ...uniqueSubjects]
      },
      { 
        key: 'grade', 
        label: 'teacherTimetable.grade', 
        options: ['all', ...uniqueGrades]
      },
      { 
        key: 'type', 
        label: 'teacherTimetable.type', 
        options: ['all', ...uniqueTypes]
      },
      { 
        key: 'status', 
        label: 'teacherTimetable.status', 
        options: ['all', ...uniqueStatuses]
      }
    ];
  }, [data]);

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'day': {
        'Monday': t('timetable.days.monday'),
        'Tuesday': t('timetable.days.tuesday'),
        'Wednesday': t('timetable.days.wednesday'),
        'Thursday': t('timetable.days.thursday'),
        'Friday': t('timetable.days.friday'),
        'Saturday': t('timetable.days.saturday'),
        'Sunday': t('timetable.days.sunday')
      },
      'subject': {
        'Mathematics': t('teacherTimetable.subjects.mathematics'),
        'Advanced Mathematics': t('teacherTimetable.subjects.advancedMath'),
        'Computer Science': t('teacherTimetable.subjects.computerScience')
      },
      'grade': {
        '5th Grade': t('students.grade.5th Grade'),
        '6th Grade': t('students.grade.6th Grade'),
        '7th Grade': t('students.grade.7th Grade')
      },
      'type': {
        'lecture': t('timetable.type.lecture'),
        'lab': t('timetable.type.lab'),
        'practical': t('timetable.type.practical')
      },
      'status': {
        'completed': t('timetable.status.completed'),
        'ongoing': t('timetable.status.ongoing'),
        'upcoming': t('timetable.status.upcoming')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    activeText: 'text-indigo-700 dark:text-indigo-300',
    activeBorder: 'border-indigo-200 dark:border-indigo-700',
    badge: 'bg-indigo-500'
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'day':
        return (
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {item.day}
            </p>
          </div>
        );

      case 'time':
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.time}
              </span>
            </div>
          </div>
        );

      case 'subject':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {item.subject}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.subjectCode}
              </p>
            </div>
          </div>
        );

      case 'grade':
        return (
          <Badge 
            variant="secondary" 
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1"
          >
            <Users className="w-3 h-3 mr-1" />
            {item.grade}
          </Badge>
        );

      case 'room':
        return (
          <div className="flex items-center justify-center gap-1">
            <MapPin className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.room}
            </span>
          </div>
        );

      case 'type':
        const typeColors = {
          lecture: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
          lab: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          practical: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
        };
        return (
          <Badge 
            variant="secondary" 
            className={`px-3 py-1 ${typeColors[item.type] || 'bg-gray-100 text-gray-800'}`}
          >
            {getOptionLabel('type', item.type)}
          </Badge>
        );

      case 'status':
        const statusConfig = {
          completed: {
            icon: CheckCircle,
            class: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300'
          },
          ongoing: {
            icon: AlertCircle,
            class: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300'
          },
          upcoming: {
            icon: Clock,
            class: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
          }
        };
        const config = statusConfig[item.status];
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border shadow-sm flex items-center gap-1 ${config.class} ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {config.icon && <config.icon className="w-3 h-3" />}
            {getOptionLabel('status', item.status)}
          </Badge>
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
                className="w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView && onView(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
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
      type="teacherTimetable"
      title="teacherTimetable.classSchedule"
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

export default TeacherTimetableTable;