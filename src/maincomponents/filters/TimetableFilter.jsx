// src/maincomponents/filters/TimetableFilter.jsx
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BaseFilter from './BaseFilter';

const TimetableFilter = ({
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

  // Get dynamic filter options from data or use provided dynamicFilters
  const filterOptions = useMemo(() => {
    const options = {
      day: ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      subject: [],
      teacher: [],
      grade: [],
      room: []
    };

    // If dynamicFilters are provided, use them
    if (Object.keys(dynamicFilters).length > 0) {
      return dynamicFilters;
    }

    if (data.length > 0) {
      // Get unique subjects
      const uniqueSubjects = [...new Set(data.map(item => item.subject).filter(Boolean))];
      options.subject = ['all', ...uniqueSubjects];
      
      // Get unique teachers
      const uniqueTeachers = [...new Set(data.map(item => item.teacher || item.teacherName).filter(Boolean))];
      options.teacher = ['all', ...uniqueTeachers];
      
      // Get unique grades
      const uniqueGrades = [...new Set(data.map(item => item.grade).filter(Boolean))];
      options.grade = ['all', ...uniqueGrades];
      
      // Get unique rooms
      const uniqueRooms = [...new Set(data.map(item => item.room).filter(Boolean))];
      options.room = ['all', ...uniqueRooms];
    }

    return options;
  }, [data, dynamicFilters]);

  // Timetable filter configuration
  const filterConfig = [
    { 
      key: 'day', 
      label: 'timetable.day', 
      options: filterOptions.day || ['all', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
    },
    { 
      key: 'subject', 
      label: 'timetable.subject', 
      options: filterOptions.subject || [] 
    },
    { 
      key: 'teacher', 
      label: 'timetable.teacher', 
      options: filterOptions.teacher || [] 
    },
    { 
      key: 'grade', 
      label: 'timetable.grade', 
      options: filterOptions.grade || [] 
    },
    { 
      key: 'room', 
      label: 'timetable.room', 
      options: filterOptions.room || [] 
    }
  ];

  // Function to get translated option labels
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
      'subject': {},
      'teacher': {},
      'grade': {
        '1st Grade': t('students.grade.1st Grade'),
        '2nd Grade': t('students.grade.2nd Grade'),
        '3rd Grade': t('students.grade.3rd Grade'),
        '4th Grade': t('students.grade.4th Grade'),
        '5th Grade': t('students.grade.5th Grade'),
        '6th Grade': t('students.grade.6th Grade')
      },
      'room': {}
    };
    
    // Return translated label if exists, otherwise return the option itself
    return translationMap[filterKey]?.[option] || option;
  };

  // Timetable-specific colors
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

export default TimetableFilter;