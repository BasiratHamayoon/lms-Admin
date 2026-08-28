import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Users, Briefcase, UserCheck } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import StaffTable from '@maincomponents/tables/StaffTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import { UnifiedChart } from '@maincomponents/charts/UnifiedChart';
import ViewStaffModal from '@maincomponents/modal/viewModals/ViewStaffModal';
import StaffModalFields from '@maincomponents/modal/addEditModals/StaffModalFields';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import { ANIMATION_CONFIG, MONTH_TRANSLATIONS, STAFF_ROLES } from '../../data/Constants';
import {
  fetchStaffList,
  fetchStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  fetchStaffStats,
  fetchStaffMonthChart,
  fetchStaffRoleChart
} from '@redux/actions/staff';
import {
  clearErrors,
  clearSuccess,
  setSelectedStaff,
  clearSelectedStaff
} from '@redux/slice/staffSlice';

const DEFAULT_STATS = { totalAll: 0, totalTeachers: 0, totalHR: 0, totalAccountant: 0 };
const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 10, totalPages: 1 };

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const Staff = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);

  const {
    list = [], pagination = DEFAULT_PAGINATION, stats = DEFAULT_STATS, monthChart = [],
    roleChart = [], loading, statsLoading, chartsLoading, createLoading, updateLoading,
    deleteLoading, error, createSuccess, updateSuccess, deleteSuccess, selectedStaff
  } = useSelector((state) => state.staff);

  const safeStats = useMemo(() => ({ ...DEFAULT_STATS, ...(stats || {}) }), [stats]);
  const safePagination = useMemo(() => ({ ...DEFAULT_PAGINATION, ...(pagination || {}) }), [pagination]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ role: 'all', department: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeChart, setActiveChart] = useState('overview');
  
  const [formData, setFormData] = useState({
    name: { en: { firstName: '', lastName: '' }, ar: { firstName: '', lastName: '' } },
    email: '', password: '', phoneNumber: '', role: 'teacher', department: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadData = useCallback((isInitial = false) => {
    const params = {
      page: currentPage, limit: pageSize,
      search: debouncedSearchTerm || undefined,
      role: filters.role !== 'all' ? filters.role : undefined,
      department: filters.department !== 'all' ? filters.department : undefined,
    };
    dispatch(fetchStaffList(params));
    
    if (isInitial) {
      dispatch(fetchStaffStats());
      dispatch(fetchStaffMonthChart());
      dispatch(fetchStaffRoleChart());
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, filters, currentLanguage, loadData]);

  useEffect(() => {
    if (createSuccess) {
      toast.success(t('staff.messages.createSuccess')); setIsModalOpen(false); resetForm();
      dispatch(clearSuccess()); loadData(true);
    }
  }, [createSuccess, t, dispatch, loadData]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success(t('staff.messages.updateSuccess')); setIsModalOpen(false); resetForm();
      dispatch(clearSuccess()); loadData(true);
    }
  }, [updateSuccess, t, dispatch, loadData]);
  
  useEffect(() => {
    if (deleteSuccess) {
      toast.success(t('staff.messages.deleteSuccess')); dispatch(clearSuccess());
      if (list.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        loadData(true);
      }
    }
  }, [deleteSuccess, t, dispatch, list.length, currentPage, loadData]);

  useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); } }, [error, dispatch]);

  const formattedMonthChartData = useMemo(() => {
    if (!monthChart || monthChart.length === 0) return [];
    return monthChart.map(item => ({ name: MONTH_TRANSLATIONS[currentLanguage]?.[item.month] || item.month, value: item.count }));
  }, [monthChart, currentLanguage]);

  const formattedRoleChartData = useMemo(() => {
    if (!roleChart || roleChart.length === 0) return [];
    return roleChart.map(item => ({ name: t(`staff.roles.${item._id}`, { defaultValue: item._id }), value: item.count }));
  }, [roleChart, currentLanguage, t]);

  const departmentChartData = useMemo(() => {
    if (!list || list.length === 0) return [];
    const counts = list.reduce((acc, member) => {
      const depName = member.department?.name?.[currentLanguage] || member.department?.name?.en || t('common.unassigned');
      acc[depName] = (acc[depName] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [list, currentLanguage, t]);

  const resetForm = () => {
    setFormData({
      name: { en: { firstName: '', lastName: '' }, ar: { firstName: '', lastName: '' } }, email: '', password: '', 
      phoneNumber: '', role: 'teacher', department: '', joiningDate: new Date().toISOString().split('T')[0],
    });
    dispatch(clearSelectedStaff());
  };

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = formData;
    if (!((name?.en?.firstName || name?.en?.lastName) || (name?.ar?.firstName || name?.ar?.lastName))) return toast.error(t('staff.validations.nameRequired'));
    if (!email) return toast.error(t('staff.validations.emailRequired'));
    if (modalMode === 'add' && !password) return toast.error(t('staff.validations.passwordRequired'));
    if (!role) return toast.error(t('staff.validations.roleRequired'));
    const payload = {
      name: { en: name.en, ar: name.ar }, email: email.trim(), role, phoneNumber: formData.phoneNumber?.trim() || undefined,
      joiningDate: formData.joiningDate || undefined, department: formData.department || undefined, ...(modalMode === 'add' && { password }),
    };
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    if (modalMode === 'add') dispatch(createStaff(payload));
    else if (selectedStaff?.id) dispatch(updateStaff({ id: selectedStaff.id, data: payload }));
  };
  
  const handleAddStaff = () => { setModalMode('add'); resetForm(); setIsModalOpen(true); };

  const handleEditStaff = async (staff) => {
    if (!staff?.id) return;
    try {
      const result = await dispatch(fetchStaffById(staff.id)).unwrap();
      if (!result) return toast.error(t('staff.messages.fetchFailed'));
      setModalMode('edit');
      setFormData({
        name: result.name || { en: {}, ar: {} }, email: result.email || '', password: '', phoneNumber: result.phoneNumber || '', 
        role: result.role || 'teacher', department: result.department?._id || result.department || '',
        joiningDate: result.joiningDate ? new Date(result.joiningDate).toISOString().split('T')[0] : '',
      });
      setIsModalOpen(true);
    } catch (err) { toast.error(t('staff.messages.fetchFailed')); }
  };
  
  const handleViewStaff = async (staff) => {
    if (!staff?.id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchStaffById(staff.id)).unwrap();
    } catch (err) {
      toast.error(t('staff.messages.fetchFailed'));
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteStaff = (staffId) => { if (staffId) dispatch(deleteStaff(staffId)); };
  
  const handlePageChange = useCallback((page) => setCurrentPage(page), []);
  const handlePageSizeChange = useCallback((size) => { setPageSize(size); setCurrentPage(1); }, []);
  const handleFilterChange = useCallback((key, val) => { setFilters(p => ({ ...p, [key]: val })); setCurrentPage(1); }, []);
  const handleSearchChange = useCallback((val) => { setSearchTerm(val); setCurrentPage(1); }, []);

  const statsCards = useMemo(() => [
    { key: 'totalAll', title: 'staff.totalAll', value: safeStats.totalAll, icon: Users, color: 'blue' },
    { key: 'teachers', title: 'staff.totalTeachers', value: safeStats.totalTeachers, icon: UserCheck, color: 'green' },
    { key: 'hr', title: 'staff.totalHR', value: safeStats.totalHR, icon: Briefcase, color: 'purple' },
    { key: 'accountant', title: 'staff.totalAccountant', value: safeStats.totalAccountant, icon: Briefcase, color: 'teal' }
  ], [safeStats]);
  
  const formattedStaff = useMemo(() => list.map(user => {
    const nameBlock = user.name?.[currentLanguage] || user.name?.en || user.name?.ar || {};
    return {
      _id: user._id, id: user.id, name: [nameBlock.firstName, nameBlock.lastName].filter(Boolean).join(' ') || user.email,
      email: user.email, phone: user.phoneNumber, role: user.role, 
      department: user.department?.name?.[currentLanguage] || user.department?.name?.en,
      departmentId: user.department?._id, joinDate: user.joiningDate, avatar: ''
    };
  }), [list, currentLanguage]);

  const chartConfigs = {
    monthly: { xAxisKey: 'name', areas: [{ dataKey: 'value', name: t('staff.charts.staffCount'), color: '#10b981' }] },
    roles: { colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'] },
    departments: { xAxisKey: 'name', areas: [{ dataKey: 'value', name: t('staff.charts.staffCount'), color: '#3b82f6' }] }
  };
  
  const chartTitles = {
    monthly: t('staff.charts.monthlyTitle'),
    roles: t('staff.charts.rolesTitle'),
    departments: t('staff.charts.departmentsTitle'),
    overview: t('staff.charts.overviewTitle')
  };
  
  const renderCharts = () => {
    switch (activeChart) {
      case 'monthly': return <UnifiedChart data={formattedMonthChartData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={chartsLoading} />;
      case 'roles': return <UnifiedChart data={formattedRoleChartData} type="donut" config={chartConfigs.roles} title={chartTitles.roles} isRTL={isRTL} showLegend loading={chartsLoading} currentLanguage={currentLanguage} />;
      case 'departments': return <UnifiedChart data={departmentChartData} type="curve" config={chartConfigs.departments} title={chartTitles.departments} isRTL={isRTL} loading={loading} />;
      default: return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <UnifiedChart data={formattedMonthChartData} type="curve" config={chartConfigs.monthly} title={chartTitles.monthly} isRTL={isRTL} loading={chartsLoading} />
          <UnifiedChart data={formattedRoleChartData} type="donut" config={chartConfigs.roles} title={chartTitles.roles} isRTL={isRTL} showLegend loading={chartsLoading} currentLanguage={currentLanguage} />
        </div>
      );
    }
  };
  
  const chartTabs = [
    { key: 'overview', labelEn: 'Overview', labelAr: 'نظرة عامة' },
    { key: 'monthly', labelEn: 'Monthly', labelAr: 'شهري' },
    { key: 'roles', labelEn: 'Roles', labelAr: 'الوظائف' },
    { key: 'departments', labelEn: 'Departments', labelAr: 'الأقسام' }
  ];

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.staff')} description={t('staff.pageDescription')}
        action={
          <Button onClick={handleAddStaff} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg">
            <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />{t('staff.addStaff')}
          </Button>
        } isRTL={isRTL}
      />
      
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsCards.map((stat, i) => <StatsCard key={stat.key} title={t(stat.title)} value={stat.value} icon={stat.icon} color={stat.color} delay={i * 0.1} isRTL={isRTL} loading={statsLoading} />)}
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {chartTabs.map(tab => <Button key={tab.key} variant={activeChart === tab.key ? 'default' : 'outline'} onClick={() => setActiveChart(tab.key)} className={`transition-all ${activeChart === tab.key ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-card'}`}>{isRTL ? tab.labelAr : tab.labelEn}</Button>)}
      </motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{renderCharts()}</motion.div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><StaffTable data={formattedStaff} onView={handleViewStaff} onEdit={handleEditStaff} onDelete={handleDeleteStaff} isRTL={isRTL} currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} loading={loading} showPagination serverSidePagination pageSize={pageSize} currentPage={currentPage} totalItems={safePagination.total} totalPages={safePagination.totalPages} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} /></motion.div>

      <BaseCreateModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={modalMode === 'add' ? t('staff.addStaff') : t('staff.editStaff')} description={t(modalMode === 'add' ? 'staff.modal.addDesc' : 'staff.modal.editDesc')} onSubmit={handleFormSubmit} submitLabel={t(modalMode === 'add' ? 'staff.addStaff' : 'common.save')} isSubmitting={createLoading || updateLoading} type="staff" icon={Users} gradient="from-green-500 to-green-600" isRTL={isRTL}>
        <StaffModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL} modalMode={modalMode} additionalData={{ roles: STAFF_ROLES }} enableMultiLanguage currentLanguage={currentLanguage} />
      </BaseCreateModal>
      
      <ViewStaffModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedStaff()); }} data={selectedStaff} loading={isDetailsLoading} isRTL={isRTL} currentLanguage={currentLanguage} onEdit={(staff) => { setIsViewModalOpen(false); handleEditStaff(staff); }} onDelete={(id) => { setIsViewModalOpen(false); handleDeleteStaff(id); }} />
    </div>
  );
};
export default Staff;