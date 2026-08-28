import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@maincomponents/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@maincomponents/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend, Sector, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ChartSkeleton from '@maincomponents/skeletons/ChartSkeleton';
import ExpenseTable from '@maincomponents/tables/ExpenseTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import ViewExpenseModal from '@maincomponents/modal/viewModals/ViewExpenseModal';
import ExpenseModalFields from '@maincomponents/modal/addEditModals/ExpenseModalFields';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import {
  fetchExpenses, createExpense, updateExpense, deleteExpense,
  fetchExpenseStats, processExpense, fetchExpenseDetails
} from '@redux/actions/expense';
import { clearErrors, clearSuccess, clearSelectedExpense } from '@redux/slice/expenseSlice';
import { DEPARTMENTS } from '@data/expenseData';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Expenses = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language?.startsWith('ar');
  const currentLanguage = i18n.language;

  const {
    expenses, stats, pagination, selectedExpense, loading, detailsLoading, statsLoading,
    createLoading, updateLoading, error, createSuccess, updateSuccess, deleteSuccess, processSuccess
  } = useSelector((state) => state.expenses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [activeChart, setActiveChart] = useState('overview');
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', category: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeIndex, setActiveIndex] = useState(null);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadData = useCallback(() => {
    const params = {
      page: currentPage, limit: pageSize, search: debouncedSearchTerm || undefined,
      status: filters.status !== 'all' ? filters.status : undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
    };
    dispatch(fetchExpenses(params));
    dispatch(fetchExpenseStats({ status: params.status, category: params.category, search: params.search }));
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); }}, [error, dispatch]);

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess || processSuccess) {
      if (createSuccess) toast.success(t('expense.messages.createSuccess'));
      if (updateSuccess) toast.success(t('expense.messages.updateSuccess'));
      if (deleteSuccess) toast.success(t('expense.messages.deleteSuccess'));
      if (processSuccess) toast.success(t('expense.messages.processSuccess'));
      dispatch(clearSuccess());
      loadData();
    }
  }, [createSuccess, updateSuccess, deleteSuccess, processSuccess, dispatch, loadData, t]);

  const categoryChartData = useMemo(() => (stats?.categoryBreakdown || []).map(item => ({ name: t(`expense.categories.${item._id}`, { defaultValue: item._id }), value: item.count })), [stats, t]);
  const statusChartData = useMemo(() => (stats?.statusBreakdown || []).map(item => ({ name: t(`expense.status.${item._id}`, { defaultValue: item._id }), value: item.count })), [stats, t]);

  const handleInputChange = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };
    const expenseId = selectedExpense?.id || selectedExpense?._id;

    if (modalMode === 'add') {
      await dispatch(createExpense(payload)).unwrap();
    } else if (modalMode === 'edit' && expenseId) {
      await dispatch(updateExpense({ id: expenseId, data: payload })).unwrap();
    }
    setIsModalOpen(false);
  };

  const handleAddExpense = () => {
    setModalMode('add');
    setFormData({ date: new Date().toISOString().split('T')[0], status: 'pending' });
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setModalMode('edit');
    setFormData({ ...expense, date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '' });
    setIsViewModalOpen(false);
    setIsModalOpen(true);
  };

  const handleViewExpense = (expense) => {
    const expenseId = expense.id || expense._id; // ✅ THE FIX
    if (!expenseId) {
        toast.error("Invalid expense record selected.");
        return;
    }
    dispatch(fetchExpenseDetails(expenseId));
    setIsViewModalOpen(true);
  };

  const handleDeleteExpense = (expense) => {
    const expenseId = expense.id || expense._id; // ✅ THE FIX
    if (window.confirm(t('common.confirmDelete'))) {
      dispatch(deleteExpense(expenseId));
      setIsViewModalOpen(false);
    }
  };

  const handleProcessExpense = (expense, action) => {
    const expenseId = expense.id || expense._id; // ✅ THE FIX
    let reason = '';
    if (action === 'rejected' && (reason = window.prompt(t('expense.enterRejectionReason'))) === null) return;
    dispatch(processExpense({ id: expenseId, data: { status: action, reason } }));
  };
  
  const handleFilterChange = (key, value) => { setFilters(p => ({ ...p, [key]: value })); setCurrentPage(1); };
  const handleSearchChange = (value) => { setSearchTerm(value); setCurrentPage(1); };
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => { setPageSize(size); setCurrentPage(1); };

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(null);

  const renderStatusChart = (data) => (
    <Card className="border-0 shadow-lg w-full">
      <CardHeader><CardTitle>{t('expense.distributionByStatus')}</CardTitle></CardHeader>
      <CardContent className="h-[350px] p-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs><linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis reversed={isRTL} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
            <Area type="monotone" dataKey="value" stroke="#ec4899" fillOpacity={1} fill="url(#colorStatus)" name={t('expense.expenseCount')} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderCategoryChart = (data) => {
    const colors = ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#8b5cf6"];
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);
    const ActiveShape = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload }) => (
      <g><text x={cx} y={cy} dy={-8} textAnchor="middle" className="fill-foreground text-3xl font-bold">{payload.value}</text><text x={cx} y={cy} dy={12} textAnchor="middle" className="fill-muted-foreground text-sm">{payload.name}</text><Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 4} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={5} /></g>
    );

    return (
      <Card className="border-0 shadow-lg w-full">
        <CardHeader><CardTitle>{t('expense.distributionByCategory')}</CardTitle></CardHeader>
        <CardContent className="h-[350px] p-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value" paddingAngle={5} cornerRadius={8} activeIndex={activeIndex} activeShape={ActiveShape} onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} className="stroke-background/50 stroke-2" />)}
              </Pie>
              {activeIndex === null && (<text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"><tspan x="50%" dy="-0.5em" className="text-3xl font-bold fill-foreground">{totalValue}</tspan><tspan x="50%" dy="1.5em" className="text-sm fill-muted-foreground">{currentLanguage === 'ar' ? 'الإجمالي' : 'Total'}</tspan></text>)}
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };
  
  const renderCharts = () => {
    if (statsLoading) {
      return <ChartSkeleton type="curve" className="w-full h-[420px]" />;
    }
    const hasStatusData = statusChartData && statusChartData.length > 0;
    const hasCategoryData = categoryChartData && categoryChartData.length > 0;
    const noDataAvailable = <div className="flex items-center justify-center h-full min-h-[420px] bg-card rounded-lg shadow-lg col-span-full"><p className="text-muted-foreground">{t('charts.noData')}</p></div>;
    if (activeChart === 'status') {
      return hasStatusData ? renderStatusChart(statusChartData) : noDataAvailable;
    }
    if (activeChart === 'categories') {
      return hasCategoryData ? renderCategoryChart(categoryChartData) : noDataAvailable;
    }
    if (hasStatusData && hasCategoryData) {
      return <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{renderStatusChart(statusChartData)}{renderCategoryChart(categoryChartData)}</div>;
    } else if (hasStatusData) {
      return renderStatusChart(statusChartData);
    } else if (hasCategoryData) {
      return renderCategoryChart(categoryChartData);
    } else {
      return noDataAvailable;
    }
  };

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.expenses')} description={t('expense.pageDescription')} isRTL={isRTL} action={
        <Button onClick={handleAddExpense} className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-lg">
          <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('expense.addExpense')}
        </Button>
      }/>

      <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {['overview', 'categories', 'status'].map((chart) => (
          <Button key={chart} variant={activeChart === chart ? 'default' : 'outline'} onClick={() => setActiveChart(chart)} className={`transition-all duration-200 capitalize ${activeChart === chart ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' : 'bg-card'}`}>
            {t(`common.${chart}`)}
          </Button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{renderCharts()}</motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ExpenseTable data={expenses} isLoading={loading} onView={handleViewExpense} onEdit={handleEditExpense} onDelete={handleDeleteExpense} onProcess={handleProcessExpense} isRTL={isRTL} currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} showPagination currentPage={pagination.currentPage} pageSize={pageSize} totalItems={pagination.totalExpenses} totalPages={pagination.totalPages} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
      </motion.div>

      <BaseCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? t('expense.addExpense') : t('expense.editExpense')} description={t(`expense.modal.${modalMode}Desc`)} onSubmit={handleFormSubmit} submitLabel={modalMode === 'add' ? t('expense.addExpense') : t('common.save')} isSubmitting={createLoading || updateLoading} type="expense" icon={FileText} gradient="from-pink-500 to-pink-600" isRTL={isRTL}>
        <ExpenseModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL} mode={modalMode} additionalData={{ departments: DEPARTMENTS }} enableMultiLanguage />
      </BaseCreateModal>

      <ViewExpenseModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedExpense()); }} data={selectedExpense} isLoading={detailsLoading} isRTL={isRTL} currentLanguage={currentLanguage} onEdit={handleEditExpense} onDelete={handleDeleteExpense} />
    </div>
  );
};

export default Expenses;