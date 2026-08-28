// src/maincomponents/tables/NotificationTable.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Bell, MessageCircle, Calendar, CheckCircle, FileText, Award, DollarSign,
  Eye, Edit, Trash2, MoreVertical, Users, AlertTriangle, AlertCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const NotificationTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onSend,
  onPublish,
  onArchive,
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
  dynamicFilters = {},
  loading = false
}) => {
  const { t } = useTranslation();

  // Define table columns
  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'title', label: 'notifications.form.title', width: 'min-w-[200px]', align: 'left' },
    { key: 'type', label: 'notifications.form.type', width: 'w-28', align: 'center' },
    { key: 'priority', label: 'notifications.form.priority', width: 'w-28', align: 'center' },
    { key: 'target', label: 'notifications.form.targetAudience', width: 'w-28', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    // { key: 'readRate', label: 'notifications.readRate', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  // Table colors
  const colors = {
    primary: 'from-emerald-500 to-emerald-600',
    gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  };

  const emptyState = {
    icon: Bell,
    title: 'notifications.noNotificationsFound',
    description: 'notifications.noNotificationsDesc'
  };

  // Get dynamic filter options
  const filterOptions = useMemo(() => {
    const options = {
      type: [],
      priority: [],
      status: [],
      targetAudience: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      const uniquePriorities = [...new Set(data.map(item => item.priority).filter(Boolean))];
      options.priority = ['all', ...uniquePriorities];
      
      const uniqueStatuses = [...new Set(data.map(item => item.status).filter(Boolean))];
      options.status = ['all', ...uniqueStatuses];
      
      const uniqueAudiences = [...new Set(data.map(item => item.targetAudience).filter(Boolean))];
      options.targetAudience = ['all', ...uniqueAudiences];
    }

    return options;
  }, [data, dynamicFilters]);

  // Filter configuration
  const filterConfig = [
    { 
      key: 'type', 
      label: 'notifications.form.type', 
      options: ['all', 'announcement', 'event', 'assignment', 'quiz', 'grade', 'fee', 'attendance', 'other'] 
    },
    { 
      key: 'priority', 
      label: 'notifications.form.priority', 
      options: ['all', 'low', 'medium', 'high', 'urgent'] 
    },
    { 
      key: 'status', 
      label: 'common.status', 
      options: ['all', 'draft', 'published', 'archived'] 
    },
    { 
      key: 'targetAudience', 
      label: 'notifications.form.targetAudience', 
      options: ['all', 'students', 'teachers', 'staff', 'parents', 'admin', 'specific'] 
    }
  ];

  // Function to get translated option labels
  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    // For specific keys, try to find translation
    if (['type', 'priority', 'status', 'targetAudience'].includes(filterKey)) {
      const keyMap = {
        type: 'types',
        priority: 'priority',
        status: 'status',
        targetAudience: 'targetAudience'
      };
      
      const translationKey = `notifications.${keyMap[filterKey]}.${option}`;
      const translation = t(translationKey);
      
      // If translation key is returned (meaning no translation found), return option
      if (translation === translationKey) return option;
      return translation;
    }
    
    return option;
  };

  // Filter colors
  const filterColors = {
    activeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    activeText: 'text-emerald-700 dark:text-emerald-300',
    activeBorder: 'border-emerald-200 dark:border-emerald-700',
    badge: 'bg-emerald-500'
  };

  // Status colors for badges
  const getStatusColor = (status) => {
    const statusColors = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
      published: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      archived: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    const priorityColors = {
      low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
      urgent: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Type icons
  const getTypeIcon = (type) => {
    const iconMap = {
      announcement: Bell,
      event: Calendar,
      assignment: FileText,
      quiz: Award,
      grade: CheckCircle,
      fee: DollarSign,
      attendance: Users,
      other: MessageCircle
    };
    return iconMap[type] || MessageCircle;
  };

  const getUserInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper to get bilingual value
  const getBilingualValue = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[currentLanguage] || val.en || val.ar || '';
  };

  // Truncate text function
  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'title':
        const titleText = getBilingualValue(item.title);
        const messageText = getBilingualValue(item.message);
        const senderName = item.sentBy?.name 
          ? (typeof item.sentBy.name === 'string' 
              ? item.sentBy.name 
              : (item.sentBy.name[currentLanguage] || item.sentBy.name.en || '')) 
          : (isRTL ? 'مسؤول النظام' : 'System Admin');

        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-600">
              <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm">
                {getUserInitials(senderName)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {truncateText(titleText, 40)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {truncateText(messageText, 50)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{senderName}</span>
                <span className="mx-1">•</span>
                {formatDate(item.createdAt)}
              </p>
            </div>
          </div>
        );

      case 'type':
        const TypeIcon = getTypeIcon(item.type);
        const typeText = t(`notifications.types.${item.type}`, item.type);
        
        return (
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-1 font-semibold border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-1"
          >
            <TypeIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{typeText}</span>
          </Badge>
        );

      case 'priority':
        const priorityText = t(`notifications.priority.${item.priority}`, item.priority);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getPriorityColor(item.priority)} shadow-sm`}
          >
            {priorityText}
          </Badge>
        );

      case 'target':
        const targetText = t(`notifications.targetAudience.${item.targetAudience}`, item.targetAudience);
        
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {targetText}
          </span>
        );

      case 'status':
        const statusText = t(`notifications.status.${item.status}`, item.status);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm`}
          >
            {statusText}
          </Badge>
        );

      case 'readRate':
        // const readRate = calculateReadRate(item.readCount, item.totalRecipients);
        // For now, hardcode or remove as backend doesn't send this yet in list view
        return (
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              -
            </span>
          </div>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-700"
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
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                {item.status === 'draft' && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => onEdit && onEdit(item)}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      {t('common.edit')}
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => onSend && onSend(item)}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isRTL ? 'نشر' : 'Publish'}
                    </DropdownMenuItem>
                  </>
                )}

                {item.status === 'published' && (
                  <DropdownMenuItem 
                    onClick={() => onArchive && onArchive(item)}
                    className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/30 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isRTL ? 'أرشفة' : 'Archive'}
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                
                <DropdownMenuItem 
                  onClick={() => onDelete && onDelete(item._id)}
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
      type="notification"
      title="notifications.notificationList"
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

export default NotificationTable;