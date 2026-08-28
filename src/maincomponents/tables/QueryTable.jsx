import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../../maincomponents/components/ui/avatar';
import { Badge } from '../../maincomponents/components/ui/badge';
import { Button } from '../../maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  MoreVertical,
  Reply
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../maincomponents/components/ui/dropdown-menu';

const QueryTable = ({
  data = [],
  loading = false,
  onView,
  onReply,
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
  totalItems = 0,
  totalPages = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  showSearch = true,
  showFilters = true
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'student', label: 'queries.student', width: 'w-48', align: 'left' },
    { key: 'message', label: 'queries.message', width: 'min-w-[200px]', align: 'left' },
    { key: 'status', label: 'common.status', width: 'w-32', align: 'center' },
    { key: 'date', label: 'common.date', width: 'w-32', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: MessageCircle,
    title: 'queries.noQueriesFound',
    description: 'queries.noQueriesDesc'
  };

  const filterConfig = [
    // { 
    //   key: 'status', 
    //   label: 'common.status', 
    //   options: ['all', 'open', 'in-progress', 'closed'] 
    // }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    const statusMap = {
      'open': t('queries.status.pending'),
      'in-progress': t('queries.status.inProgress'),
      'closed': t('queries.status.resolved'),
    };
    return statusMap[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  const getStatusConfig = (status) => {
    const config = {
      'open': {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
        icon: Clock,
        label: t('queries.status.pending')
      },
      'in-progress': {
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
        icon: AlertCircle,
        label: t('queries.status.inProgress')
      },
      'closed': {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
        icon: CheckCircle,
        label: t('queries.status.resolved')
      }
    };
    return config[status] || config['open'];
  };

  // --- FIX: Robust Initial Generator ---
  const getUserInitials = (name) => {
    if (!name) return '??';
    
    // Ensure it is a string before splitting
    let nameStr = name;
    if (typeof name !== 'string') {
        // Fallback if an object slips through
        nameStr = name?.en || name?.ar || '??';
        if (typeof nameStr !== 'string') nameStr = '??';
    }

    return nameStr
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(
        currentLanguage === 'ar' ? 'ar-SA' : 'en-US',
        { year: 'numeric', month: 'short', day: 'numeric' }
      );
    } catch (e) { return dateString; }
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return <span className="text-sm font-medium text-gray-900 dark:text-white">{(currentPage - 1) * pageSize + index + 1}</span>;

      case 'student':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-600">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                {getUserInitials(item.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                {/* Ensure we display something even if item.name is missing */}
                {item.name && typeof item.name === 'string' ? item.name : t('common.unknown')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                 {item.section || item.class || 'N/A'}
              </span>
            </div>
          </div>
        );

      case 'message':
        return (
          <div className={`max-w-md ${isRTL ? 'text-left' : ''}`}>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2" title={item.message}>
               {item.message}
            </p>
          </div>
        );

      case 'status': {
        const { color, icon: Icon, label } = getStatusConfig(item.status);
        return (
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border ${color} shadow-sm flex items-center justify-center gap-1 w-fit mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Icon className="w-3 h-3" />
            <span className="whitespace-nowrap">{label}</span>
          </Badge>
        );
      }

      case 'date':
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {formatDate(item.date)}
          </span>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? 'start' : 'end'}
                className="w-40"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem onClick={() => onView && onView(item)} className="gap-2 cursor-pointer">
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => onReply && onReply(item)} className="gap-2 cursor-pointer text-blue-600 focus:text-blue-700">
                  <Reply className="h-4 w-4" />
                  {t('queries.reply')}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onDelete && onDelete(item.id)} className="gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return <span className="text-sm text-gray-700 dark:text-gray-300">{item[column.key]}</span>;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      loading={loading}
      type="query"
      title="dashboard.studentQueries"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filters={filters}
      onFilterChange={onFilterChange}
      showSearch={showSearch}
      showFilters={showFilters}
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

export default QueryTable;