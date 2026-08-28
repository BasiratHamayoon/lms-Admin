import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  fetchOverallKPIs,
  fetchPerformanceSummary,
  fetchStaffKPIs,
  fetchStaffKPIDetail,
} from '../../redux/actions/performance';
import {
  TrendingUp, Users, MessageSquare, Target
} from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import PerformanceTable from '@maincomponents/tables/PerformanceTable';
import ViewPerformanceModal from '@maincomponents/modal/viewModals/ViewPerformanceModal';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const Performance = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const initialFetchDone = useRef(false);

  const { kpis, staffList, selectedStaff, loading } = useSelector((state) => state.performance);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', department: 'all' });
  
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (!initialFetchDone.current) {
      dispatch(fetchOverallKPIs());
      dispatch(fetchPerformanceSummary());
      initialFetchDone.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStaffKPIs({
      page,
      limit,
      search: debouncedSearch,
      status: filters.status,
      department: filters.department,
      lang: i18n.language
    }));
  }, [dispatch, page, limit, debouncedSearch, filters, i18n.language]);

  const handleViewPerformance = (row) => {
    if (row.userId) {
      dispatch(fetchStaffKPIDetail(row.userId));
      setIsViewModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
  };

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePageSizeChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };
  const handleSearchChange = (val) => setSearch(val);
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const statsData = [
    { title: 'performance.totalReviews', value: kpis.totalKPIs || 0, icon: Users, color: 'blue' },
    { title: 'performance.avgScore', value: (kpis.averages?.overallRating || 0).toFixed(1), icon: Target, color: 'purple', suffix: '/ 5.0' },
    { title: 'performance.punctuality', value: (kpis.averages?.punctuality || 0).toFixed(1), icon: MessageSquare, color: 'green' },
    { title: 'performance.teachingQuality', value: (kpis.averages?.teachingQuality || 0).toFixed(1), icon: TrendingUp, color: 'teal', suffix: '/ 5.0' }
  ];

  const calculatedTotalPages = useMemo(() => {
    return Math.ceil((staffList.total || 0) / limit) || 1;
  }, [staffList.total, limit]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.performance')}
        description={t('performance.pageDescription')}
        isRTL={isRTL}
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} loading={loading.kpis} isRTL={isRTL} />
        ))}
      </motion.div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">{t('performance.performanceMembers')}</h3>
        <PerformanceTable
          data={staffList.rows || []}
          loading={loading.list}
          onView={handleViewPerformance}
          isRTL={isRTL}
          currentLanguage={i18n.language}
          showPagination={true}
          pageSize={limit}
          currentPage={page}
          totalItems={staffList.total || 0}
          totalPages={calculatedTotalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          searchTerm={search}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      <ViewPerformanceModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModal}
        data={selectedStaff}
        isLoading={loading.detail}
        isRTL={isRTL}
        currentLanguage={i18n.language}
      />
    </div>
  );
};

export default Performance;