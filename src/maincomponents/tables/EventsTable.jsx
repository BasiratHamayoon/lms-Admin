import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  Calendar, Clock, MapPin, Eye, Users, Bell, 
  Edit, Trash2, MoreVertical 
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const EventsTable = ({
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
    pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  onPageChange = () => {},
  onPageSizeChange = () => {},
  
  dynamicFilters = {},
  loading = false
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'event', label: 'events.eventInfo', width: 'min-w-[200px]', align: 'left' },
    { key: 'dateTime', label: 'events.dateTimeInfo', width: 'min-w-[120px]', align: 'center' },
    { key: 'location', label: 'events.form.location', width: 'min-w-[120px]', align: 'left' },
    { key: 'eventDetails', label: 'events.visibilityInfo', width: 'min-w-[140px]', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-teal-500 to-teal-600',
    gradient: 'bg-gradient-to-r from-teal-500 to-teal-600',
    badge: 'bg-gradient-to-r from-teal-500 to-teal-600'
  };

  const emptyState = {
    icon: Calendar,
    title: 'events.noEventsFound',
    description: 'events.noEventsDesc'
  };

  const filterOptions = useMemo(() => {
    const options = {
      status: ['all', 'scheduled', 'completed', 'cancelled', 'postponed'],
      type: [],
      visibility: [],
      // location: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      const uniqueVisibility = [...new Set(data.map(item => item.visibility).filter(Boolean))];
      options.visibility = ['all', ...uniqueVisibility];
      
      // const uniqueLocations = [...new Set(data.map(item => item.location).filter(Boolean))];
      // options.location = ['all', ...uniqueLocations];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'status', 
      label: 'common.status', 
      options: filterOptions.status || ['all', 'scheduled', 'completed', 'cancelled'] 
    },
    { 
      key: 'type', 
      label: 'events.form.type', 
      options: filterOptions.type || [] 
    },
    { 
      key: 'visibility', 
      label: 'events.form.visibility', 
      options: filterOptions.visibility || [] 
    },
    // { 
    //   key: 'location', 
    //   label: 'events.form.location', 
    //   options: filterOptions.location || [] 
    // }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'status': {
        'scheduled': t('events.status.scheduled'),
        'completed': t('events.status.completed'),
        'cancelled': t('events.status.cancelled'),
        'postponed': t('events.status.postponed')
      },
      'type': {
        'academic': t('events.types.academic'),
        'administrative': t('events.types.administrative'),
        'holiday': t('events.types.holiday'),
        'exam': t('events.types.exam'),
        'other': t('events.types.other')
      },
      'visibility': {
        'all': t('events.visibility.all'),
        'teachers': t('events.visibility.staff'),
        'students': t('events.visibility.students'),
        'admins': t('events.visibility.department')
      },
      'location': {}
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-teal-50 dark:bg-teal-900/20',
    activeText: 'text-teal-700 dark:text-teal-300',
    activeBorder: 'border-teal-200 dark:border-teal-700',
    badge: 'bg-teal-500'
  };

  const getStatusColor = (status) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      postponed: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      scheduled: Calendar,
      completed: Calendar,
      cancelled: Calendar,
      postponed: Calendar
    };
    return iconMap[status] || Calendar;
  };

  const getTypeColor = (type) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600'
    ];
    
    const typeMap = {
      academic: 0,
      administrative: 1,
      holiday: 2,
      exam: 3,
      other: 4
    };
    
    return colors[typeMap[type] || 0];
  };

  const getEventDate = (startDate) => {
    const date = new Date(startDate);
    return date.toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEventTime = (startDate, endDate, allDay) => {
    if (allDay) return t('events.allDay');
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {/* ✅ Fix index calculation for pagination */}
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'event':
        return (
          <div className={`flex flex-col gap-1 ${isRTL ? 'text-left' : ''}`}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r ${getTypeColor(item.type)}`}>
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {truncateText(item.description, 45)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'dateTime':
        return (
          <div className={`flex flex-col items-center ${isRTL ? 'text-left' : ''}`}>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {getEventTime(item.startDate, item.endDate, item.allDay)}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getEventDate(item.startDate)}
            </span>
          </div>
        );

      case 'location':
        return (
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-3 h-3 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
              {truncateText(item.location, 20)}
            </span>
          </div>
        );

      case 'eventDetails':
        return (
          <div className={`flex flex-col items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {t(`events.visibility.${item.visibility}`)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-green-500" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {t(`events.types.${item.type}`)}
              </span>
            </div>
            {item.reminder && (
              <div className="flex items-center gap-2">
                <Bell className="w-3 h-3 text-yellow-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {t('events.form.reminder')}
                </span>
              </div>
            )}
          </div>
        );

      case 'status':
        const statusText = t(`events.status.${item.status}`, item.status);
        const StatusIcon = getStatusIcon(item.status);
        
        return (
          <Badge 
            variant="secondary" 
            className={`text-xs px-2 py-1 font-semibold border ${getStatusColor(item.status)} shadow-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusText}
          </Badge>
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
                className="w-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem 
                  onClick={() => onView && onView(item)}
                  className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
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
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
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
      type="event"
      title="events.eventMembers"
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
      serverSidePagination={true}  
      isLoading={loading}
      
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

export default EventsTable;