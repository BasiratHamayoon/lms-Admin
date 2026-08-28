import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import {
  HelpCircle,
  ListChecks, 
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Hash 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu';

const SurveyTable = ({
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
    { key: 'question', label: 'survey.form.questionText', width: 'min-w-[300px]', align: 'left' },
    { key: 'category', label: 'survey.form.category', width: 'min-w-[120px]', align: 'center' },
    { key: 'weight', label: 'survey.form.weight', width: 'w-24', align: 'center' },
    { key: 'status', label: 'common.status', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: HelpCircle,
    title: 'survey.noQuestionsFound',
    description: 'survey.noQuestionsDesc'
  };

  
  const filterConfig = useMemo(() => ([
    {
      key: 'category',
      label: 'survey.form.category',
      options: ['all', ...(dynamicFilters.category || [])]
    },
    {
      key: 'active',
      label: 'common.status',
      options: ['all', 'active', 'inactive']
    }
  ]), [dynamicFilters]);

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') {
      return t('common.all');
    }

    if (filterKey === 'active') {
      return option === 'active' 
        ? t('survey.status.active', { defaultValue: 'Active' })
        : t('survey.status.inactive', { defaultValue: 'Inactive' });
    }

    if (filterKey === 'category') {
      return t(`survey.categories.${option}`, { defaultValue: option });
    }

    return option; 
  };

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      teaching: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
      behavior: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300',
      communication: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300',
      punctuality: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      teamwork: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      initiative: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300',
      professionalDevelopment: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300',
      other: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
      facilities: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300',
      curriculum: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      administration: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300',
      resources: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300',
      environment: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/40 dark:text-pink-300',
      support: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300',
      overall: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300'
    };

    return categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusConfig = (isActive) => {
    if (isActive) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
        icon: CheckCircle
      };
    }
    return {
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300',
      icon: XCircle
    };
  };

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {((currentPage - 1) * pageSize) + index + 1}
          </span>
        );

      case 'question':
        const questionText = item.question?.[currentLanguage] || item.question?.en || item.question?.ar || '-';
        return (
          <div className={isRTL ? 'text-left' : ''}>
            <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
              {questionText}
            </p>
          </div>
        );

      case 'category':
        return (
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border ${getCategoryColor(item.category)}`}
          >
            <ListChecks className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {t(`survey.categories.${item.category}`, { defaultValue: item.category })}
          </Badge>
        );

      case 'weight':
        return (
          <Badge
            variant="secondary"
            className="text-xs px-2 py-1 font-semibold border bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
          >
            <Hash className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
            {item.weight}
          </Badge>
        );

      case 'status':
        const statusConfig = getStatusConfig(item.active);
        const StatusIcon = statusConfig.icon;
        return (
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-1 font-semibold border flex items-center gap-1 ${statusConfig.color}`}
          >
            <StatusIcon className="w-3 h-3" />
            {item.active ? t('survey.status.active') : t('survey.status.inactive')}
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
                  onClick={() => onDelete && onDelete(item._id)}
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
            {item[column.key] ?? '-'}
          </span>
        );
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="survey"
      title="survey.surveyQuestions"
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

export default SurveyTable;