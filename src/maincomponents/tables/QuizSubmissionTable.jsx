import React, { useCallback, memo, useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@maincomponents/components/ui/badge';
import { Button } from '@maincomponents/components/ui/button';
import { Avatar, AvatarFallback } from '@maincomponents/components/ui/avatar';
import BaseTable from './BaseTable';
import { FileText, CheckCircle, Clock, BarChart3, BookOpen, Edit } from 'lucide-react';

const QuizSubmissionTable = ({
  data = [],
  onGrade,
  isRTL = false,
  loading = false,
  currentLanguage = 'en',
  showPagination = true,
  
  filters: externalFilters,
  onFilterChange: externalOnFilterChange,
  pagination: externalPagination,
  onPageChange: externalOnPageChange,
  onPageSizeChange: externalOnPageSizeChange,
  ...props
}) => {
  const { t } = useTranslation();

  
  const isExternallyControlled = Boolean(externalOnFilterChange);

  
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState({ status: 'all' });
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(10);
  
  const debounceRef = useRef(null);

  
  const searchTerm = isExternallyControlled 
    ? (externalFilters?.search || '') 
    : localSearchTerm;
  const filters = isExternallyControlled 
    ? externalFilters 
    : localFilters;
  const currentPage = isExternallyControlled 
    ? (externalPagination?.currentPage || 1) 
    : localCurrentPage;
  const pageSize = isExternallyControlled 
    ? (externalPagination?.limit || 10) 
    : localPageSize;

  
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  
  const getDisplayName = useCallback((name) => {
    if (!name) return t('common.unknownStudent');
    
    if (typeof name === 'string') return name;
    
    if (typeof name === 'object') {
      if (name[currentLanguage]?.firstName) {
        const langName = name[currentLanguage];
        return `${langName.firstName || ''} ${langName.lastName || ''}`.trim();
      }
      
      const fallbackLang = currentLanguage === 'ar' ? 'en' : 'ar';
      if (name[fallbackLang]?.firstName) {
        const langName = name[fallbackLang];
        return `${langName.firstName || ''} ${langName.lastName || ''}`.trim();
      }
      
      if (currentLanguage === 'ar') {
        return name.ar || name.en || t('common.unknownStudent');
      }
      return name.en || name.ar || t('common.unknownStudent');
    }
    
    return t('common.unknownStudent');
  }, [currentLanguage, t]);

  
  const getUserInitials = useCallback((name) => {
    if (!name) return 'ST';
    
    if (typeof name === 'string') {
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    
    if (typeof name === 'object') {
      if (name[currentLanguage]?.firstName) {
        const firstName = name[currentLanguage].firstName;
        const lastName = name[currentLanguage].lastName || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'ST';
      }
      
      const displayName = currentLanguage === 'ar' 
        ? (name.ar || name.en) 
        : (name.en || name.ar);
      
      if (displayName) {
        return displayName.substring(0, 2).toUpperCase();
      }
    }
    
    return 'ST';
  }, [currentLanguage]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [currentLanguage]);

  const formatTime = useCallback((dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    
    return date.toLocaleTimeString(locale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, [currentLanguage]);

  const getQuizTitle = useCallback((item) => {
    if (item?.quizTitle) {
      if (typeof item.quizTitle === 'string') return item.quizTitle;
      
      if (typeof item.quizTitle === 'object') {
        if (currentLanguage === 'ar') {
          return item.quizTitle.ar || item.quizTitle.en || '-';
        }
        return item.quizTitle.en || item.quizTitle.ar || '-';
      }
    }
    
    if (item?.quiz?.title) {
      if (typeof item.quiz.title === 'string') return item.quiz.title;
      
      if (typeof item.quiz.title === 'object') {
        if (currentLanguage === 'ar') {
          return item.quiz.title.ar || item.quiz.title.en || '-';
        }
        return item.quiz.title.en || item.quiz.title.ar || '-';
      }
    }
    
    return '-';
  }, [currentLanguage]);

  const getClassName = useCallback((item) => {
    if (item?.className) {
      if (typeof item.className === 'string') return item.className;
      
      if (typeof item.className === 'object') {
        if (currentLanguage === 'ar') {
          return item.className.ar || item.className.en || '';
        }
        return item.className.en || item.className.ar || '';
      }
    }
    
    if (item?.quiz?.classId?.name) {
      return getDisplayName(item.quiz.classId.name);
    }
    
    return '';
  }, [currentLanguage, getDisplayName]);

  
  const handleSearchChange = useCallback((value) => {
    if (isExternallyControlled) {
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      
      setLocalSearchTerm(value);
      
      
      debounceRef.current = setTimeout(() => {
        externalOnFilterChange?.({ ...externalFilters, search: value });
      }, 500);
    } else {
      setLocalSearchTerm(value);
      setLocalCurrentPage(1); 
    }
  }, [isExternallyControlled, externalOnFilterChange, externalFilters]);

  
  const handleFilterChange = useCallback((newFilters) => {
    if (isExternallyControlled) {
      externalOnFilterChange?.({ ...externalFilters, ...newFilters });
    } else {
      setLocalFilters(prev => ({ ...prev, ...newFilters }));
      setLocalCurrentPage(1); 
    }
  }, [isExternallyControlled, externalOnFilterChange, externalFilters]);

  
  const handlePageChange = useCallback((page) => {
    if (isExternallyControlled) {
      externalOnPageChange?.(page);
    } else {
      setLocalCurrentPage(page);
    }
  }, [isExternallyControlled, externalOnPageChange]);

  
  const handlePageSizeChange = useCallback((size) => {
    if (isExternallyControlled) {
      externalOnPageSizeChange?.(size);
    } else {
      setLocalPageSize(size);
      setLocalCurrentPage(1);
    }
  }, [isExternallyControlled, externalOnPageSizeChange]);

const columns = useMemo(() => [
      { 
        key: 'student', 
        label: t('students.name'), 
        width: 'min-w-[220px]', 
        align: isRTL ? 'right' : 'left' 
      },
      { 
        key: 'quizTitle', 
        label: t('quizzes.quizTitle'), 
        width: 'min-w-[200px]', 
        align: isRTL ? 'right' : 'left' 
      },
      { 
        key: 'submissionInfo', 
        label: t('common.submitted'), 
        width: 'min-w-[150px]', 
        align: 'center' 
      },
      { 
        key: 'status', 
        label: t('common.status'), 
        width: 'min-w-[130px]', 
        align: 'center' 
      },
      { 
        key: 'marks', 
        label: t('common.marks'), 
        width: 'min-w-[120px]', 
        align: 'center' 
      }
    ],
    
    
    // if (onGrade) {
    //   cols.push({ 
    //     key: 'actions', 
    //     label: t('common.actions'), 
    //     width: 'w-24', 
    //     align: 'center' 
    //   });
    // }
 [isRTL]);

  const colors = {
    primary: 'from-green-500 to-green-600',
    gradient: 'bg-gradient-to-r from-green-500 to-green-600',
    badge: 'bg-gradient-to-r from-green-500 to-green-600'
  };

  const emptyState = {
    icon: BarChart3,
    title: t('quizzes.noSubmissions'),
    description: t('quizzes.waitingForStudents')
  };

  
  
  
  
  
  
  

  const getOptionLabel = useCallback((filterKey, option) => {
    if (option === 'all') return t('common.all');
    return t(`status.${option}`);
  }, [t]);

  const filterColors = {
    activeBg: 'bg-green-50 dark:bg-green-900/20',
    activeText: 'text-green-700 dark:text-green-300',
    activeBorder: 'border-green-200 dark:border-green-700',
    badge: 'bg-green-500'
  };

  const getStatusStyle = useCallback((status) => {
    switch (status) {
      case 'graded':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300', 
          icon: CheckCircle 
        };
      case 'submitted':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300', 
          icon: FileText 
        };
      case 'pending':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300', 
          icon: Clock 
        };
      default:
        return { color: 'bg-gray-100 dark:bg-gray-800', icon: FileText };
    }
  }, []);

  const getMarksPercentage = useCallback((totalMarks, maxMarks) => {
    if (totalMarks == null || maxMarks == null || maxMarks === 0) return null;
    return Math.round((totalMarks / maxMarks) * 100);
  }, []);

  const getMarksColor = useCallback((percentage) => {
    if (percentage === null) return 'text-gray-400';
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }, []);

  const renderCell = useCallback((item, column) => {
    switch (column.key) {
      case 'student':
        const studentName = getDisplayName(item.student?.name);
        const initials = getUserInitials(item.student?.name);
        
        return (
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className={isRTL ? 'text-left' : ''}>
              <p className="font-semibold text-sm text-gray-900 dark:text-white leading-tight">
                {studentName}
              </p>
              {item.student?.email && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5" dir="ltr">
                  {item.student.email}
                </p>
              )}
            </div>
          </div>
        );

      case 'quizTitle':
        const quizTitle = getQuizTitle(item);
        const className = getClassName(item);
        
        return (
          <div className={isRTL ? 'text-left' : ''}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <BookOpen className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                {quizTitle}
              </p>
            </div>
            {className && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {className}
              </p>
            )}
          </div>
        );

      case 'submissionInfo':
        return (
          <div className="flex flex-col items-center">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(item.submittedAt)}
            </span>
            {item.submittedAt && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formatTime(item.submittedAt)}
              </span>
            )}
          </div>
        );

      case 'status':
        const style = getStatusStyle(item.status);
        const Icon = style.icon;
        return (
          <Badge className={`flex items-center justify-center gap-1.5 border px-3 py-1 ${style.color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="font-medium">{t(`status.${item.status}`)}</span>
          </Badge>
        );

      case 'marks':
        const percentage = getMarksPercentage(item.totalMarks, item.maxMarks);
        const marksColor = getMarksColor(percentage);
        
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-baseline gap-0.5">
              <span className={`text-md font-bold ${marksColor}`}>
                {item.totalMarks ?? '-'}
              </span>
              <span className="text-md text-gray-500 dark:text-gray-400">
                /{item.maxMarks || 100}
              </span>
            </div>
            {percentage !== null && (
              <span className={`text-xs font-medium ${marksColor}`}>
                ({percentage}%)
              </span>
            )}
          </div>
        );

      // case 'actions':
      //   const canGrade = item.status === 'submitted' || item.status === 'pending';
      //   const isGraded = item.status === 'graded';
        
      //   return (
      //     <div className="flex justify-center">
      //       <Button
      //         variant={isGraded ? "outline" : "default"}
      //         size="sm"
      //         onClick={() => onGrade?.(item)}
      //         className={isGraded 
      //           ? "border-green-500 text-green-600 hover:bg-green-50" 
      //           : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      //         }
      //       >
      //         <Edit className="w-3.5 h-3.5 mr-1" />
      //         {isGraded ? t('common.editGrade') : t('common.grade')}
      //       </Button>
      //     </div>
      //   );

      // default:
      //   return null;
    }
  }, [
    isRTL, 
    getDisplayName, 
    getUserInitials, 
    getQuizTitle, 
    getClassName,
    formatDate, 
    formatTime, 
    getStatusStyle, 
    getMarksPercentage,
    getMarksColor,
    onGrade,
    t
  ]);

  
  const filteredData = useMemo(() => {
    if (isExternallyControlled) {
      return data; 
    }

    let result = [...data];

    
    if (localSearchTerm) {
      const term = localSearchTerm.toLowerCase();
      result = result.filter(item => {
        const studentName = getDisplayName(item.student?.name).toLowerCase();
        const email = item.student?.email?.toLowerCase() || '';
        const quizTitle = getQuizTitle(item).toLowerCase();
        const className = getClassName(item).toLowerCase();
        
        return studentName.includes(term) || 
               email.includes(term) || 
               quizTitle.includes(term) ||
               className.includes(term);
      });
    }

    
    if (localFilters.status && localFilters.status !== 'all') {
      result = result.filter(item => item.status === localFilters.status);
    }

    return result;
  }, [data, localSearchTerm, localFilters, getDisplayName, getQuizTitle, getClassName, isExternallyControlled]);

  
  const paginatedData = useMemo(() => {
    if (isExternallyControlled) {
      return data; 
    }
    
    const start = (localCurrentPage - 1) * localPageSize;
    return filteredData.slice(start, start + localPageSize);
  }, [data, filteredData, localCurrentPage, localPageSize, isExternallyControlled]);

  
  const totalItems = isExternallyControlled 
    ? (externalPagination?.total || data.length)
    : filteredData.length;
  
  const totalPages = isExternallyControlled
    ? (externalPagination?.totalPages || Math.ceil(totalItems / pageSize))
    : Math.ceil(filteredData.length / localPageSize);

  return (
    <BaseTable
      data={paginatedData}
      columns={columns}
      renderCell={renderCell}
      type="quiz-submissions"
      title={t('quizzes.submissions')}
      colors={colors}
      isRTL={isRTL}
      currentLanguage={currentLanguage}
      emptyState={emptyState}
      
      searchTerm={isExternallyControlled ? localSearchTerm : searchTerm}
      onSearchChange={handleSearchChange}
      searchPlaceholder={t('quizzes.searchSubmissions')}
      filters={localFilters}
      onFilterChange={handleFilterChange}
      showSearch={true}
      showFilters={true}
      showPagination={showPagination}
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
      isLoading={loading}
      {...props}
    />
  );
};

export default memo(QuizSubmissionTable);