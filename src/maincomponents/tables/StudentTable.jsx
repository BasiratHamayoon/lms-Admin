import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import BaseTable from './BaseTable';
import { 
  User, Phone, Mail, 
  Eye, Edit, Trash2, MoreVertical,
  GraduationCap
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const StudentTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onAssign, 
  isRTL = false,
  currentLanguage = 'en',
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  loading = false,
  pageSize = 10,
  currentPage = 1,
  totalItems = 0,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();
  const { classes } = useSelector((state) => state.classes || { classes: [] });

  const getStudentName = (student) => {
    if (!student) return 'Unknown';
    if (student.displayName) return student.displayName;
    if (typeof student.name === 'string') return student.name;
    const nameLang = student.name?.[currentLanguage] || student.name?.en || student.name?.ar || {};
    return `${nameLang.firstName || ''} ${nameLang.lastName || ''}`.trim() || 'Unknown';
  };

  const getUserInitials = (student) => {
    const name = getStudentName(student);
    return name.slice(0, 2).toUpperCase();
  };

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'name', label: 'students.form.fullName', width: 'min-w-[220px]' },
    { key: 'studentId', label: 'students.form.studentId', width: 'min-w-[120px]' },
    { key: 'classInfo', label: 'students.form.class', width: 'min-w-[140px]' }, 
    { key: 'phone', label: 'students.form.phone', width: 'min-w-[120px]' },
    { key: 'status', label: 'students.form.enrollStatus', width: 'w-24', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const renderCell = (item, column, index) => {
    switch (column.key) {
      case 'index':
        return <span className="text-sm font-medium text-gray-900 dark:text-white">{((currentPage - 1) * pageSize) + index + 1}</span>;

      case 'name':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-left' : ''}`}>
            <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
              <AvatarImage src={item.avatar} alt="avatar" />
              <AvatarFallback className="bg-green-600 text-white text-xs">
                {getUserInitials(item)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{getStudentName(item)}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[140px]">{item.email}</span>
              </div>
            </div>
          </div>
        );

      case 'studentId':
        return <Badge variant="outline" className="font-mono text-xs bg-gray-50 text-gray-700 border-gray-200">{item.studentId || item.id}</Badge>;

      case 'classInfo':
        let displayClassName = '';
        if (item.className) {
            if (typeof item.className === 'object') {
                displayClassName = item.className[currentLanguage] || item.className.en || '';
            } else {
                displayClassName = item.className;
            }
        }

        return (
          <div className="flex flex-col">
            {displayClassName ? (
              <>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {displayClassName}
                  {item.section && <span className="ml-1 text-xs text-gray-500">({item.section})</span>}
                </span>
                <span className="text-xs text-gray-500">{t('students.form.rollNumber')}: {item.rollNumber || '-'}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400 italic">{t('common.unassigned')}</span>
            )}
          </div>
        );

      case 'phone':
        return (
          <div className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {item.phoneNumber ? <><Phone className="w-3 h-3" /> {item.phoneNumber}</> : <span className="text-gray-400">-</span>}
          </div>
        );

      case 'status':
        const status = item.enrollmentStatus || 'unassigned'; 
        const statusConfig = {
          active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
          unassigned: { bg: 'bg-red-100', text: 'text-red-700', label: 'Unassigned' }, 
          inactive: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Inactive' },
          graduated: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Graduated' },
          withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Withdrawn' },
        };
        const config = statusConfig[status] || statusConfig.unassigned;
        return <Badge className={`${config.bg} ${config.text} border-0 capitalize whitespace-nowrap`}>{config.label}</Badge>;

      case 'actions':
        const isUnassigned = item.enrollmentStatus === 'unassigned' || !item.className;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              
              {isUnassigned && onAssign && (
                <>
                  <DropdownMenuItem onClick={() => onAssign(item)} className="text-blue-600 focus:text-blue-700 focus:bg-blue-50">
                    <GraduationCap className="h-4 w-4 mr-2" /> {isRTL ? 'تعيين فصل' : 'Assign Class'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye className="h-4 w-4 mr-2" /> {t('common.view')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-2" /> {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(item.id || item._id)} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" /> {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      default:
        return null;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="students"
      title="students.studentMembers"
      emptyState={{ icon: User, title: 'students.noStudentsFound', description: 'students.noStudentsDesc' }}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      showSearch={true}
      
      filters={filters}
      onFilterChange={onFilterChange}
      showFilters={true}
      
      showPagination={true}
      isLoading={loading}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
};

export default StudentTable;