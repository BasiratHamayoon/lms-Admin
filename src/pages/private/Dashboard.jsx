import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { ArrowRight, Users, Briefcase, BookOpen, Building } from 'lucide-react';

import StatsCard from '../../maincomponents/cards/StatsCard';
import RecentActivities from '../../maincomponents/dashboard/RecentActivities';
import QuickActions from '../../maincomponents/dashboard/QuickActions';
import PageHeader from '../../maincomponents/headerbar/PageHeader';
import QueryTable from '../../maincomponents/tables/QueryTable';
import ViewQueriesModal from '@maincomponents/modal/viewModals/ViewQueriesModal';
import ReplyModal from '@maincomponents/modal/ReplyModal';
import { useAppTranslation } from '../../hooks/use-translation';
import { quickActionsData } from '../../data/dashboard';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { Button } from '../../maincomponents/components/ui/button';
import {
  fetchDashboardQueryStats,
  fetchDashboardStats,
  fetchRecentActivities
} from '@redux/slice/dashboardSlice';
import { 
  replyToQuery, 
  deleteQuery, 
  fetchQueryDetails 
} from '../../redux/actions/queries';
import { clearDetails } from '@redux/slice/queriesSlice';

const Dashboard = () => {
  const { t, currentLanguage, i18n } = useAppTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { 
    queries: rawQueries, 
    stats, 
    recentActivitiesRaw,
    loadingStats, 
    loadingQueryStats, 
    loadingRecentActivities, 
    error
  } = useSelector(state => state.dashboard) || {};
  
  const { queryDetails, detailsLoading } = useSelector(state => state.queries) || {};

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [selectedQueryId, setSelectedQueryId] = useState(null); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const fetchDataTimeoutRef = useRef(null);

  useEffect(() => {
    if (fetchDataTimeoutRef.current) {
      clearTimeout(fetchDataTimeoutRef.current);
    }

    fetchDataTimeoutRef.current = setTimeout(() => {
      dispatch(fetchDashboardStats());
      dispatch(fetchDashboardQueryStats());
      dispatch(fetchRecentActivities());
    }, 300); // Debounce delay of 300ms

    return () => {
      if (fetchDataTimeoutRef.current) {
        clearTimeout(fetchDataTimeoutRef.current);
      }
    };
  }, [dispatch]);

  const queries = useMemo(() => {
    if (!Array.isArray(rawQueries)) return [];

    const lang = currentLanguage === 'ar' ? 'ar' : 'en';

    const getLocalizedContent = (content) => {
      if (!content) return '';
      if (typeof content === 'string') return content;
      const val = content[lang] || content.en || content.ar;
      if (typeof val === 'string') return val;
      if (val && typeof val === 'object' && val.firstName) {
        return `${val.firstName} ${val.lastName || ''}`.trim();
      }
      if (content.firstName) {
        return `${content.firstName} ${content.lastName || ''}`.trim();
      }
      return '';
    };

    return rawQueries.map(q => {
      const studentObj = q.student || q.studentId;
      const teacherObj = q.teacher || q.teacherId;
      const studentName = getLocalizedContent(studentObj?.name);
      const teacherName = getLocalizedContent(teacherObj?.name);
      const studentEmail = studentObj?.email || '';
      const teacherEmail = teacherObj?.email || '';
      const titleText = getLocalizedContent(q.title);
      const descriptionText = getLocalizedContent(q.description);
      const displayName = studentName || teacherName || studentEmail || teacherEmail || titleText || '—';

      return {
        id: q._id || q.id,
        name: displayName,
        email: studentEmail || teacherEmail || '',
        title: titleText,
        message: descriptionText,
        status: q.status || 'open',
        date: q.createdAt,
        course: q.course || 'N/A',
        type: q.type || 'general'
      };
    });
  }, [rawQueries, currentLanguage]);

  const statsCards = useMemo(() => {
    return [
      {
        key: 'students',
        title: 'dashboard.totalStudents',
        value: stats?.totalStudents || 0,
        icon: Users,
        color: 'blue',
        route: '/students'
      },
      {
        key: 'staff',
        title: 'dashboard.totalStaff',
        value: stats?.totalStaff || 0,
        icon: Briefcase,
        color: 'green',
        route: '/staff'
      },
      {
        key: 'courses',
        title: 'dashboard.totalCourses',
        value: stats?.totalCourses || 0,
        icon: BookOpen,
        color: 'purple',
        route: '/courses'
      },
      {
        key: 'departments',
        title: 'dashboard.totalDepartments',
        value: stats?.totalDepartments || 0,
        icon: Building,
        color: 'teal',
        route: '/departments'
      }
    ];
  }, [stats]);

  const recentActivities = useMemo(() => {
    if (!recentActivitiesRaw) return [];
    const lang = currentLanguage === 'ar' ? 'ar' : 'en';
    const now = Date.now();
    const list = [];

    const getText = (txt) => (typeof txt === 'string' ? txt : txt?.[lang] || txt?.en || '');

    (recentActivitiesRaw.students || []).forEach(s => {
      const created = new Date(s.createdAt).getTime();
      const hoursAgo = (now - created) / 36e5;
      list.push({
        type: 'student',
        message: getText(s.text),
        color: 'blue',
        hoursAgo,
        route: '/students',
        icon: Users
      });
    });

    (recentActivitiesRaw.staff || []).forEach(st => {
      const created = new Date(st.createdAt).getTime();
      const hoursAgo = (now - created) / 36e5;
      list.push({
        type: 'staff',
        message: getText(st.text),
        color: 'purple',
        hoursAgo,
        route: '/staff',
        icon: Briefcase
      });
    });

    (recentActivitiesRaw.courses || []).forEach(c => {
      const created = new Date(c.createdAt).getTime();
      const hoursAgo = (now - created) / 36e5;
      list.push({
        type: 'course',
        message: getText(c.text),
        color: 'green',
        hoursAgo,
        route: '/courses',
        icon: BookOpen
      });
    });

    (recentActivitiesRaw.departments || []).forEach(d => {
      const created = new Date(d.createdAt).getTime();
      const hoursAgo = (now - created) / 36e5;
      list.push({
        type: 'department',
        message: getText(d.text),
        color: 'orange',
        hoursAgo,
        route: '/departments',
        icon: Building
      });
    });

    return list.sort((a, b) => a.hoursAgo - b.hoursAgo);
  }, [recentActivitiesRaw, currentLanguage]);
  
  const handleViewQuery = (query) => {
    setSelectedQueryId(query.id);
    setSelectedQuery(query); 
    dispatch(fetchQueryDetails(query.id));
    setIsViewModalOpen(true);
  };

  const handleReplyQuery = (query) => {
    setSelectedQueryId(query.id);
    setSelectedQuery(query); 
    dispatch(fetchQueryDetails(query.id));
    setIsReplyModalOpen(true);
  };
  
  const handleDeleteQuery = async (queryId) => {
    try {
      await dispatch(deleteQuery(queryId)).unwrap();
      toast.success(t('queries.queryDeleted'));
      
      dispatch(fetchDashboardQueryStats());
    } catch (error) {
      console.error('Error deleting query:', error);
      toast.error(t('common.error'));
    }
  };

  const handleReplySubmit = async (queryId, replyMessage) => {
    try {
      await dispatch(replyToQuery({ id: queryId, message: replyMessage })).unwrap();
      toast.success(t('queries.replySent'));
      setIsReplyModalOpen(false);
      dispatch(clearDetails());
      
      dispatch(fetchDashboardQueryStats());
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(t('common.error'));
    }
  };
  
  const viewModalData = useMemo(() => {
    if (queryDetails) {
      return {
        ...queryDetails,
        id: queryDetails._id || queryDetails.id,
        name: queryDetails.student?.name || queryDetails.studentName || 'Unknown',
        email: queryDetails.student?.email || queryDetails.studentEmail || '',
        course: queryDetails.class 
          ? `${queryDetails.class.courseName} (${queryDetails.class.section})` 
          : queryDetails.course || 'N/A',
        message: queryDetails.description || queryDetails.message,
        date: queryDetails.createdAt,
        type: queryDetails.type || 'general',
        status: queryDetails.status || 'open',
        avatar: null
      };
    }
    
    return selectedQuery;
  }, [queryDetails, selectedQuery]);

  const handleViewMoreQueries = () => {
    navigate('/queries');
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedQueryId(null);
    dispatch(clearDetails());
  };

  const handleCloseReplyModal = () => {
    setIsReplyModalOpen(false);
    setSelectedQueryId(null);
    dispatch(clearDetails());
  };

  return (
    <div className="space-y-6 py-6 px-2">
      <PageHeader
        title={t('header.dashboardOverview')}
        description={t('dashboard.welcome')}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: ANIMATION_CONFIG.stagger.fast
            }
          }
        }}
      >
        {statsCards.map((stat, index) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            route={stat.route}
            delay={index * ANIMATION_CONFIG.stagger.fast}
            loading={loadingStats} 
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: ANIMATION_CONFIG.duration.normal,
          ease: ANIMATION_CONFIG.ease.smooth
        }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <RecentActivities 
          activities={recentActivities} 
          loading={loadingRecentActivities} 
        />
        <QuickActions 
          actions={quickActionsData} 
          loading={loadingStats} 
        />
      </motion.div>
  
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: ANIMATION_CONFIG.duration.normal,
          ease: ANIMATION_CONFIG.ease.smooth
        }}
        className="col-span-full"
      >
        <QueryTable
          data={queries}
          onView={handleViewQuery}
          onReply={handleReplyQuery}
          onDelete={handleDeleteQuery}
          showPagination={false}
          pageSize={4}
          currentPage={1}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          isRTL={i18n.language === 'ar'}
          currentLanguage={i18n.language}
          showSearch={false}
          showFilters={false}
          loading={loadingQueryStats} 
        />

        {queries.length > 4 && !loadingQueryStats && (
          <div className="flex justify-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              onClick={handleViewMoreQueries}
              className={`text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group ${
                i18n.language === 'ar' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <span className="text-sm font-medium">
                {t('common.viewMore')}
              </span>
              <ArrowRight
                className={`h-4 w-4 transition-transform ${
                  i18n.language === 'ar'
                    ? 'mr-2 rotate-180 group-hover:-translate-x-1'
                    : 'ml-2 group-hover:translate-x-1'
                }`}
              />
            </Button>
          </div>
        )}
      </motion.div>

      {isViewModalOpen && (
        <ViewQueriesModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          data={viewModalData}
          loading={detailsLoading}
          isRTL={i18n.language === 'ar'}
          currentLanguage={i18n.language}
          onReply={() => {
            setIsViewModalOpen(false);
            setIsReplyModalOpen(true);
          }}
        />
      )}

      {isReplyModalOpen && (
        <ReplyModal
          isOpen={isReplyModalOpen}
          onClose={handleCloseReplyModal}
          query={viewModalData}
          loading={detailsLoading}
          onReply={handleReplySubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;