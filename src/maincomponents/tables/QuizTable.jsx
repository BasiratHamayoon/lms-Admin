import React, { useCallback, memo, useMemo, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  BookOpen, Calendar, Eye, Edit, Trash2, MoreVertical,
  Users, CheckCircle, Lock, FileText, Send, XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';

const ActionMenu = memo(({ item, onView, onEdit, onDelete, onPublish, onClose, t, isRTL }) => {
  const canEdit = item.status !== 'closed';
  const canPublish = item.status === 'draft';
  const canClose = item.status === 'published';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
        >
          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isRTL ? "end" : "start"}
        className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm"
      >
        <DropdownMenuItem
          onClick={() => onView(item)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          {t('common.view')}
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem
            onClick={() => onEdit(item)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Edit className="h-4 w-4" />
            {t('common.edit')}
          </DropdownMenuItem>
        )}

        {canPublish && onPublish && (
          <DropdownMenuItem
            onClick={() => onPublish(item._id || item.id)}
            className="flex items-center gap-2 cursor-pointer text-green-600"
          >
            <Send className="h-4 w-4" />
            {t('common.publish')}
          </DropdownMenuItem>
        )}

        {canClose && onClose && (
          <DropdownMenuItem
            onClick={() => onClose(item._id || item.id)}
            className="flex items-center gap-2 cursor-pointer text-orange-600"
          >
            <XCircle className="h-4 w-4" />
            {t('common.close')}
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(item._id || item.id)}
          className="flex items-center gap-2 cursor-pointer text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          {t('common.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ActionMenu.displayName = 'ActionMenu';

const QuizTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onPublish,
  onClose,
  loading = false,
  isRTL = false,
  currentLanguage = 'en',
  showPagination = true,
  metaData = {},
  filters = {},
  onFilterChange,
  onClearFilters,
  pagination = {},
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  const { t } = useTranslation();
  
  // LOCAL state for search to prevent focus loss
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.searchTitle || '');
  const [localFilters, setLocalFilters] = useState({
    status: filters.status || 'all',
    classId: filters.classId || 'all'
  });
  
  const debounceRef = useRef(null);
  const isInitialMount = useRef(true);

  // Sync local search with external filters on initial load only
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setLocalSearchTerm(filters.searchTitle || '');
      setLocalFilters({
        status: filters.status || 'all',
        classId: filters.classId || 'all'
      });
    }
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback((value) => {
    setLocalSearchTerm(value);
    
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Debounce the API call
    debounceRef.current = setTimeout(() => {
      onFilterChange?.({ 
        ...localFilters,
        searchTitle: value,
        // Reset status and classId if they are 'all'
        status: localFilters.status !== 'all' ? localFilters.status : undefined,
        classId: localFilters.classId !== 'all' ? localFilters.classId : undefined
      });
    }, 500); // 500ms debounce
  }, [onFilterChange, localFilters]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Handle filter changes (immediate, no debounce needed)
  const handleTableFilterChange = useCallback((newFilters) => {
    const updatedFilters = {
      ...localFilters,
      ...newFilters
    };
    
    setLocalFilters(updatedFilters);
    
    // Build API filters
    const apiFilters = {
      searchTitle: localSearchTerm || undefined
    };
    
    if (updatedFilters.status && updatedFilters.status !== 'all') {
      apiFilters.status = updatedFilters.status;
    }
    if (updatedFilters.classId && updatedFilters.classId !== 'all') {
      apiFilters.classId = updatedFilters.classId;
    }
    
    onFilterChange?.(apiFilters);
  }, [onFilterChange, localSearchTerm, localFilters]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setLocalSearchTerm('');
    setLocalFilters({ status: 'all', classId: 'all' });
    onClearFilters?.();
  }, [onClearFilters]);

  const getSafeText = useCallback((input) => {
    if (!input) return '';
    if (typeof input === 'string') return input;
    if (typeof input === 'object') {
      return input[currentLanguage] || input.en || input.ar || '';
    }
    return String(input);
  }, [currentLanguage]);

const columns = useMemo(() => [
  { key: 'title', label: 'common.title', width: 'min-w-[250px]', align: isRTL ? 'right' : 'left' },
  { key: 'context', label: 'classes.class', width: 'min-w-[150px]', align: 'center' },
  { key: 'dueDate', label: 'common.dueDate', width: 'min-w-[120px]', align: 'center' },
  { key: 'stats', label: 'common.status', width: 'min-w-[150px]', align: 'center' },
  { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
], [isRTL]); // Keep isRTL in deps for the align property


  const colors = {
    primary: 'from-green-500 to-green-600',
    gradient: 'bg-gradient-to-r from-green-500 to-green-600',
    badge: 'bg-gradient-to-r from-green-500 to-green-600'
  };

  const emptyState = {
    icon: BookOpen,
    title: t('quizzes.noQuizzesFound'),
    description: t('quizzes.createToGetStarted')
  };

  // Build class options for filter
  const classFilterOptions = useMemo(() => {
    const options = ['all'];
    if (metaData.classes && Array.isArray(metaData.classes)) {
      metaData.classes.forEach(c => {
        const value = c.value || c._id || c.id;
        if (value) options.push(value);
      });
    }
    return options;
  }, [metaData.classes]);

  // const filterConfig = useMemo(() => [
  //   {
  //     key: 'status',
  //     label: 'common.status',
  //     options: ['all', 'draft', 'published', 'closed']
  //   },
  //   {
  //     key: 'classId',
  //     label: 'classes.class',
  //     options: classFilterOptions
  //   }
  // ], [classFilterOptions]);

  const getOptionLabel = useCallback((filterKey, option) => {
    if (option === 'all') return t('common.all');

    if (filterKey === 'status') {
      return t(`status.${option}`);
    }

    if (filterKey === 'classId') {
      const classItem = metaData.classes?.find(c => 
        (c.value || c._id || c.id) === option
      );
      if (classItem) {
        return classItem.label || getSafeText(classItem.name) || option;
      }
      return option;
    }

    return option;
  }, [metaData.classes, t, getSafeText]);

  const filterColors = {
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-200 dark:border-green-700',
    badge: 'bg-green-500'
  };

  const getStatusStyle = useCallback((status) => {
    switch (status) {
      case 'published':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'status.published' };
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText, label: 'status.draft' };
      case 'closed':
        return { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Lock, label: 'status.closed' };
      default:
        return { color: 'bg-gray-100', icon: FileText, label: status };
    }
  }, []);

  const renderCell = useCallback((item, column) => {
    switch (column.key) {
      case 'title':
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {getSafeText(item.title) || item.titleLabel}
            </span>
            <div className="flex items-center gap-2 mt-1">
              {item.questionsCount !== undefined && (
                <span className="text-xs text-gray-500">
                  {item.questionsCount} {t('quizzes.questions')}
                </span>
              )}
              {item.totalMarks && (
                <span className="text-xs text-gray-500">
                  • {item.totalMarks} {t('common.marks')}
                </span>
              )}
            </div>
          </div>
        );

      case 'context':
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {item.class || item.className || getSafeText(item.classId?.name)}
            </span>
            {item.section && (
              <span className="text-xs text-gray-500">{item.section}</span>
            )}
          </div>
        );

      case 'dueDate':
        const date = item.dueDate ? new Date(item.dueDate).toLocaleDateString(
          currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
          { year: 'numeric', month: 'short', day: 'numeric' }
        ) : '-';
        return (
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {date}
            </span>
          </div>
        );

      case 'stats':
        const statusConfig = getStatusStyle(item.status);
        const StatusIcon = statusConfig.icon;

        return (
          <div className="flex flex-col items-center gap-2">
            <Badge className={`flex items-center gap-1 border ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3" />
              {t(statusConfig.label)}
            </Badge>
            {item.status !== 'draft' && item.totalStudents !== undefined && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{item.submittedCount || 0}/{item.totalStudents || 0}</span>
              </div>
            )}
          </div>
        );

      case 'actions':
        return (
          <ActionMenu
            item={item}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onClose={onClose}
            t={t}
            isRTL={isRTL}
          />
        );

      default:
        return null;
    }
  }, [currentLanguage, isRTL, onView, onEdit, onDelete, onPublish, onClose, t, getStatusStyle, getSafeText]);

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="quiz"
      title="sidebar.quizzes"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      // Use LOCAL search state
      searchTerm={localSearchTerm}
      onSearchChange={handleSearchChange}
      // Use LOCAL filter state
      filters={localFilters}
      onFilterChange={handleTableFilterChange}
      onClearFilters={handleClearFilters}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      pageSize={pagination.limit || 10}
      currentPage={pagination.page || 1}
      totalItems={pagination.total || 0}
      totalPages={pagination.totalPages || 1}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      // filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      {...props}
    />
  );
};

export default memo(QuizTable);