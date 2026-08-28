import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Building, CheckCircle, BookOpen, Briefcase } from 'lucide-react';

// --- Chart-specific imports ---
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../maincomponents/components/ui/card';
// --- ADDED THIS IMPORT ---
import { ChartContainer, ChartTooltipContent } from '../../maincomponents/components/ui/chart';
import ChartSkeleton from '../../maincomponents/skeletons/ChartSkeleton.jsx';
// --- End chart-specific imports ---

import StatsCard from '@maincomponents/cards/StatsCard';
import DepartmentTable from '@maincomponents/tables/DepartmentTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import DepartmentsModalFields from '@maincomponents/modal/addEditModals/DepartmentsModalFields';
import ViewDepartmentModal from '@maincomponents/modal/viewModals/ViewDepartmentModal';

import {
  fetchDepartments,
  fetchDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchDepartmentStats,
  fetchMemberDistributionChart,
} from '@redux/actions/department';

import { fetchTeacherOptions } from '@redux/actions/class';

import {
  clearErrors,
  clearSuccess,
  setSelectedDepartment,
  clearSelectedDepartment,
} from '@redux/slice/departmentSlice';

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

const DEFAULT_STATS = { totalDepartments: 0, activeDepartments: 0, academicDepartments: 0, administrativeDepartments: 0 };
const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 10, pages: 0 };

const Departments = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);
  
  const {
    departments = [], pagination = DEFAULT_PAGINATION, stats = DEFAULT_STATS, memberDistributionChart = [],
    loading, statsLoading, chartLoading, createLoading, updateLoading,
    deleteLoading, error, createSuccess, updateSuccess, deleteSuccess, selectedDepartment
  } = useSelector((state) => state.departments) || {};
  
  const { teacherOptions = [], teacherOptionsLoading = false } = useSelector((state) => state.classes) || {};

  const getDisplayName = (name) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[currentLanguage] || name.en || name.ar || '';
  };
  
  const teachersLabel = t('departments.teachers');
  const studentsLabel = t('departments.students');

  const memberChartData = useMemo(() => {
    if (!memberDistributionChart || !Array.isArray(memberDistributionChart)) return [];
    return memberDistributionChart.map((item) => ({
      name: getDisplayName(item?.department) || t('common.unassigned'),
      [teachersLabel]: item?.teacherCount || 0,
      [studentsLabel]: item?.studentCount || 0,
    }));
  }, [memberDistributionChart, currentLanguage, t, getDisplayName, teachersLabel, studentsLabel]);

  // The rest of the component's state and logic remains the same...
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ type: 'all', status: 'all' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [formData, setFormData] = useState({ name: { en: '', ar: '' }, description: { en: '', ar: '' }, type: 'academic', headId: null, active: true });
    const safeStats = useMemo(() => ({ ...DEFAULT_STATS, ...(stats || {}) }), [stats]);
    const safePagination = useMemo(() => ({ ...DEFAULT_PAGINATION, ...(pagination || {}) }), [pagination]);
    const loadData = useCallback((isInitial = false) => { const params = { page: currentPage, limit: pageSize, search: debouncedSearchTerm || undefined, type: filters.type !== 'all' ? filters.type : undefined, active: filters.status !== 'all' ? filters.status : undefined, }; dispatch(fetchDepartments(params)); if (isInitial) { dispatch(fetchDepartmentStats()); dispatch(fetchMemberDistributionChart()); } }, [dispatch, currentPage, pageSize, debouncedSearchTerm, filters]);
    useEffect(() => { if (!initialFetchDone.current) { loadData(true); initialFetchDone.current = true; } else { loadData(false); } }, [currentPage, pageSize, debouncedSearchTerm, filters, currentLanguage, loadData]);
    useEffect(() => { if (isModalOpen && teacherOptions.length === 0) { dispatch(fetchTeacherOptions()); } }, [isModalOpen, dispatch, teacherOptions.length]);
    useEffect(() => { if (createSuccess) { toast.success(t('departments.messages.createSuccess')); setIsModalOpen(false); resetForm(); dispatch(clearSuccess()); loadData(true); } }, [createSuccess, t, dispatch, loadData]);
    useEffect(() => { if (updateSuccess) { toast.success(t('departments.messages.updateSuccess')); setIsModalOpen(false); resetForm(); dispatch(clearSuccess()); loadData(true); } }, [updateSuccess, t, dispatch, loadData]);
    useEffect(() => { if (deleteSuccess) { toast.success(t('departments.messages.deleteSuccess')); dispatch(clearSuccess()); if (departments.length === 1 && currentPage > 1) { setCurrentPage(prev => prev - 1); } else { loadData(true); } } }, [deleteSuccess, t, dispatch, departments.length, currentPage, loadData]);
    useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); } }, [error, dispatch]);
    const resetForm = () => { setFormData({ name: { en: '', ar: '' }, description: { en: '', ar: '' }, type: 'academic', headId: null, active: true }); dispatch(clearSelectedDepartment()); };
    const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
    const handleFormSubmit = async (e) => { e.preventDefault(); if (!formData.name?.en && !formData.name?.ar) { return toast.error(t('departments.validations.nameRequired')); } const payload = { name: { en: formData.name.en?.trim(), ar: formData.name.ar?.trim() }, description: { en: formData.description.en?.trim(), ar: formData.description.ar?.trim() }, type: formData.type, headId: formData.headId || undefined, active: formData.active }; if (modalMode === 'add') { dispatch(createDepartment(payload)); } else if (selectedDepartment?._id) { dispatch(updateDepartment({ id: selectedDepartment._id, data: payload })); } };
    const handleAddDepartment = () => { setModalMode('add'); resetForm(); setIsModalOpen(true); };
    const handleEditDepartment = async (department) => { if (!department?._id) return; setIsDetailsLoading(true); setModalMode('edit'); setIsModalOpen(true); try { const result = await dispatch(fetchDepartmentById(department._id)).unwrap(); if (result) { setFormData({ name: result.name || { en: '', ar: '' }, description: result.description || { en: '', ar: '' }, type: result.type || 'academic', headId: result.head?._id || null, active: result.active }); } } catch (err) { toast.error(t('departments.messages.fetchFailed')); setIsModalOpen(false); } finally { setIsDetailsLoading(false); } };
    const handleViewDepartment = async (department) => { if (!department?._id) return; setIsViewModalOpen(true); setIsDetailsLoading(true); try { await dispatch(fetchDepartmentById(department._id)).unwrap(); } catch (err) { toast.error(t('departments.messages.fetchFailed')); setIsViewModalOpen(false); } finally { setIsDetailsLoading(false); } };
    const handleDeleteClick = (department) => { if (department?._id) dispatch(deleteDepartment(department._id)); };
    const handlePageChange = useCallback((page) => setCurrentPage(page), []);
    const handlePageSizeChange = useCallback((size) => { setPageSize(size); setCurrentPage(1); }, []);
    const handleFilterChange = useCallback((key, val) => { setFilters(p => ({ ...p, [key]: val })); setCurrentPage(1); }, []);
    const handleSearchChange = useCallback((val) => { setSearchTerm(val); setCurrentPage(1); }, []);
    const formattedTeachers = useMemo(() => { if (!teacherOptions || !Array.isArray(teacherOptions)) return []; return teacherOptions.map((teacher) => { const nameObj = teacher?.name || {}; const enName = nameObj?.en || {}; const arName = nameObj?.ar || {}; const displayName = currentLanguage === 'ar' && (arName?.firstName || arName?.lastName) ? `${arName.firstName || ''} ${arName.lastName || ''}`.trim() : `${enName.firstName || ''} ${enName.lastName || ''}`.trim(); return { _id: teacher._id, name: displayName || `Teacher ${teacher?.id}` }; }).filter(Boolean); }, [teacherOptions, currentLanguage]);
    const statsCards = useMemo(() => [ { title: 'departments.totalDepartments', value: safeStats.totalDepartments, icon: Building, color: 'blue' }, { title: 'departments.activeDepartments', value: safeStats.activeDepartments, icon: CheckCircle, color: 'green' }, { title: 'departments.academicDepartments', value: safeStats.academicDepartments, icon: BookOpen, color: 'purple' }, { title: 'departments.administrativeDepartments', value: safeStats.administrativeDepartments, icon: Briefcase, color: 'teal' }, ], [safeStats]);


  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader title={t('sidebar.departments')} description={t('departments.pageDescription')}
        action={
          <Button onClick={handleAddDepartment} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg gap-2">
            <Plus className="w-4 h-4" />{t('departments.addDepartment')}
          </Button>
        } isRTL={isRTL} />

      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsCards.map((stat, i) => <StatsCard key={stat.title} title={t(stat.title)} value={stat.value} icon={stat.icon} color={stat.color} delay={i * 0.1} isRTL={isRTL} loading={statsLoading} />)}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
          <CardHeader>
            <CardTitle className={`text-lg font-bold text-card-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('departments.memberDistribution')}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-96 p-0">
            {chartLoading ? (
              <ChartSkeleton type="curve" isRTL={isRTL} />
            ) : (
              // --- FIX: Wrap the chart in ChartContainer ---
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memberChartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/30" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.7)' }}
                      stroke={'hsl(var(--foreground) / 0.7)'}
                      angle={-30} textAnchor="end" height={60}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'hsl(var(--foreground) / 0.7)' }}
                      stroke={'hsl(var(--foreground) / 0.7)'}
                    />
                    <Tooltip
                      content={<ChartTooltipContent
                        className="bg-background/95 backdrop-blur-sm"
                        labelClassName="font-bold text-foreground"
                      />}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Area type="monotone" dataKey={teachersLabel} stroke="#8b5cf6" fill="url(#colorTeachers)" strokeWidth={2} />
                    <Area type="monotone" dataKey={studentsLabel} stroke="#22c55e" fill="url(#colorStudents)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <DepartmentTable data={departments || []} onView={handleViewDepartment} onEdit={handleEditDepartment} onDelete={handleDeleteClick} isRTL={isRTL} currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange} loading={loading} showPagination pageSize={pageSize} currentPage={currentPage} totalItems={safePagination.total} totalPages={safePagination.pages} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
      </motion.div>
      
      <BaseCreateModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={modalMode === 'add' ? t('departments.addDepartment') : t('departments.editDepartment')} description={t(modalMode === 'add' ? 'departments.modal.addDesc' : 'departments.modal.editDesc')} onSubmit={handleFormSubmit} submitLabel={modalMode === 'add' ? t('departments.addDepartment') : t('common.save')} isSubmitting={createLoading || updateLoading || isDetailsLoading} type="department" gradient="from-purple-500 to-purple-600" isRTL={isRTL}>
        <DepartmentsModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL} teachers={formattedTeachers} teachersLoading={teacherOptionsLoading} mode={modalMode} enableMultiLanguage currentLanguage={currentLanguage} />
      </BaseCreateModal>
      <ViewDepartmentModal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedDepartment()); }} data={selectedDepartment} isRTL={isRTL} currentLanguage={currentLanguage} onEdit={(dept) => { setIsViewModalOpen(false); handleEditDepartment(dept); }} onDelete={(dept) => { setIsViewModalOpen(false); handleDeleteClick(dept); }} loading={isDetailsLoading} />
    </div>
  );
};

export default Departments;