// pages/Reports.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchReportCards,
  fetchGraphData,
  fetchFeeReports,
  fetchExpenseReports
} from '../../redux/actions/report';
import { ANIMATION_CONFIG } from '@data/Constants';
import { toast } from 'sonner';
import { Button } from '@maincomponents/components/ui/button';
import StatsCard from '@maincomponents/cards/StatsCard';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import { UnifiedChart } from '@maincomponents/charts/UnifiedChart';
import ViewReportModal from '@maincomponents/modal/viewModals/ViewReportModal';
import ReportsTable from '@maincomponents/tables/ReportsTable';
import { Wallet, TrendingDown, AlertCircle, PiggyBank } from 'lucide-react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Reports = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const {
    cards, graphData, feeRecords, expenseRecords, feePagination,
    expensePagination, loading
  } = useSelector((state) => state.reports);

  const statsLoading = loading.cards;
  const chartsLoading = loading.graph;
  const listLoading = loading.fees || loading.expenses;

  const [selectedReport, setSelectedReport] = useState(null);
  const [activeChart, setActiveChart] = useState('overview');
  const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ reportType: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  useEffect(() => {
    dispatch(fetchReportCards());
    dispatch(fetchGraphData());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page: currentPage, limit: pageSize,
      search: debouncedSearchTerm.trim() || undefined,
    };
    if (filters.reportType === 'financial' || filters.reportType === 'all') {
      dispatch(fetchFeeReports(params));
    }
    if (filters.reportType === 'analytical' || filters.reportType === 'all') {
      dispatch(fetchExpenseReports(params));
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters.reportType]);

  const unifiedReportsData = useMemo(() => {
    const safelyGetString = (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'number') return String(val);
      if (typeof val === 'object') {
        return val[currentLanguage] || val['en'] || val['ar'] || Object.values(val)[0] || '';
      }
      return '';
    };

    const fees = feeRecords.map((item) => ({
      id: item.feeId || item._id, title: `${t('reports.feeCollection')} - ${safelyGetString(item.name)}`,
      description: `Class: ${item.class}, Mode: ${item.mode}`, reportType: 'financial', period: 'daily',
      generatedAt: new Date().toISOString(), generatedBy: 'System', netBalance: item.paid,
      status: 'completed', originalData: item
    }));
    const expenses = expenseRecords.map((item) => ({
      id: item._id || Math.random(), title: `${t('reports.expense')} - ${safelyGetString(item.category)}`,
      description: safelyGetString(item.note), reportType: 'analytical', period: 'daily',
      generatedAt: new Date().toISOString(), generatedBy: 'Admin', netBalance: -item.amount,
      status: 'completed', originalData: item
    }));

    if (filters.reportType === 'financial') return fees;
    if (filters.reportType === 'analytical') return expenses;
    return [...fees, ...expenses];
  }, [feeRecords, expenseRecords, t, currentLanguage, filters.reportType]);

  const { totalItems, totalPages } = useMemo(() => {
    const feePag = feePagination || { total: 0, totalPages: 1 };
    const expPag = expensePagination || { total: 0, totalPages: 1 };
    if (filters.reportType === 'financial') return { totalItems: feePag.total, totalPages: feePag.totalPages };
    if (filters.reportType === 'analytical') return { totalItems: expPag.total, totalPages: expPag.totalPages };
    return { totalItems: (feePag.total || 0) + (expPag.total || 0), totalPages: Math.max(feePag.totalPages || 1, expPag.totalPages || 1) };
  }, [feePagination, expensePagination, filters.reportType]);

  const monthlyComparisonData = useMemo(() => {
    if (!graphData || graphData.length === 0) return [];
    return graphData.map(d => ({ month: d.month, fee: d.fee, expense: d.expense, profit: d.fee - d.expense }));
  }, [graphData]);

  const feeExpenseData = useMemo(() => [
    { name: t('reports.feeCollection'), value: cards.totalFeeCollection || 0 },
    { name: t('reports.totalExpenses'), value: cards.totalExpense || 0 }
  ], [cards, t]);

  const formatCurrency = (amount) => `${amount?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`;
  
  const handleViewReport = (report) => { setSelectedReport(report); setIsViewReportModalOpen(true); };
  const handleDownloadReport = () => toast.success(t('reports.downloading'));
  const handlePrintReport = () => toast.success(t('reports.printing'));
  const handleShareReport = () => toast.success(t('reports.shared'));
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);
  const handlePageSizeChange = useCallback((size) => { setPageSize(size); setCurrentPage(1); }, []);
  const handleFilterChange = useCallback((key, val) => { setFilters(p => ({ ...p, [key]: val })); setCurrentPage(1); }, []);
  const handleSearchChange = useCallback((val) => { setSearchTerm(val); setCurrentPage(1); }, []);

  const chartConfigs = {
    monthly: { xAxisKey: 'month', areas: [{ dataKey: 'profit', name: t('reports.netBalance'), color: '#10b981' }] },
    feeExpense: { colors: ['#3b82f6', '#ef4444', '#f97316'] }
  };
  
  const chartTitles = {
    monthly: t('reports.monthlyComparison'),
    feeExpense: t('reports.feeExpenseComparison'),
    overview: t('reports.overview')
  };
  
  const renderCharts = () => {
    switch (activeChart) {
      case 'monthly': return <UnifiedChart data={monthlyComparisonData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={chartsLoading} />;
      case 'feeExpense': return <UnifiedChart data={feeExpenseData} type="donut" config={chartConfigs.feeExpense} title={chartTitles.feeExpense} isRTL={isRTL} showLegend loading={chartsLoading} currentLanguage={currentLanguage} />;
      default: return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <UnifiedChart data={monthlyComparisonData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={chartsLoading} />
          <UnifiedChart data={feeExpenseData} type="donut" config={chartConfigs.feeExpense} title={chartTitles.feeExpense} isRTL={isRTL} showLegend loading={chartsLoading} currentLanguage={currentLanguage} />
        </div>
      );
    }
  };
  
  const statsData = [
    { title: 'reports.totalCollection', value: cards.totalFeeCollection, icon: Wallet, color: 'blue' },
    { title: 'reports.totalExpenses', value: cards.totalExpense, icon: TrendingDown, color: 'green' },
    { title: 'reports.pendingFees', value: cards.totalPendingFees, icon: AlertCircle, color: 'purple' },
    { title: 'reports.netBalance', value: cards.netBalance, icon: PiggyBank, color: 'teal' }
  ];
  
  const chartTabs = [
    { key: 'overview', label: t('reports.overview') },
    { key: 'monthly', label: t('reports.monthly') },
    { key: 'feeExpense', label: t('reports.feeExpense') }
  ];

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.reports')} description={t('reports.pageDescription')} isRTL={isRTL} />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: ANIMATION_CONFIG.stagger.fast } } }}>
        {statsData.map((stat, index) => <StatsCard key={index} title={t(stat.title)} value={formatCurrency(stat.value)} icon={stat.icon} color={stat.color} delay={index * ANIMATION_CONFIG.stagger.fast} isRTL={isRTL} loading={statsLoading} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {chartTabs.map((tab) => <Button key={tab.key} variant={activeChart === tab.key ? 'default' : 'outline'} onClick={() => setActiveChart(tab.key)} disabled={chartsLoading} className={`transition-all duration-200 ${activeChart === tab.key ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' : 'bg-card'}`}>{tab.label}</Button>)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>{renderCharts()}</motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <ReportsTable data={unifiedReportsData} onView={handleViewReport} onDownload={handleDownloadReport} onPrint={handlePrintReport} onShare={handleShareReport} showPagination serverSidePagination isRTL={isRTL} currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} pageSize={pageSize} currentPage={currentPage} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} totalItems={totalItems} totalPages={totalPages} loading={listLoading} />
      </motion.div>

      <ViewReportModal isOpen={isViewReportModalOpen} onClose={() => setIsViewReportModalOpen(false)} data={selectedReport} isRTL={isRTL} currentLanguage={currentLanguage} loading={listLoading && !selectedReport} onDownload={handleDownloadReport} onPrint={handlePrintReport} onShare={handleShareReport} />
    </div>
  );
};

export default Reports;