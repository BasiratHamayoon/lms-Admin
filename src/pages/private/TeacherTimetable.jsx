import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { 
  fetchTodayOverview, 
  fetchWeeklyTimetable, 
  downloadTimetablePDF 
} from '../../redux/actions/teacherTimetable'; 

import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import TeacherTimetableTable from '@maincomponents/tables/TeacherTimetableTable';
import { Badge } from '../../maincomponents/components/ui/badge';
import { Card, CardContent } from '../../maincomponents/components/ui/card';
import { Button } from '../../maincomponents/components/ui/button';
import ViewTeacherTimetableClassModal from '@maincomponents/modal/viewModals/ViewTeacherTimetableClassModal';
import { Calendar, Clock, BookOpen, MapPin, Bell, Download } from 'lucide-react';
import { ANIMATION_CONFIG } from '@data/Constants';

const TeacherTimetable = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  const { 
    todayOverview, 
    weeklyTimetable, 
    loading, 
    exportLoading 
  } = useSelector((state) => state.teacherTimetable);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeTab, setActiveTab] = useState('weekly');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchTodayOverview());
    dispatch(fetchWeeklyTimetable());
  }, [dispatch]);

  const todayDateString = new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const transformedClasses = useMemo(() => {
    if (!weeklyTimetable) return [];

    const days = Object.keys(weeklyTimetable);
    const flatList = [];

    days.forEach((day) => {
      weeklyTimetable[day].forEach((cls) => {
        const start = new Date(cls.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const end = new Date(cls.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        flatList.push({
          id: cls.id,
          day: day,
          time: `${start} - ${end}`,
          startTimeRaw: cls.startTime,
          endTimeRaw: cls.endTime,
          subject: cls.courseName,
          subjectCode: cls.courseCode,
          grade: cls.className, 
          section: cls.section,
          room: cls.room || 'N/A',
          type: cls.type || 'lecture',
          status: cls.disabled ? 'completed' : 'upcoming',
          date: new Date().toISOString() 
        });
      });
    });
    return flatList;
  }, [weeklyTimetable]);

  const filteredClasses = useMemo(() => {
    let filtered = transformedClasses;

    if (activeTab === 'today') {
      const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      filtered = filtered.filter(cls => cls.day === todayDayName);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cls =>
        cls.subject?.toLowerCase().includes(term) ||
        cls.grade?.toLowerCase().includes(term) ||
        cls.subjectCode?.toLowerCase().includes(term)
      );
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(cls => {
          if (key === 'day') return cls.day === value;
          if (key === 'subject') return cls.subject === value;
          if (key === 'grade') return cls.grade === value;
          if (key === 'type') return cls.type === value;
          if (key === 'status') return cls.status === value;
          return true;
        });
      }
    });

    return filtered;
  }, [transformedClasses, activeTab, searchTerm, filters]);

  const paginatedClasses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredClasses.slice(startIndex, endIndex);
  }, [filteredClasses, currentPage, pageSize]);

  const statsCards = useMemo(() => [
    {
      key: 'totalClasses',
      title: 'teacherTimetable.totalClasses',
      value: todayOverview?.totalClasses || 0,
      icon: Calendar,
      color: 'blue',
    },
    {
      key: 'todayClasses',
      title: 'teacherTimetable.todayClasses',
      value: todayOverview?.classesTaken || 0,
      icon: Clock,
      color: 'green',
    },
    {
      key: 'subjects',
      title: 'teacherTimetable.subjects',
      value: new Set(transformedClasses.map(c => c.subject)).size,
      icon: BookOpen,
      color: 'purple',
    },
    {
      key: 'remainingToday',
      title: 'teacherTimetable.remainingToday',
      value: todayOverview?.remainingClasses || 0,
      icon: MapPin,
      color: 'teal',
    }
  ], [todayOverview, transformedClasses]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
    setCurrentPage(1);
  };

  const dynamicFilters = useMemo(() => {
    return {
      day: ['all', ...new Set(transformedClasses.map(item => item.day).filter(Boolean))],
      subject: ['all', ...new Set(transformedClasses.map(item => item.subject).filter(Boolean))],
      grade: ['all', ...new Set(transformedClasses.map(item => item.grade).filter(Boolean))],
      type: ['all', ...new Set(transformedClasses.map(item => item.type).filter(Boolean))],
      status: ['all', ...new Set(transformedClasses.map(item => item.status).filter(Boolean))]
    };
  }, [transformedClasses]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title={t('sidebar.timetable')}
          description={t('teacherTimetable.pageDescription')}
          isRTL={isRTL}
        />
        <Button 
          onClick={() => dispatch(downloadTimetablePDF())} 
          disabled={exportLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {exportLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          )}
          {t('common.exportPDF') || "Export PDF"}
        </Button>
      </div>

      {/* Today's Date Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('teacherTimetable.today')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {todayDateString}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/80 dark:bg-gray-800/80 px-4 py-2">
                <Bell className="w-4 h-4 mr-2" />
                {todayOverview?.totalClasses || 0} {t('teacherTimetable.classesToday')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast } }
        }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <StatsCard
              title={t(stat.title)}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              delay={index * ANIMATION_CONFIG.stagger.fast}
              isRTL={isRTL}
              loading={loading}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {['weekly', 'today'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
                setFilters({});
              }}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t(`teacherTimetable.${tab}Schedule`)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table with Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TeacherTimetableTable
          data={paginatedClasses}
          onView={(item) => {
            setSelectedClass(item);
            setViewModalOpen(true);
          }}
          isRTL={isRTL}
          currentLanguage={currentLanguage}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          loading={loading}
          showPagination={true}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={filteredClasses.length}
          totalPages={Math.ceil(filteredClasses.length / pageSize)}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          dynamicFilters={dynamicFilters}
        />
      </motion.div>

      {/* View Class Modal */}
      <ViewTeacherTimetableClassModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedClass(null);
        }}
        data={selectedClass}
        isRTL={isRTL}
        currentLanguage={currentLanguage}
        loading={false}
      />
    </div>
  );
};

export default TeacherTimetable;