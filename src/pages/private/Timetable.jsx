import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '../../maincomponents/components/ui/button';
import { Plus, Calendar, Clock, CheckCircle, Users } from 'lucide-react';
import StatsCard from '@maincomponents/cards/StatsCard';
import TimetableTable from '@maincomponents/tables/TimetableTable';
import PageHeader from '@maincomponents/headerbar/PageHeader';
import BaseCreateModal from '@maincomponents/modal/addEditModals/BaseCreateModal';
import TimetableModalFields from '@maincomponents/modal/addEditModals/TimetableModalFields';
import ViewTimetableModal from '@maincomponents/modal/viewModals/ViewTimetableModal';
import {
  fetchTimetables,
  fetchTimetableById,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  fetchTimetableStats,
  fetchTimetableStatusChart,
  fetchTimetableByClassChart
} from '@redux/actions/timetable';
import { fetchClassOptions } from '@redux/actions/class';
import { fetchCourseOptions } from '@redux/actions/course';
import { fetchTeacherOptions } from '@redux/actions/class';
import {
  clearErrors,
  clearSuccess,
  setSelectedTimetable,
  clearSelectedTimetable
} from '@redux/slice/timetableSlice';

const DEFAULT_STATS = { totalTimetables: 0, activeTimetables: 0, totalScheduleEntries: 0, classesWithTimetables: 0 };
const DEFAULT_PAGINATION = { total: 0, page: 1, limit: 10, pages: 0 };

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
};

const getBilingualString = (field, lang = 'en') => {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object' && field !== null) return field[lang] || field.en || field.ar || '';
  return String(field);
};

const Timetable = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;
  const initialFetchDone = useRef(false);

  const {
    timetables = [], pagination = DEFAULT_PAGINATION, stats = DEFAULT_STATS,
    loading = false, statsLoading = false, createLoading = false, updateLoading = false, deleteSuccess = false,
    error = null, createSuccess = false, updateSuccess = false, selectedTimetable = null
  } = useSelector((state) => state.timetables || {});

  const { classOptions = [], teacherOptions = [] } = useSelector((state) => state.classes || {});
  const { courseOptions = [] } = useSelector((state) => state.courses || {});

  const safeStats = useMemo(() => ({ ...DEFAULT_STATS, ...(stats || {}) }), [stats]);
  const safePagination = useMemo(() => ({ ...DEFAULT_PAGINATION, ...(pagination || {}) }), [pagination]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({});
  const debouncedSearch = useDebounce(searchTerm, 500);

  const loadData = useCallback((isInitial = false) => {
    const params = {
      page: currentPage, limit: pageSize, search: debouncedSearch || undefined,
      classId: filters.classId, academicYear: filters.academicYear, semester: filters.semester,
      level: filters.level, active: filters.status,
    };
    dispatch(fetchTimetables(params));
    if (isInitial) {
      dispatch(fetchTimetableStats());
      dispatch(fetchClassOptions());
      dispatch(fetchCourseOptions());
      dispatch(fetchTeacherOptions());
    }
  }, [dispatch, currentPage, pageSize, debouncedSearch, filters]);

  useEffect(() => {
    if (!initialFetchDone.current) {
      loadData(true);
      initialFetchDone.current = true;
    } else {
      loadData(false);
    }
  }, [currentPage, pageSize, debouncedSearch, filters, loadData]);

  useEffect(() => {
    if (createSuccess || updateSuccess || deleteSuccess) {
      toast.success(t(
        createSuccess ? 'timetable.messages.createSuccess' :
        updateSuccess ? 'timetable.messages.updateSuccess' :
        'timetable.messages.deleteSuccess'
      ));
      if (isModalOpen) setIsModalOpen(false);
      resetForm();
      dispatch(clearSuccess());
      loadData(true);
    }
  }, [createSuccess, updateSuccess, deleteSuccess, t, dispatch, isModalOpen, loadData]);
  
  useEffect(() => { if (error) { toast.error(error); dispatch(clearErrors()); } }, [error, dispatch]);

  const resetForm = () => { setFormData({}); setSelectedFile(null); dispatch(clearSelectedTimetable()); };
  const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleFileChange = (file) => setSelectedFile(file);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submitData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });
    if (selectedFile) submitData.append('file', selectedFile);
    if (modalMode === 'add') {
      dispatch(createTimetable(submitData));
    } else if (selectedTimetable?._id) {
      dispatch(updateTimetable({ id: selectedTimetable._id, data: submitData }));
    }
  };

  const handleAddTimetable = () => { setModalMode('add'); resetForm(); setIsModalOpen(true); };
  const handleEditTimetable = async (timetable) => {
    if (!timetable?._id) return;
    try {
      const result = await dispatch(fetchTimetableById(timetable._id)).unwrap();
      setModalMode('edit');
      setFormData(result);
      setIsModalOpen(true);
    } catch (err) { /* error is handled by slice */ }
  };
  
  const handleViewTimetable = async (timetable) => {
    if (!timetable?._id) return;
    setIsViewModalOpen(true);
    setIsDetailsLoading(true);
    try {
      await dispatch(fetchTimetableById(timetable._id)).unwrap();
    } catch (err) {
      setIsViewModalOpen(false);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleDeleteClick = (timetable) => dispatch(deleteTimetable(timetable._id));
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => { setPageSize(size); setCurrentPage(1); };
  const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setCurrentPage(1); };
  const handleSearchChange = (value) => { setSearchTerm(value); setCurrentPage(1); };
  
  const statsCards = useMemo(() => [
    { title: 'timetable.totalTimetables', value: safeStats.totalTimetables, icon: Calendar, color: 'blue' },
    { title: 'timetable.activeTimetables', value: safeStats.activeTimetables, icon: CheckCircle, color: 'green' },
    { title: 'timetable.totalScheduleEntries', value: safeStats.totalScheduleEntries, icon: Clock, color: 'purple' },
    { title: 'timetable.classesWithTimetables', value: safeStats.classesWithTimetables, icon: Users, color: 'teal' }
  ], [safeStats]);

  const tableData = useMemo(() => timetables.map(tt => ({
    ...tt, id: tt._id,
    classDisplay: getBilingualString(tt.className || tt.classId?.name, currentLanguage),
    section: getBilingualString(tt.section || tt.classId?.section, currentLanguage),
    academicYear: getBilingualString(tt.academicYear, currentLanguage),
    semester: getBilingualString(tt.semester, currentLanguage),
    level: getBilingualString(tt.level, currentLanguage),
    scheduleCount: tt.schedule?.length || 0
  })), [timetables, currentLanguage]);

  return (
    <div className="space-y-6 py-6 px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('sidebar.timetable')} description={t('timetable.pageDescription')}
        action={
          <Button onClick={handleAddTimetable} className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-lg gap-2">
            <Plus className="w-4 h-4" />{t('timetable.addTimetable')}
          </Button>
        } isRTL={isRTL}
      />
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        {statsCards.map((stat, index) => <StatsCard key={stat.title} title={t(stat.title)} value={stat.value} icon={stat.icon} color={stat.color} delay={index * 0.1} isRTL={isRTL} loading={statsLoading} />)}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <TimetableTable data={tableData} onView={handleViewTimetable} onEdit={handleEditTimetable} onDelete={handleDeleteClick} isRTL={isRTL}
          currentLanguage={currentLanguage} searchTerm={searchTerm} onSearchChange={handleSearchChange} filters={filters} onFilterChange={handleFilterChange}
          loading={loading} showPagination serverSidePagination pageSize={pageSize} currentPage={currentPage} totalItems={safePagination.total} totalPages={safePagination.pages}
          onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
      </motion.div>
      <BaseCreateModal
        isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={modalMode === 'add' ? t('timetable.addTimetable') : t('timetable.editTimetable')}
        description={t(modalMode === 'add' ? 'timetable.modal.addDesc' : 'timetable.modal.editDesc')}
        onSubmit={handleFormSubmit} submitLabel={modalMode === 'add' ? t('timetable.addTimetable') : t('common.save')}
        isSubmitting={createLoading || updateLoading} type="timetable" icon={Calendar} gradient="from-indigo-500 to-indigo-600" isRTL={isRTL}>
        <TimetableModalFields formData={formData} handleChange={handleInputChange} isRTL={isRTL}
          classes={classOptions} courses={courseOptions} teachers={teacherOptions} mode={modalMode} enableMultiLanguage
          currentLanguage={currentLanguage} onFileChange={handleFileChange} selectedFile={selectedFile} />
      </BaseCreateModal>
      <ViewTimetableModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); dispatch(clearSelectedTimetable()); }}
        data={selectedTimetable} isRTL={isRTL} currentLanguage={currentLanguage}
        onEdit={(item) => { setIsViewModalOpen(false); handleEditTimetable(item); }}
        onDelete={(item) => { setIsViewModalOpen(false); handleDeleteClick(item); }}
        loading={isDetailsLoading}
      />
    </div>
  );
};

export default Timetable;