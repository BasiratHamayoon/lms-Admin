import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { 
  fetchQueries, 
  fetchQueryStats, 
  replyToQuery, 
  deleteQuery, 
  fetchQueryDetails,
} from '../../redux/actions/queries';

import { clearDetails } from '@redux/slice/queriesSlice';
import StatsCard from '../../maincomponents/cards/StatsCard';
import QueryTable from '../../maincomponents/tables/QueryTable.jsx';
import ReplyModal from '../../maincomponents/modal/ReplyModal';
import ViewQueriesModal from '../../maincomponents/modal/viewModals/ViewQueriesModal';
import PageHeader from '../../maincomponents/headerbar/PageHeader';
import { ANIMATION_CONFIG } from '../../data/Constants';
import { MessageCircle, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const Queries = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';

  const { 
    queries, 
    stats, 
    pagination, 
    loading, 
    queryDetails, 
  } = useSelector((state) => state.queries);

  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedQueryId, setSelectedQueryId] = useState(null);

  useEffect(() => {
    dispatch(fetchQueryStats());
  }, [dispatch]);

  useEffect(() => {
    const debouncedFetch = setTimeout(() => {
      dispatch(fetchQueries({
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm,
        status: filters.status !== 'all' ? filters.status : undefined,
        lang: i18n.language
      }));
    }, 500);
    return () => clearTimeout(debouncedFetch);
  }, [dispatch, pagination.currentPage, pagination.limit, searchTerm, filters, i18n.language]);

  const tableData = useMemo(() => {
    return queries.map(q => ({
      ...q,
      name: q.studentName,
      message: q.description || q.title,
    }));
  }, [queries]);

  const statsCards = useMemo(() => [
    { key: 'total', title: 'dashboard.totalQueries', value: stats.total, icon: MessageCircle, color: 'blue' },
    { key: 'open', title: 'queries.status.pending', value: stats.open, icon: Clock, color: 'green' },
    { key: 'inProgress', title: 'queries.status.inProgress', value: stats['in-progress'], icon: AlertCircle, color: 'purple' },
    { key: 'closed', title: 'queries.status.resolved', value: stats.closed, icon: CheckCircle, color: 'teal' }
  ], [stats]);

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const handleReply = (query) => {
    setSelectedQueryId(query.id);
    dispatch(fetchQueryDetails(query.id)); 
    setIsReplyModalOpen(true);
  };

  const handleView = async (query) => {
    if (!query?.id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
        await dispatch(fetchQueryDetails(query.id)).unwrap();
    } catch (error) {
        toast.error(t('queries.fetchFailed', 'Failed to fetch query details. It may have been deleted.'));
        setIsViewModalOpen(false);
    } finally {
        setIsDetailsLoading(false);
    }
  };

  const handleSendReply = async (queryId, replyMessage) => {
    await dispatch(replyToQuery({ id: queryId, message: replyMessage })).unwrap();
    setIsReplyModalOpen(false);
    dispatch(fetchQueries({ page: pagination.currentPage, lang: i18n.language }));
  };

  const handleDelete = async (queryId) => {
    await dispatch(deleteQuery(queryId));
    dispatch(fetchQueries({ page: pagination.currentPage, lang: i18n.language }));
  };

  const viewModalData = useMemo(() => {
    if (!queryDetails) return null;
    return {
      ...queryDetails,
      name: queryDetails.student?.name || 'Unknown',
      email: queryDetails.student?.id || '',
      course: queryDetails.class ? `${queryDetails.class.courseName} (${queryDetails.class.section})` : 'N/A',
      message: queryDetails.description,
      date: queryDetails.createdAt,
      type: 'general',
      avatar: null 
    };
  }, [queryDetails]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.queries')}
        description={t('queries.pageDescription')}
        isRTL={isRTL}
      />

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast } } }}
      >
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.key}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
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

      <motion.div 
        className="col-span-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <QueryTable
          data={tableData}
          loading={loading}
          onView={handleView}
          onReply={handleReply}
          onDelete={handleDelete}
          title="dashboard.studentQueries"
          isRTL={isRTL}
          currentLanguage={i18n.language}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={handleFilterChange}
          showPagination={true}
          currentPage={pagination.currentPage}
          pageSize={pagination.limit}
          totalItems={pagination.totalQueries}
          totalPages={pagination.totalPages}
          onPageChange={(page) => dispatch(fetchQueries({ page, limit: pagination.limit, lang: i18n.language }))}
        />
      </motion.div>

      <ReplyModal 
        isOpen={isReplyModalOpen} 
        onClose={() => { setIsReplyModalOpen(false); dispatch(clearDetails()); }} 
        query={viewModalData || tableData.find(q => q.id === selectedQueryId)} 
        onReply={handleSendReply} 
      />
      
      <ViewQueriesModal 
        isOpen={isViewModalOpen} 
        onClose={() => { setIsViewModalOpen(false); dispatch(clearDetails()); }} 
        data={viewModalData} 
        loading={isDetailsLoading}
        isRTL={isRTL} 
        currentLanguage={i18n.language}
        onReply={handleReply}
      />
    </div>
  );
};

export default Queries;