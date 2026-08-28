import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import {
  User,
  Briefcase,
  Phone,
  Eye,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';

const StaffTable = ({
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
  
  serverSidePagination = false,
  loading = false,
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'name', label: 'staff.form.fullName', width: 'min-w-[200px]', align: 'left' },
    { key: 'role', label: 'staff.form.role', width: 'min-w-[120px]', align: 'center' },
    { key: 'department', label: 'staff.form.department', width: 'min-w-[150px]', align: 'left' },
    { key: 'joinDate', label: 'staff.form.joinDate', width: 'w-28', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-green-500 to-green-600',
    gradient: 'bg-gradient-to-r from-green-500 to-green-600',
    badge: 'bg-gradient-to-r from-green-500 to-green-600'
  };

  const emptyState = {
    icon: User,
    title: 'staff.noStaffFound',
    description: 'staff.noStaffDesc'
  };

  const filterOptions = useMemo(() => {
    const options = {
      role: ['all', 'teacher', 'hr', 'accountant'],
      department: ['all'],
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueDepartments = [...new Set(data.map(item => item.department).filter(Boolean))];
      options.department = ['all', ...uniqueDepartments];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    {
      key: 'role',
      label: 'staff.form.role',
      options: filterOptions.role
    },
    {
      key: 'department',
      label: 'staff.form.department',
      options: filterOptions.department
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'role': {
        'teacher': t('staff.roles.teacher'),
        'hr': t('staff.roles.hr'),
        'accountant': t('staff.roles.accountant')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-200 dark:border-green-700',
    badge: 'bg-green-500'
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
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
    } catch {
      return dateString;
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      teacher: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      hr: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      accountant: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // const getStatusConfig = (status) => {
  //   const statusMap = {
  //     'active': {
  //       color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
  //       icon: CheckCircle
  //     },
  //     'inactive': {
  //       color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
  //       icon: XCircle
  //     },
  //     'on-leave': {
  //       color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
  //       icon: Clock
  //     }
  //   };
  //   return statusMap[status] || statusMap['inactive'];
  // };

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
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse ' : ''} `}>
            <Avatar className={`h-10 w-10 border-2 border-gray-200 dark:border-gray-600`}>
              <AvatarImage src={item.avatar} alt={item.name} />
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm">
                {getUserInitials(item.name)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {item.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.email}
              </p>
              {item.phone && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {item.phone}
                </p>
              )}
            </div>
          </div>
        );

      case 'role':
        return (
          <Badge 
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border ${getRoleColor(item.role)}`}
          >
            <Briefcase className="w-3 h-3 mr-1" />
            {t(`staff.roles.${item.role}`, item.role)}
          </Badge>
        );

      case 'department':
        return (
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {item.department || '-'}
          </span>
        );

      case 'joinDate':
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
            {formatDate(item.joinDate)}
          </span>
        );

      // case 'status':
      //   const statusConfig = getStatusConfig(item.status);
      //   const StatusIcon = statusConfig.icon;
      //   return (
      //     <Badge 
      //       variant="secondary"
      //       className={`text-xs px-2 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}
      //     >
      //       <StatusIcon className="w-3 h-3" />
      //       {t(`staff.status.${item.status}`, item.status)}
      //     </Badge>
      //   );

      case 'actions':
        return (
          <div className={`flex items-center justify-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                align={isRTL ? 'start' : 'end'}
                className="w-40"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <DropdownMenuItem
                  onClick={() => onView && onView(item)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  {t('common.view')}
                </DropdownMenuItem>
                
                <DropdownMenuItem
                  onClick={() => onEdit && onEdit(item)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  {t('common.edit')}
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                  onClick={() => onDelete && onDelete(item.id)}
                  className="flex items-center gap-2 cursor-pointer text-red-600"
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
      type="staff"
      title="staff.staffMembers"
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
      serverSidePagination={serverSidePagination}
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

export default StaffTable;