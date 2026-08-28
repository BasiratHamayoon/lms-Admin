import React, { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@maincomponents/components/ui/avatar';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import BaseTable from './BaseTable';
import {
  User,
  BookOpen,
  Award,
  TrendingUp,
  BarChart,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  FileText,
  Archive
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@maincomponents/components/ui/dropdown-menu';

const GradeTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  showPagination = true,
  isRTL = false,
  currentLanguage = 'en',
  searchTerm = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  totalItems = 0,
  totalPages = 0,
  dynamicFilters = {},
  loading = false,
  selectedIds = [],
  onSelectionChange,
  serverSidePagination = false
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || currentLanguage || 'en';

  /**
   * Get localized name from various name formats
   */
  const getLocalizedName = useCallback((nameObj) => {
    if (!nameObj) return t('common.unknown');

    if (typeof nameObj === 'string') return nameObj;

    if (nameObj.en || nameObj.ar) {
      const localizedName = isRTL ? (nameObj.ar || nameObj.en) : (nameObj.en || nameObj.ar);

      if (typeof localizedName === 'string') return localizedName;

      if (localizedName && typeof localizedName === 'object') {
        const firstName = localizedName.firstName || '';
        const lastName = localizedName.lastName || '';
        return `${firstName} ${lastName}`.trim() || t('common.unknown');
      }
    }

    if (nameObj.firstName || nameObj.lastName) {
      return `${nameObj.firstName || ''} ${nameObj.lastName || ''}`.trim();
    }

    return t('common.unknown');
  }, [isRTL, t]);

  /**
   * Get student display name from student object
   */
  const getStudentName = useCallback((student) => {
    if (!student) return t('common.unknown');

    if (student.displayName) return student.displayName;

    if (student.name) {
      return getLocalizedName(student.name);
    }

    return student.email || t('common.unknown');
  }, [getLocalizedName, t]);

  /**
   * Get course/subject display name
   */
  const getCourseName = useCallback((item) => {
    if (item.subject && typeof item.subject === 'string') {
      return item.subject;
    }

    if (item.subject && typeof item.subject === 'object') {
      return getLocalizedName(item.subject.name) || item.subject.code || t('common.unknown');
    }

    if (item.course) {
      if (typeof item.course === 'string') return item.course;
      return getLocalizedName(item.course.name) || item.course.code || t('common.unknown');
    }

    if (item.courseId) {
      if (typeof item.courseId === 'string') return item.courseId;
      return getLocalizedName(item.courseId.name) || item.courseId.code || t('common.unknown');
    }

    return t('common.unknown');
  }, [getLocalizedName, t]);

  /**
   * Get course code
   */
  const getCourseCode = useCallback((item) => {
    if (item.subjectCode) return item.subjectCode;

    if (item.course?.code) return item.course.code;

    if (item.courseId?.code) return item.courseId.code;

    return '';
  }, []);

  /**
   * Get class display name
   */
  const getClassName = useCallback((item) => {
    if (item.class) {
      if (typeof item.class === 'string') return item.class;
      const name = getLocalizedName(item.class.name);
      const section = item.class.section ? ` - ${getLocalizedName(item.class.section)}` : '';
      return `${name}${section}`.trim();
    }

    if (item.classId) {
      if (typeof item.classId === 'string') return item.classId;
      const name = getLocalizedName(item.classId.name);
      const section = item.classId.section ? ` - ${item.classId.section}` : '';
      return `${name}${section}`.trim();
    }

    return '';
  }, [getLocalizedName]);

  /**
   * Get student ID code
   */
  const getStudentId = useCallback((student) => {
    if (!student) return '';
    return student.id || student.studentId || '';
  }, []);

  /**
   * Get user initials for avatar
   */
  const getUserInitials = useCallback((name) => {
    if (!name || name === t('common.unknown')) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }, [t]);

  const columns = [
    { key: 'index', label: '#', width: 'w-12', align: 'center' },
    { key: 'student', label: 'grade.form.student', width: 'min-w-[220px]', align: isRTL ? 'right' : 'left' },
    { key: 'course', label: 'grade.form.course', width: 'min-w-[180px]', align: isRTL ? 'right' : 'left' },
    { key: 'academicInfo', label: 'grade.academicInfo', width: 'min-w-[150px]', align: 'center' },
    { key: 'marks', label: 'grade.form.marks', width: 'min-w-[140px]', align: 'center' },
    { key: 'grade', label: 'grade.form.grade', width: 'min-w-[100px]', align: 'center' },
    { key: 'status', label: 'grade.form.status', width: 'min-w-[120px]', align: 'center' },
    { key: 'actions', label: 'common.actions', width: 'w-20', align: 'center' }
  ];

  const colors = {
    primary: 'from-blue-500 to-blue-600',
    gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
    badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
  };

  const emptyState = {
    icon: Award,
    title: 'grade.noGradesFound',
    description: 'grade.noGradesDesc'
  };

  const filterColors = {
    activeBg: 'bg-blue-50 dark:bg-blue-900/20',
    activeText: 'text-blue-700 dark:text-blue-300',
    activeBorder: 'border-blue-200 dark:border-blue-700',
    badge: 'bg-blue-500'
  };

  // Static filter options (not dependent on current data for server-side)
  const filterOptions = useMemo(() => {
    if (Object.keys(dynamicFilters).length > 0) return dynamicFilters;

    return {
      status: ['all', 'draft', 'published', 'archived'],
      term: ['all', 'first', 'second', 'third', 'fourth', 'summer', 'final'],
      academicYear: ['all', '2024-2025', '2023-2024', '2022-2023', '2021-2022'],
      grade: ['all', 'A+', 'A', 'B', 'C', 'D', 'F']
    };
  }, [dynamicFilters]);

  const filterConfig = [
    { key: 'status', label: 'common.status', options: filterOptions.status },
    { key: 'term', label: 'grade.form.term', options: filterOptions.term },
    { key: 'academicYear', label: 'grade.form.academicYear', options: filterOptions.academicYear },
    // { key: 'grade', label: 'grade.form.grade', options: filterOptions.grade }
  ];

  const getStatusColor = (status) => {
    const map = {
      draft: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
      published: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300',
      archived: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300'
    };
    return map[status] || map.draft;
  };

  const getStatusIcon = (status) => {
    const map = {
      draft: Clock,
      published: CheckCircle,
      archived: Archive
    };
    return map[status] || Clock;
  };

  const getGradeColor = (grade) => {
    const map = {
      'A+': 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200',
      'A': 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200',
      'B': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200',
      'C': 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-200',
      'D': 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-200',
      'F': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200'
    };
    return map[grade] || 'bg-gray-100 text-gray-800';
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 70) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderCell = (item, column, index) => {
    const student = item.student || item.studentId;
    const studentName = getStudentName(student);
    const studentCode = getStudentId(student);
    const studentAvatar = student?.avatar;

    const courseName = getCourseName(item);
    const courseCode = getCourseCode(item);
    const className = getClassName(item);

    // Calculate the correct index for server-side pagination
    const displayIndex = serverSidePagination
      ? (currentPage - 1) * pageSize + index + 1
      : index + 1;

    switch (column.key) {
      case 'index':
        return (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {displayIndex}
          </span>
        );

      case 'student':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-700 shadow-sm">
              {studentAvatar ? (
                <AvatarImage src={studentAvatar} alt={studentName} />
              ) : null}
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                {getUserInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {studentName}
              </p>
              {studentCode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {studentCode}
                </p>
              )}
              {className && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  {className}
                </p>
              )}
            </div>
          </div>
        );

      case 'course':
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <p className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                {courseName}
              </p>
              {courseCode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {courseCode}
                </p>
              )}
            </div>
          </div>
        );

      case 'academicInfo':
        return (
          <div className="text-center space-y-1.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white block">
              {item.academicYear || '-'}
            </span>
            <Badge
              variant="outline"
              className="text-xs font-medium px-2.5 py-0.5 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
            >
              {t(`grade.terms.${item.term}`) || item.term}
            </Badge>
          </div>
        );

      case 'marks':
        const percentage = item.percentage ? Number(item.percentage) : 0;
        return (
          <div className="text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5">
              <TrendingUp className={`w-4 h-4 ${getPercentageColor(percentage)}`} />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {item.obtainedMarks ?? 0}/{item.totalMarks ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <BarChart className={`w-3.5 h-3.5 ${getPercentageColor(percentage)}`} />
              <span className={`text-sm font-semibold ${getPercentageColor(percentage)}`}>
                {percentage.toFixed(1)}%
              </span>
            </div>
            {item.assessments && item.assessments.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.assessments.length} {t('grade.assessments')}
              </div>
            )}
          </div>
        );

      case 'grade':
        return (
          <div className="flex justify-center">
            <Badge
              className={`text-sm px-4 py-1.5 font-bold shadow-sm ${getGradeColor(item.grade)}`}
            >
              {item.grade || '-'}
            </Badge>
          </div>
        );

      case 'status':
        const StatusIcon = getStatusIcon(item.status);
        return (
          <div className="flex justify-center">
            <Badge
              variant="secondary"
              className={`text-xs px-3 py-1.5 font-semibold border ${getStatusColor(item.status)} flex items-center gap-1.5`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{t(`grade.status.${item.status}`) || item.status}</span>
            </Badge>
          </div>
        );

      case 'actions':
        return (
          <div className={`flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align={isRTL ? "start" : "end"}
                className="w-48"
              >
                {onView && (
                  <DropdownMenuItem
                    onClick={() => onView(item)}
                    className="cursor-pointer"
                  >
                    <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('common.view')}
                  </DropdownMenuItem>
                )}

                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(item)}
                    className="cursor-pointer"
                  >
                    <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('common.edit')}
                  </DropdownMenuItem>
                )}

                {item.status === 'draft' && onPublish && (
                  <DropdownMenuItem
                    onClick={() => onPublish(item)}
                    className="cursor-pointer text-green-600 dark:text-green-400"
                  >
                    <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('grade.actions.publish')}
                  </DropdownMenuItem>
                )}

                {item.status === 'published' && onArchive && (
                  <DropdownMenuItem
                    onClick={() => onArchive(item)}
                    className="cursor-pointer text-blue-600 dark:text-blue-400"
                  >
                    <Archive className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('grade.actions.archive')}
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item._id)}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                    >
                      <Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );

      default:
        return <span className="text-sm text-gray-600">{item[column.key] ?? '-'}</span>;
    }
  };

  const getOptionLabel = (key, opt) => {
    if (opt === 'all') return t('common.all');

    switch (key) {
      case 'status':
        return t(`grade.status.${opt}`) || opt;
      case 'term':
        return t(`grade.terms.${opt}`) || opt;
      case 'grade':
        return opt;
      default:
        return opt;
    }
  };

  return (
    <BaseTable
      data={data}
      columns={columns}
      renderCell={renderCell}
      type="grade"
      title="grade.gradesManagement"
      colors={colors}
      emptyState={emptyState}
      isRTL={isRTL}
      currentLanguage={lang}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      filters={filters}
      onFilterChange={onFilterChange}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      totalItems={totalItems}
      totalPages={totalPages}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      serverSidePagination={serverSidePagination}
    />
  );
};

export default GradeTable;