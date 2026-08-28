import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const TeacherTimetableFilter = ({
  data = [],
  filters = {},
  onFilterChange,
  onSearchChange,
  searchTerm = '',
  isRTL = false,
  showSearch = true,
  showFilters = true,
  dynamicFilters = {}
}) => {
  const { t } = useTranslation();

  const filterOptions = useMemo(() => {
    const options = {
      day: ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      subject: [],
      grade: [],
      type: [],
      status: []
    };

    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      const uniqueSubjects = [...new Set(data.map(item => item.subject).filter(Boolean))];
      options.subject = ['all', ...uniqueSubjects];
      
      const uniqueGrades = [...new Set(data.map(item => item.grade).filter(Boolean))];
      options.grade = ['all', ...uniqueGrades];
      
      const uniqueTypes = [...new Set(data.map(item => item.type).filter(Boolean))];
      options.type = ['all', ...uniqueTypes];
      
      const uniqueStatuses = [...new Set(data.map(item => item.status).filter(Boolean))];
      options.status = ['all', ...uniqueStatuses];
    }

    return options;
  }, [data, dynamicFilters]);

  const filterConfig = [
    { 
      key: 'day', 
      label: 'teacherTimetable.day', 
      options: filterOptions.day || ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
    },
    { 
      key: 'subject', 
      label: 'teacherTimetable.subject', 
      options: filterOptions.subject || [] 
    },
    { 
      key: 'grade', 
      label: 'teacherTimetable.grade', 
      options: filterOptions.grade || [] 
    },
    { 
      key: 'type', 
      label: 'teacherTimetable.type', 
      options: filterOptions.type || [] 
    },
    { 
      key: 'status', 
      label: 'teacherTimetable.status', 
      options: filterOptions.status || [] 
    }
  ];

  const getOptionLabel = (filterKey, option) => {
    if (option === 'all') return t('common.all');
    
    const translationMap = {
      'day': {
        'Monday': t('timetable.days.monday'),
        'Tuesday': t('timetable.days.tuesday'),
        'Wednesday': t('timetable.days.wednesday'),
        'Thursday': t('timetable.days.thursday'),
        'Friday': t('timetable.days.friday'),
        'Saturday': t('timetable.days.saturday'),
        'Sunday': t('timetable.days.sunday')
      },
      'subject': {
        'Mathematics': t('teacherTimetable.subjects.mathematics'),
        'Advanced Mathematics': t('teacherTimetable.subjects.advancedMath'),
        'Computer Science': t('teacherTimetable.subjects.computerScience')
      },
      'grade': {
        '5th Grade': t('students.grade.5th Grade'),
        '6th Grade': t('students.grade.6th Grade'),
        '7th Grade': t('students.grade.7th Grade')
      },
      'type': {
        'lecture': t('timetable.type.lecture'),
        'lab': t('timetable.type.lab'),
        'practical': t('timetable.type.practical')
      },
      'status': {
        'completed': t('timetable.status.completed'),
        'ongoing': t('timetable.status.ongoing'),
        'upcoming': t('timetable.status.upcoming')
      }
    };
    
    return translationMap[filterKey]?.[option] || option;
  };

  const filterColors = {
    activeBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    activeText: 'text-indigo-700 dark:text-indigo-300',
    activeBorder: 'border-indigo-200 dark:border-indigo-700',
    badge: 'bg-indigo-500'
  };

  return (
    <BaseFilter
      filters={filters}
      onFilterChange={onFilterChange}
      onSearchChange={onSearchChange}
      searchTerm={searchTerm}
      isRTL={isRTL}
      showSearch={showSearch}
      showFilters={showFilters}
      filterConfig={filterConfig}
      getOptionLabel={getOptionLabel}
      filterColors={filterColors}
    />
  );
};

export default TeacherTimetableFilter;