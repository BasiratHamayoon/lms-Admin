// PerformanceTable.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../../maincomponents/components/ui/avatar';
import { Badge } from '../../maincomponents/components/ui/badge';
import { Button } from '../../maincomponents/components/ui/button';
import BaseTable from './BaseTable'; 
import { 
  Building, Eye, MoreVertical, TrendingUp, TrendingDown, Calendar, FileText 
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '../../maincomponents/components/ui/dropdown-menu';

const PerformanceTable = ({
  data = [],
  loading = false,
  onView,
  showPagination = true,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 0,
  onPageChange,
  onPageSizeChange,
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  isRTL = false,
  currentLanguage = 'en'
}) => {
  const { t } = useTranslation();

  const columns = [
   { key: 'index', label: '#', width: 'w-10', align: 'center' },
    { key: 'staff', label: 'performance.employee', width: 'min-w-[180px]', align: 'left' },
    { key: 'reviewInfo', label: 'performance.reviewInfo', width: 'min-w-[100px]', align: 'center' },
    { key: 'ratings', label: 'performance.ratings', width: 'min-w-[20px]', align: 'center' },
    { key: 'overallRating', label: 'performance.overallRating', width: 'min-w-[100px]', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-16', align: 'center' }
  ];

  const colors = {
    primary: 'from-purple-500 to-purple-600',
    gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
    badge: 'bg-gradient-to-r from-purple-500 to-purple-600'
  };

  const getUserInitials = (name) => {
    if (!name) return '??';
    return String(name).slice(0, 2).toUpperCase();
  };

  const getStatusColor = (status) => {
    const map = {
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      acknowledged: 'bg-teal-100 text-teal-800 border-teal-200',
      finalized: 'bg-green-100 text-green-800 border-green-200'
    };
    return map[status] || 'bg-gray-100';
  };

  const getReviewTypeColor = (type) => {
    return type === 'annual' 
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (rating >= 4.0) return 'text-green-600 bg-green-50 border-green-200';
    if (rating >= 3.0) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (currentPage - 1) * pageSize + index + 1;

      case 'staff':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarImage src={item.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {getUserInitials(item.userName)}
              </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
              <span className="font-medium text-sm text-gray-900 dark:text-white">
                {item.userName}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                 <Building className="w-3 h-3" /> {item.department}
              </span>
            </div>
          </div>
        );

      case 'reviewInfo':
        return (
          <div className="flex flex-col items-center gap-1">
             <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${getReviewTypeColor(item.reviewType)}`}>
               {t(`performance.reviewTypes.${item.reviewType}`)}
             </Badge>
             <span className="text-[11px] text-muted-foreground flex items-center gap-1">
               <Calendar className="w-3 h-3" />
               {new Date(item.createdAt).toLocaleDateString(currentLanguage, { month: 'short', year: 'numeric' })}
             </span>
          </div>
        );

      case 'ratings':
        const r = item.ratings || {};
        return (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
             <div className="flex gap-x-1 items-center text-muted-foreground">
               <span 
                 className="truncate max-w-[70px]" 
                 title={t('performance.teachingQuality')}
               >
                 {t('performance.teachingQuality')}:
               </span> 
               <span className="font-semibold text-gray-700 dark:text-gray-300">
                 {r.teachingQuality?.toFixed(1)}
               </span>
             </div>
             
             <div className="flex gap-x-3 items-center text-muted-foreground">
               <span 
                 className="truncate max-w-[70px]" 
                 title={t('performance.teamwork')}
               >
                 {t('performance.teamwork')}:
               </span> 
               <span className="font-semibold text-gray-700 dark:text-gray-300">
                 {r.teamwork?.toFixed(1)}
               </span>
             </div>
          </div>
        );

      case 'overallRating':
        const rating = item.ratings?.overallRating || 0;
        return (
          <div className="flex items-center justify-center">
            <Badge variant="outline" className={`font-bold flex items-center gap-1 px-2 py-1 ${getRatingColor(rating)}`}>
              {rating >= 4.0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {rating.toFixed(1)} <span className="text-[10px] font-normal opacity-70">/ 5</span>
            </Badge>
          </div>
        );

      case 'status':
        return (
          <Badge variant="secondary" className={`capitalize ${getStatusColor(item.status)}`}>
            {t(`performance.status.${item.status}`)}
          </Badge>
        );

      case 'actions':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(item)} className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> {t('common.view')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
        
      default: return null;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      isLoading={loading}
      isRTL={isRTL}
      title='performance.reviewInfo'
      currentLanguage={currentLanguage}
      colors={colors}
      showSearch={true}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      showFilters={true}
      filters={filters}
      onFilterChange={onFilterChange}
      showPagination={showPagination}
      serverSidePagination={true}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      emptyState={{
        icon: FileText,
        title: t('performance.noPerformanceFound'),
        description: t('performance.noPerformanceDesc')
      }}
    />
  );
};

export default PerformanceTable;