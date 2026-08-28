import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '../../maincomponents/components/ui/avatar';
import { Badge } from '../../maincomponents/components/ui/badge';
import { Button } from '../../maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  FileText, AlertCircle, CheckCircle, XCircle,
  Eye, Edit, Trash2, MoreVertical, Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../maincomponents/components/ui/dropdown-menu';

const ContractTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onDownload,
  isRTL = false,
  currentLanguage = 'en',
  
  
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  
  
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  totalItems,
  totalPages,
  loading = false,
  showPagination = true
}) => {
  const { t } = useTranslation();

  
  const filterOptions = useMemo(() => {
    return {
      // status: ['all', 'active', 'expired'],
      type: ['all', 'Contract', 'Agreement', 'NOC', 'Warning']
    };
  }, []);

  const filterConfig = [
    // { key: 'status', label: 'contract.filters.status', options: filterOptions.status },
    { key: 'type', label: 'contract.filters.type', options: filterOptions.type }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    const translationMap = {
      // 'status': {
      //   'active': t('contract.filters.active'),
      //   'expired': t('contract.filters.expired')
      // },
      'type': {
        'Contract': t('contract.type.contract'),
        'Agreement': t('contract.type.agreement'),
        'NOC': t('contract.type.noc'),
        'Warning': t('contract.type.warning')
      }
    };
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-200 dark:border-green-700',
    badge: 'bg-green-600'
  };

  const emptyState = {
    icon: FileText,
    title: 'contract.messages.noContractsFound',
    description: 'contract.messages.noContractsDesc'
  };

  
  const columns = [
    { key: 'teacher', label: 'contract.form.teacherName', width: 'min-w-[220px]', align: 'left' },
    { key: 'type', label: 'contract.form.type', width: 'min-w-[120px]', align: 'center' },
    { key: 'uploadDate', label: 'contract.form.uploadDate', width: 'w-32', align: 'center' },
    { key: 'expiryDate', label: 'contract.form.expiryDate', width: 'w-32', align: 'center' },
    { key: 'status', label: 'contract.form.status', width: 'w-28', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-24', align: 'center' }
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US');
  };

  const getStatus = (expiryDate) => {
    if (!expiryDate) return { label: 'unknown', color: 'bg-gray-100', icon: FileText };
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(expiryDate);
    
    
    const isExpired = expiry < today;
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isExpired) return { label: 'expired', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle };
    if (diffDays < 30) return { label: 'expiring', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle };
    return { label: 'active', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
  };

  const renderCell = (item, column) => {
    switch (column.key) {
      case 'teacher':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-green-600 text-white text-xs">
                {item.teacher?.name ? item.teacher.name.substring(0,2).toUpperCase() : 'NA'}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-semibold text-sm">
                {currentLanguage === 'ar' ? (item.teacher?.nameAr || item.teacher?.name) : item.teacher?.name}
              </p>
              <p className="text-xs text-gray-500">{item.teacher?.email}</p>
            </div>
          </div>
        );

      case 'type':
        const typeKey = item.type ? item.type.toLowerCase() : 'contract';
        return <Badge variant="outline">{t(`contract.type.${typeKey}`)}</Badge>;

      case 'uploadDate':
        return <span className="text-sm">{formatDate(item.uploadDate)}</span>;

      case 'expiryDate':
        return <span className="text-sm">{formatDate(item.expiryDate)}</span>;

      case 'status':
        const status = getStatus(item.expiryDate);
        const StatusIcon = status.icon;
        return (
          <Badge className={`${status.color} flex items-center gap-1 w-fit mx-auto border`}>
            <StatusIcon className="w-3 h-3" />
            {t(`contract.status.${status.label}`)}
          </Badge>
        );

      case 'actions':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye className="w-4 h-4 mr-2" /> {t('contract.actions.viewDocument')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="w-4 h-4 mr-2" /> {t('contract.editContract')}
              </DropdownMenuItem>
              {item.file && (
                <DropdownMenuItem onClick={() => onDownload(item)}>
                  <Download className="w-4 h-4 mr-2" /> {t('contract.actions.downloadDocument')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" /> {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      default:
        return item[column.key];
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="contract"
      title="contract.contractMembers"
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      isLoading={loading}
      
      showSearch={true}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      
      showFilters={true}
      filters={filters}
      onFilterChange={onFilterChange}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}

      showPagination={showPagination}
      serverSidePagination={true}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      totalItems={totalItems}
      totalPages={totalPages}
    />
  );
};

export default ContractTable;