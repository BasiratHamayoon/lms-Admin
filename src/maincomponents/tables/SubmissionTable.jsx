import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import BaseTable from './BaseTable';
import { FileText, CheckCircle, Clock, XCircle, MoreVertical, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@maincomponents/components/ui/dropdown-menu';

const SubmissionActionsCell = React.memo(({ item, onGrade, onView, isRTL }) => {
  const { t } = useTranslation();
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
        align={isRTL ? "end" : "start"}
        className="w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <DropdownMenuItem 
          onClick={() => onView(item)}
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <FileText className="h-4 w-4" />
          {t('common.view')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onGrade(item)}
          className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <Edit className="h-4 w-4" />
          {t('common.grade')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
SubmissionActionsCell.displayName = 'SubmissionActionsCell';

const SubmissionTable = ({
  data = [],
  onGrade,
  onView,
  isRTL = false,
  currentLanguage = 'en',
  showPagination = true,
  loading = false, 
  ...props
}) => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = isRTL ? [
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' },
    { key: 'marks', label: 'common.marks', width: 'min-w-[100px]', align: 'center' },
    { key: 'status', label: 'common.status', width: 'min-w-[120px]', align: 'center' },
    { key: 'submissionInfo', label: 'common.submitted', width: 'min-w-[150px]', align: 'center' },
    { key: 'student', label: 'students.name', width: 'min-w-[200px]', align: 'right' }
  ] : [
    { key: 'student', label: 'students.name', width: 'min-w-[200px]', align: 'left' },
    { key: 'submissionInfo', label: 'common.submitted', width: 'min-w-[150px]', align: 'center' },
    { key: 'status', label: 'common.status', width: 'min-w-[120px]', align: 'center' },
    { key: 'marks', label: 'common.marks', width: 'min-w-[100px]', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: FileText,
    title: 'No submissions',
    description: 'Waiting for students to submit'
  };

  const filterOptions = {
    status: ['all', 'graded', 'submitted', 'late', 'returned']
  };

  // const filterConfig = [
  //   { 
  //     key: 'status', 
  //     label: 'common.status', 
  //     options: filterOptions.status || ['all', 'graded', 'submitted', 'late', 'returned'] 
  //   }
  // ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'graded': t('status.graded'),
        'submitted': t('status.submitted'),
        'late': t('status.late'),
        'returned': t('status.returned')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  const getStatusStyle = useCallback((status) => {
    switch (status) {
      case 'graded': return { color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300', icon: CheckCircle };
      case 'submitted': return { color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300', icon: FileText };
      case 'late': return { color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300', icon: Clock };
      case 'returned': return { color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300', icon: XCircle };
      default: return { color: 'bg-gray-100', icon: FileText };
    }
  }, []);

  const getUserInitials = useCallback((name) => name ? name.substring(0, 2).toUpperCase() : 'ST', []);

  const renderCell = useCallback((item, column, index) => {
    switch (column.key) {
      case 'student':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-9 w-9 border border-gray-200 group-hover:scale-110 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs">
                {getUserInitials(item.student?.name)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{item.student?.name}</p>
              <p className="text-xs text-gray-500">{item.className}</p>
            </div>
          </div>
        );
      case 'submissionInfo':
        return (
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium">
              {new Date(item.submissionDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US')}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(item.submissionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      case 'status':
        const style = getStatusStyle(item.status);
        const Icon = style.icon;
        return (
          <Badge className={`flex items-center gap-1 border ${style.color} ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Icon className="w-3 h-3" />
            {t(`status.${item.status}`)}
          </Badge>
        );
      case 'marks':
        return item.marks !== null ? (
          <span className="font-bold text-gray-900 dark:text-white">
            {item.marks}
          </span>
        ) : <span className="text-gray-400">-</span>;
      case 'actions':
        return (
          <SubmissionActionsCell 
            item={item} 
            onGrade={onGrade} 
            onView={onView} 
            isRTL={isRTL}
          />
        );
      default: return null;
    }
  }, [isRTL, getUserInitials, getStatusStyle, t, onGrade, onView, currentLanguage]);

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="submissions"
      title="assignments.submissions"
      colors={colors}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      emptyState={emptyState}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filters={filters}
      onFilterChange={setFilters}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      // filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading} 
      {...props}
    />
  );
};

export default React.memo(SubmissionTable);