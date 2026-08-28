import React, { useCallback, memo, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable'; 
import { 
  BookOpen, Calendar, Eye, Edit, Trash2, MoreVertical, 
  Users, CheckCircle, Archive, FileText, Send, UserPlus
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@maincomponents/components/ui/dropdown-menu';


const getLocalizedText = (value, lang = 'en') => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value[lang]) return value[lang];
    if (value.en) return value.en;
    if (value.ar) return value.ar;
    const first = Object.values(value)[0];
    if (typeof first === 'string') return first;
  }
  return String(value);
};

const ActionMenu = memo(({ item, onView, onEdit, onDelete, onPublish, onAssignStudents, t, isRTL }) => {
  const isDraft = item.status === 'draft';
  
  return (
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
        align={isRTL ? 'start' : 'end'}
        className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <DropdownMenuItem 
          onClick={() => onView(item)}
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Eye className="h-4 w-4" />
          {t('common.view')}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => onEdit(item)}
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Edit className="h-4 w-4" />
          {t('common.edit')}
        </DropdownMenuItem>

        {isDraft && onPublish && (
          <DropdownMenuItem 
            onClick={() => onPublish(item._id)}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Send className="h-4 w-4" />
            {t('common.publish')}
          </DropdownMenuItem>
        )}

        {!isDraft && onAssignStudents && (
          <DropdownMenuItem 
            onClick={() => onAssignStudents(item)}
            className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <UserPlus className="h-4 w-4" />
            {t('assignments.assignStudents')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
        
        <DropdownMenuItem 
          onClick={() => onDelete(item._id)}
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Trash2 className="h-4 w-4" />
          {t('common.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ActionMenu.displayName = 'ActionMenu';

const AssignmentTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onPublish,
  onAssignStudents,
  isRTL = false,
  currentLanguage = 'en',
  showPagination = true,
  metaData = {},
  loading = false,
  
  filters: externalFilters = {},
  onFilterChange,
  onSearchChange,
  pagination = {},
  onPageChange,
  onPageSizeChange,
  useServerSide = false,  
  ...props
}) => {
  const { t } = useTranslation();

  
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({});
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(10);

  
  const searchTerm = useServerSide ? (externalFilters.search || '') : localSearchTerm;
  const filters = useServerSide ? externalFilters : localFilters;
  const currentPage = useServerSide ? (pagination.page || 1) : localCurrentPage;
  const pageSize = useServerSide ? (pagination.limit || 10) : localPageSize;
  const totalItems = useServerSide ? (pagination.total || data.length) : data.length;
  const totalPages = useServerSide ? (pagination.totalPages || 1) : Math.ceil(data.length / localPageSize);

  
  const handleSearchChange = useCallback((term) => {
    if (useServerSide && onSearchChange) {
      onSearchChange(term);
    } else {
      setLocalSearchTerm(term);
      setLocalCurrentPage(1);
    }
  }, [useServerSide, onSearchChange]);

  const handleFilterChange = useCallback((newFilters) => {
    if (useServerSide && onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setLocalFilters(prev => ({ ...prev, ...newFilters }));
      setLocalCurrentPage(1);
    }
  }, [useServerSide, onFilterChange]);

  const handlePageChange = useCallback((page) => {
    if (useServerSide && onPageChange) {
      onPageChange(page);
    } else {
      setLocalCurrentPage(page);
    }
  }, [useServerSide, onPageChange]);

  const handlePageSizeChange = useCallback((size) => {
    if (useServerSide && onPageSizeChange) {
      onPageSizeChange(size);
    } else {
      setLocalPageSize(size);
      setLocalCurrentPage(1);
    }
  }, [useServerSide, onPageSizeChange]);

  
  const filteredData = useMemo(() => {
    if (useServerSide) return data;

    let result = [...data];

    
    if (localSearchTerm.trim()) {
      const term = localSearchTerm.toLowerCase();
      result = result.filter(item => {
        const title = getLocalizedText(item.title, currentLanguage).toLowerCase();
        const desc = getLocalizedText(item.description, currentLanguage).toLowerCase();
        return title.includes(term) || desc.includes(term);
      });
    }

    
    if (localFilters.status && localFilters.status !== 'all') {
      result = result.filter(item => item.status === localFilters.status);
    }
    if (localFilters.classId && localFilters.classId !== 'all') {
      result = result.filter(item => (item.classId?._id || item.classId) === localFilters.classId);
    }
    if (localFilters.courseId && localFilters.courseId !== 'all') {
      result = result.filter(item => (item.courseId?._id || item.courseId) === localFilters.courseId);
    }

    return result;
  }, [data, localSearchTerm, localFilters, currentLanguage, useServerSide]);

  
  const paginatedData = useMemo(() => {
    if (useServerSide) return data;

    const start = (localCurrentPage - 1) * localPageSize;
    return filteredData.slice(start, start + localPageSize);
  }, [filteredData, localCurrentPage, localPageSize, useServerSide, data]);

  const displayData = useServerSide ? data : paginatedData;

  const columns = useMemo(() => [
    { key: 'title', label: t('assignments.assignmentTitle'), sortable: false },
    { key: 'context', label: t('assignments.context'), sortable: false },
    { key: 'dueDate', label: t('assignments.dueDate'), sortable: false },
    { key: 'stats', label: t('assignments.stats'), sortable: false },
    { key: 'actions', label: t('common.actions'), sortable: false }
  ], [t]);

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: BookOpen,
    title: 'No assignments found',
    description: 'Create one to get started'
  };

  const filterOptions = useMemo(() => {
    const statusOptions = ['all', 'published', 'draft', 'archived'];
    const classOptions = ['all', ...(metaData.classes?.map(c => c._id || c.id || c.value) || [])];
    const courseOptions = ['all', ...(metaData.courses?.map(c => c._id || c.id) || [])];

    return {
      status: statusOptions,
      classId: classOptions,
      courseId: courseOptions
    };
  }, [metaData]);

  const getOptionLabel = useCallback((filterKey, option) => {
    if (option === 'all') return t('common.all');

    const translationMap = {
      status: {
        published: t('status.published'),
        draft: t('status.draft'),
        archived: t('status.archived')
      },
      classId: {
        ...(metaData.classes?.reduce((acc, cls) => {
          const id = cls._id || cls.id || cls.value;
          acc[id] = cls.name || cls.label;
          return acc;
        }, {}) || {})
      },
      courseId: {
        ...(metaData.courses?.reduce((acc, crs) => {
          const id = crs._id || crs.id;
          acc[id] = crs.name || crs.nameLabel;
          return acc;
        }, {}) || {})
      }
    };

    const mapped = translationMap[filterKey]?.[option];
    if (mapped) {
      return getLocalizedText(mapped, currentLanguage);
    }
    return String(option);
  }, [metaData, currentLanguage, t]);

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  const renderCell = useCallback(
    (item, column, index) => {
      switch (column.key) {
        case 'title': {
          const titleText = getLocalizedText(item.title, currentLanguage);
          const descText = getLocalizedText(item.description, currentLanguage);

          return (
            <div className={`flex flex-col ${isRTL ? 'text-left' : ''}`}>
              <span className="font-semibold text-gray-900 dark:text-white">
                {titleText}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-[250px]">
                {descText}
              </span>
            </div>
          );
        }

        case 'context': {
          const courseName = getLocalizedText(item.courseId?.name, currentLanguage);
          const className = getLocalizedText(item.classId?.name, currentLanguage);

          return (
            <div className="flex flex-col items-center gap-1">
              {courseName && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {courseName}
                </Badge>
              )}
              <span className="text-xs text-gray-500">{className}</span>
            </div>
          );
        }

        case 'dueDate': {
          const date = item.dueDate
            ? new Date(item.dueDate).toLocaleDateString(
                currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
                { year: 'numeric', month: 'short', day: 'numeric' }
              )
            : '-';
          const isPast = item.dueDate && new Date(item.dueDate) < new Date();
          
          return (
            <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className={`w-4 h-4 ${isPast ? 'text-red-400' : 'text-gray-400'}`} />
              <span className={`text-sm ${isPast ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {date}
              </span>
            </div>
          );
        }

        case 'stats': {
          let statusConfig;
          switch (item.status) {
            case 'published':
              statusConfig = {
                color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
                icon: CheckCircle,
                label: 'status.published'
              };
              break;
            case 'draft':
              statusConfig = {
                color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300',
                icon: FileText,
                label: 'status.draft'
              };
              break;
            case 'archived':
              statusConfig = {
                color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
                icon: Archive,
                label: 'status.archived'
              };
              break;
            default:
              statusConfig = {
                color: 'bg-gray-100',
                icon: FileText,
                label: item.status
              };
          }
          const StatusIcon = statusConfig.icon;

          return (
            <div className="flex flex-col items-center gap-2">
              <Badge className={`flex items-center gap-1 border ${statusConfig.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
                <StatusIcon className="w-3 h-3" />
                {t(statusConfig.label)}
              </Badge>
              {item.status === 'published' && (
                <div className={`flex items-center gap-1 text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Users className="w-3 h-3" />
                  <span>
                    {item.submissionStats?.submitted ?? 0}/{item.submissionStats?.total ?? item.assignedTo?.length ?? 0}
                  </span>
                </div>
              )}
            </div>
          );
        }

        case 'actions':
          return (
            <ActionMenu
              item={item}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onPublish={onPublish}
              onAssignStudents={onAssignStudents}
              t={t}
              isRTL={isRTL}
            />
          );

        default:
          return null;
      }
    },
    [currentLanguage, isRTL, onView, onEdit, onDelete, onPublish, onAssignStudents, t]
  );

  // const filterConfig = [
  //   { key: 'status', label: 'common.status', options: filterOptions.status },
  //   { key: 'classId', label: 'classes.class', options: filterOptions.classId },
  //   { key: 'courseId', label: 'courses.course', options: filterOptions.courseId }
  // ];

  return (
    <BaseTable
      data={displayData}
      columns={columns}
      renderCell={renderCell}
      type="assignment"
      title="sidebar.assignments"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
      
      filters={filters}
      onFilterChange={handleFilterChange}
      showSearch={true}
      showFilters={true}
      
      showPagination={showPagination}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={useServerSide ? totalItems : filteredData.length}
      totalPages={useServerSide ? totalPages : Math.ceil(filteredData.length / pageSize)}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      
      // filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      {...props}
    />
  );
};

export default React.memo(AssignmentTable);